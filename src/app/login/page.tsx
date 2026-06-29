import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { LoginForm } from "@/features/auth/LoginForm";

export default async function LoginPage() {
    const session = await auth();

    if (session) {
        redirect("/dashboard");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
                <p className="text-sm font-semibold text-blue-600">
                    SES/BP Sales Management System
                </p>

                <h1 className="mt-3 text-3xl font-bold text-slate-900">ログイン</h1>

                <p className="mt-3 text-sm text-slate-600">
                    Auth.jsを利用したログイン機能です。
                </p>

                <LoginForm />
            </div>
        </main>
    );
}