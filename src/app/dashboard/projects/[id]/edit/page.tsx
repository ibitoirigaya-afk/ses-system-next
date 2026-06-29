import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import ProjectEditForm from "@/features/projects/ProjectEditForm";
import { getProjectById } from "@/lib/repositories/projectRepository";
import { getSkills } from "@/lib/repositories/skillRepository";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ProjectEditPage({ params }: Props) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const { id } = await params;

    const project = await getProjectById(id);

    if (!project) {
        notFound();
    }

    const skills = await getSkills();

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <div className="mx-auto max-w-3xl space-y-6">
                <div>
                    <p className="text-sm font-semibold text-blue-600">Project Edit</p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        案件編集
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        案件情報と必要スキルを編集できます。
                    </p>
                </div>

                <ProjectEditForm project={project} skills={skills} />
            </div>
        </main>
    );
}