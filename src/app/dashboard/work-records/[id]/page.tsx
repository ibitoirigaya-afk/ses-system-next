import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { WorkRecordDeleteButton } from "@/features/workRecords/WorkRecordDeleteButton";
import { getWorkRecordById } from "@/lib/repositories/workRecordRepository";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function WorkRecordDetailPage({ params }: Props) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const { id } = await params;
    const workRecord = await getWorkRecordById(id);

    if (!workRecord) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-blue-600">
                            Work Record Detail
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-slate-900">
                            稼働実績詳細
                        </h1>

                        <p className="mt-3 text-sm text-slate-500">
                            作成者：{workRecord.createdBy.name}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={`/dashboard/work-records/${workRecord.id}/edit`}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                        >
                            編集する
                        </Link>

                        <WorkRecordDeleteButton workRecordId={workRecord.id} />
                    </div>
                </div>

                <section className="rounded-2xl bg-white p-8 shadow">
                    <dl className="grid gap-6">
                        <div>
                            <dt className="text-sm font-bold text-slate-500">案件</dt>
                            <dd className="mt-2">
                                <Link
                                    href={`/dashboard/projects/${workRecord.project.id}`}
                                    className="text-lg font-bold text-slate-900 hover:text-blue-600"
                                >
                                    {workRecord.project.title}
                                </Link>
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm font-bold text-slate-500">要員</dt>
                            <dd className="mt-2">
                                <Link
                                    href={`/dashboard/engineers/${workRecord.engineer.id}`}
                                    className="text-lg font-bold text-slate-900 hover:text-blue-600"
                                >
                                    {workRecord.engineer.name}
                                </Link>
                                <p className="mt-1 text-sm text-slate-500">
                                    所属会社：{workRecord.engineer.companyName}
                                </p>
                            </dd>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <dt className="text-sm font-bold text-slate-500">対象月</dt>
                                <dd className="mt-2 text-slate-900">
                                    {workRecord.targetMonth}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm font-bold text-slate-500">稼働時間</dt>
                                <dd className="mt-2 text-slate-900">
                                    {workRecord.workingHours}時間
                                </dd>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            <div>
                                <dt className="text-sm font-bold text-slate-500">請求金額</dt>
                                <dd className="mt-2 text-slate-900">
                                    {workRecord.billingAmount.toLocaleString()}円
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm font-bold text-slate-500">支払金額</dt>
                                <dd className="mt-2 text-slate-900">
                                    {workRecord.paymentAmount.toLocaleString()}円
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm font-bold text-slate-500">粗利</dt>
                                <dd className="mt-2 font-bold text-slate-900">
                                    {workRecord.grossProfit.toLocaleString()}円
                                </dd>
                            </div>
                        </div>

                        <div>
                            <dt className="text-sm font-bold text-slate-500">メモ</dt>
                            <dd className="mt-2 whitespace-pre-wrap leading-7 text-slate-700">
                                {workRecord.memo ?? "未設定"}
                            </dd>
                        </div>
                    </dl>
                </section>

                <Link
                    href="/dashboard/work-records"
                    className="inline-flex text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                    ← 稼働実績一覧へ戻る
                </Link>
            </div>
        </main>
    );
}