import Mailgen from 'mailgen'

export default class EmailService {
  constructor(env, sender) {
    this.sender = sender
    switch (env) {
      case 'development':
        this.link = 'http://localhost:3000'
        break
      case 'test':
        this.link = 'http://localhost:5000'
        break
      case 'production':
        this.link = 'https://api-contacts-users.herokuapp.com'
        break
      default:
        this.link = 'http://localhost:3000'
    }
  }

  createEmailTemplate(username, verificationToken) {
    const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'hw06',
        link: this.link,
      },
    })

    const email = {
      body: {
        name: username,
        intro: "Welcome! We're very excited to have you on board.",
        action: {
          instructions: 'To get started with Mailgen, please click here:',
          button: {
            color: '#22BC66', // Optional action button color
            text: 'Confirm your account',
            link: `${this.link}/api/users/verify/${verificationToken}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    }
    return mailGenerator.generate(email)
  }

  async sendVerifyEmail(email, username, verificationToken) {
    const emailBody = this.createEmailTemplate(username, verificationToken)
    const msg = {
      to: email,
      subject: 'Verification email',
      html: emailBody,
    }
    try {
      const result = await this.sender.send(msg)
      console.log(result)
      return true
    } catch (error) {
      console.error(error.message)
      return false
    }
  }
}
