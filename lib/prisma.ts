import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";
import pg from "pg";
import { PrismaClient } from "./generated/prisma/client";

const { Pool } = pg;

const globalForPrisma = global as unknown as {
	prisma: PrismaClient;
};

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool); //or using adapter without accelerate

const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({ accelerateUrl: connectionString }).$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
