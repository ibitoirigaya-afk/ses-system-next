"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
    createSkill,
    deleteSkill,
    restoreSkill,
    updateSkill,
} from "@/lib/repositories/skillRepository";

export async function updateSkillAction(id: string, formData: FormData) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const name = String(formData.get("name") ?? "");
    const category = String(formData.get("category") ?? "");

    if (name.trim() === "" || category.trim() === "") {
        return {
            error: "入力内容を確認してください。",
        };
    }

    try {
        await updateSkill(id, {
            name,
            category,
        });
    } catch {
        return {
            error: "同じカテゴリに同じスキルが既に登録されています。",
        };
    }

    redirect("/dashboard/skills");
}

export async function deleteSkillAction(id: string) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    await deleteSkill(id);

    redirect("/dashboard/skills");
}

export async function restoreSkillAction(id: string) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    await restoreSkill(id);

    redirect("/dashboard/skills");
}

export async function createSkillAction(formData: FormData) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const name = String(formData.get("name") ?? "");
    const category = String(formData.get("category") ?? "");

    if (name.trim() === "" || category.trim() === "") {
        return {
            error: "入力内容を確認してください。",
        };
    }

    try {
        await createSkill({
            name,
            category,
        });
    } catch {
        return {
            error: "同じカテゴリに同じスキルが既に登録されています。",
        };
    }

    redirect("/dashboard/skills");
}