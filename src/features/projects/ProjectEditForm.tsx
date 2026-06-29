"use client";

import Link from "next/link";
import type { Project, Skill } from "@prisma/client";
import { useActionState } from "react";

import { updateProjectAction } from "@/features/projects/actions";

type ProjectWithSkills = Project & {
    skills: Skill[];
};

type Props = {
    project: ProjectWithSkills;
    skills: Skill[];
};

export default function ProjectEditForm({ project, skills }: Props) {
    const selectedSkillIds = project.skills.map((skill) => skill.id);

    const [state, formAction, isPending] = useActionState(
        async (_prevState: { error?: string } | undefined, formData: FormData) => {
            return updateProjectAction(project.id, formData);
        },
        undefined,
    );

    return (
        <form action={formAction} className="space-y-6 rounded-2xl bg-white p-8 shadow">
            {state?.error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm font-bold text-red-600">
                    {state.error}
                </p>
            )}

            <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-bold text-slate-700">
                    案件名
                </label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    defaultValue={project.title}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="description"
                    className="block text-sm font-bold text-slate-700"
                >
                    案件概要
                </label>
                <textarea
                    id="description"
                    name="description"
                    defaultValue={project.description}
                    className="min-h-36 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label
                        htmlFor="location"
                        className="block text-sm font-bold text-slate-700"
                    >
                        勤務地
                    </label>
                    <input
                        id="location"
                        name="location"
                        type="text"
                        defaultValue={project.location}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="unitPrice"
                        className="block text-sm font-bold text-slate-700"
                    >
                        単価
                    </label>
                    <input
                        id="unitPrice"
                        name="unitPrice"
                        type="number"
                        defaultValue={project.unitPrice}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <p className="text-sm font-bold text-slate-700">必要スキル</p>

                {skills.length === 0 ? (
                    <p className="text-sm text-slate-500">
                        登録済みのスキルがありません。先にスキルを登録してください。
                    </p>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                        {skills.map((skill) => (
                            <label
                                key={skill.id}
                                className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm"
                            >
                                <input
                                    type="checkbox"
                                    name="skillIds"
                                    value={skill.id}
                                    defaultChecked={selectedSkillIds.includes(skill.id)}
                                    className="h-4 w-4"
                                />
                                <span className="font-semibold text-slate-700">
                                    {skill.name}
                                    <span className="ml-2 text-xs font-normal text-slate-400">
                                        {skill.category}
                                    </span>
                                </span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3">
                <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                    キャンセル
                </Link>

                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {isPending ? "更新中..." : "更新する"}
                </button>
            </div>
        </form>
    );
}