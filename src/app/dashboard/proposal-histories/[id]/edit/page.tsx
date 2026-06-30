import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import ProposalHistoryEditForm from "@/features/proposalHistories/ProposalHistoryEditForm";
import { getProposalHistoryByIdForUser } from "@/lib/repositories/proposalHistoryRepository";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ProposalHistoryEditPage({ params }: Props) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const { id } = await params;

    const proposalHistory = await getProposalHistoryByIdForUser(
        id,
        session.user.id,
    );

    if (!proposalHistory) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <div className="mx-auto max-w-3xl space-y-6">
                <div>
                    <p className="text-sm font-semibold text-blue-600">
                        Proposal Edit
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        提案履歴編集
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        提案ステータス・面談日・メモを編集できます。
                    </p>
                </div>

                <ProposalHistoryEditForm proposal={proposalHistory} />
            </div>
        </main>
    );
}