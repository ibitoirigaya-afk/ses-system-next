"use client";

import { restoreSkillAction } from "./actions";

type SkillRestoreButtonProps = {
    skillId: string;
};

export function SkillRestoreButton({ skillId }: SkillRestoreButtonProps) {
    async function handleRestore() {
        const confirmed = window.confirm("このスキルを復元しますか？");

        if (!confirmed) {
            return;
        }

        await restoreSkillAction(skillId);
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