import Link from "next/link";

import { BpCompanyRestoreButton } from "@/features/bpCompanies/BpCompanyRestoreButton";
import { getDeletedBpCompanies } from "@/lib/repositories/bpCompanyRepository";

export default async function DeletedBpCompaniesPage() {
    const bpCompanies = await getDeletedBpCompanies();

    return (
        <main className="px-8 py-10">
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-red-600">
                            Deleted BP Companies
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-slate-900">
                            削除済みBP企業一覧
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            削除済みのBP企業を確認・復元できます。
                        </p>
                    </div>

                    <Link
                        href="/dashboard/bp-companies"
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                    >
                        BP企業一覧へ戻る
                    </Link>
                </div>

                {bpCompanies.length === 0 ? (
                    <section className="rounded-2xl bg-white p-8 text-center shadow">
                        <p className="text-slate-500">
                            削除済みのBP企業はありません。
                        </p>
                    </section>
                ) : (
                    <section className="grid gap-4">
                        {bpCompanies.map((bpCompany) => (
                            <article
                                key={bpCompany.id}
                                className="rounded-2xl bg-white p-6 shadow"
                            >
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">
                                            {bpCompany.name}
                                        </h2>

                                        <div className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                                            <p>
                                                担当者：
                                                <span className="font-semibold text-slate-800">
                                                    {bpCompany.contactPerson ?? "未設定"}
                                                </span>
                                            </p>

                                            <p>
                                                メール：
                                                <span className="font-semibold text-slate-800">
                                                    {bpCompany.email ?? "未設定"}
                                                </span>
                                            </p>

                                            <p>
                                                電話番号：
                                                <span className="font-semibold text-slate-800">
                                                    {bpCompany.phone ?? "未設定"}
                                                </span>
                                            </p>

                                            <p>
                                                作成者：
                                                <span className="font-semibold text-slate-800">
                                                    {bpCompany.createdBy.name}
                                                </span>
                                            </p>
                                        </div>

                                        {bpCompany.address && (
                                            <p className="mt-3 text-sm text-slate-500">
                                                住所：{bpCompany.address}
                                            </p>
                                        )}

                                        {bpCompany.memo && (
                                            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                                                メモ：{bpCompany.memo}
                                            </p>
                                        )}
                                    </div>

                                    <BpCompanyRestoreButton bpCompanyId={bpCompany.id} />
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </div>
        </main>
    );
}