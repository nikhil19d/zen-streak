import { getServerSession, NextAuthOptions } from "next-auth";
import { UnAuthorizedError } from "./error";
export async function requireAuth(authOptions: NextAuthOptions) {
  const session = await getServerSession(authOptions)
  if (!session) throw new UnAuthorizedError()
  return session
}
