import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Skill } from "@prisma/client";

import { auth } from "@/auth";
import { CreateProposalButton } from "@/features/proposalHistories/CreateProposalButton";
import { getEngineers } from "@/lib/repositories/engineerRepository";
import { getProjectById } from "@/lib/repositories/projectRepository";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

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

    const matchRate = Math.round(
        (matchedSkills.length / projectSkills.length) * 100,
    );

    return {
        matchedSkills,
        matchRate,
    };
}

export default async function ProjectMatchingPage({ params }: Props) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const { id } = await params;

    const project = await getProjectById(id);

    if (!project) {
        notFound();
    }

    const engineers = await getEngineers();

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
        <main className="min-h-screen bg-slate-100 p-8">
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-blue-600">
                            Project Matching
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-slate-900">
                            {project.title} のマッチング
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            案件の必要スキルと要員の保有スキルを比較します。
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
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
                                        <span className="ml-2 text-blue-400">
                                            {skill.category}
                                        </span>
                                    </span>
                                ))
                            )}
                        </div>
                    </div>

                    <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                    >
                        案件詳細へ戻る
                    </Link>
                </div>

                {engineers.length === 0 ? (
                    <section className="rounded-2xl bg-white p-8 text-center shadow">
                        <p className="text-slate-500">
                            要員が登録されていません。先に要員を登録してください。
                        </p>
                    </section>
                ) : (
                    <section className="space-y-4">
                        {matchingEngineers.map(({ engineer, matchedSkills, matchRate }) => (
                            <article
                                key={engineer.id}
                                className="rounded-2xl bg-white p-6 shadow"
                            >
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Link
                                                href={`/dashboard/engineers/${engineer.id}`}
                                                className="text-xl font-bold text-slate-900 hover:text-blue-600"
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

                                    <div className="w-full space-y-3 md:w-80">
                                        <CreateProposalButton
                                            projectId={project.id}
                                            engineerId={engineer.id}
                                        />

                                        <Link
                                            href={`/dashboard/engineers/${engineer.id}`}
                                            className="block rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-bold text-white hover:bg-blue-700"
                                        >
                                            要員詳細
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </section>
                )}

                <Link
                    href="/dashboard/projects"
                    className="inline-flex text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                    ← 案件一覧へ戻る
                </Link>
            </div>
        </main>
    );
}