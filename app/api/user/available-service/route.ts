// app/api/user/available-services/route.ts
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { createApiResponse, createApiError, API_ERROR_CODES } from "@/lib/utils/api"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return createApiError("Unauthorized", API_ERROR_CODES.UNAUTHORIZED, 401)
    }

    // Get user's current services
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
  } catch (error) {
    console.error("Error fetching available services:", error)
    return createApiError(
      "Failed to fetch available services",
      API_ERROR_CODES.INTERNAL_ERROR,
      500
    )
  }
}