import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { SkillDeleteButton } from "@/features/skills/SkillDeleteButton";
import { SkillEditForm } from "@/features/skills/SkillEditForm";
import { getSkillById } from "@/lib/repositories/skillRepository";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function SkillEditPage({ params }: Props) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const { id } = await params;
    const skill = await getSkillById(id);

    if (!skill) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <div className="mx-auto max-w-3xl space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-blue-600">Edit Skill</p>

                        <h1 className="mt-2 text-3xl font-bold text-slate-900">
                            スキル編集
                        </h1>
                    </div>

                    <SkillDeleteButton skillId={skill.id} />
                </div>

                <section className="rounded-2xl bg-white p-8 shadow">
                    <SkillEditForm skill={skill} />
                </section>

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