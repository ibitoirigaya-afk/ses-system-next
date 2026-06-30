import { prisma } from "@/lib/db";

type CreateWorkRecordInput = {
    projectId: string;
    engineerId: string;
    targetMonth: string;
    workingHours: number;
    billingAmount: number;
    paymentAmount: number;
    grossProfit: number;
    memo?: string | null;
    createdById: string;
};

type UpdateWorkRecordInput = {
    projectId: string;
    engineerId: string;
    targetMonth: string;
    workingHours: number;
    billingAmount: number;
    paymentAmount: number;
    grossProfit: number;
    memo?: string | null;
};

const workRecordInclude = {
    project: true,
    engineer: true,
    createdBy: true,
};

export async function getWorkRecords() {
    return prisma.workRecord.findMany({
        where: {
            deletedAt: null,
        },
        include: workRecordInclude,
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function getDeletedWorkRecords() {
    return prisma.workRecord.findMany({
        where: {
            deletedAt: {
                not: null,
            },
        },
        include: workRecordInclude,
        orderBy: {
            deletedAt: "desc",
        },
    });
}

export async function getWorkRecordById(id: string) {
    return prisma.workRecord.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        include: workRecordInclude,
    });
}

export async function createWorkRecord(input: CreateWorkRecordInput) {
    return prisma.workRecord.create({
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
            targetMonth: input.targetMonth,
            workingHours: input.workingHours,
            billingAmount: input.billingAmount,
            paymentAmount: input.paymentAmount,
            grossProfit: input.grossProfit,
            memo: input.memo,
            createdBy: {
                connect: {
                    id: input.createdById,
                },
            },
        },
    });
}

export async function updateWorkRecord(id: string, input: UpdateWorkRecordInput) {
    return prisma.workRecord.update({
        where: {
            id,
        },
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
            targetMonth: input.targetMonth,
            workingHours: input.workingHours,
            billingAmount: input.billingAmount,
            paymentAmount: input.paymentAmount,
            grossProfit: input.grossProfit,
            memo: input.memo,
        },
    });
}

export async function deleteWorkRecord(id: string) {
    return prisma.workRecord.update({
        where: {
            id,
        },
        data: {
            deletedAt: new Date(),
        },
    });
}

export async function restoreWorkRecord(id: string) {
    return prisma.workRecord.update({
        where: {
            id,
        },
        data: {
            deletedAt: null,
        },
    });
}

export async function getCurrentMonthGrossProfitTotal() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const currentMonth = `${year}-${month}`;

    const result = await prisma.workRecord.aggregate({
        where: {
            deletedAt: null,
            targetMonth: currentMonth,
        },
        _sum: {
            grossProfit: true,
        },
    });

    return result._sum.grossProfit ?? 0;
}