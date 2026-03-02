// import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { prisma } from "@/lib/prisma";
// import { verifyPassword } from "@/lib/auth";
// import NextAuth from "next-auth/next";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Email và mật khẩu không được để trống");
//         }

//         try {
//           const user = await prisma.user.findUnique({
//             where: { email: credentials.email },
//           });

//           if (!user) {
//             throw new Error("Tài khoản không tồn tại");
//           }

//           const isPasswordValid = await verifyPassword(
//             credentials.password,
//             user.password,
//           );

//           if (!isPasswordValid) {
//             throw new Error("Mật khẩu không chính xác");
//           }

//           return {
//             id: user.id,
//             email: user.email,
//             name: user.name,
//             role: user.role,
//           };
//         } catch (error: any) {
//           throw new Error(error.message);
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.role = (user as any).role;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string;
//         (session.user as any).role = token.role as string;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/auth/login",
//   },
//   session: {
//     strategy: "jwt",
//     maxAge: 24 * 60 * 60, // 24 hours
//   },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
