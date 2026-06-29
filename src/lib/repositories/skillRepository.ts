import { prisma } from "@/lib/db";

export async function getSkills() {
    return prisma.skill.findMany({
        where: {
            deletedAt: null,
        },
        orderBy: [
            {
                category: "asc",
            },
            {
                name: "asc",
            },
        ],
    });
}

export async function getSkillById(id: string) {
    return prisma.skill.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });
}

export async function createSkill(data: { name: string; category: string }) {
    return prisma.skill.create({
        data: {
            name: data.name,
            category: data.category,
        },
    });
}

export async function updateSkill(
    id: string,
    data: {
        name: string;
        category: string;
    },
) {
    return prisma.skill.update({
        where: {
            id,
        },
        data: {
            name: data.name,
            category: data.category,
        },
    });
}

export async function deleteSkill(id: string) {
    return prisma.skill.update({
        where: {
            id,
        },
        data: {
            deletedAt: new Date(),
        },
    });
}

export async function restoreSkill(id: string) {
    return prisma.skill.update({
        where: {
            id,
        },
        data: {
            deletedAt: null,
        },
    });
}

export async function getDeletedSkills() {
    return prisma.skill.findMany({
        where: {
            deletedAt: {
                not: null,
            },
        },
        orderBy: [
            {
                category: "asc",
            },
            {
                name: "asc",
            },
        ],
    });
}