import dotenv from 'dotenv'

dotenv.config()

const SERVER_PORT = process.env.PORT || 4040
const SERVER_HOSTNAME = process.env.HOST || 'localhost'
const uri = process.env.DB_URI

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT,
}

const jwt = {
  secret: process.env.JWT_SECRET,
  ex: process.env.JWT_EX,
}

const db = {
  uri,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // socketTimeoutMS: 30000,
  },
}

const mail = {
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT,
  user: process.env.MAIL_USER,
  password: process.env.MAIL_PASSWORD,
}

const config = {
  server: SERVER,
  db,
  node_env: process.env.NODE_EN,
  jwt,
  mail,
}

export default config
