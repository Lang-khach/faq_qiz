import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

let _authOptions: NextAuthOptions | null = null;

function getAuthOptions(): NextAuthOptions {
  if (_authOptions) {
    return _authOptions;
  }

  // Validate required environment variables at runtime
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is not set in environment variables");
  }
  if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_SECRET is not set in environment variables");
  }
  if (!process.env.NEXTAUTH_SECRET) {
    throw new Error("NEXTAUTH_SECRET is not set in environment variables");
  }

  _authOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ],
    pages: {
      signIn: '/',
      error: '/',
    },
    callbacks: {
      async signIn({ user, account, profile }) {
        // Allow all Google accounts to sign in
        return true;
      },
      async session({ session, token }) {
        if (session.user) {
          session.user.email = token.email || session.user.email || undefined;
        }
        return session;
      },
      async jwt({ token, account, profile }) {
        // Persist the OAuth access_token and or the user id to the token right after signin
        if (account) {
          token.accessToken = account.access_token;
        }
        return token;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
  };

  return _authOptions;
}

export const authOptions: NextAuthOptions = new Proxy({} as NextAuthOptions, {
  get(_target, prop) {
    return getAuthOptions()[prop as keyof NextAuthOptions];
  },
});
