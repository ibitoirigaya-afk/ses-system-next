import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { WorkRecordRestoreButton } from "@/features/workRecords/WorkRecordRestoreButton";
import { getDeletedWorkRecords } from "@/lib/repositories/workRecordRepository";

export default async function DeletedWorkRecordsPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const workRecords = await getDeletedWorkRecords();

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-red-600">
                            Deleted Work Records
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-slate-900">
                            削除済み稼働実績一覧
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            削除済みの稼働実績を確認・復元できます。
                        </p>
                    </div>

                    <Link
                        href="/dashboard/work-records"
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                    >
                        稼働実績一覧へ戻る
                    </Link>
                </div>

                {workRecords.length === 0 ? (
                    <section className="rounded-2xl bg-white p-8 text-center shadow">
                        <p className="text-slate-500">
                            削除済みの稼働実績はありません。
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

                                    <WorkRecordRestoreButton workRecordId={workRecord.id} />
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </div>
        </main>
    );
}