import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { ProjectDeleteButton } from "@/features/projects/ProjectDeleteButton";
import { getProjectById } from "@/lib/repositories/projectRepository";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ProjectDetailPage({ params }: Props) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const { id } = await params;
    const project = await getProjectById(id);

    if (!project) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-blue-600">
                            Project Detail
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-slate-900">
                            {project.title}
                        </h1>

                        <p className="mt-3 text-sm text-slate-500">
                            作成者：{project.createdBy.name}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={`/dashboard/projects/${project.id}/matching`}
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"
                        >
                            マッチング
                        </Link>

                        <Link
                            href={`/dashboard/projects/${project.id}/edit`}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                        >
                            編集する
                        </Link>

                        <ProjectDeleteButton projectId={project.id} />
                    </div>
                </div>

                <section className="rounded-2xl bg-white p-8 shadow">
                    <dl className="grid gap-6">
                        <div>
                            <dt className="text-sm font-bold text-slate-500">案件名</dt>
                            <dd className="mt-2 text-lg font-semibold text-slate-900">
                                {project.title}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm font-bold text-slate-500">案件概要</dt>
                            <dd className="mt-2 whitespace-pre-wrap leading-7 text-slate-700">
                                {project.description}
                            </dd>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <dt className="text-sm font-bold text-slate-500">勤務地</dt>
                                <dd className="mt-2 text-slate-900">{project.location}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-bold text-slate-500">単価</dt>
                                <dd className="mt-2 text-slate-900">
                                    {project.unitPrice.toLocaleString()}円
                                </dd>
                            </div>
                        </div>

                        <div>
                            <dt className="text-sm font-bold text-slate-500">ステータス</dt>
                            <dd className="mt-2 text-slate-900">{project.status}</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-bold text-slate-500">必要スキル</dt>
                            <dd className="mt-3">
                                {project.skills.length === 0 ? (
                                    <p className="text-sm text-slate-500">
                                        必要スキルは未設定です。
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {project.skills.map((skill) => (
                                            <span
                                                key={skill.id}
                                                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                                            >
                                                {skill.name}
                                                <span className="ml-2 text-slate-400">
                                                    {skill.category}
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </dd>
                        </div>
                    </dl>
                </section>

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