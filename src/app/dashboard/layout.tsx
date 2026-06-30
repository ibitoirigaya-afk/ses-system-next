import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { logoutAction } from "@/features/auth/actions";
import DashboardNav from "@/features/dashboard/DashboardNav";

type Props = {
    children: ReactNode;
};

export default async function DashboardLayout({ children }: Props) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <div className="sticky top-0 z-50">
                <header className="border-b border-slate-300 bg-white">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-7">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                SES/BP営業管理システム
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                ログイン中：{session.user?.name} / {session.user?.role}
                            </p>
                        </div>

                        <form action={logoutAction}>
                            <button
                                type="submit"
                                className="rounded bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-700"
                            >
                                ログアウト
                            </button>
                        </form>
                    </div>
                </header>

                <DashboardNav role={session.user?.role ?? ""} />
            </div>

            {children}
        </div>
    );
}