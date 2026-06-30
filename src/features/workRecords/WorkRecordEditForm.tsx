"use client";

import Link from "next/link";
import type { Engineer, Project, WorkRecord } from "@prisma/client";
import { useActionState } from "react";

import { updateWorkRecordAction } from "@/features/workRecords/actions";

type WorkRecordWithRelations = WorkRecord & {
    project: Project;
    engineer: Engineer;
};

type Props = {
    workRecord: WorkRecordWithRelations;
    projects: Project[];
    engineers: Engineer[];
};

export default function WorkRecordEditForm({
    workRecord,
    projects,
    engineers,
}: Props) {
    const [state, formAction, isPending] = useActionState(
        async (
            _prevState: { error?: string } | undefined,
            formData: FormData,
        ): Promise<{ error?: string } | undefined> => {
            return updateWorkRecordAction(workRecord.id, formData);
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
                    defaultValue={workRecord.projectId}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
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
                    defaultValue={workRecord.engineerId}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
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
                    defaultValue={workRecord.targetMonth}
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
                        defaultValue={workRecord.workingHours}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
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
                        defaultValue={workRecord.billingAmount}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
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
                        defaultValue={workRecord.paymentAmount}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                粗利は「請求金額 - 支払金額」で自動計算されます。現在の粗利：
                <span className="ml-1 font-bold text-slate-900">
                    {workRecord.grossProfit.toLocaleString()}円
                </span>
            </div>

            <div className="space-y-2">
                <label htmlFor="memo" className="block text-sm font-bold text-slate-700">
                    メモ
                </label>
                <textarea
                    id="memo"
                    name="memo"
                    defaultValue={workRecord.memo ?? ""}
                    className="min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
            </div>

            <div className="flex justify-end gap-3">
                <Link
                    href={`/dashboard/work-records/${workRecord.id}`}
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