import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export default async function MyCompanyPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const currentUser = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
        include: {
            bpCompany: {
                include: {
                    engineers: {
                        where: {
                            deletedAt: null,
                        },
                        orderBy: {
                            createdAt: "desc",
                        },
                    },
                },
            },
        },
    });

    if (!currentUser?.bpCompany) {
        redirect("/dashboard");
    }

    const bpCompany = currentUser.bpCompany;

    return (
        <main className="px-8 py-10">
            <div className="mx-auto max-w-6xl space-y-6">
                <div>
                    <p className="text-sm font-semibold text-blue-600">
                        My Company
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        自社情報
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        自分が所属しているBP企業の情報を確認できます。
                    </p>
                </div>

                <section className="rounded-2xl bg-white p-8 shadow">
                    <dl className="grid gap-6">
                        <div>
                            <dt className="text-sm font-bold text-slate-500">
                                会社名
                            </dt>
                            <dd className="mt-2 text-xl font-bold text-slate-900">
                                {bpCompany.name}
                            </dd>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <dt className="text-sm font-bold text-slate-500">
                                    担当者
                                </dt>
                                <dd className="mt-2 text-slate-900">
                                    {bpCompany.contactPerson ?? "未設定"}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm font-bold text-slate-500">
                                    メールアドレス
                                </dt>
                                <dd className="mt-2 text-slate-900">
                                    {bpCompany.email ?? "未設定"}
                                </dd>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <dt className="text-sm font-bold text-slate-500">
                                    電話番号
                                </dt>
                                <dd className="mt-2 text-slate-900">
                                    {bpCompany.phone ?? "未設定"}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm font-bold text-slate-500">
                                    住所
                                </dt>
                                <dd className="mt-2 text-slate-900">
                                    {bpCompany.address ?? "未設定"}
                                </dd>
                            </div>
                        </div>

                        <div>
                            <dt className="text-sm font-bold text-slate-500">
                                メモ
                            </dt>
                            <dd className="mt-2 whitespace-pre-wrap leading-7 text-slate-700">
                                {bpCompany.memo ?? "未設定"}
                            </dd>
                        </div>
                    </dl>
                </section>

                <section className="rounded-2xl bg-white p-8 shadow">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                所属要員
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                自社に紐づいている要員を確認できます。
                            </p>
                        </div>

                        <Link
                            href="/dashboard/engineers"
                            className="text-sm font-bold text-blue-600 hover:text-blue-700"
                        >
                            要員一覧へ →
                        </Link>
                    </div>

                    {bpCompany.engineers.length === 0 ? (
                        <p className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                            所属要員はまだ登録されていません。
                        </p>
                    ) : (
                        <div className="mt-6 grid gap-3">
                            {bpCompany.engineers.map((engineer) => (
                                <Link
                                    key={engineer.id}
                                    href={`/dashboard/engineers/${engineer.id}`}
                                    className="rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50"
                                >
                                    <p className="font-bold text-slate-900">
                                        {engineer.name}
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        最寄駅：{engineer.nearestStation ?? "未設定"} / 経験年数：
                                        {engineer.experienceYears ?? "未設定"}年
                                    </p>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

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