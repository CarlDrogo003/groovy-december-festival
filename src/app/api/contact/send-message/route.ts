import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email to hello@groovydecember.ng
    const emailResponse = await resend.emails.send({
      from: 'Groovy December <onboarding@resend.dev>',
      to: 'hello@groovydecember.ng',
      replyTo: email,
      subject: `New Contact Form Submission: ${subject || 'No subject'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject || 'No subject provided'}</p>
          <hr style="border: 1px solid #ddd; margin: 20px 0;" />
          <h3>Message:</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          <hr style="border: 1px solid #ddd; margin: 20px 0;" />
          <p style="color: #666; font-size: 12px;">
            Reply to this email to respond to the sender.
          </p>
        </div>
      `,
    });

    if (emailResponse.error) {
      console.error('Resend error:', emailResponse.error);
      return Response.json(
        { error: 'Failed to send email', details: emailResponse.error },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: 'Email sent successfully',
      messageId: emailResponse.data?.id,
    });
  } catch (error: any) {
    console.error('Contact email error:', error);
    return Response.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}
