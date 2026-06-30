import BpCompanyForm from "@/features/bpCompanies/BpCompanyForm";

export default function NewBpCompanyPage() {
    return (
        <main className="px-8 py-10">
            <div className="mx-auto max-w-3xl space-y-6">
                <div>
                    <p className="text-sm font-semibold text-blue-600">
                        BP Company New
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        新規BP企業登録
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        BP企業の会社情報・担当者情報を登録できます。
                    </p>
                </div>

                <BpCompanyForm />
            </div>
        </main>
    );
}