import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken"
import { generateSessionId } from "@/utils"
import Cookies from "cookies"

export function authMiddleware(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]

      if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      const decoded: JWTToken = jwt.verify(token, process.env.JWT_SECRET) as JWTToken
      ;(req as NextApiRequest & { user: JWTToken }).user = decoded

      if (!token) {
        const decoded: JWTToken = {
          sessionId: generateSessionId(),
        }
        const newToken = jwt.sign(decoded, process.env.JWT_SECRET, {
          expiresIn: Number.MAX_SAFE_INTEGER,
        })
        ;(req as NextApiRequest & { user: JWTToken }).user = decoded
        const cookies = new Cookies(req, res)
        cookies.set("token", newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 2147483647,
        })
      } else {
        const decoded: JWTToken = jwt.verify(token, process.env.JWT_SECRET) as JWTToken
        ;(req as NextApiRequest & { user: JWTToken }).user = decoded
      }

      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" })
    }
  }
}
