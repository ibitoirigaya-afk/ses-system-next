"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
    createBpCompany,
    deleteBpCompany,
    getBpCompanyByJoinCode,
    getBpCompanyByName,
    restoreBpCompany,
    updateBpCompany,
} from "@/lib/repositories/bpCompanyRepository";

function toOptionalString(value: FormDataEntryValue | null) {
    const text = String(value ?? "").trim();

    if (text === "") {
        return null;
    }

    return text;
}

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

export async function createBpCompanyAction(formData: FormData) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const name = String(formData.get("name") ?? "").trim();

    if (name === "") {
        return {
            error: "会社名を入力してください。",
        };
    }

    const existingBpCompany = await getBpCompanyByName(name);

    if (existingBpCompany) {
        return {
            error: "このBP企業はすでに登録されています。",
        };
    }

    const joinCode = await generateUniqueJoinCode();

    await createBpCompany({
        name,
        joinCode,
        contactPerson: toOptionalString(formData.get("contactPerson")),
        email: toOptionalString(formData.get("email")),
        phone: toOptionalString(formData.get("phone")),
        address: toOptionalString(formData.get("address")),
        memo: toOptionalString(formData.get("memo")),
        createdById: session.user.id,
    });

    redirect("/dashboard/bp-companies");
}

export async function updateBpCompanyAction(id: string, formData: FormData) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const name = String(formData.get("name") ?? "").trim();

    if (name === "") {
        return {
            error: "会社名を入力してください。",
        };
    }

    const existingBpCompany = await getBpCompanyByName(name);

    if (existingBpCompany && existingBpCompany.id !== id) {
        return {
            error: "このBP企業はすでに登録されています。",
        };
    }

    await updateBpCompany(id, {
        name,
        contactPerson: toOptionalString(formData.get("contactPerson")),
        email: toOptionalString(formData.get("email")),
        phone: toOptionalString(formData.get("phone")),
        address: toOptionalString(formData.get("address")),
        memo: toOptionalString(formData.get("memo")),
    });

    redirect(`/dashboard/bp-companies/${id}`);
}

export async function deleteBpCompanyAction(id: string) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    await deleteBpCompany(id);

    redirect("/dashboard/bp-companies");
}

export async function restoreBpCompanyAction(id: string) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    await restoreBpCompany(id);

    redirect("/dashboard/bp-companies");
}