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
            const res = await fetch("https://blog-backend-l.onrender.com/token", {
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
      // 1. When the backend gives us the token, save it to the encrypted cookie (JWT)
      async jwt({ token, user }: any) {
        if (user) {
          token.accessToken = user.accessToken;
          token.role = user.role; // Optional: If you have roles
        }
        return token;
      },
      
      // 2. When the frontend asks for data, copy the token from the cookie to the session
      async session({ session, token }: any) {
        session.accessToken = token.accessToken;
        session.user.id = token.sub; // Optional: Pass user ID
        return session;
      },
    },
});

// IMPORTANT: You must export GET and POST
export { handler as GET, handler as POST };