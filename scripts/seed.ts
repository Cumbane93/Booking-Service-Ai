const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
    try {
        await db.agentCategory.createMany({
            data: [
                { name: "Default" },
                { name: "Ai" },
                { name: "Custom" },
            ]
        })
    } catch (error) {
        console.error("Error seeding default agents", error);
    } finally {
        await db.$disconnect();
    }
};

main();