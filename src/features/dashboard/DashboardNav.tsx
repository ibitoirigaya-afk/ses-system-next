"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
    role: string;
    hasBpCompany: boolean;
};

const navItems = [
    {
        title: "TOP",
        href: "/dashboard",
        roles: ["admin", "user", "company"],
    },
    {
        title: "案件",
        href: "/dashboard/projects",
        roles: ["admin", "user", "company"],
    },
    {
        title: "BP企業",
        href: "/dashboard/bp-companies",
        roles: ["admin"],
    },
    {
        title: "要員",
        href: "/dashboard/engineers",
        roles: ["admin", "user", "company"],
    },
    {
        title: "自社情報",
        href: "/dashboard/my-company",
        roles: ["user", "company"],
        requiresBpCompany: true,
    },
    {
        title: "スキル",
        href: "/dashboard/skills",
        roles: ["admin", "user"],
    },
    {
        title: "提案履歴",
        href: "/dashboard/proposal-histories",
        roles: ["admin", "user", "company"],
    },
    {
        title: "稼働実績",
        href: "/dashboard/work-records",
        roles: ["admin"],
    },
];

function isActivePath(pathname: string, href: string) {
    if (href === "/dashboard") {
        return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
}

export default function DashboardNav({ role, hasBpCompany }: Props) {
    const pathname = usePathname();

    const filteredNavItems = navItems.filter((item) => {
        if (!item.roles.includes(role)) {
            return false;
        }

        if (item.requiresBpCompany && !hasBpCompany) {
            return false;
        }

        return true;
    });

    return (
        <nav className="border-b border-slate-300 bg-white">
            <div className="mx-auto flex max-w-6xl gap-3 overflow-x-auto px-8 py-3">
                {filteredNavItems.map((item) => {
                    const isActive = isActivePath(pathname, item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={
                                isActive
                                    ? "whitespace-nowrap rounded bg-blue-600 px-4 py-3 text-sm font-bold text-white"
                                    : "whitespace-nowrap rounded px-4 py-3 text-sm font-bold text-slate-800 hover:bg-slate-100"
                            }
                        >
                            {item.title}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}