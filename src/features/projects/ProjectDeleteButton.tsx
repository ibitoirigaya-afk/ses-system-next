"use client";

import { deleteProjectAction } from "./actions";

type ProjectDeleteButtonProps = {
    projectId: string;
};

export function ProjectDeleteButton({ projectId }: ProjectDeleteButtonProps) {
    async function handleDelete() {
        const confirmed = window.confirm("この案件を削除しますか？");

        if (!confirmed) {
            return;
        }

        await deleteProjectAction(projectId);
    }

    return (
        <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
        >
            削除する
        </button>
    );
}