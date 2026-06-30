"use client";

import Link from "next/link";
import type { BpCompany } from "@prisma/client";
import { useState } from "react";

import { registerAction } from "./actions";

type Props = {
    bpCompanies: BpCompany[];
};

export function RegisterForm({ bpCompanies }: Props) {
    const [role, setRole] = useState("user");
    const [belongsToBpCompany, setBelongsToBpCompany] = useState("false");
    const [isBpCompany, setIsBpCompany] = useState("false");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(formData: FormData) {
        setErrorMessage("");

        const result = await registerAction(formData);

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
                    htmlFor="name"
                    className="block text-sm font-bold text-slate-700"
                >
                    名前
                </label>

                <input
                    id="name"
                    name="name"
                    type="text"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                    placeholder="例：山田 太郎"
                />
            </div>

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
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                    placeholder="例：sample@example.com"
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
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                    placeholder="8文字以上"
                />
            </div>

            <div>
                <label
                    htmlFor="role"
                    className="block text-sm font-bold text-slate-700"
                >
                    権限
                </label>

                <select
                    id="role"
                    name="role"
                    value={role}
                    onChange={(event) => {
                        setRole(event.target.value);
                        setBelongsToBpCompany("false");
                        setIsBpCompany("false");
                    }}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                >
                    <option value="user">user</option>
                    <option value="company">company</option>
                </select>
            </div>

            {role === "company" && (
                <div className="space-y-5 rounded-xl bg-slate-50 p-5">
                    <div>
                        <label
                            htmlFor="companyName"
                            className="block text-sm font-bold text-slate-700"
                        >
                            会社名
                        </label>

                        <input
                            id="companyName"
                            name="companyName"
                            type="text"
                            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                            placeholder="例：株式会社サンプル"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="isBpCompany"
                            className="block text-sm font-bold text-slate-700"
                        >
                            BP企業ですか？
                        </label>

                        <select
                            id="isBpCompany"
                            name="isBpCompany"
                            value={isBpCompany}
                            onChange={(event) => setIsBpCompany(event.target.value)}
                            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                        >
                            <option value="false">いいえ</option>
                            <option value="true">はい</option>
                        </select>

                        <p className="mt-2 text-xs text-slate-500">
                            はいを選ぶと、登録後にBP企業データと参加コードが自動作成されます。
                        </p>
                    </div>
                </div>
            )}

            {role === "user" && (
                <div className="space-y-5 rounded-xl bg-slate-50 p-5">
                    <div>
                        <label
                            htmlFor="belongsToBpCompany"
                            className="block text-sm font-bold text-slate-700"
                        >
                            BP企業に所属していますか？
                        </label>

                        <select
                            id="belongsToBpCompany"
                            name="belongsToBpCompany"
                            value={belongsToBpCompany}
                            onChange={(event) =>
                                setBelongsToBpCompany(event.target.value)
                            }
                            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                        >
                            <option value="false">いいえ</option>
                            <option value="true">はい</option>
                        </select>
                    </div>

                    {belongsToBpCompany === "true" && (
                        <>
                            <div>
                                <label
                                    htmlFor="bpCompanyId"
                                    className="block text-sm font-bold text-slate-700"
                                >
                                    所属BP企業
                                </label>

                                <select
                                    id="bpCompanyId"
                                    name="bpCompanyId"
                                    defaultValue=""
                                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                                >
                                    <option value="">BP企業を選択してください</option>

                                    {bpCompanies.map((bpCompany) => (
                                        <option key={bpCompany.id} value={bpCompany.id}>
                                            {bpCompany.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="joinCode"
                                    className="block text-sm font-bold text-slate-700"
                                >
                                    参加コード
                                </label>

                                <input
                                    id="joinCode"
                                    name="joinCode"
                                    type="text"
                                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                                    placeholder="例：BP-ABC123"
                                />

                                <p className="mt-2 text-xs text-slate-500">
                                    所属BP企業から共有された参加コードを入力してください。
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}

            <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700"
            >
                新規登録
            </button>

            <p className="text-center text-sm text-slate-500">
                すでにアカウントがある場合は{" "}
                <Link
                    href="/login"
                    className="font-bold text-blue-600 hover:text-blue-700"
                >
                    ログイン
                </Link>
            </p>
        </form>
    );
}