// app/api/user/services/[serviceId]/route.ts
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { createApiResponse, createApiError, API_ERROR_CODES } from "@/lib/utils/api"

export async function PATCH(
  req: Request,
  { params }: { params: { serviceId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return createApiError("Unauthorized", API_ERROR_CODES.UNAUTHORIZED, 401)
    }

    // Find service and verify ownership
    const userService = await prisma.userService.findUnique({
      where: { id: params.serviceId },
      include: {
        userNumber: true,
        forwardingCode: true
      }
    })

    if (!userService || userService.userNumber.userId !== session.user.id) {
      return createApiError("Service not found", API_ERROR_CODES.NOT_FOUND, 404)
    }

    // Update service status
    const updatedService = await prisma.userService.update({
      where: { id: params.serviceId },
      data: { 
        isActive: !userService.isActive,
        lastDialed: new Date(),
        updatedAt: new Date()
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

    // Log the service update for tracking
    await prisma.failedServices.upsert({
      where: {
        id: `${userService.id}-${Date.now()}` // Unique ID for the log
      },
      update: {
        resolved: true
      },
      create: {
        id: `${userService.id}-${Date.now()}`,
        userNumberId: userService.userNumberId,
        error: 'Service state updated',
        resolved: true
      }
    })

    return createApiResponse(updatedService)
  } catch (error) {
    console.error("Error updating service:", error)

    // Log the error if update fails
    if (params.serviceId) {
      await prisma.failedServices.create({
        data: {
          id: `${params.serviceId}-${Date.now()}`,
          userNumberId: params.serviceId,
          error: error instanceof Error ? error.message : 'Unknown error',
          resolved: false
        }
      })
    }

    return createApiError(
      "Failed to update service",
      API_ERROR_CODES.INTERNAL_ERROR,
      500
    )
  }
}