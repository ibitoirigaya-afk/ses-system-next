"use client";

import { useState } from "react";

import { createSkillAction } from "./actions";

export function SkillForm() {
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(formData: FormData) {
        setErrorMessage("");

        const result = await createSkillAction(formData);

        if (result?.error) {
            setErrorMessage(result.error);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-5">
            {errorMessage !== "" && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {errorMessage}
                </div>
            )}

            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-bold text-slate-700"
                >
                    スキル名
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                    placeholder="例：React"
                />
            </div>

            <div>
                <label
                    htmlFor="category"
                    className="block text-sm font-bold text-slate-700"
                >
                    カテゴリ
                </label>
                <input
                    id="category"
                    name="category"
                    type="text"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                    placeholder="例：フロントエンド"
                />
            </div>

            <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
            >
                登録する
            </button>
        </form>
    );
}