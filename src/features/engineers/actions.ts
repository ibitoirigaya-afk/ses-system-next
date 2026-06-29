"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
    createEngineer,
    deleteEngineer,
    restoreEngineer,
    updateEngineer,
} from "@/lib/repositories/engineerRepository";

function toOptionalString(value: FormDataEntryValue | null) {
    const text = String(value ?? "").trim();

    if (text === "") {
        return null;
    }

    return text;
}

function toOptionalNumber(value: FormDataEntryValue | null) {
    const text = String(value ?? "").trim();

    if (text === "") {
        return null;
    }

    const number = Number(text);

    if (Number.isNaN(number)) {
        return null;
    }

    return number;
}

function toOptionalDate(value: FormDataEntryValue | null) {
    const text = String(value ?? "").trim();

    if (text === "") {
        return null;
    }

    return new Date(text);
}

export async function createEngineerAction(formData: FormData) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const name = String(formData.get("name") ?? "");
    const companyName = String(formData.get("companyName") ?? "");
    const skillIds = formData.getAll("skillIds").map(String);

    if (name.trim() === "" || companyName.trim() === "") {
        return {
            error: "氏名と所属会社を入力してください。",
        };
    }

    await createEngineer({
        name,
        companyName,
        age: toOptionalNumber(formData.get("age")),
        gender: toOptionalString(formData.get("gender")),
        nearestStation: toOptionalString(formData.get("nearestStation")),
        desiredUnitPrice: toOptionalNumber(formData.get("desiredUnitPrice")),
        experienceYears: toOptionalNumber(formData.get("experienceYears")),
        availableDate: toOptionalDate(formData.get("availableDate")),
        desiredLocation: toOptionalString(formData.get("desiredLocation")),
        desiredConditions: toOptionalString(formData.get("desiredConditions")),
        careerSummary: toOptionalString(formData.get("careerSummary")),
        createdById: session.user.id,
        skillIds,
    });

    redirect("/dashboard/engineers");
}

export async function updateEngineerAction(id: string, formData: FormData) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const name = String(formData.get("name") ?? "");
    const companyName = String(formData.get("companyName") ?? "");
    const skillIds = formData.getAll("skillIds").map(String);

    if (name.trim() === "" || companyName.trim() === "") {
        return {
            error: "氏名と所属会社を入力してください。",
        };
    }

    await updateEngineer(id, {
        name,
        companyName,
        age: toOptionalNumber(formData.get("age")),
        gender: toOptionalString(formData.get("gender")),
        nearestStation: toOptionalString(formData.get("nearestStation")),
        desiredUnitPrice: toOptionalNumber(formData.get("desiredUnitPrice")),
        experienceYears: toOptionalNumber(formData.get("experienceYears")),
        availableDate: toOptionalDate(formData.get("availableDate")),
        desiredLocation: toOptionalString(formData.get("desiredLocation")),
        desiredConditions: toOptionalString(formData.get("desiredConditions")),
        careerSummary: toOptionalString(formData.get("careerSummary")),
        skillIds,
    });

    redirect(`/dashboard/engineers/${id}`);
}

export async function deleteEngineerAction(id: string) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    await deleteEngineer(id);

    redirect("/dashboard/engineers");
}

export async function restoreEngineerAction(id: string) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    await restoreEngineer(id);

    redirect("/dashboard/engineers");
}