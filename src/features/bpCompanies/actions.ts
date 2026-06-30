"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
    createBpCompany,
    deleteBpCompany,
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

    await createBpCompany({
        name,
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