import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Connect to your FastAPI Backend
         // 👇 Make sure there is NO slash at the end of the URL
            const res = await fetch("https://blog-backend-l.onrender.com", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              username: credentials?.username || "",
              password: credentials?.password || "",
            }),
          });

          if (!res.ok) return null;
          const data = await res.json();
          
          return { 
            id: credentials?.username || "user",
            email: credentials?.username, 
            accessToken: data.access_token 
          };
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) token.accessToken = user.accessToken;
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Make sure this is loaded
  pages: {
    signIn: "/login",
  },
});

// IMPORTANT: You must export GET and POST
export { handler as GET, handler as POST };