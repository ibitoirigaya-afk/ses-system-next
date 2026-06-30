import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
    canCreateProjectForUser,
    getProjectsForUser,
} from "@/lib/repositories/projectRepository";

export default async function ProjectsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const projects = await getProjectsForUser(session.user.id);
    const canCreateProject = await canCreateProjectForUser(session.user.id);

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-blue-600">
                            Projects
                        </p>
                        <h1 className="mt-2 text-3xl font-bold text-slate-900">
                            案件一覧
                        </h1>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/dashboard/projects/deleted"
                            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
                        >
                            削除済み一覧
                        </Link>

                        {canCreateProject && (
                            <Link
                                href="/dashboard/projects/new"
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                            >
                                新規案件登録
                            </Link>
                        )}
                    </div>
                </div>

                <div className="rounded-2xl bg-white shadow">
                    {projects.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            案件がまだ登録されていません。
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200">
                            {projects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/dashboard/projects/${project.id}`}
                                    className="block p-6 hover:bg-slate-50"
                                >
                                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-900">
                                                {project.title}
                                            </h2>

                                            <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                                                {project.description}
                                            </p>

                                            <p className="mt-3 text-sm text-slate-500">
                                                勤務地：{project.location}
                                            </p>
                                        </div>

                                        <div className="text-left md:text-right">
                                            <p className="text-lg font-bold text-slate-900">
                                                {project.unitPrice.toLocaleString()}
                                                円
                                            </p>

                                            <p className="mt-2 text-sm text-slate-500">
                                                作成者：
                                                {project.createdBy.name}
                                            </p>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {project.skills.length === 0 ? (
                                                    <span className="text-sm text-slate-400">
                                                        必要スキル未設定
                                                    </span>
                                                ) : (
                                                    project.skills.map(
                                                        (skill) => (
                                                            <span
                                                                key={skill.id}
                                                                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                                                            >
                                                                {skill.name}
                                                            </span>
                                                        ),
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
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