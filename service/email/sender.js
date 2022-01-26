import sgMail from '@sendgrid/mail'

export default class SenderSendGrid {
  async send(msg) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    return await sgMail.send({ ...msg, from: process.env.SEND_FROM_MAIL })
  }
}
