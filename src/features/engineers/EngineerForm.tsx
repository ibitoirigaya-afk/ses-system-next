"use client";

import Link from "next/link";
import type { Skill } from "@prisma/client";
import { useActionState } from "react";

import { createEngineerAction } from "@/features/engineers/actions";

type Props = {
    skills: Skill[];
};

export default function EngineerForm({ skills }: Props) {
    const [state, formAction, isPending] = useActionState(
        async (_prevState: { error?: string } | undefined, formData: FormData) => {
            return createEngineerAction(formData);
        },
        undefined,
    );

    return (
        <form action={formAction} className="space-y-6 rounded-2xl bg-white p-8 shadow">
            {state?.error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm font-bold text-red-600">
                    {state.error}
                </p>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-bold text-slate-700">
                        氏名
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        placeholder="例：田中 太郎"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="companyName"
                        className="block text-sm font-bold text-slate-700"
                    >
                        所属会社
                    </label>
                    <input
                        id="companyName"
                        name="companyName"
                        type="text"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        placeholder="例：株式会社サンプル"
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                    <label htmlFor="age" className="block text-sm font-bold text-slate-700">
                        年齢
                    </label>
                    <input
                        id="age"
                        name="age"
                        type="number"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        placeholder="例：30"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="gender"
                        className="block text-sm font-bold text-slate-700"
                    >
                        性別
                    </label>
                    <input
                        id="gender"
                        name="gender"
                        type="text"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        placeholder="例：男性"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="experienceYears"
                        className="block text-sm font-bold text-slate-700"
                    >
                        経験年数
                    </label>
                    <input
                        id="experienceYears"
                        name="experienceYears"
                        type="number"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        placeholder="例：3"
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label
                        htmlFor="nearestStation"
                        className="block text-sm font-bold text-slate-700"
                    >
                        最寄駅
                    </label>
                    <input
                        id="nearestStation"
                        name="nearestStation"
                        type="text"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        placeholder="例：新宿駅"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="desiredUnitPrice"
                        className="block text-sm font-bold text-slate-700"
                    >
                        希望単価
                    </label>
                    <input
                        id="desiredUnitPrice"
                        name="desiredUnitPrice"
                        type="number"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        placeholder="例：650000"
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label
                        htmlFor="availableDate"
                        className="block text-sm font-bold text-slate-700"
                    >
                        稼働可能日
                    </label>
                    <input
                        id="availableDate"
                        name="availableDate"
                        type="date"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="desiredLocation"
                        className="block text-sm font-bold text-slate-700"
                    >
                        希望勤務地
                    </label>
                    <input
                        id="desiredLocation"
                        name="desiredLocation"
                        type="text"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        placeholder="例：東京 / リモート"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="desiredConditions"
                    className="block text-sm font-bold text-slate-700"
                >
                    希望条件
                </label>
                <textarea
                    id="desiredConditions"
                    name="desiredConditions"
                    className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2"
                    placeholder="例：週3リモート希望、長期案件希望など"
                />
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="careerSummary"
                    className="block text-sm font-bold text-slate-700"
                >
                    経歴概要
                </label>
                <textarea
                    id="careerSummary"
                    name="careerSummary"
                    className="min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2"
                    placeholder="これまでの開発経験や担当工程を入力してください"
                />
            </div>

            <div className="space-y-3">
                <p className="text-sm font-bold text-slate-700">保有スキル</p>

                {skills.length === 0 ? (
                    <p className="text-sm text-slate-500">
                        登録済みのスキルがありません。先にスキルを登録してください。
                    </p>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                        {skills.map((skill) => (
                            <label
                                key={skill.id}
                                className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm"
                            >
                                <input
                                    type="checkbox"
                                    name="skillIds"
                                    value={skill.id}
                                    className="h-4 w-4"
                                />
                                <span className="font-semibold text-slate-700">
                                    {skill.name}
                                    <span className="ml-2 text-xs font-normal text-slate-400">
                                        {skill.category}
                                    </span>
                                </span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3">
                <Link
                    href="/dashboard/engineers"
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