import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load .env from server directory first, fallback to root directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../../.env') })
dotenv.config({ path: path.resolve(__dirname, '../../../.env') })

const nodeEnv = process.env.NODE_ENV || 'development'
const isProduction = nodeEnv === 'production'

const originsRaw = process.env.ALLOWED_ORIGINS || process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173'
const allowedOrigins = originsRaw.split(',').map((o) => o.trim()).filter(Boolean)

export const ENV = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: nodeEnv,
  isProduction,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  AUTH_SECRET: process.env.AUTH_SECRET || (isProduction ? '' : 'dev_insecure_auth_secret_change_me'),
  ALLOWED_ORIGINS: allowedOrigins,
  COOKIE_SECRET: process.env.COOKIE_SECRET || (isProduction ? '' : 'dev_insecure_cookie_secret'),
}

// Security invariant check in production
if (isProduction && !ENV.AUTH_SECRET) {
  console.warn('[SECURITY WARNING] In production, AUTH_SECRET must be defined in environment variables!')
}
