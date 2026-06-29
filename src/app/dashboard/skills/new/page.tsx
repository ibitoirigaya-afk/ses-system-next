import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SkillForm } from "@/features/skills/SkillForm";

export default async function NewSkillPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <div className="mx-auto max-w-3xl space-y-6">
                <div>
                    <p className="text-sm font-semibold text-blue-600">New Skill</p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        新規スキル登録
                    </h1>
                </div>

                <section className="rounded-2xl bg-white p-8 shadow">
                    <SkillForm />
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