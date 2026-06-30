"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
    createWorkRecord,
    deleteWorkRecord,
    restoreWorkRecord,
    updateWorkRecord,
} from "@/lib/repositories/workRecordRepository";

function toOptionalString(value: FormDataEntryValue | null) {
    const text = String(value ?? "").trim();

    if (text === "") {
        return null;
    }

    return text;
}

function toNumber(value: FormDataEntryValue | null) {
    const text = String(value ?? "0").trim();
    const number = Number(text);

    if (Number.isNaN(number)) {
        return 0;
    }

    return number;
}

export async function createWorkRecordAction(formData: FormData) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const projectId = String(formData.get("projectId") ?? "");
    const engineerId = String(formData.get("engineerId") ?? "");
    const targetMonth = String(formData.get("targetMonth") ?? "");

    const workingHours = toNumber(formData.get("workingHours"));
    const billingAmount = toNumber(formData.get("billingAmount"));
    const paymentAmount = toNumber(formData.get("paymentAmount"));
    const grossProfit = billingAmount - paymentAmount;

    if (
        projectId.trim() === "" ||
        engineerId.trim() === "" ||
        targetMonth.trim() === ""
    ) {
        return {
            error: "案件・要員・対象月を選択してください。",
        };
    }

    await createWorkRecord({
        projectId,
        engineerId,
        targetMonth,
        workingHours,
        billingAmount,
        paymentAmount,
        grossProfit,
        memo: toOptionalString(formData.get("memo")),
        createdById: session.user.id,
    });

    redirect("/dashboard/work-records");
}

export async function updateWorkRecordAction(id: string, formData: FormData) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const projectId = String(formData.get("projectId") ?? "");
    const engineerId = String(formData.get("engineerId") ?? "");
    const targetMonth = String(formData.get("targetMonth") ?? "");

    const workingHours = toNumber(formData.get("workingHours"));
    const billingAmount = toNumber(formData.get("billingAmount"));
    const paymentAmount = toNumber(formData.get("paymentAmount"));
    const grossProfit = billingAmount - paymentAmount;

    if (
        projectId.trim() === "" ||
        engineerId.trim() === "" ||
        targetMonth.trim() === ""
    ) {
        return {
            error: "案件・要員・対象月を選択してください。",
        };
    }

    await updateWorkRecord(id, {
        projectId,
        engineerId,
        targetMonth,
        workingHours,
        billingAmount,
        paymentAmount,
        grossProfit,
        memo: toOptionalString(formData.get("memo")),
    });

    redirect(`/dashboard/work-records/${id}`);
}

export async function deleteWorkRecordAction(id: string) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    await deleteWorkRecord(id);

    redirect("/dashboard/work-records");
}

export async function restoreWorkRecordAction(id: string) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    await restoreWorkRecord(id);

    redirect("/dashboard/work-records");
}