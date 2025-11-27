import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email send')
    return
  }

  try {
    const data = await resend.emails.send({
      from: 'Groovy December Festival <noreply@groovydecember.com>',
      to,
      subject,
      html
    })

    return { success: true, data }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error }
  }
}

// Email templates
export function getRegistrationConfirmationEmail(hotelName: string) {
  return {
    subject: 'Hotel Registration Received - Groovy December Festival',
    html: `
      <h1>Thank You for Registering Your Hotel</h1>
      <p>We have received your registration for ${hotelName}.</p>
      <p>Our team will review your submission within 2-3 business days. We'll notify you once the review is complete.</p>
      <p>If you have any questions in the meantime, please don't hesitate to contact us.</p>
      <br>
      <p>Best regards,</p>
      <p>The Groovy December Festival Team</p>
    `
  }
}

export function getAdminNotificationEmail(hotelName: string, hotelId: string) {
  return {
    subject: 'New Hotel Registration Pending Review',
    html: `
      <h1>New Hotel Registration</h1>
      <p>A new hotel registration has been submitted and requires your review.</p>
      <p><strong>Hotel Name:</strong> ${hotelName}</p>
      <p>Please review the registration at your earliest convenience:</p>
      <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/hotels?id=${hotelId}">Review Registration</a></p>
    `
  }
}

export function getApprovalEmail(hotelName: string) {
  return {
    subject: 'Hotel Registration Approved - Groovy December Festival',
    html: `
      <h1>Congratulations! Your Hotel Registration is Approved</h1>
      <p>We're pleased to inform you that your hotel, ${hotelName}, has been approved for the Groovy December Festival.</p>
      <p>Your hotel will now be visible to festival attendees looking for accommodation.</p>
      <p>Next steps:</p>
      <ol>
        <li>Set up your room inventory</li>
        <li>Update your availability calendar</li>
        <li>Review your hotel's public profile</li>
      </ol>
      <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/hotels/dashboard">Access Your Hotel Dashboard</a></p>
      <br>
      <p>Best regards,</p>
      <p>The Groovy December Festival Team</p>
    `
  }
}

export function getRejectionEmail(hotelName: string, reason?: string) {
  return {
    subject: 'Hotel Registration Update - Groovy December Festival',
    html: `
      <h1>Hotel Registration Status Update</h1>
      <p>Thank you for your interest in partnering with the Groovy December Festival.</p>
      <p>After careful review of your registration for ${hotelName}, we regret to inform you that we are unable to approve your hotel at this time.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      <p>If you would like to submit a new registration addressing these concerns, you're welcome to do so.</p>
      <p>For any questions, please contact our support team.</p>
      <br>
      <p>Best regards,</p>
      <p>The Groovy December Festival Team</p>
    `
  }
}