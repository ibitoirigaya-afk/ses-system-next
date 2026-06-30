"use client";

import { useTransition } from "react";

import { deleteBpCompanyAction } from "@/features/bpCompanies/actions";

type Props = {
    bpCompanyId: string;
};

export function BpCompanyDeleteButton({ bpCompanyId }: Props) {
    const [isPending, startTransition] = useTransition();

    function handleDelete() {
        const confirmed = window.confirm("このBP企業を削除しますか？");

        if (!confirmed) {
            return;
        }

        startTransition(() => {
            deleteBpCompanyAction(bpCompanyId);
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