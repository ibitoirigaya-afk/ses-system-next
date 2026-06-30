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

export async function getProposalHistoryCount() {
    return prisma.proposalHistory.count({
        where: {
            deletedAt: null,
        },
    });
}

export async function getRecentProposalHistories() {
    return prisma.proposalHistory.findMany({
        where: {
            deletedAt: null,
        },
        include: {
            project: true,
            engineer: true,
            createdBy: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 5,
    });
}

export async function getProposalHistoriesForUser(userId: string) {
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

    if (user.bpCompanyId) {
        return prisma.proposalHistory.findMany({
            where: {
                deletedAt: null,
                engineer: {
                    bpCompanyId: user.bpCompanyId,
                },
            },
            include: proposalHistoryInclude,
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    return prisma.proposalHistory.findMany({
        where: {
            deletedAt: null,
            OR: [
                {
                    createdById: user.id,
                },
                {
                    engineer: {
                        createdById: user.id,
                    },
                },
            ],
        },
        include: proposalHistoryInclude,
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function getProposalHistoryByIdForUser(id: string, userId: string) {
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
        return prisma.proposalHistory.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: proposalHistoryInclude,
        });
    }

    if (user.bpCompanyId) {
        return prisma.proposalHistory.findFirst({
            where: {
                id,
                deletedAt: null,
                engineer: {
                    bpCompanyId: user.bpCompanyId,
                },
            },
            include: proposalHistoryInclude,
        });
    }

    return prisma.proposalHistory.findFirst({
        where: {
            id,
            deletedAt: null,
            OR: [
                {
                    createdById: user.id,
                },
                {
                    engineer: {
                        createdById: user.id,
                    },
                },
            ],
        },
        include: proposalHistoryInclude,
    });
}

export async function getDeletedProposalHistoriesForUser(userId: string) {
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

    if (user.bpCompanyId) {
        return prisma.proposalHistory.findMany({
            where: {
                deletedAt: {
                    not: null,
                },
                engineer: {
                    bpCompanyId: user.bpCompanyId,
                },
            },
            include: proposalHistoryInclude,
            orderBy: {
                deletedAt: "desc",
            },
        });
    }

    return prisma.proposalHistory.findMany({
        where: {
            deletedAt: {
                not: null,
            },
            OR: [
                {
                    createdById: user.id,
                },
                {
                    engineer: {
                        createdById: user.id,
                    },
                },
            ],
        },
        include: proposalHistoryInclude,
        orderBy: {
            deletedAt: "desc",
        },
    });
}

export async function getDeletedProposalHistoryByIdForUser(
    id: string,
    userId: string,
) {
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
        return prisma.proposalHistory.findFirst({
            where: {
                id,
                deletedAt: {
                    not: null,
                },
            },
            include: proposalHistoryInclude,
        });
    }

    if (user.bpCompanyId) {
        return prisma.proposalHistory.findFirst({
            where: {
                id,
                deletedAt: {
                    not: null,
                },
                engineer: {
                    bpCompanyId: user.bpCompanyId,
                },
            },
            include: proposalHistoryInclude,
        });
    }

    return prisma.proposalHistory.findFirst({
        where: {
            id,
            deletedAt: {
                not: null,
            },
            OR: [
                {
                    createdById: user.id,
                },
                {
                    engineer: {
                        createdById: user.id,
                    },
                },
            ],
        },
        include: proposalHistoryInclude,
    });
}