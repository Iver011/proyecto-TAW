import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "email", placeholder: "test@test.com" },
        password: { label: "password", type: "password" },
      },
      
      async authorize(credentials) {
        console.log(credentials)
        const res = await fetch(
          `http://localhost:8080/api/auth/login`,
          {
            method: "POST",
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
            }), 
            headers: { "Content-Type": "application/json" },
          }
        );
        const user = await res.json();
        console.log("usuario",user);

        if (!res.ok) throw new Error(user.error);

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut:"/"
  },
});

export { handler as GET, handler as POST };