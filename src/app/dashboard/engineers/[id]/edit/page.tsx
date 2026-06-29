import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import EngineerEditForm from "@/features/engineers/EngineerEditForm";
import { getEngineerById } from "@/lib/repositories/engineerRepository";
import { getSkills } from "@/lib/repositories/skillRepository";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EngineerEditPage({ params }: Props) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const { id } = await params;

    const engineer = await getEngineerById(id);

    if (!engineer) {
        notFound();
    }

    const skills = await getSkills();

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <div className="mx-auto max-w-3xl space-y-6">
                <div>
                    <p className="text-sm font-semibold text-blue-600">Engineer Edit</p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        要員編集
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        要員情報と保有スキルを編集できます。
                    </p>
                </div>

                <EngineerEditForm engineer={engineer} skills={skills} />
            </div>
        </main>
    );
}