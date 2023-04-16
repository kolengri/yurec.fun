// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { authMiddleware } from "@/middleware"
import { CustomRequest } from "@/types"

type Body = {
  name: string
  wish: string
  colorVariant: string
  backgroundVariant: string
}

export default authMiddleware<CustomRequest<Body>>(async (req, res) => {
  const { body } = req

  res.status(200)
})
