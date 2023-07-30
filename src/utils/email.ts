import logger from '../config/logger'
import nodemailer from 'nodemailer'
import AppError from './appError'
import config from '../config/config'
interface mailData {
  email: string
  subject: string
  message: string
  html?: string
}

const sendEmail = async (data: mailData): Promise<boolean> => {
  logger.info('inside utils sendemail')
  try {
    const transport = nodemailer.createTransport({
      host: config.mail.smtpHost,
      port: Number(config.mail.smtpPort),
      secure: false,
      auth: {
        user: config.mail.user,
        pass: config.mail.password,
      },
    })

    // mail options
    const mailOptions = {
      from: config.mail.user,
      to: data.email,
      subject: data.subject,
      text: data.message,
    }
    const mailed = await transport.sendMail(mailOptions)

    return mailed ? true : false
  } catch (error: any) {
    throw new AppError(error.message, 500)
  }
}

export default sendEmail
