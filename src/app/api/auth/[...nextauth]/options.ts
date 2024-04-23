import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel, { UserSchema } from "@/models/user.model";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      id: "credentials",

      // `credentials` is used to generate a form on the sign in page.
      credentials: {
        email: { label: "Email", type: "text " },
        password: { label: "Password", type: "password" },
      },

      // tell next-auth how to authorize
      async authorize(credentials): Promise<any> {
        await dbConnect();

        try {
          const user = await UserModel.findOne<UserSchema>(
            {
              email: credentials?.email,
            },
            {
              username: 1,
              password: 1,
              isVerified: 1,
            },
          );

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.isVerified) {
            throw new Error("please verify your account first before login");
          }

          // match the incoming password with database user's password
          const isPasswordMatched = await bcrypt.compare(
            credentials?.password as string,
            user.password,
          );

          if (!isPasswordMatched) {
            throw new Error("Incorect Password");
          }

          return user;

          //
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    // always returns token
    async jwt({ token, user }) {
      if (!user) return token;

      // store in token so that we reduce the database called althow payload become heavy
      token._id = user._id?.toString();
      token.isVerified = user.isVerified;
      token.isAcceptiongMessage = user.isAcceptiongMessage;
      token.username = user.username;

      return token;
    },
    // always returns session
    async session({ session, token }) {
      if (!token) return session;

      // store in session so that we reduce the database called althow payload become heavy
      session.user._id = token._id;
      session.user.isVerified = token.isVerified;
      session.user.isAcceptiongMessage = token.isAcceptiongMessage;
      session.user.username = token.username;

      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET as string,
};
