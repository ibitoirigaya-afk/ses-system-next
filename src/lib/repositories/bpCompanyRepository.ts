import { prisma } from "@/lib/db";

type CreateBpCompanyInput = {
    name: string;
    contactPerson?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    memo?: string | null;
    createdById: string;
};

type UpdateBpCompanyInput = {
    name: string;
    contactPerson?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    memo?: string | null;
};

const bpCompanyInclude = {
    createdBy: true,
};

export async function getBpCompanies() {
    return prisma.bpCompany.findMany({
        where: {
            deletedAt: null,
        },
        include: bpCompanyInclude,
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function getDeletedBpCompanies() {
    return prisma.bpCompany.findMany({
        where: {
            deletedAt: {
                not: null,
            },
        },
        include: bpCompanyInclude,
        orderBy: {
            deletedAt: "desc",
        },
    });
}

export async function getBpCompanyById(id: string) {
    return prisma.bpCompany.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        include: bpCompanyInclude,
    });
}

export async function getBpCompanyByName(name: string) {
    return prisma.bpCompany.findFirst({
        where: {
            name,
            deletedAt: null,
        },
    });
}

export async function createBpCompany(input: CreateBpCompanyInput) {
    return prisma.bpCompany.create({
        data: {
            name: input.name,
            contactPerson: input.contactPerson,
            email: input.email,
            phone: input.phone,
            address: input.address,
            memo: input.memo,
            createdBy: {
                connect: {
                    id: input.createdById,
                },
            },
        },
    });
}

export async function updateBpCompany(
    id: string,
    input: UpdateBpCompanyInput,
) {
    return prisma.bpCompany.update({
        where: {
            id,
        },
        data: {
            name: input.name,
            contactPerson: input.contactPerson,
            email: input.email,
            phone: input.phone,
            address: input.address,
            memo: input.memo,
        },
    });
}

export async function deleteBpCompany(id: string) {
    return prisma.bpCompany.update({
        where: {
            id,
        },
        data: {
            deletedAt: new Date(),
        },
    });
}

export async function restoreBpCompany(id: string) {
    return prisma.bpCompany.update({
        where: {
            id,
        },
        data: {
            deletedAt: null,
        },
    });
}

export async function getBpCompanyCount() {
    return prisma.bpCompany.count({
        where: {
            deletedAt: null,
        },
    });
}