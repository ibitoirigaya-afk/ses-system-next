import Link from "next/link";
import { notFound } from "next/navigation";

import { BpCompanyDeleteButton } from "@/features/bpCompanies/BpCompanyDeleteButton";
import { getBpCompanyById } from "@/lib/repositories/bpCompanyRepository";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function BpCompanyDetailPage({ params }: Props) {
    const { id } = await params;

    const bpCompany = await getBpCompanyById(id);

    if (!bpCompany) {
        notFound();
    }

    return (
        <main className="px-8 py-10">
            <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-blue-600">
                            BP Company Detail
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-slate-900">
                            BP企業詳細
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            BP企業の会社情報・担当者情報を確認できます。
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={`/dashboard/bp-companies/${bpCompany.id}/edit`}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                        >
                            編集する
                        </Link>

                        <BpCompanyDeleteButton bpCompanyId={bpCompany.id} />
                    </div>
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

                        <div>
                            <dt className="text-sm font-bold text-slate-500">
                                参加コード
                            </dt>
                            <dd className="mt-2 inline-flex rounded-lg bg-slate-100 px-4 py-2 font-mono text-lg font-bold text-slate-900">
                                {bpCompany.joinCode}
                            </dd>
                            <p className="mt-2 text-sm text-slate-500">
                                companyユーザー登録時に、このコードを入力してもらいます。
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <dt className="text-sm font-bold text-slate-500">
                                    担当者名
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
                                    作成者
                                </dt>
                                <dd className="mt-2 text-slate-900">
                                    {bpCompany.createdBy.name}
                                </dd>
                            </div>
                        </div>

                        <div>
                            <dt className="text-sm font-bold text-slate-500">
                                住所
                            </dt>
                            <dd className="mt-2 text-slate-900">
                                {bpCompany.address ?? "未設定"}
                            </dd>
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

                <Link
                    href="/dashboard/bp-companies"
                    className="inline-flex text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                    ← BP企業一覧へ戻る
                </Link>
            </div>
        </main>
    );
}