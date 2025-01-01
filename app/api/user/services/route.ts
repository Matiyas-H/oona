// app/api/user/services/route.ts
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { createApiResponse, createApiError, API_ERROR_CODES } from "@/lib/utils/api"

// Get user's services
export async function GET(request: Request) {
  // Add URL check for available services
  const { searchParams } = new URL(request.url)
  const available = searchParams.get('available')

  try {
    const session = await auth()
    if (!session?.user?.id) {
      return createApiError("Unauthorized", API_ERROR_CODES.UNAUTHORIZED, 401)
    }

    // If requesting available services
    if (available === 'true') {
      const userNumber = await prisma.userNumber.findUnique({
        where: { userId: session.user.id },
        include: {
          services: {
            select: { forwardingCodeId: true }
          }
        }
      })

      if (!userNumber) {
        return createApiError("No number found", API_ERROR_CODES.NOT_FOUND, 404)
      }

      // Get all available services for user's carrier that aren't already added
      const availableServices = await prisma.forwardingCode.findMany({
        where: {
          carrierId: userNumber.carrierId,
          // Exclude services user already has
          id: {
            notIn: userNumber.services.map(s => s.forwardingCodeId)
          }
        },
        select: {
          id: true,
          serviceType: true,
          carrierId: true
        }
      })

      return createApiResponse(availableServices)
    }

    // Get existing services
    const userServices = await prisma.userService.findMany({
      where: {
        userNumber: {
          userId: session.user.id
        }
      },
      include: {
        carrier: {
          select: {
            name: true
          }
        },
        forwardingCode: {
          select: {
            serviceType: true,
            activateFormat: true,
            deactivateFormat: true
          }
        },
        userNumber: {
          select: {
            telyxNumber: true
          }
        }
      },
      orderBy: {
        forwardingCode: {
          serviceType: 'asc'
        }
      }
    })

    return createApiResponse(userServices)
  } catch (error) {
    console.error("Error fetching services:", error)
    return createApiError(
      "Failed to fetch services",
      API_ERROR_CODES.INTERNAL_ERROR,
      500
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return createApiError("Unauthorized", API_ERROR_CODES.UNAUTHORIZED, 401)
    }

    const { serviceType } = await request.json()

    // Get user's number
    const userNumber = await prisma.userNumber.findUnique({
      where: { userId: session.user.id }
    })

    if (!userNumber) {
      return createApiError("No number found", API_ERROR_CODES.NOT_FOUND, 404)
    }

    // Check if service already exists
    const existingService = await prisma.userService.findFirst({
      where: {
        userNumberId: userNumber.id,
        forwardingCode: {
          id: serviceType
        }
      }
    })

    if (existingService) {
      return createApiError(
        "Service already exists",
        API_ERROR_CODES.VALIDATION_ERROR,
        400
      )
    }

    // Get forwarding code
    const forwardingCode = await prisma.forwardingCode.findUnique({
      where: { id: serviceType }
    })

    if (!forwardingCode) {
      return createApiError("Service type not found", API_ERROR_CODES.NOT_FOUND, 404)
    }

    // Create new service
    const newService = await prisma.userService.create({
      data: {
        userNumberId: userNumber.id,
        carrierId: userNumber.carrierId,
        forwardingCodeId: forwardingCode.id,
        gsmCode: forwardingCode.activateFormat.replace(
          '{telynex_number}',
          userNumber.telyxNumber
        ),
        isActive: false
      },
      include: {
        carrier: {
          select: {
            name: true
          }
        },
        forwardingCode: {
          select: {
            serviceType: true,
            activateFormat: true,
            deactivateFormat: true
          }
        },
        userNumber: {
          select: {
            telyxNumber: true
          }
        }
      }
    })

    return createApiResponse(newService)
  } catch (error) {
    console.error("Error creating service:", error)
    return createApiError(
      "Failed to create service",
      API_ERROR_CODES.INTERNAL_ERROR,
      500
    )
  }
}