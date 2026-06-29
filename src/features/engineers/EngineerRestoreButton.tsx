"use client";

import { useTransition } from "react";

import { restoreEngineerAction } from "@/features/engineers/actions";

type Props = {
    engineerId: string;
};

export function EngineerRestoreButton({ engineerId }: Props) {
    const [isPending, startTransition] = useTransition();

    function handleRestore() {
        const confirmed = window.confirm("この要員を復元しますか？");

        if (!confirmed) {
            return;
        }

        startTransition(() => {
            restoreEngineerAction(engineerId);
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