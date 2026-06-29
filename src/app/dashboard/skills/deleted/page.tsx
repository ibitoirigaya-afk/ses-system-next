import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SkillRestoreButton } from "@/features/skills/SkillRestoreButton";
import { getDeletedSkills } from "@/lib/repositories/skillRepository";

export default async function DeletedSkillsPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const skills = await getDeletedSkills();

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <div className="mx-auto max-w-5xl space-y-6">
                <div>
                    <p className="text-sm font-semibold text-blue-600">Deleted Skills</p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        削除済みスキル一覧
                    </h1>
                </div>

                <div className="rounded-2xl bg-white shadow">
                    {skills.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            削除済みのスキルはありません。
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200">
                            {skills.map((skill) => (
                                <div
                                    key={skill.id}
                                    className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between"
                                >
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">
                                            {skill.name}
                                        </h2>

                                        <p className="mt-2 text-sm text-slate-500">
                                            カテゴリ：{skill.category}
                                        </p>
                                    </div>

                                    <SkillRestoreButton skillId={skill.id} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Link
                    href="/dashboard/skills"
                    className="inline-flex text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                    ← スキル一覧へ戻る
                </Link>
            </div>
        </main>
    );
}