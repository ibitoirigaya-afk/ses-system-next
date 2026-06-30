import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { EngineerRestoreButton } from "@/features/engineers/EngineerRestoreButton";
import { getDeletedEngineersForUser } from "@/lib/repositories/engineerRepository";

export default async function DeletedEngineersPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const engineers = await getDeletedEngineersForUser(session.user.id);

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-red-600">
                            Deleted Engineers
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-slate-900">
                            削除済み要員一覧
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            削除済みの要員を確認・復元できます。
                        </p>
                    </div>

                    <Link
                        href="/dashboard/engineers"
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                    >
                        要員一覧へ戻る
                    </Link>
                </div>

                {engineers.length === 0 ? (
                    <section className="rounded-2xl bg-white p-8 text-center shadow">
                        <p className="text-slate-500">
                            削除済みの要員はありません。
                        </p>
                    </section>
                ) : (
                    <section className="grid gap-4">
                        {engineers.map((engineer) => (
                            <article
                                key={engineer.id}
                                className="rounded-2xl bg-white p-6 shadow"
                            >
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">
                                            {engineer.name}
                                        </h2>

                                        <p className="mt-2 text-sm text-slate-500">
                                            所属会社：{engineer.companyName}
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            作成者：{engineer.createdBy.name}
                                        </p>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {engineer.skills.length === 0 ? (
                                                <span className="text-sm text-slate-400">
                                                    保有スキル未設定
                                                </span>
                                            ) : (
                                                engineer.skills.map((skill) => (
                                                    <span
                                                        key={skill.id}
                                                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                                                    >
                                                        {skill.name}
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    <EngineerRestoreButton engineerId={engineer.id} />
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </div>
        </main>
    );
}