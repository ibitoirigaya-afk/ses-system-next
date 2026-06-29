import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    const passwordHash = await bcrypt.hash("password", 10);

    await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {},
        create: {
            name: "管理者",
            email: "admin@example.com",
            passwordHash,
            role: UserRole.admin,
        },
    });

    await prisma.user.upsert({
        where: { email: "user@example.com" },
        update: {},
        create: {
            name: "要員担当",
            email: "user@example.com",
            passwordHash,
            role: UserRole.user,
        },
    });

    await prisma.user.upsert({
        where: { email: "company@example.com" },
        update: {},
        create: {
            name: "企業担当",
            email: "company@example.com",
            passwordHash,
            role: UserRole.company,
        },
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
        console.log("Seed completed");
    })
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });