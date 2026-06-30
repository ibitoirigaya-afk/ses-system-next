"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/db";
import {
    getBpCompanyById,
    getBpCompanyByJoinCode,
} from "@/lib/repositories/bpCompanyRepository";

function generateJoinCode() {
    const randomText = Math.random().toString(36).slice(2, 8).toUpperCase();

    return `BP-${randomText}`;
}

async function generateUniqueJoinCode() {
    for (let i = 0; i < 10; i += 1) {
        const joinCode = generateJoinCode();

        const existingBpCompany = await getBpCompanyByJoinCode(joinCode);

        if (!existingBpCompany) {
            return joinCode;
        }
    }

    throw new Error("参加コードの生成に失敗しました。");
}

export async function loginAction(formData: FormData) {
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            return {
                error: "メールアドレスまたはパスワードが違います。",
            };
        }

        throw error;
    }

    redirect("/dashboard");
}

export async function registerAction(formData: FormData) {
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const roleText = String(formData.get("role") ?? "user");

    const companyName = String(formData.get("companyName") ?? "").trim();
    const isBpCompanyText = String(formData.get("isBpCompany") ?? "false");

    const belongsToBpCompanyText = String(
        formData.get("belongsToBpCompany") ?? "false",
    );
    const bpCompanyId = String(formData.get("bpCompanyId") ?? "").trim();
    const joinCode = String(formData.get("joinCode") ?? "").trim();

    if (name === "") {
        return {
            error: "名前を入力してください。",
        };
    }

    if (email === "") {
        return {
            error: "メールアドレスを入力してください。",
        };
    }

    if (password === "") {
        return {
            error: "パスワードを入力してください。",
        };
    }

    if (password.length < 8) {
        return {
            error: "パスワードは8文字以上で入力してください。",
        };
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        return {
            error: "このメールアドレスはすでに登録されています。",
        };
    }

    const role =
        roleText === "company" ? UserRole.company : UserRole.user;

    const passwordHash = await bcrypt.hash(password, 10);

    if (role === UserRole.company) {
        if (companyName === "") {
            return {
                error: "会社名を入力してください。",
            };
        }

        const isBpCompany = isBpCompanyText === "true";

        if (!isBpCompany) {
            await prisma.user.create({
                data: {
                    name,
                    email,
                    passwordHash,
                    role,
                    companyName,
                    isBpCompany: false,
                },
            });

            redirect("/login");
        }

        const existingBpCompany = await prisma.bpCompany.findFirst({
            where: {
                name: companyName,
                deletedAt: null,
            },
        });

        if (existingBpCompany) {
            return {
                error: "この会社名のBP企業はすでに登録されています。",
            };
        }

        const newJoinCode = await generateUniqueJoinCode();

        await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    passwordHash,
                    role,
                    companyName,
                    isBpCompany: true,
                },
            });

            const bpCompany = await tx.bpCompany.create({
                data: {
                    name: companyName,
                    joinCode: newJoinCode,
                    contactPerson: name,
                    email,
                    createdBy: {
                        connect: {
                            id: user.id,
                        },
                    },
                },
            });

            await tx.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    bpCompanyId: bpCompany.id,
                },
            });
        });

        redirect("/login");
    }

    const belongsToBpCompany = belongsToBpCompanyText === "true";

    if (!belongsToBpCompany) {
        await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                role,
                isBpCompany: false,
            },
        });

        redirect("/login");
    }

    if (bpCompanyId === "") {
        return {
            error: "所属BP企業を選択してください。",
        };
    }

    if (joinCode === "") {
        return {
            error: "参加コードを入力してください。",
        };
    }

    const bpCompany = await getBpCompanyById(bpCompanyId);

    if (!bpCompany) {
        return {
            error: "選択されたBP企業が見つかりません。",
        };
    }

    if (bpCompany.joinCode !== joinCode) {
        return {
            error: "参加コードが正しくありません。",
        };
    }

    await prisma.user.create({
        data: {
            name,
            email,
            passwordHash,
            role,
            companyName: bpCompany.name,
            isBpCompany: true,
            bpCompanyId: bpCompany.id,
        },
    });

    redirect("/login");
}

export async function logoutAction() {
    await signOut({
        redirectTo: "/login",
    });
}