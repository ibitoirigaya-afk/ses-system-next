"use client";

import { useTransition } from "react";

import { restoreProposalHistoryAction } from "@/features/proposalHistories/actions";

type Props = {
    proposalHistoryId: string;
};

export function ProposalHistoryRestoreButton({ proposalHistoryId }: Props) {
    const [isPending, startTransition] = useTransition();

    function handleRestore() {
        const confirmed = window.confirm("この提案履歴を復元しますか？");

        if (!confirmed) {
            return;
        }

        startTransition(() => {
            restoreProposalHistoryAction(proposalHistoryId);
        });
    }

    return (
        <button
            type="button"
            onClick={handleRestore}
            disabled={isPending}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50"
        >
            {isPending ? "復元中..." : "復元する"}
        </button>
    );
}