"use client";

import Link from "next/link";
import { useActionState } from "react";

import { createBpCompanyAction } from "@/features/bpCompanies/actions";

export default function BpCompanyForm() {
    const [state, formAction, isPending] = useActionState(
        async (
            _prevState: { error?: string } | undefined,
            formData: FormData,
        ): Promise<{ error?: string } | undefined> => {
            return createBpCompanyAction(formData);
        },
        undefined,
    );

    return (
        <form
            action={formAction}
            className="space-y-6 rounded-2xl bg-white p-8 shadow"
        >
            {state?.error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm font-bold text-red-600">
                    {state.error}
                </p>
            )}

            <div className="space-y-2">
                <label
                    htmlFor="name"
                    className="block text-sm font-bold text-slate-700"
                >
                    会社名
                    <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                    id="name"
                    name="name"
                    type="text"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    placeholder="例：株式会社サンプルBP"
                />
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="contactPerson"
                    className="block text-sm font-bold text-slate-700"
                >
                    担当者名
                </label>

                <input
                    id="contactPerson"
                    name="contactPerson"
                    type="text"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    placeholder="例：山田 太郎"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
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
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        placeholder="例：sample@example.com"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="phone"
                        className="block text-sm font-bold text-slate-700"
                    >
                        電話番号
                    </label>

                    <input
                        id="phone"
                        name="phone"
                        type="text"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        placeholder="例：03-1234-5678"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="address"
                    className="block text-sm font-bold text-slate-700"
                >
                    住所
                </label>

                <input
                    id="address"
                    name="address"
                    type="text"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    placeholder="例：東京都渋谷区..."
                />
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="memo"
                    className="block text-sm font-bold text-slate-700"
                >
                    メモ
                </label>

                <textarea
                    id="memo"
                    name="memo"
                    className="min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2"
                    placeholder="例：React案件が多い。月初に要員情報を確認する。"
                />
            </div>

            <div className="flex justify-end gap-3">
                <Link
                    href="/dashboard/bp-companies"
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                    キャンセル
                </Link>

                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {isPending ? "登録中..." : "登録する"}
                </button>
            </div>
        </form>
    );
}