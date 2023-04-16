import jwt from "jsonwebtoken"

interface Payload {
  sessionId: string
}

function generateToken(sessionId: string): string {
  const payload: Payload = { sessionId }
  const token = jwt.sign(payload, process.env.JWT_SECRET)
  return token
}
