import { NextApiRequest } from "next"

export type CustomRequest<Body = any, Params = any> = Omit<NextApiRequest, "body" | "query"> & {
  body: Body
  query: NextApiRequest["query"] & Params
}
