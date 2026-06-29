import Link from "next/link";
import { redirect } from "next/navigation";
import type { Skill } from "@prisma/client";

import { auth } from "@/auth";
import { getEngineers } from "@/lib/repositories/engineerRepository";
import { getProjects } from "@/lib/repositories/projectRepository";

function calculateMatchRate(projectSkills: Skill[], engineerSkills: Skill[]) {
    if (projectSkills.length === 0) {
        return {
            matchedSkills: [],
            matchRate: 0,
        };
    }

    const engineerSkillIds = new Set(engineerSkills.map((skill) => skill.id));

    const matchedSkills = projectSkills.filter((skill) =>
        engineerSkillIds.has(skill.id),
    );

    const matchRate = Math.round((matchedSkills.length / projectSkills.length) * 100);

    return {
        matchedSkills,
        matchRate,
    };
}

export default async function MatchingPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const projects = await getProjects();
    const engineers = await getEngineers();

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-blue-600">Matching</p>

                        <h1 className="mt-2 text-3xl font-bold text-slate-900">
                            案件マッチング
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            案件の必要スキルと要員の保有スキルを比較して、一致率を表示します。
                        </p>
                    </div>

                    <Link
                        href="/dashboard"
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                    >
                        ダッシュボードへ戻る
                    </Link>
                </div>

                {projects.length === 0 ? (
                    <section className="rounded-2xl bg-white p-8 text-center shadow">
                        <p className="text-slate-500">
                            案件が登録されていません。先に案件を登録してください。
                        </p>
                    </section>
                ) : engineers.length === 0 ? (
                    <section className="rounded-2xl bg-white p-8 text-center shadow">
                        <p className="text-slate-500">
                            要員が登録されていません。先に要員を登録してください。
                        </p>
                    </section>
                ) : (
                    <section className="space-y-6">
                        {projects.map((project) => {
                            const matchingEngineers = engineers
                                .map((engineer) => {
                                    const { matchedSkills, matchRate } = calculateMatchRate(
                                        project.skills,
                                        engineer.skills,
                                    );

                                    return {
                                        engineer,
                                        matchedSkills,
                                        matchRate,
                                    };
                                })
                                .sort((a, b) => b.matchRate - a.matchRate);

                            return (
                                <article
                                    key={project.id}
                                    className="rounded-2xl bg-white p-6 shadow"
                                >
                                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900">
                                                {project.title}
                                            </h2>

                                            <p className="mt-2 text-sm text-slate-500">
                                                勤務地：{project.location} / 単価：
                                                {project.unitPrice.toLocaleString()}円
                                            </p>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {project.skills.length === 0 ? (
                                                    <span className="text-sm text-slate-400">
                                                        必要スキル未設定
                                                    </span>
                                                ) : (
                                                    project.skills.map((skill) => (
                                                        <span
                                                            key={skill.id}
                                                            className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                                                        >
                                                            {skill.name}
                                                        </span>
                                                    ))
                                                )}
                                            </div>
                                        </div>

                                        <Link
                                            href={`/dashboard/projects/${project.id}`}
                                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                                        >
                                            案件詳細
                                        </Link>
                                    </div>

                                    <div className="mt-6 space-y-3">
                                        <h3 className="text-sm font-bold text-slate-700">
                                            マッチする要員
                                        </h3>

                                        {matchingEngineers.map(
                                            ({ engineer, matchedSkills, matchRate }) => (
                                                <div
                                                    key={engineer.id}
                                                    className="rounded-xl border border-slate-200 p-4"
                                                >
                                                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                                        <div>
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <Link
                                                                    href={`/dashboard/engineers/${engineer.id}`}
                                                                    className="text-lg font-bold text-slate-900 hover:text-blue-600"
                                                                >
                                                                    {engineer.name}
                                                                </Link>

                                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                                                                    一致率 {matchRate}%
                                                                </span>
                                                            </div>

                                                            <p className="mt-2 text-sm text-slate-500">
                                                                所属会社：{engineer.companyName}
                                                            </p>

                                                            <p className="mt-1 text-sm text-slate-500">
                                                                希望単価：
                                                                {engineer.desiredUnitPrice !== null
                                                                    ? `${engineer.desiredUnitPrice.toLocaleString()}円`
                                                                    : "未設定"}
                                                            </p>

                                                            <div className="mt-3 flex flex-wrap gap-2">
                                                                {matchedSkills.length === 0 ? (
                                                                    <span className="text-sm text-slate-400">
                                                                        一致スキルなし
                                                                    </span>
                                                                ) : (
                                                                    matchedSkills.map((skill) => (
                                                                        <span
                                                                            key={skill.id}
                                                                            className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700"
                                                                        >
                                                                            {skill.name}
                                                                        </span>
                                                                    ))
                                                                )}
                                                            </div>
                                                        </div>

                                                        <Link
                                                            href={`/dashboard/engineers/${engineer.id}`}
                                                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                                                        >
                                                            要員詳細
                                                        </Link>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </section>
                )}
            </div>
        </main>
    );
}