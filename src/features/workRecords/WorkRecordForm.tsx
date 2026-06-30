"use client";

import Link from "next/link";
import type { Engineer, Project } from "@prisma/client";
import { useActionState } from "react";

import { createWorkRecordAction } from "@/features/workRecords/actions";

type Props = {
    projects: Project[];
    engineers: Engineer[];
};

export default function WorkRecordForm({ projects, engineers }: Props) {
    const [state, formAction, isPending] = useActionState(
        async (
            _prevState: { error?: string } | undefined,
            formData: FormData,
        ): Promise<{ error?: string } | undefined> => {
            return createWorkRecordAction(formData);
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

            <div className="space-y-2">
                <label htmlFor="projectId" className="block text-sm font-bold text-slate-700">
                    案件
                </label>
                <select
                    id="projectId"
                    name="projectId"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    defaultValue=""
                >
                    <option value="">案件を選択してください</option>
                    {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                            {project.title}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label htmlFor="engineerId" className="block text-sm font-bold text-slate-700">
                    要員
                </label>
                <select
                    id="engineerId"
                    name="engineerId"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    defaultValue=""
                >
                    <option value="">要員を選択してください</option>
                    {engineers.map((engineer) => (
                        <option key={engineer.id} value={engineer.id}>
                            {engineer.name}（{engineer.companyName}）
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label htmlFor="targetMonth" className="block text-sm font-bold text-slate-700">
                    対象月
                </label>
                <input
                    id="targetMonth"
                    name="targetMonth"
                    type="month"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                    <label
                        htmlFor="workingHours"
                        className="block text-sm font-bold text-slate-700"
                    >
                        稼働時間
                    </label>
                    <input
                        id="workingHours"
                        name="workingHours"
                        type="number"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        placeholder="例：160"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="billingAmount"
                        className="block text-sm font-bold text-slate-700"
                    >
                        請求金額
                    </label>
                    <input
                        id="billingAmount"
                        name="billingAmount"
                        type="number"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        placeholder="例：700000"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="paymentAmount"
                        className="block text-sm font-bold text-slate-700"
                    >
                        支払金額
                    </label>
                    <input
                        id="paymentAmount"
                        name="paymentAmount"
                        type="number"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        placeholder="例：550000"
                    />
                </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                粗利は「請求金額 - 支払金額」で自動計算されます。
            </div>

            <div className="space-y-2">
                <label htmlFor="memo" className="block text-sm font-bold text-slate-700">
                    メモ
                </label>
                <textarea
                    id="memo"
                    name="memo"
                    className="min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2"
                    placeholder="例：稼働安定。翌月も継続予定。"
                />
            </div>

            <div className="flex justify-end gap-3">
                <Link
                    href="/dashboard/work-records"
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