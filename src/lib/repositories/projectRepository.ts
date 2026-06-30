import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";

type CreateProjectInput = {
    title: string;
    description: string;
    location: string;
    unitPrice: number;
    createdById: string;
    skillIds?: string[];
};

type UpdateProjectInput = {
    title: string;
    description: string;
    location: string;
    unitPrice: number;
    skillIds?: string[];
};

const projectInclude = {
    createdBy: true,
    skills: {
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
    },
} satisfies Prisma.ProjectInclude;

async function getProjectAccessUser(userId: string) {
    return prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            role: true,
        },
    });
}

export async function canCreateProjectForUser(userId: string) {
    const user = await getProjectAccessUser(userId);

    if (!user) {
        return false;
    }

    return user.role === "admin" || user.role === "company";
}

export async function getProjects() {
    return prisma.project.findMany({
        where: {
            deletedAt: null,
        },
        include: projectInclude,
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function getProjectsForUser(userId: string) {
    const user = await getProjectAccessUser(userId);

    if (!user) {
        return [];
    }

    // 案件は、マッチングや提案に使うため全ログインユーザーが閲覧可能
    return prisma.project.findMany({
        where: {
            deletedAt: null,
        },
        include: projectInclude,
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function getDeletedProjects() {
    return prisma.project.findMany({
        where: {
            deletedAt: {
                not: null,
            },
        },
        include: projectInclude,
        orderBy: {
            deletedAt: "desc",
        },
    });
}

export async function getDeletedProjectsForUser(userId: string) {
    const user = await getProjectAccessUser(userId);

    if (!user) {
        return [];
    }

    if (user.role === "admin") {
        return getDeletedProjects();
    }

    return prisma.project.findMany({
        where: {
            deletedAt: {
                not: null,
            },
            createdById: userId,
        },
        include: projectInclude,
        orderBy: {
            deletedAt: "desc",
        },
    });
}

export async function getProjectById(id: string) {
    return prisma.project.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        include: projectInclude,
    });
}

export async function getProjectByIdForUser(id: string, userId: string) {
    const user = await getProjectAccessUser(userId);

    if (!user) {
        return null;
    }

    // 案件詳細も全ログインユーザーが閲覧可能
    return prisma.project.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        include: projectInclude,
    });
}

export async function getProjectManageTargetForUser(
    id: string,
    userId: string,
) {
    const user = await getProjectAccessUser(userId);

    if (!user) {
        return null;
    }

    if (user.role === "admin") {
        return prisma.project.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: projectInclude,
        });
    }

    return prisma.project.findFirst({
        where: {
            id,
            deletedAt: null,
            createdById: userId,
        },
        include: projectInclude,
    });
}

export async function getDeletedProjectByIdForUser(
    id: string,
    userId: string,
) {
    const user = await getProjectAccessUser(userId);

    if (!user) {
        return null;
    }

    if (user.role === "admin") {
        return prisma.project.findFirst({
            where: {
                id,
                deletedAt: {
                    not: null,
                },
            },
            include: projectInclude,
        });
    }

    return prisma.project.findFirst({
        where: {
            id,
            deletedAt: {
                not: null,
            },
            createdById: userId,
        },
        include: projectInclude,
    });
}

export async function createProject(input: CreateProjectInput) {
    const skillIds = input.skillIds ?? [];

    return prisma.project.create({
        data: {
            title: input.title,
            description: input.description,
            location: input.location,
            unitPrice: input.unitPrice,
            createdBy: {
                connect: {
                    id: input.createdById,
                },
            },
            skills: {
                connect: skillIds.map((id) => ({
                    id,
                })),
            },
        },
    });
}

export async function updateProject(id: string, input: UpdateProjectInput) {
    const skillIds = input.skillIds ?? [];

    return prisma.project.update({
        where: {
            id,
        },
        data: {
            title: input.title,
            description: input.description,
            location: input.location,
            unitPrice: input.unitPrice,
            skills: {
                set: skillIds.map((skillId) => ({
                    id: skillId,
                })),
            },
        },
    });
}

export async function deleteProject(id: string) {
    return prisma.project.update({
        where: {
            id,
        },
        data: {
            deletedAt: new Date(),
        },
    });
}

export async function restoreProject(id: string) {
    return prisma.project.update({
        where: {
            id,
        },
        data: {
            deletedAt: null,
        },
    });
}

export async function getProjectCount() {
    return prisma.project.count({
        where: {
            deletedAt: null,
        },
    });
}