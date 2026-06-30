import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getWorkRecords } from "@/lib/repositories/workRecordRepository";

export default async function WorkRecordsPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const workRecords = await getWorkRecords();

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-blue-600">
                            Work Records
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-slate-900">
                            稼働実績一覧
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            案件ごとの稼働時間・請求金額・支払金額・粗利を確認できます。
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/dashboard/work-records/deleted"
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                        >
                            削除済み一覧
                        </Link>

                        <Link
                            href="/dashboard/work-records/new"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                        >
                            新規稼働実績登録
                        </Link>
                    </div>
                </div>

                {workRecords.length === 0 ? (
                    <section className="rounded-2xl bg-white p-8 text-center shadow">
                        <p className="text-slate-500">
                            稼働実績はまだ登録されていません。
                        </p>
                    </section>
                ) : (
                    <section className="grid gap-4">
                        {workRecords.map((workRecord) => (
                            <article
                                key={workRecord.id}
                                className="rounded-2xl bg-white p-6 shadow"
                            >
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="text-xl font-bold text-slate-900">
                                                {workRecord.project.title}
                                            </h2>

                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                                                {workRecord.targetMonth}
                                            </span>
                                        </div>

                                        <p className="mt-2 text-sm text-slate-500">
                                            要員：{workRecord.engineer.name}
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            稼働時間：{workRecord.workingHours}時間
                                        </p>

                                        <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-3">
                                            <p>
                                                請求金額：
                                                <span className="font-bold">
                                                    {workRecord.billingAmount.toLocaleString()}円
                                                </span>
                                            </p>

                                            <p>
                                                支払金額：
                                                <span className="font-bold">
                                                    {workRecord.paymentAmount.toLocaleString()}円
                                                </span>
                                            </p>

                                            <p>
                                                粗利：
                                                <span className="font-bold">
                                                    {workRecord.grossProfit.toLocaleString()}円
                                                </span>
                                            </p>
                                        </div>

                                        <p className="mt-2 text-sm text-slate-500">
                                            作成者：{workRecord.createdBy.name}
                                        </p>
                                    </div>

                                    <div className="flex gap-3">
                                        <Link
                                            href={`/dashboard/work-records/${workRecord.id}`}
                                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                                        >
                                            詳細
                                        </Link>

                                        <Link
                                            href={`/dashboard/work-records/${workRecord.id}/edit`}
                                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                                        >
                                            編集
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </section>
                )}

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