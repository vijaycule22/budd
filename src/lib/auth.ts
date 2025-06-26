import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // In a real app, you'd fetch from your database
          // For now, we'll use a simple check against environment variables
          const adminEmail = process.env.ADMIN_EMAIL || "admin@studybuddy.com";
          const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

          if (credentials.email === adminEmail) {
            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              await bcrypt.hash(adminPassword, 10)
            );
            if (isPasswordValid) {
              return {
                id: "1",
                email: adminEmail,
                name: "Admin User",
                role: "admin",
              };
            }
          }

          // Check for regular users (you can expand this with a database)
          const users = [
            {
              id: "2",
              email: "user@studybuddy.com",
              password: await bcrypt.hash("user123", 10),
              name: "Regular User",
              role: "user",
            },
          ];

          const user = users.find((u) => u.email === credentials.email);
          if (
            user &&
            (await bcrypt.compare(credentials.password, user.password))
          ) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.role = token.role;
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
