import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const payload = await request.json()

    // Log received submission on server
    console.log('[GTM Submission Received]:', {
      companyName: payload.companyName,
      contactPerson: payload.contactPerson,
      date: payload.date,
      timestamp: new Date().toISOString()
    })

    // Return success response with generated submission ID
    const submissionId = `GTM-${Date.now().toString(36).toUpperCase()}`

    return NextResponse.json(
      {
        success: true,
        submissionId,
        message: 'GTM Strategy submission received successfully.',
        receivedAt: new Date().toISOString()
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[GTM Submission Error]:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process GTM Strategy submission.'
      },
      { status: 500 }
    )
  }
}
