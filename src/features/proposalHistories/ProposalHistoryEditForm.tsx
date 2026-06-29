"use client";

import Link from "next/link";
import type {
    Engineer,
    Project,
    ProposalHistory,
    ProposalStatus,
} from "@prisma/client";
import { useActionState } from "react";

import { updateProposalHistoryAction } from "@/features/proposalHistories/actions";

type ProposalHistoryWithRelations = ProposalHistory & {
    project: Project;
    engineer: Engineer;
};

type Props = {
    proposal: ProposalHistoryWithRelations;
};

const statusOptions: {
    value: ProposalStatus;
    label: string;
}[] = [
        {
            value: "proposed",
            label: "提案中",
        },
        {
            value: "interviewing",
            label: "面談中",
        },
        {
            value: "accepted",
            label: "成約",
        },
        {
            value: "rejected",
            label: "見送り",
        },
        {
            value: "withdrawn",
            label: "辞退",
        },
    ];

function formatDateForInput(date: Date | null) {
    if (!date) {
        return "";
    }

    return date.toISOString().slice(0, 10);
}

export default function ProposalHistoryEditForm({ proposal }: Props) {
    const [state, formAction, isPending] = useActionState(
        async (
            _prevState: { error?: string } | undefined,
            formData: FormData,
        ): Promise<{ error?: string } | undefined> => {
            await updateProposalHistoryAction(proposal.id, formData);

            return undefined;
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
                <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-sm font-bold text-slate-500">案件</p>
                    <p className="mt-2 font-bold text-slate-900">
                        {proposal.project.title}
                    </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-sm font-bold text-slate-500">要員</p>
                    <p className="mt-2 font-bold text-slate-900">
                        {proposal.engineer.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                        {proposal.engineer.companyName}
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="status" className="block text-sm font-bold text-slate-700">
                    ステータス
                </label>
                <select
                    id="status"
                    name="status"
                    defaultValue={proposal.status}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                    {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                            {status.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="interviewDate"
                    className="block text-sm font-bold text-slate-700"
                >
                    面談日
                </label>
                <input
                    id="interviewDate"
                    name="interviewDate"
                    type="date"
                    defaultValue={formatDateForInput(proposal.interviewDate)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="memo" className="block text-sm font-bold text-slate-700">
                    メモ
                </label>
                <textarea
                    id="memo"
                    name="memo"
                    defaultValue={proposal.memo ?? ""}
                    className="min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2"
                    placeholder="面談予定、営業メモ、見送り理由などを入力してください"
                />
            </div>

            <div className="flex justify-end gap-3">
                <Link
                    href={`/dashboard/proposal-histories/${proposal.id}`}
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