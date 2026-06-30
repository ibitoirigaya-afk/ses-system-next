import { redirect } from "next/navigation";

import { auth } from "@/auth";
import ProjectForm from "@/features/projects/ProjectForm";
import { canCreateProjectForUser } from "@/lib/repositories/projectRepository";
import { getSkills } from "@/lib/repositories/skillRepository";

export default async function NewProjectPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const canCreateProject = await canCreateProjectForUser(session.user.id);

    if (!canCreateProject) {
        redirect("/dashboard/projects");
    }

    const skills = await getSkills();

    return (
        <main className="mx-auto max-w-3xl space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-bold">新規案件登録</h1>
                <p className="mt-2 text-sm text-gray-600">
                    案件情報と必要スキルを入力してください。
                </p>
            </div>

            <ProjectForm skills={skills} />
        </main>
    );
}