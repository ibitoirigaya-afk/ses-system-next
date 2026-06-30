import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { ProjectRestoreButton } from "@/features/projects/ProjectRestoreButton";
import { getDeletedProjectsForUser } from "@/lib/repositories/projectRepository";

export default async function DeletedProjectsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const projects = await getDeletedProjectsForUser(session.user.id);

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <div className="mx-auto max-w-6xl space-y-6">
                <div>
                    <p className="text-sm font-semibold text-blue-600">
                        Deleted Projects
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        削除済み案件一覧
                    </h1>
                </div>

                <div className="rounded-2xl bg-white shadow">
                    {projects.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            削除済みの案件はありません。
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200">
                            {projects.map((project) => (
                                <div key={project.id} className="p-6">
                                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
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

                                            <p className="mt-1 text-sm text-slate-500">
                                                作成者：
                                                {project.createdBy.name}
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-start gap-3 md:items-end">
                                            <p className="text-lg font-bold text-slate-900">
                                                {project.unitPrice.toLocaleString()}
                                                円
                                            </p>

                                            <ProjectRestoreButton
                                                projectId={project.id}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

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