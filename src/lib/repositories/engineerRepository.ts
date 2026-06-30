import { prisma } from "@/lib/db";

type CreateEngineerInput = {
    name: string;
    companyName: string;
    bpCompanyId?: string | null;
    age?: number | null;
    gender?: string | null;
    nearestStation?: string | null;
    desiredUnitPrice?: number | null;
    experienceYears?: number | null;
    availableDate?: Date | null;
    desiredLocation?: string | null;
    desiredConditions?: string | null;
    careerSummary?: string | null;
    createdById: string;
    skillIds?: string[];
};

type UpdateEngineerInput = {
    name: string;
    companyName: string;
    bpCompanyId?: string | null;
    age?: number | null;
    gender?: string | null;
    nearestStation?: string | null;
    desiredUnitPrice?: number | null;
    experienceYears?: number | null;
    availableDate?: Date | null;
    desiredLocation?: string | null;
    desiredConditions?: string | null;
    careerSummary?: string | null;
    skillIds?: string[];
};

const engineerInclude = {
    createdBy: true,
    bpCompany: true,
    skills: {
        where: {
            deletedAt: null,
        },
        orderBy: [
            {
                category: "asc" as const,
            },
            {
                name: "asc" as const,
            },
        ],
    },
};

export async function getEngineers() {
    return prisma.engineer.findMany({
        where: {
            deletedAt: null,
        },
        include: engineerInclude,
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function getDeletedEngineers() {
    return prisma.engineer.findMany({
        where: {
            deletedAt: {
                not: null,
            },
        },
        include: engineerInclude,
        orderBy: {
            deletedAt: "desc",
        },
    });
}

export async function getEngineerById(id: string) {
    return prisma.engineer.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        include: engineerInclude,
    });
}

export async function createEngineer(input: CreateEngineerInput) {
    const skillIds = input.skillIds ?? [];

    return prisma.engineer.create({
        data: {
            name: input.name,
            companyName: input.companyName,
            ...(input.bpCompanyId
                ? {
                    bpCompany: {
                        connect: {
                            id: input.bpCompanyId,
                        },
                    },
                }
                : {}),
            age: input.age,
            gender: input.gender,
            nearestStation: input.nearestStation,
            desiredUnitPrice: input.desiredUnitPrice,
            experienceYears: input.experienceYears,
            availableDate: input.availableDate,
            desiredLocation: input.desiredLocation,
            desiredConditions: input.desiredConditions,
            careerSummary: input.careerSummary,
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

export async function updateEngineer(id: string, input: UpdateEngineerInput) {
    const skillIds = input.skillIds ?? [];

    return prisma.engineer.update({
        where: {
            id,
        },
        data: {
            name: input.name,
            companyName: input.companyName,
            ...(input.bpCompanyId === undefined
                ? {}
                : input.bpCompanyId === null
                    ? {
                        bpCompany: {
                            disconnect: true,
                        },
                    }
                    : {
                        bpCompany: {
                            connect: {
                                id: input.bpCompanyId,
                            },
                        },
                    }),
            age: input.age,
            gender: input.gender,
            nearestStation: input.nearestStation,
            desiredUnitPrice: input.desiredUnitPrice,
            experienceYears: input.experienceYears,
            availableDate: input.availableDate,
            desiredLocation: input.desiredLocation,
            desiredConditions: input.desiredConditions,
            careerSummary: input.careerSummary,
            skills: {
                set: skillIds.map((skillId) => ({
                    id: skillId,
                })),
            },
        },
    });
}

export async function deleteEngineer(id: string) {
    return prisma.engineer.update({
        where: {
            id,
        },
        data: {
            deletedAt: new Date(),
        },
    });
}

export async function restoreEngineer(id: string) {
    return prisma.engineer.update({
        where: {
            id,
        },
        data: {
            deletedAt: null,
        },
    });
}

export async function getEngineerCount() {
    return prisma.engineer.count({
        where: {
            deletedAt: null,
        },
    });
}

export async function getEngineersForUser(userId: string) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            role: true,
            bpCompanyId: true,
        },
    });

    if (!user) {
        return [];
    }

    if (user.role === "admin") {
        return prisma.engineer.findMany({
            where: {
                deletedAt: null,
            },
            include: engineerInclude,
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    if (user.bpCompanyId) {
        return prisma.engineer.findMany({
            where: {
                deletedAt: null,
                bpCompanyId: user.bpCompanyId,
            },
            include: engineerInclude,
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    return prisma.engineer.findMany({
        where: {
            deletedAt: null,
            createdById: user.id,
        },
        include: engineerInclude,
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function getEngineerByIdForUser(id: string, userId: string) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            role: true,
            bpCompanyId: true,
        },
    });

    if (!user) {
        return null;
    }

    if (user.role === "admin") {
        return prisma.engineer.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: engineerInclude,
        });
    }

    if (user.bpCompanyId) {
        return prisma.engineer.findFirst({
            where: {
                id,
                deletedAt: null,
                bpCompanyId: user.bpCompanyId,
            },
            include: engineerInclude,
        });
    }

    return prisma.engineer.findFirst({
        where: {
            id,
            deletedAt: null,
            createdById: user.id,
        },
        include: engineerInclude,
    });
}

export async function getDeletedEngineersForUser(userId: string) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            role: true,
            bpCompanyId: true,
        },
    });

    if (!user) {
        return [];
    }

    if (user.role === "admin") {
        return prisma.engineer.findMany({
            where: {
                deletedAt: {
                    not: null,
                },
            },
            include: engineerInclude,
            orderBy: {
                deletedAt: "desc",
            },
        });
    }

    if (user.bpCompanyId) {
        return prisma.engineer.findMany({
            where: {
                deletedAt: {
                    not: null,
                },
                bpCompanyId: user.bpCompanyId,
            },
            include: engineerInclude,
            orderBy: {
                deletedAt: "desc",
            },
        });
    }

    return prisma.engineer.findMany({
        where: {
            deletedAt: {
                not: null,
            },
            createdById: user.id,
        },
        include: engineerInclude,
        orderBy: {
            deletedAt: "desc",
        },
    });
}

export async function getDeletedEngineerByIdForUser(id: string, userId: string) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            role: true,
            bpCompanyId: true,
        },
    });

    if (!user) {
        return null;
    }

    if (user.role === "admin") {
        return prisma.engineer.findFirst({
            where: {
                id,
                deletedAt: {
                    not: null,
                },
            },
            include: engineerInclude,
        });
    }

    if (user.bpCompanyId) {
        return prisma.engineer.findFirst({
            where: {
                id,
                deletedAt: {
                    not: null,
                },
                bpCompanyId: user.bpCompanyId,
            },
            include: engineerInclude,
        });
    }

    return prisma.engineer.findFirst({
        where: {
            id,
            deletedAt: {
                not: null,
            },
            createdById: user.id,
        },
        include: engineerInclude,
    });
}