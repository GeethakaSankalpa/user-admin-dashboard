// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "@/lib/dbConnect";
import { User, IUser } from "@/models/User";
import bcrypt from "bcrypt";

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      accessLevel: "admin" | "member";
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    accessLevel: "admin" | "member";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessLevel: "admin" | "member";
    id: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        if (!credentials?.email || !credentials?.password) return null;

        const user = await User.findOne({ email: credentials.email }).lean();
        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid || user.status !== "active") return null;

        // Update last login
        await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          accessLevel: user.accessLevel,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessLevel = user.accessLevel;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.accessLevel = token.accessLevel;
        session.user.id = token.id;
      }
      return session;
    },
    // Add redirect callback
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };