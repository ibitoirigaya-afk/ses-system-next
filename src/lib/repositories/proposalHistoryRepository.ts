import type { ProposalStatus } from "@prisma/client";

import { prisma } from "@/lib/db";

type CreateProposalHistoryInput = {
    projectId: string;
    engineerId: string;
    createdById: string;
    status?: ProposalStatus;
    interviewDate?: Date | null;
    memo?: string | null;
};

type UpdateProposalHistoryInput = {
    status: ProposalStatus;
    interviewDate?: Date | null;
    memo?: string | null;
};

const proposalHistoryInclude = {
    project: {
        include: {
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
        },
    },
    engineer: {
        include: {
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
        },
    },
    createdBy: true,
};

export async function getProposalHistories() {
    return prisma.proposalHistory.findMany({
        where: {
            deletedAt: null,
        },
        include: proposalHistoryInclude,
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function getDeletedProposalHistories() {
    return prisma.proposalHistory.findMany({
        where: {
            deletedAt: {
                not: null,
            },
        },
        include: proposalHistoryInclude,
        orderBy: {
            deletedAt: "desc",
        },
    });
}

export async function getProposalHistoryById(id: string) {
    return prisma.proposalHistory.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        include: proposalHistoryInclude,
    });
}

export async function getProposalHistoryByProjectAndEngineer(
    projectId: string,
    engineerId: string,
) {
    return prisma.proposalHistory.findFirst({
        where: {
            projectId,
            engineerId,
            deletedAt: null,
        },
        include: proposalHistoryInclude,
    });
}

export async function createProposalHistory(input: CreateProposalHistoryInput) {
    return prisma.proposalHistory.create({
        data: {
            project: {
                connect: {
                    id: input.projectId,
                },
            },
            engineer: {
                connect: {
                    id: input.engineerId,
                },
            },
            createdBy: {
                connect: {
                    id: input.createdById,
                },
            },
            status: input.status ?? "proposed",
            interviewDate: input.interviewDate,
            memo: input.memo,
        },
    });
}

export async function updateProposalHistory(
    id: string,
    input: UpdateProposalHistoryInput,
) {
    return prisma.proposalHistory.update({
        where: {
            id,
        },
        data: {
            status: input.status,
            interviewDate: input.interviewDate,
            memo: input.memo,
        },
    });
}

export async function deleteProposalHistory(id: string) {
    return prisma.proposalHistory.update({
        where: {
            id,
        },
        data: {
            deletedAt: new Date(),
        },
    });
}

export async function restoreProposalHistory(id: string) {
    return prisma.proposalHistory.update({
        where: {
            id,
        },
        data: {
            deletedAt: null,
        },
    });
}