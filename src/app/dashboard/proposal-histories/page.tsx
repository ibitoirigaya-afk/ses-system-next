import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getProposalHistoriesForUser } from "@/lib/repositories/proposalHistoryRepository";

const statusLabels = {
    proposed: "提案中",
    interviewing: "面談中",
    accepted: "成約",
    rejected: "見送り",
    withdrawn: "辞退",
};

export default async function ProposalHistoriesPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const proposalHistories = await getProposalHistoriesForUser(session.user.id);

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-blue-600">
                            Proposal Histories
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-slate-900">
                            提案履歴一覧
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            マッチング結果から作成した提案履歴を確認できます。
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/dashboard/proposal-histories/deleted"
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                        >
                            削除済み一覧
                        </Link>

                        <Link
                            href="/dashboard/projects"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                        >
                            案件一覧へ
                        </Link>
                    </div>
                </div>

                {proposalHistories.length === 0 ? (
                    <section className="rounded-2xl bg-white p-8 text-center shadow">
                        <p className="text-slate-500">
                            提案履歴はまだ作成されていません。
                        </p>
                    </section>
                ) : (
                    <section className="grid gap-4">
                        {proposalHistories.map((proposal) => (
                            <article
                                key={proposal.id}
                                className="rounded-2xl bg-white p-6 shadow"
                            >
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="text-xl font-bold text-slate-900">
                                                {proposal.project.title}
                                            </h2>

                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                                                {statusLabels[proposal.status]}
                                            </span>
                                        </div>

                                        <p className="mt-2 text-sm text-slate-500">
                                            要員：{proposal.engineer.name}
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            所属会社：{proposal.engineer.companyName}
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            提案日：
                                            {proposal.proposedAt.toLocaleDateString("ja-JP")}
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            面談日：
                                            {proposal.interviewDate
                                                ? proposal.interviewDate.toLocaleDateString("ja-JP")
                                                : "未設定"}
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            作成者：{proposal.createdBy.name}
                                        </p>
                                    </div>

                                    <div className="flex gap-3">
                                        <Link
                                            href={`/dashboard/proposal-histories/${proposal.id}`}
                                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                                        >
                                            詳細
                                        </Link>

                                        <Link
                                            href={`/dashboard/proposal-histories/${proposal.id}/edit`}
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