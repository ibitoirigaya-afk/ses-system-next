"use client";

import { useActionState } from "react";

import { createProposalHistoryAction } from "@/features/proposalHistories/actions";

type Props = {
    projectId: string;
    engineerId: string;
};

export function CreateProposalButton({ projectId, engineerId }: Props) {
    const [state, formAction, isPending] = useActionState(
        async (_prevState: { error?: string } | undefined, formData: FormData) => {
            return createProposalHistoryAction(formData);
        },
        undefined,
    );

    return (
        <form
            action={formAction}
            className="w-full space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
        >
            <input type="hidden" name="projectId" value={projectId} />
            <input type="hidden" name="engineerId" value={engineerId} />

            {state?.error && (
                <p className="rounded bg-red-50 p-2 text-xs font-bold text-red-600">
                    {state.error}
                </p>
            )}

            <div className="space-y-2">
                <label
                    htmlFor={`interviewDate-${engineerId}`}
                    className="block text-xs font-bold text-slate-600"
                >
                    面談日
                </label>
                <input
                    id={`interviewDate-${engineerId}`}
                    name="interviewDate"
                    type="date"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                />
            </div>

            <div className="space-y-2">
                <label
                    htmlFor={`memo-${engineerId}`}
                    className="block text-xs font-bold text-slate-600"
                >
                    メモ
                </label>
                <textarea
                    id={`memo-${engineerId}`}
                    name="memo"
                    className="min-h-20 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                    placeholder="例：React経験あり。単価相談可。面談候補日確認中。"
                />
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50"
            >
                {isPending ? "作成中..." : "この内容で提案する"}
            </button>
        </form>
    );
}