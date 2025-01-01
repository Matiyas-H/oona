// lib/twilio.ts
import { Twilio } from 'twilio'
import { prisma } from "@/lib/db"

// Validate environment variables at startup
const requiredEnvVars = [
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_WEBHOOK_URL',
  'TWILIO_VERIFY_SERVICE_SID',
  'TWILIO_ADDRESS_SID'
] as const

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
}

export const twilioClient = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
  
)

// Helper to log failed purchases
async function logFailedPurchase(params: {
  userId: string
  twilioNumber?: string
  carrierId: string
  countryId: string
  error: string
  numberType?: 'mobile' | 'local'
  attemptedAt?: Date
}) {
  try {
    await prisma.failedPurchase.create({
      data: {
        userId: params.userId,
        twilioNumber: params.twilioNumber || '',
        carrierId: params.carrierId,
        countryId: params.countryId,
        error: params.error,
        // numberType: params.numberType,
        createdAt: params.attemptedAt || new Date()
      }
    })
  } catch (error) {
    console.error('Failed to log failed purchase:', error)
  }
}

// Helper to format phone number
function formatPhoneNumber(number: string): string {
  return number.replace(/^\+/, '')
}

// Helper to determine and search for country-specific number type
async function searchForNumber(countryIsoCode: string) {
  const numberType = countryIsoCode === 'FI' ? 'mobile' : 'local'
  console.log(`Searching for ${numberType} number in ${countryIsoCode}`)

  try {
    if (countryIsoCode === 'FI') {
      const numbers = await twilioClient.availablePhoneNumbers(countryIsoCode)
        .mobile
        .list({ 
          limit: 1,
          voiceEnabled: true
        })
      return { numbers, type: numberType as 'mobile' | 'local' }
    } else {
      const numbers = await twilioClient.availablePhoneNumbers(countryIsoCode)
        .local
        .list({ 
          limit: 1,
          voiceEnabled: true
        })
      return { numbers, type: numberType as 'mobile' | 'local' }
    }
  } catch (error) {
    console.error(`Error searching for ${numberType} numbers in ${countryIsoCode}:`, error)
    throw new Error(`Failed to search ${numberType} numbers in ${countryIsoCode}: ${error.message}`)
  }
}

export async function purchaseNumber(params: {
  userId: string
  countryId: string
  carrierId: string
}) {
  const { userId, countryId, carrierId } = params
  const attemptedAt = new Date()

  // Handle development environment
  if (process.env.NODE_ENV !== 'production') {
    try {
      const country = await prisma.country.findUniqueOrThrow({
        where: { id: countryId }
      })
      
      const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
      const testNumber = `${country.code}${randomSuffix}`.replace(/^\+/, '')
      
      const numberType = country.isoCode === 'FI' ? 'mobile' : 'local'
      console.log(`Development mode - using test ${numberType} number:`, testNumber)
      return testNumber
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      await logFailedPurchase({
        userId,
        carrierId,
        countryId,
        error: `Failed to generate test number: ${errorMessage}`,
        attemptedAt
      })
      throw new Error('Failed to generate test number')
    }
  }

  try {
    // Get country details
    const country = await prisma.country.findUniqueOrThrow({
      where: { id: countryId }
    })

    if (!country.isoCode) {
      throw new Error(`Country ${country.name} does not have an ISO code configured`)
    }

    console.log(`Initiating number purchase for ${country.name} (${country.isoCode})`)
    
    // Search for available numbers based on country
    const { numbers: availableNumbers, type: numberType } = await searchForNumber(country.isoCode)

    if (!availableNumbers || availableNumbers.length === 0) {
      const error = `No ${numberType} numbers available in ${country.name} (${country.isoCode})`
      console.error(error)
      await logFailedPurchase({
        userId,
        carrierId,
        countryId,
        error,
        numberType,
        attemptedAt
      })
      throw new Error(error)
    }

    console.log(`Found available ${numberType} number:`, availableNumbers[0].phoneNumber)

    // Purchase the number with webhook configuration
    let purchasedNumber;
    try {
      if (country.isoCode === 'FI') {
        purchasedNumber = await twilioClient.incomingPhoneNumbers
          .create({
            phoneNumber: availableNumbers[0].phoneNumber,
            voiceUrl: process.env.TWILIO_WEBHOOK_URL,
            // statusCallback: `${process.env.TWILIO_WEBHOOK_URL}/status`.replace(/\/+/g, '/'),
            addressSid: process.env.TWILIO_ADDRESS_SID // Add for Finnish numbers
          });
      } else {
        purchasedNumber = await twilioClient.incomingPhoneNumbers
          .create({
            phoneNumber: availableNumbers[0].phoneNumber,
            voiceUrl: process.env.TWILIO_WEBHOOK_URL,
            // statusCallback: `${process.env.TWILIO_WEBHOOK_URL}/status`.replace(/\/+/g, '/'),
          });
      }
    } catch (error) {
      console.error(`Error purchasing ${numberType} number:`, error);
      await logFailedPurchase({
        userId,
        carrierId,
        countryId,
        error: `Failed to purchase ${numberType} number: ${error.message}`,
        numberType,
        attemptedAt
      });
      throw new Error(`Failed to purchase ${numberType} number: ${error.message}`);
    }

    if (!purchasedNumber?.phoneNumber) {
      const error = `Failed to purchase ${numberType} number: Invalid response from Twilio`
      await logFailedPurchase({
        userId,
        carrierId,
        countryId,
        error,
        numberType,
        attemptedAt
      })
      throw new Error(error)
    }

    const formattedNumber = formatPhoneNumber(purchasedNumber.phoneNumber)
    console.log(`Successfully purchased ${numberType} number:`, formattedNumber)
    
    return formattedNumber

  } catch (error) {
    console.error('Error in purchaseNumber:', error)
    
    await logFailedPurchase({
      userId,
      carrierId,
      countryId,
      error: error instanceof Error ? error.message : 'Unknown error in purchaseNumber',
      attemptedAt
    })
    
    throw error instanceof Error ? error : new Error('Unknown error in purchaseNumber')
  }
}

// Add function to release/cleanup number if needed
export async function releaseNumber(number: string) {
  if (process.env.NODE_ENV === 'production') {
    try {
      const formattedNumber = formatPhoneNumber(number)
      const numbers = await twilioClient.incomingPhoneNumbers
        .list({ phoneNumber: formattedNumber })

      if (numbers.length > 0) {
        await twilioClient.incomingPhoneNumbers(numbers[0].sid)
          .remove()
        console.log('Successfully released number:', formattedNumber)
      }
    } catch (error) {
      console.error('Failed to release number:', error)
      throw error
    }
  }
}