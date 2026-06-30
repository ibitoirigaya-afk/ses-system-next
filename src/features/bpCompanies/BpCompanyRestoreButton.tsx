"use client";

import { useTransition } from "react";

import { restoreBpCompanyAction } from "@/features/bpCompanies/actions";

type Props = {
    bpCompanyId: string;
};

export function BpCompanyRestoreButton({ bpCompanyId }: Props) {
    const [isPending, startTransition] = useTransition();

    function handleRestore() {
        const confirmed = window.confirm("このBP企業を復元しますか？");

        if (!confirmed) {
            return;
        }

        startTransition(() => {
            restoreBpCompanyAction(bpCompanyId);
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