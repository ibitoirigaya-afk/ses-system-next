import Link from "next/link";

import { getEngineerCount } from "@/lib/repositories/engineerRepository";
import { getProjectCount } from "@/lib/repositories/projectRepository";
import {
    getProposalHistoryCount,
    getRecentProposalHistories,
} from "@/lib/repositories/proposalHistoryRepository";
import { getCurrentMonthGrossProfitTotal } from "@/lib/repositories/workRecordRepository";

const menuItems = [
    {
        title: "案件管理",
        description: "案件の一覧・登録・編集を管理します。",
        href: "/dashboard/projects",
    },
    {
        title: "要員管理",
        description: "要員情報、スキル、希望条件を管理します。",
        href: "/dashboard/engineers",
    },
    {
        title: "スキル管理",
        description: "案件・要員に紐付けるスキルを管理します。",
        href: "/dashboard/skills",
    },
    {
        title: "BP企業管理",
        description: "BP企業情報と所属要員を管理します。",
        href: "/dashboard/bp-companies",
    },
    {
        title: "提案履歴",
        description: "案件への提案状況や面談状況を管理します。",
        href: "/dashboard/proposal-histories",
    },
    {
        title: "稼働実績",
        description: "売上・支払い・粗利を管理します。",
        href: "/dashboard/work-records",
    },
];

function getProposalStatusLabel(status: string) {
    if (status === "proposed") {
        return "提案中";
    }

    if (status === "interviewing") {
        return "面談中";
    }

    if (status === "accepted") {
        return "成約";
    }

    if (status === "rejected") {
        return "見送り";
    }

    if (status === "withdrawn") {
        return "辞退";
    }

    return status;
}

export default async function DashboardPage() {
    const [
        projectCount,
        engineerCount,
        proposalHistoryCount,
        currentMonthGrossProfitTotal,
        recentProposalHistories,
    ] = await Promise.all([
        getProjectCount(),
        getEngineerCount(),
        getProposalHistoryCount(),
        getCurrentMonthGrossProfitTotal(),
        getRecentProposalHistories(),
    ]);

    return (
        <main className="min-h-screen bg-slate-100 px-8 py-10">
            <div className="mx-auto max-w-6xl space-y-8">
                <section>
                    <h2 className="text-2xl font-bold text-slate-900">
                        管理者TOP
                    </h2>

                    <p className="mt-2 text-slate-500">
                        システム全体の状況を確認できます。
                    </p>
                </section>

                <section className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-2xl bg-white p-6 shadow">
                        <p className="text-sm font-bold text-slate-500">案件数</p>
                        <p className="mt-3 text-3xl font-bold text-slate-900">
                            {projectCount}
                            <span className="ml-1 text-base text-slate-500">件</span>
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow">
                        <p className="text-sm font-bold text-slate-500">要員数</p>
                        <p className="mt-3 text-3xl font-bold text-slate-900">
                            {engineerCount}
                            <span className="ml-1 text-base text-slate-500">人</span>
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow">
                        <p className="text-sm font-bold text-slate-500">提案履歴数</p>
                        <p className="mt-3 text-3xl font-bold text-slate-900">
                            {proposalHistoryCount}
                            <span className="ml-1 text-base text-slate-500">件</span>
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow">
                        <p className="text-sm font-bold text-slate-500">
                            今月の粗利合計
                        </p>
                        <p className="mt-3 text-3xl font-bold text-slate-900">
                            {currentMonthGrossProfitTotal.toLocaleString()}
                            <span className="ml-1 text-base text-slate-500">円</span>
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900">機能メニュー</h2>

                    <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                <h3 className="text-lg font-bold text-slate-900">
                                    {item.title}
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                    {item.description}
                                </p>

                                <p className="mt-4 text-sm font-bold text-blue-600">
                                    開く →
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="rounded-2xl bg-white p-6 shadow">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                最近の提案履歴
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                直近で作成された提案を5件まで表示します。
                            </p>
                        </div>

                        <Link
                            href="/dashboard/proposal-histories"
                            className="text-sm font-bold text-blue-600 hover:text-blue-700"
                        >
                            すべて見る →
                        </Link>
                    </div>

                    {recentProposalHistories.length === 0 ? (
                        <p className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                            提案履歴はまだありません。
                        </p>
                    ) : (
                        <div className="mt-6 grid gap-3">
                            {recentProposalHistories.map((proposal) => (
                                <Link
                                    key={proposal.id}
                                    href={`/dashboard/proposal-histories/${proposal.id}`}
                                    className="rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50"
                                >
                                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <p className="font-bold text-slate-900">
                                                {proposal.project.title}
                                            </p>

                                            <p className="mt-1 text-sm text-slate-500">
                                                要員：{proposal.engineer.name}
                                            </p>
                                        </div>

                                        <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                                            {getProposalStatusLabel(proposal.status)}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}