import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

type Props = {
    children: ReactNode;
};

export default async function SkillsLayout({ children }: Props) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    if (session.user.role === "company") {
        redirect("/dashboard");
    }

    return <>{children}</>;
}