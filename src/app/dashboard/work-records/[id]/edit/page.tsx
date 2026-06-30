import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import WorkRecordEditForm from "@/features/workRecords/WorkRecordEditForm";
import { getEngineers } from "@/lib/repositories/engineerRepository";
import { getProjects } from "@/lib/repositories/projectRepository";
import { getWorkRecordById } from "@/lib/repositories/workRecordRepository";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function WorkRecordEditPage({ params }: Props) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const { id } = await params;

    const workRecord = await getWorkRecordById(id);

    if (!workRecord) {
        notFound();
    }

    const projects = await getProjects();
    const engineers = await getEngineers();

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <div className="mx-auto max-w-3xl space-y-6">
                <div>
                    <p className="text-sm font-semibold text-blue-600">Work Record Edit</p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        稼働実績編集
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        案件・要員・対象月・金額情報を編集できます。
                    </p>
                </div>

                <WorkRecordEditForm
                    workRecord={workRecord}
                    projects={projects}
                    engineers={engineers}
                />
            </div>
        </main>
    );
}