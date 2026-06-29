import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        Credentials({
            credentials: {
                email: {
                    label: "メールアドレス",
                    type: "email",
                },
                password: {
                    label: "パスワード",
                    type: "password",
                },
            },
            async authorize(credentials) {
                const email = String(credentials?.email ?? "");
                const password = String(credentials?.password ?? "");

                if (email === "" || password === "") {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email,
                    },
                });

                if (!user) {
                    return null;
                }

                const isValidPassword = await bcrypt.compare(
                    password,
                    user.passwordHash,
                );

                if (!isValidPassword) {
                    return null;
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub ?? "";
                session.user.role = token.role ?? "";
            }

            return session;
        },
    },
});