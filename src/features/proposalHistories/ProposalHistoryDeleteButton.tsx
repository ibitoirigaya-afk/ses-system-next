"use client";

import { useTransition } from "react";

import { deleteProposalHistoryAction } from "@/features/proposalHistories/actions";

type Props = {
    proposalHistoryId: string;
};

export function ProposalHistoryDeleteButton({ proposalHistoryId }: Props) {
    const [isPending, startTransition] = useTransition();

    function handleDelete() {
        const confirmed = window.confirm("この提案履歴を削除しますか？");

        if (!confirmed) {
            return;
        }

        startTransition(() => {
            deleteProposalHistoryAction(proposalHistoryId);
        });
    }

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
        >
            {isPending ? "削除中..." : "削除する"}
        </button>
    );
}