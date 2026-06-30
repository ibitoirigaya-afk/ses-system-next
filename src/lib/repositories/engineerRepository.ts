import { prisma } from "@/lib/db";

type CreateEngineerInput = {
    name: string;
    companyName: string;
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