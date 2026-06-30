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

export async function getProjects() {
    return prisma.project.findMany({
        where: {
            deletedAt: null,
        },
        include: {
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
        },
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
        include: {
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
        },
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
        include: {
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
        },
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