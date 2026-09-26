import { Request, Response, NextFunction } from 'express'

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
const VALID_MODE_IDS = new Set(['daily-conversation', 'job-interview', 'college-life', 'free-talk'])
const ID_REGEX = /^[a-zA-Z0-9_-]{8,64}$/

export function validateSignupInput(req: Request, res: Response, next: NextFunction): void {
  const { name, email, password } = req.body || {}

  if (!name || typeof name !== 'string' || !name.trim()) {
    res.status(400).json({ error: 'Full name is required (max 60 characters).' })
    return
  }
  const cleanName = name.trim()
  if (cleanName.length > 60) {
    res.status(400).json({ error: 'Name must not exceed 60 characters.' })
    return
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    res.status(400).json({ error: 'Valid email address is required.' })
    return
  }
  const cleanEmail = email.toLowerCase().trim()
  if (cleanEmail.length > 100 || !EMAIL_REGEX.test(cleanEmail)) {
    res.status(400).json({ error: 'Please enter a valid email address.' })
    return
  }

  if (!password || typeof password !== 'string') {
    res.status(400).json({ error: 'Password is required.' })
    return
  }
  if (password.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters long.' })
    return
  }
  if (password.length > 128) {
    res.status(400).json({ error: 'Password must not exceed 128 characters.' })
    return
  }
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  if (!hasLetter || !hasNumber) {
    res.status(400).json({ error: 'Password must contain at least one letter and one number.' })
    return
  }

  req.body.name = cleanName
  req.body.email = cleanEmail
  next()
}

export function validateLoginInput(req: Request, res: Response, next: NextFunction): void {
  const { email, password } = req.body || {}

  if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
    res.status(400).json({ error: 'Email and password are required.' })
    return
  }
  const cleanEmail = email.toLowerCase().trim()
  if (cleanEmail.length > 100 || !EMAIL_REGEX.test(cleanEmail)) {
    res.status(400).json({ error: 'Invalid email or password.' })
    return
  }
  if (password.length > 128) {
    res.status(400).json({ error: 'Invalid email or password.' })
    return
  }

  req.body.email = cleanEmail
  next()
}

export function validateStartConversationInput(req: Request, res: Response, next: NextFunction): void {
  const { mode } = req.body || {}

  if (!mode || typeof mode !== 'object' || !mode.id || typeof mode.id !== 'string') {
    res.status(400).json({ error: 'A valid practice mode object is required.' })
    return
  }

  if (!VALID_MODE_IDS.has(mode.id)) {
    res.status(400).json({ error: `Invalid practice mode. Allowed: ${Array.from(VALID_MODE_IDS).join(', ')}` })
    return
  }

  if (!mode.title || typeof mode.title !== 'string' || mode.title.length > 60) {
    res.status(400).json({ error: 'Practice mode title must be a valid string under 60 characters.' })
    return
  }

  if (mode.promptStarter && (typeof mode.promptStarter !== 'string' || mode.promptStarter.length > 500)) {
    res.status(400).json({ error: 'Prompt starter must not exceed 500 characters.' })
    return
  }

  next()
}

export function validateConversationMessageInput(req: Request, res: Response, next: NextFunction): void {
  const { sessionId, userText } = req.body || {}

  if (!sessionId || typeof sessionId !== 'string' || !ID_REGEX.test(sessionId)) {
    res.status(400).json({ error: 'Invalid sessionId format.' })
    return
  }

  if (!userText || typeof userText !== 'string' || !userText.trim()) {
    res.status(400).json({ error: 'Spoken text cannot be empty.' })
    return
  }

  const cleanText = userText.trim()
  if (cleanText.length > 1000) {
    res.status(400).json({ error: 'Spoken input exceeds maximum limit of 1000 characters.' })
    return
  }

  req.body.userText = cleanText
  next()
}

export function validateEndConversationInput(req: Request, res: Response, next: NextFunction): void {
  const { sessionId } = req.body || {}

  if (!sessionId || typeof sessionId !== 'string' || !ID_REGEX.test(sessionId)) {
    res.status(400).json({ error: 'Invalid sessionId format.' })
    return
  }

  next()
}
