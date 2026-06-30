"use client";

import Link from "next/link";
import type { BpCompany } from "@prisma/client";
import { useActionState } from "react";

import { updateBpCompanyAction } from "@/features/bpCompanies/actions";

type Props = {
    bpCompany: BpCompany;
};

export default function BpCompanyEditForm({ bpCompany }: Props) {
    const [state, formAction, isPending] = useActionState(
        async (
            _prevState: { error?: string } | undefined,
            formData: FormData,
        ): Promise<{ error?: string } | undefined> => {
            return updateBpCompanyAction(bpCompany.id, formData);
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
                    defaultValue={bpCompany.name}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
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
                    defaultValue={bpCompany.contactPerson ?? ""}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
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
                        defaultValue={bpCompany.email ?? ""}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
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
                        defaultValue={bpCompany.phone ?? ""}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
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
                    defaultValue={bpCompany.address ?? ""}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
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
                    defaultValue={bpCompany.memo ?? ""}
                    className="min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
            </div>

            <div className="flex justify-end gap-3">
                <Link
                    href={`/dashboard/bp-companies/${bpCompany.id}`}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                    キャンセル
                </Link>

                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {isPending ? "更新中..." : "更新する"}
                </button>
            </div>
        </form>
    );
}