"use client";

import { useTransition } from "react";

import { deleteWorkRecordAction } from "@/features/workRecords/actions";

type Props = {
    workRecordId: string;
};

export function WorkRecordDeleteButton({ workRecordId }: Props) {
    const [isPending, startTransition] = useTransition();

    function handleDelete() {
        const confirmed = window.confirm("この稼働実績を削除しますか？");

        if (!confirmed) {
            return;
        }

        startTransition(() => {
            deleteWorkRecordAction(workRecordId);
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