import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { authAPI } from "./api/endpoints/auth";
import { ErrorResponse } from "./api/types";
import { LoginResponse } from "./api/resource/auth";
import NextAuth, { Session, User } from "next-auth";

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt" as const,
    maxAge: 7 * 24 * 60 * 60,
  },
  providers: [
    Credentials({
      name: "Login with email and password",
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
            role: responseData.user.role,
            accessToken: responseData.tokens.accessToken,
            refreshToken: responseData.tokens.refreshToken,
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
        token.accessToken = user.accessToken;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.accessToken = token.accessToken;
        session.user.role = token.role;
      }

      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
