import { notFound } from "next/navigation";

import BpCompanyEditForm from "@/features/bpCompanies/BpCompanyEditForm";
import { getBpCompanyById } from "@/lib/repositories/bpCompanyRepository";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function BpCompanyEditPage({ params }: Props) {
    const { id } = await params;

    const bpCompany = await getBpCompanyById(id);

    if (!bpCompany) {
        notFound();
    }

    return (
        <main className="px-8 py-10">
            <div className="mx-auto max-w-3xl space-y-6">
                <div>
                    <p className="text-sm font-semibold text-blue-600">
                        BP Company Edit
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        BP企業編集
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        BP企業の会社情報・担当者情報を編集できます。
                    </p>
                </div>

                <BpCompanyEditForm bpCompany={bpCompany} />
            </div>
        </main>
    );
}