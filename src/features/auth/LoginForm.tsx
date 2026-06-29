"use client";

import { useState } from "react";

import { loginAction } from "./actions";

export function LoginForm() {
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(formData: FormData) {
        setErrorMessage("");

        const result = await loginAction(formData);

        if (result?.error) {
            setErrorMessage(result.error);
        }
    }

    return (
        <form action={handleSubmit} className="mt-8 space-y-5">
            {errorMessage !== "" && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {errorMessage}
                </div>
            )}

            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-bold text-slate-700"
                >
                    メールアドレス
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue="admin@example.com"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                />
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-bold text-slate-700"
                >
                    パスワード
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    defaultValue="password"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                />
            </div>

            <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700"
            >
                ログイン
            </button>
        </form>
    );
}