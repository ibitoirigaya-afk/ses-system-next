import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { logoutAction } from "@/features/auth/actions";

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

export default async function DashboardPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <div className="mx-auto max-w-6xl space-y-8">
                <section className="rounded-2xl bg-white p-8 shadow">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-blue-600">Dashboard</p>

                            <h1 className="mt-3 text-3xl font-bold text-slate-900">
                                ダッシュボード
                            </h1>

                            <p className="mt-3 text-slate-600">
                                ログイン中：{session.user?.name} / 権限：
                                {session.user?.role}
                            </p>
                        </div>

                        <form action={logoutAction}>
                            <button
                                type="submit"
                                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700"
                            >
                                ログアウト
                            </button>
                        </form>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-white p-6 shadow">
                        <p className="text-sm font-semibold text-slate-500">案件数</p>
                        <p className="mt-3 text-3xl font-bold text-slate-900">0</p>
                        <p className="mt-2 text-sm text-slate-500">
                            案件CRUD作成後に自動集計します。
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow">
                        <p className="text-sm font-semibold text-slate-500">要員数</p>
                        <p className="mt-3 text-3xl font-bold text-slate-900">0</p>
                        <p className="mt-2 text-sm text-slate-500">
                            要員管理作成後に自動集計します。
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow">
                        <p className="text-sm font-semibold text-slate-500">提案中</p>
                        <p className="mt-3 text-3xl font-bold text-slate-900">0</p>
                        <p className="mt-2 text-sm text-slate-500">
                            提案履歴作成後に自動集計します。
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
            </div>
        </main>
    );
}