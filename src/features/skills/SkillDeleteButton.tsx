"use client";

import { deleteSkillAction } from "./actions";

type SkillDeleteButtonProps = {
    skillId: string;
};

export function SkillDeleteButton({ skillId }: SkillDeleteButtonProps) {
    async function handleDelete() {
        const confirmed = window.confirm("このスキルを削除しますか？");

        if (!confirmed) {
            return;
        }

        await deleteSkillAction(skillId);
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