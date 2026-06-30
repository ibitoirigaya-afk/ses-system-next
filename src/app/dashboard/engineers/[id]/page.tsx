import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { EngineerDeleteButton } from "@/features/engineers/EngineerDeleteButton";
import { getEngineerByIdForUser } from "@/lib/repositories/engineerRepository";
type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EngineerDetailPage({ params }: Props) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const { id } = await params;

    const engineer = await getEngineerByIdForUser(id, session.user.id);

    if (!engineer) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-blue-600">
                            Engineer Detail
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-slate-900">
                            {engineer.name}
                        </h1>

                        <p className="mt-3 text-sm text-slate-500">
                            作成者：{engineer.createdBy.name}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={`/dashboard/engineers/${engineer.id}/edit`}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                        >
                            編集する
                        </Link>

                        <EngineerDeleteButton engineerId={engineer.id} />
                    </div>
                </div>

                <section className="rounded-2xl bg-white p-8 shadow">
                    <dl className="grid gap-6">
                        <div>
                            <dt className="text-sm font-bold text-slate-500">氏名</dt>
                            <dd className="mt-2 text-lg font-semibold text-slate-900">
                                {engineer.name}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm font-bold text-slate-500">所属会社</dt>
                            <dd className="mt-2 text-slate-900">{engineer.companyName}</dd>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            <div>
                                <dt className="text-sm font-bold text-slate-500">年齢</dt>
                                <dd className="mt-2 text-slate-900">
                                    {engineer.age ?? "未設定"}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm font-bold text-slate-500">性別</dt>
                                <dd className="mt-2 text-slate-900">
                                    {engineer.gender ?? "未設定"}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm font-bold text-slate-500">経験年数</dt>
                                <dd className="mt-2 text-slate-900">
                                    {engineer.experienceYears !== null
                                        ? `${engineer.experienceYears}年`
                                        : "未設定"}
                                </dd>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <dt className="text-sm font-bold text-slate-500">最寄駅</dt>
                                <dd className="mt-2 text-slate-900">
                                    {engineer.nearestStation ?? "未設定"}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm font-bold text-slate-500">希望単価</dt>
                                <dd className="mt-2 text-slate-900">
                                    {engineer.desiredUnitPrice !== null
                                        ? `${engineer.desiredUnitPrice.toLocaleString()}円`
                                        : "未設定"}
                                </dd>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <dt className="text-sm font-bold text-slate-500">稼働可能日</dt>
                                <dd className="mt-2 text-slate-900">
                                    {engineer.availableDate
                                        ? engineer.availableDate.toLocaleDateString("ja-JP")
                                        : "未設定"}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm font-bold text-slate-500">希望勤務地</dt>
                                <dd className="mt-2 text-slate-900">
                                    {engineer.desiredLocation ?? "未設定"}
                                </dd>
                            </div>
                        </div>

                        <div>
                            <dt className="text-sm font-bold text-slate-500">ステータス</dt>
                            <dd className="mt-2 text-slate-900">{engineer.status}</dd>
                        </div>

                        <div>
                            <dt className="text-sm font-bold text-slate-500">希望条件</dt>
                            <dd className="mt-2 whitespace-pre-wrap leading-7 text-slate-700">
                                {engineer.desiredConditions ?? "未設定"}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm font-bold text-slate-500">経歴概要</dt>
                            <dd className="mt-2 whitespace-pre-wrap leading-7 text-slate-700">
                                {engineer.careerSummary ?? "未設定"}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm font-bold text-slate-500">保有スキル</dt>
                            <dd className="mt-3">
                                {engineer.skills.length === 0 ? (
                                    <p className="text-sm text-slate-500">
                                        保有スキルは未設定です。
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {engineer.skills.map((skill) => (
                                            <span
                                                key={skill.id}
                                                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                                            >
                                                {skill.name}
                                                <span className="ml-2 text-slate-400">
                                                    {skill.category}
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </dd>
                        </div>
                    </dl>
                </section>

                <Link
                    href="/dashboard/engineers"
                    className="inline-flex text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                    ← 要員一覧へ戻る
                </Link>
            </div>
        </main>
    );
}