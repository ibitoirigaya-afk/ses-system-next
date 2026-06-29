"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/auth";

export async function loginAction(formData: FormData) {
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            return {
                error: "メールアドレスまたはパスワードが違います。",
            };
        }

        throw error;
    }

    redirect("/dashboard");
}

export async function logoutAction() {
    await signOut({
        redirectTo: "/login",
    });
}