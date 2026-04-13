import { authAPI } from "@/lib/api/endpoints/auth";
import { ErrorResponse } from "@/lib/api/types";
import { LoginResponse } from "@/lib/api/resource/auth";
import NextAuth, { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Login-Golang-API",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await authAPI.login({
            email: credentials.email,
            password: credentials.password,
          });

          // Validate the parsed response and throw if authentication failed
          if (!response || !response.success) {
            const errorResponse = response as ErrorResponse;
            throw {
              success: errorResponse.success,
              message: errorResponse.message,
              error: {
                code: errorResponse.error.code,
                message: errorResponse.error.message,
              },
              meta: errorResponse.meta,
            };
          }
          const responseData = response.data as LoginResponse;
          return {
            id: responseData.user.id,
            name: responseData.user.name,
            email: responseData.user.email,
            roles: responseData.user.role,
            accessToken: responseData.tokens.accessToken,
          };
        } catch (error) {
          throw error as ErrorResponse;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      (
        session as Session & { accessToken?: string; refreshToken?: string }
      ).accessToken = token.accessToken as string;
      (
        session as Session & { accessToken?: string; refreshToken?: string }
      ).refreshToken = token.refreshToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
