import { redirect } from "next/navigation";

import { auth } from "@/auth";
import EngineerForm from "@/features/engineers/EngineerForm";
import { getSkills } from "@/lib/repositories/skillRepository";

export default async function NewEngineerPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const skills = await getSkills();

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <div className="mx-auto max-w-3xl space-y-6">
                <div>
                    <p className="text-sm font-semibold text-blue-600">Engineer New</p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        新規要員登録
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        要員情報と保有スキルを登録できます。
                    </p>
                </div>

                <EngineerForm skills={skills} />
            </div>
        </main>
    );
}