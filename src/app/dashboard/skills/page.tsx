import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getSkills } from "@/lib/repositories/skillRepository";

export default async function SkillsPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const skills = await getSkills();

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <div className="mx-auto max-w-5xl space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-blue-600">Skills</p>
                        <h1 className="mt-2 text-3xl font-bold text-slate-900">
                            スキル一覧
                        </h1>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/dashboard/skills/deleted"
                            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
                        >
                            削除済み一覧
                        </Link>

                        <Link
                            href="/dashboard/skills/new"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                        >
                            新規スキル登録
                        </Link>
                    </div>
                </div>

                <div className="rounded-2xl bg-white shadow">
                    {skills.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            スキルがまだ登録されていません。
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200">
                            {skills.map((skill) => (
                                <div
                                    key={skill.id}
                                    className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between"
                                >
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">
                                            {skill.name}
                                        </h2>

                                        <p className="mt-2 text-sm text-slate-500">
                                            カテゴリ：{skill.category}
                                        </p>
                                    </div>

                                    <Link
                                        href={`/dashboard/skills/${skill.id}/edit`}
                                        className="text-sm font-bold text-blue-600 hover:text-blue-700"
                                    >
                                        編集する →
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Link
                    href="/dashboard"
                    className="inline-flex text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                    ← ダッシュボードへ戻る
                </Link>
            </div>
        </main>
    );
}