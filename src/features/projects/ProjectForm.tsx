"use client";

import type { Skill } from "@prisma/client";
import { useActionState } from "react";

import { createProjectAction } from "@/features/projects/actions";

type Props = {
    skills: Skill[];
};

export default function ProjectForm({ skills }: Props) {
    const [state, formAction, isPending] = useActionState(
        async (_prevState: { error?: string } | undefined, formData: FormData) => {
            return createProjectAction(formData);
        },
        undefined,
    );

    return (
        <form action={formAction} className="space-y-6 rounded-lg border bg-white p-6">
            {state?.error && (
                <p className="rounded bg-red-50 p-3 text-sm text-red-600">
                    {state.error}
                </p>
            )}

            <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-bold">
                    案件名
                </label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    className="w-full rounded border px-3 py-2"
                    placeholder="例：Reactエンジニア募集"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-bold">
                    案件説明
                </label>
                <textarea
                    id="description"
                    name="description"
                    className="min-h-32 w-full rounded border px-3 py-2"
                    placeholder="案件内容を入力してください"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-bold">
                    勤務地
                </label>
                <input
                    id="location"
                    name="location"
                    type="text"
                    className="w-full rounded border px-3 py-2"
                    placeholder="例：東京都 / リモート"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="unitPrice" className="block text-sm font-bold">
                    単価
                </label>
                <input
                    id="unitPrice"
                    name="unitPrice"
                    type="number"
                    className="w-full rounded border px-3 py-2"
                    placeholder="例：700000"
                />
            </div>

            <div className="space-y-3">
                <p className="text-sm font-bold">必要スキル</p>

                {skills.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        登録済みのスキルがありません。先にスキルを登録してください。
                    </p>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                        {skills.map((skill) => (
                            <label
                                key={skill.id}
                                className="flex items-center gap-2 rounded border p-3 text-sm"
                            >
                                <input
                                    type="checkbox"
                                    name="skillIds"
                                    value={skill.id}
                                    className="h-4 w-4"
                                />
                                <span>
                                    {skill.name}
                                    <span className="ml-2 text-xs text-gray-500">
                                        {skill.category}
                                    </span>
                                </span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3">
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                >
                    {isPending ? "登録中..." : "登録する"}
                </button>
            </div>
        </form>
    );
}