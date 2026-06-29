"use client";

import { restoreProjectAction } from "./actions";

type ProjectRestoreButtonProps = {
    projectId: string;
};

export function ProjectRestoreButton({ projectId }: ProjectRestoreButtonProps) {
    async function handleRestore() {
        const confirmed = window.confirm("この案件を復元しますか？");

        if (!confirmed) {
            return;
        }

        await restoreProjectAction(projectId);
    }

    return (
        <button
            type="button"
            onClick={handleRestore}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"
        >
            復元する
        </button>
    );
}