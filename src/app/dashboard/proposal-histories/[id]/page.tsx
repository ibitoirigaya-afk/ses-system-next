import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { ProposalHistoryDeleteButton } from "@/features/proposalHistories/ProposalHistoryDeleteButton";
import { getProposalHistoryById } from "@/lib/repositories/proposalHistoryRepository";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

const statusLabels = {
    proposed: "提案中",
    interviewing: "面談中",
    accepted: "成約",
    rejected: "見送り",
    withdrawn: "辞退",
};

export default async function ProposalHistoryDetailPage({ params }: Props) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const { id } = await params;
    const proposal = await getProposalHistoryById(id);

    if (!proposal) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-blue-600">
                            Proposal Detail
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-slate-900">
                            提案履歴詳細
                        </h1>

                        <p className="mt-3 text-sm text-slate-500">
                            作成者：{proposal.createdBy.name}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={`/dashboard/proposal-histories/${proposal.id}/edit`}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                        >
                            編集する
                        </Link>

                        <ProposalHistoryDeleteButton proposalHistoryId={proposal.id} />
                    </div>
                </div>

                <section className="rounded-2xl bg-white p-8 shadow">
                    <dl className="grid gap-6">
                        <div>
                            <dt className="text-sm font-bold text-slate-500">案件</dt>
                            <dd className="mt-2">
                                <Link
                                    href={`/dashboard/projects/${proposal.project.id}`}
                                    className="text-lg font-bold text-slate-900 hover:text-blue-600"
                                >
                                    {proposal.project.title}
                                </Link>
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm font-bold text-slate-500">要員</dt>
                            <dd className="mt-2">
                                <Link
                                    href={`/dashboard/engineers/${proposal.engineer.id}`}
                                    className="text-lg font-bold text-slate-900 hover:text-blue-600"
                                >
                                    {proposal.engineer.name}
                                </Link>
                                <p className="mt-1 text-sm text-slate-500">
                                    所属会社：{proposal.engineer.companyName}
                                </p>
                            </dd>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <dt className="text-sm font-bold text-slate-500">ステータス</dt>
                                <dd className="mt-2 text-slate-900">
                                    {statusLabels[proposal.status]}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm font-bold text-slate-500">提案日</dt>
                                <dd className="mt-2 text-slate-900">
                                    {proposal.proposedAt.toLocaleDateString("ja-JP")}
                                </dd>
                            </div>
                        </div>

                        <div>
                            <dt className="text-sm font-bold text-slate-500">面談日</dt>
                            <dd className="mt-2 text-slate-900">
                                {proposal.interviewDate
                                    ? proposal.interviewDate.toLocaleDateString("ja-JP")
                                    : "未設定"}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm font-bold text-slate-500">メモ</dt>
                            <dd className="mt-2 whitespace-pre-wrap leading-7 text-slate-700">
                                {proposal.memo ?? "未設定"}
                            </dd>
                        </div>
                    </dl>
                </section>

                <Link
                    href="/dashboard/proposal-histories"
                    className="inline-flex text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                    ← 提案履歴一覧へ戻る
                </Link>
            </div>
        </main>
    );
}