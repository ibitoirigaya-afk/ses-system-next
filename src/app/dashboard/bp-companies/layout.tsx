import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

type Props = {
    children: ReactNode;
};

export default async function BpCompaniesLayout({ children }: Props) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    if (session.user?.role !== "admin") {
        redirect("/dashboard");
    }

    return <>{children}</>;
}