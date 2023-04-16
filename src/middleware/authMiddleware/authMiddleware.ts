import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken"
import { generateSessionId } from "@/utils"
import Cookies from "cookies"

export function authMiddleware<
  Req extends NextApiRequest = NextApiRequest,
  Res extends NextApiResponse = NextApiResponse,
  ReturnReq extends Req & { user: JWTToken } = Req & { user: JWTToken }
>(handler: (req: ReturnReq, res: Res) => Promise<void>) {
  return async (req: Req, res: Res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]

      if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      const decoded: JWTToken = jwt.verify(token, process.env.JWT_SECRET) as JWTToken
      ;(req as any as ReturnReq).user = decoded

      if (!token) {
        const decoded: JWTToken = {
          sessionId: generateSessionId(),
        }
        const newToken = jwt.sign(decoded, process.env.JWT_SECRET, {
          expiresIn: Number.MAX_SAFE_INTEGER,
        })
        ;(req as any as ReturnReq).user = decoded
        const cookies = new Cookies(req, res)
        cookies.set("token", newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 2147483647,
        })
      } else {
        const decoded: JWTToken = jwt.verify(token, process.env.JWT_SECRET) as JWTToken
        ;(req as any as ReturnReq).user = decoded
      }

      return handler(req as any as ReturnReq, res)
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" })
    }
  }
}
