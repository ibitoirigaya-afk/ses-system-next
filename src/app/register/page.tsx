import Link from "next/link";

import { RegisterForm } from "@/features/auth/RegisterForm";
import { getBpCompanies } from "@/lib/repositories/bpCompanyRepository";

export default async function RegisterPage() {
    const bpCompanies = await getBpCompanies();

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
            <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
                <p className="text-sm font-semibold text-blue-600">
                    SES/BP Sales Management
                </p>

                <h1 className="mt-3 text-3xl font-bold text-slate-900">
                    新規登録
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                    アカウント情報を入力してください。companyで登録する場合は、
                    所属BP企業と参加コードが必要です。
                </p>

                <RegisterForm bpCompanies={bpCompanies} />

                <div className="mt-6 text-center">
                    <Link
                        href="/"
                        className="text-sm font-bold text-slate-500 hover:text-slate-700"
                    >
                        TOPへ戻る
                    </Link>
                </div>
            </section>
        </main>
    );
}