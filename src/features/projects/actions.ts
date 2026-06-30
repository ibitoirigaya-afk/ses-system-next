"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
    canCreateProjectForUser,
    createProject,
    deleteProject,
    getDeletedProjectByIdForUser,
    getProjectManageTargetForUser,
    restoreProject,
    updateProject,
} from "@/lib/repositories/projectRepository";

export async function deleteProjectAction(id: string) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const project = await getProjectManageTargetForUser(id, session.user.id);

    if (!project) {
        return {
            error: "この案件を削除する権限がありません。",
        };
    }

    await deleteProject(id);

    redirect("/dashboard/projects");
}

export async function restoreProjectAction(id: string) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const project = await getDeletedProjectByIdForUser(id, session.user.id);

    if (!project) {
        return {
            error: "この案件を復元する権限がありません。",
        };
    }

    await restoreProject(id);

    redirect("/dashboard/projects");
}

export async function updateProjectAction(id: string, formData: FormData) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const project = await getProjectManageTargetForUser(id, session.user.id);

    if (!project) {
        return {
            error: "この案件を編集する権限がありません。",
        };
    }

    const title = String(formData.get("title") ?? "");
    const description = String(formData.get("description") ?? "");
    const location = String(formData.get("location") ?? "");
    const unitPriceText = String(formData.get("unitPrice") ?? "0");
    const unitPrice = Number(unitPriceText);

    const skillIds = formData.getAll("skillIds").map(String);

    if (
        title.trim() === "" ||
        description.trim() === "" ||
        location.trim() === "" ||
        Number.isNaN(unitPrice)
    ) {
        return {
            error: "入力内容を確認してください。",
        };
    }

    await updateProject(id, {
        title,
        description,
        location,
        unitPrice,
        skillIds,
    });

    redirect(`/dashboard/projects/${id}`);
}

export async function createProjectAction(formData: FormData) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const canCreate = await canCreateProjectForUser(session.user.id);

    if (!canCreate) {
        return {
            error: "案件を登録する権限がありません。",
        };
    }

    const title = String(formData.get("title") ?? "");
    const description = String(formData.get("description") ?? "");
    const location = String(formData.get("location") ?? "");
    const unitPriceText = String(formData.get("unitPrice") ?? "0");
    const unitPrice = Number(unitPriceText);

    const skillIds = formData.getAll("skillIds").map(String);

    if (
        title.trim() === "" ||
        description.trim() === "" ||
        location.trim() === "" ||
        Number.isNaN(unitPrice)
    ) {
        return {
            error: "入力内容を確認してください。",
        };
    }

    await createProject({
        title,
        description,
        location,
        unitPrice,
        createdById: session.user.id,
        skillIds,
    });

    redirect("/dashboard/projects");
}