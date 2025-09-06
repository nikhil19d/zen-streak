import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./db";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      if (user.email && user.name) {
        try {
          const User = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name
            }
          })
          await prisma.streak.create({
            data: {
              userId: User.id
            }
          })
        } catch (e) { console.log(e) }
        return true
      } else return false
    },
    async session({ session }) {
      if (session.user?.email) {
        const user = await prisma.user.findUniqueOrThrow({
          where: {
            email: session.user.email
          }
        })
        session.user.id = user.id
      }
      return session
    }
  }
}

export default authOptions
