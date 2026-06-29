"use client";

import Link from "next/link";
import type { Engineer, Skill } from "@prisma/client";
import { useActionState } from "react";

import { updateEngineerAction } from "@/features/engineers/actions";

type EngineerWithSkills = Engineer & {
    skills: Skill[];
};

type Props = {
    engineer: EngineerWithSkills;
    skills: Skill[];
};

function formatDateForInput(date: Date | null) {
    if (!date) {
        return "";
    }

    return date.toISOString().slice(0, 10);
}

export default function EngineerEditForm({ engineer, skills }: Props) {
    const selectedSkillIds = engineer.skills.map((skill) => skill.id);

    const [state, formAction, isPending] = useActionState(
        async (_prevState: { error?: string } | undefined, formData: FormData) => {
            return updateEngineerAction(engineer.id, formData);
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

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-bold text-slate-700">
                        氏名
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        defaultValue={engineer.name}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="companyName"
                        className="block text-sm font-bold text-slate-700"
                    >
                        所属会社
                    </label>
                    <input
                        id="companyName"
                        name="companyName"
                        type="text"
                        defaultValue={engineer.companyName}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                    <label htmlFor="age" className="block text-sm font-bold text-slate-700">
                        年齢
                    </label>
                    <input
                        id="age"
                        name="age"
                        type="number"
                        defaultValue={engineer.age ?? ""}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="gender"
                        className="block text-sm font-bold text-slate-700"
                    >
                        性別
                    </label>
                    <input
                        id="gender"
                        name="gender"
                        type="text"
                        defaultValue={engineer.gender ?? ""}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="experienceYears"
                        className="block text-sm font-bold text-slate-700"
                    >
                        経験年数
                    </label>
                    <input
                        id="experienceYears"
                        name="experienceYears"
                        type="number"
                        defaultValue={engineer.experienceYears ?? ""}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label
                        htmlFor="nearestStation"
                        className="block text-sm font-bold text-slate-700"
                    >
                        最寄駅
                    </label>
                    <input
                        id="nearestStation"
                        name="nearestStation"
                        type="text"
                        defaultValue={engineer.nearestStation ?? ""}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="desiredUnitPrice"
                        className="block text-sm font-bold text-slate-700"
                    >
                        希望単価
                    </label>
                    <input
                        id="desiredUnitPrice"
                        name="desiredUnitPrice"
                        type="number"
                        defaultValue={engineer.desiredUnitPrice ?? ""}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label
                        htmlFor="availableDate"
                        className="block text-sm font-bold text-slate-700"
                    >
                        稼働可能日
                    </label>
                    <input
                        id="availableDate"
                        name="availableDate"
                        type="date"
                        defaultValue={formatDateForInput(engineer.availableDate)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="desiredLocation"
                        className="block text-sm font-bold text-slate-700"
                    >
                        希望勤務地
                    </label>
                    <input
                        id="desiredLocation"
                        name="desiredLocation"
                        type="text"
                        defaultValue={engineer.desiredLocation ?? ""}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="desiredConditions"
                    className="block text-sm font-bold text-slate-700"
                >
                    希望条件
                </label>
                <textarea
                    id="desiredConditions"
                    name="desiredConditions"
                    defaultValue={engineer.desiredConditions ?? ""}
                    className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="careerSummary"
                    className="block text-sm font-bold text-slate-700"
                >
                    経歴概要
                </label>
                <textarea
                    id="careerSummary"
                    name="careerSummary"
                    defaultValue={engineer.careerSummary ?? ""}
                    className="min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
            </div>

            <div className="space-y-3">
                <p className="text-sm font-bold text-slate-700">保有スキル</p>

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
                    href={`/dashboard/engineers/${engineer.id}`}
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