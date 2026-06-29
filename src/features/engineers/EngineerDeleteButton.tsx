"use client";

import { useTransition } from "react";

import { deleteEngineerAction } from "@/features/engineers/actions";

type Props = {
    engineerId: string;
};

export function EngineerDeleteButton({ engineerId }: Props) {
    const [isPending, startTransition] = useTransition();

    function handleDelete() {
        const confirmed = window.confirm("この要員を削除しますか？");

        if (!confirmed) {
            return;
        }

        startTransition(() => {
            deleteEngineerAction(engineerId);
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