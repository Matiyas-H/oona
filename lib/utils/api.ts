// lib/utils/api.ts
export const API_ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR'
} as const

export function createApiResponse(data: any) {
  return Response.json({
    success: true,
    data
  })
}

export function createApiError(
  message: string,
  code: keyof typeof API_ERROR_CODES,
  status: number = 500
) {
  return Response.json(
    {
      success: false,
      error: {
        message,
        code
      }
    },
    { status }
  )
}