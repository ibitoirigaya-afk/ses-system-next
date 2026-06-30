"use server";

import type { ProposalStatus } from "@prisma/client";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
    createProposalHistory,
    deleteProposalHistory,
    getDeletedProposalHistoryByIdForUser,
    getProposalHistoryByIdForUser,
    getProposalHistoryByProjectAndEngineer,
    restoreProposalHistory,
    updateProposalHistory,
} from "@/lib/repositories/proposalHistoryRepository";

function toOptionalString(value: FormDataEntryValue | null) {
    const text = String(value ?? "").trim();

    if (text === "") {
        return null;
    }

    return text;
}

function toOptionalDate(value: FormDataEntryValue | null) {
    const text = String(value ?? "").trim();

    if (text === "") {
        return null;
    }

    return new Date(text);
}

function toProposalStatus(value: FormDataEntryValue | null): ProposalStatus {
    const status = String(value ?? "proposed");

    if (
        status === "proposed" ||
        status === "interviewing" ||
        status === "accepted" ||
        status === "rejected" ||
        status === "withdrawn"
    ) {
        return status;
    }

    return "proposed";
}

export async function createProposalHistoryAction(formData: FormData) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const projectId = String(formData.get("projectId") ?? "");
    const engineerId = String(formData.get("engineerId") ?? "");
    const interviewDate = toOptionalDate(formData.get("interviewDate"));
    const memo = toOptionalString(formData.get("memo"));

    if (projectId.trim() === "" || engineerId.trim() === "") {
        return {
            error: "案件または要員が正しく選択されていません。",
        };
    }

    const existingProposal = await getProposalHistoryByProjectAndEngineer(
        projectId,
        engineerId,
    );

    if (existingProposal) {
        return {
            error: "この案件には、すでにこの要員を提案しています。",
        };
    }

    await createProposalHistory({
        projectId,
        engineerId,
        createdById: session.user.id,
        status: "proposed",
        interviewDate,
        memo,
    });

    redirect("/dashboard/proposal-histories");
}

export async function updateProposalHistoryAction(
    id: string,
    formData: FormData,
) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const targetProposalHistory = await getProposalHistoryByIdForUser(
        id,
        session.user.id,
    );

    if (!targetProposalHistory) {
        return {
            error: "この提案履歴を編集する権限がありません。",
        };
    }

    const status = toProposalStatus(formData.get("status"));
    const interviewDate = toOptionalDate(formData.get("interviewDate"));
    const memo = toOptionalString(formData.get("memo"));

    await updateProposalHistory(id, {
        status,
        interviewDate,
        memo,
    });

    redirect(`/dashboard/proposal-histories/${id}`);
}

export async function deleteProposalHistoryAction(id: string) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const targetProposalHistory = await getProposalHistoryByIdForUser(
        id,
        session.user.id,
    );

    if (!targetProposalHistory) {
        return {
            error: "この提案履歴を削除する権限がありません。",
        };
    }

    await deleteProposalHistory(id);

    redirect("/dashboard/proposal-histories");
}

export async function restoreProposalHistoryAction(id: string) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const targetProposalHistory = await getDeletedProposalHistoryByIdForUser(
        id,
        session.user.id,
    );

    if (!targetProposalHistory) {
        return {
            error: "この提案履歴を復元する権限がありません。",
        };
    }

    await restoreProposalHistory(id);

    redirect("/dashboard/proposal-histories");
}