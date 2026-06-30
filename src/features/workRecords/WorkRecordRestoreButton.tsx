"use client";

import { useTransition } from "react";

import { restoreWorkRecordAction } from "@/features/workRecords/actions";

type Props = {
    workRecordId: string;
};

export function WorkRecordRestoreButton({ workRecordId }: Props) {
    const [isPending, startTransition] = useTransition();

    function handleRestore() {
        const confirmed = window.confirm("この稼働実績を復元しますか？");

        if (!confirmed) {
            return;
        }

        startTransition(() => {
            restoreWorkRecordAction(workRecordId);
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