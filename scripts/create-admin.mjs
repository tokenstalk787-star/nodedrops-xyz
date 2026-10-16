import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import readline from "readline";

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log("\n==============================================");
  console.log("   NodeDrops.xyz Secure Admin Bootstrap CLI   ");
  console.log("==============================================\n");

  const email = (await question("Enter admin email address: ")).trim().toLowerCase();
  if (!email || !email.includes("@")) {
    console.error("❌ Error: Invalid email address.");
    process.exit(1);
  }

  const name = (await question("Enter admin display name: ")).trim();
  const password = await question("Enter secure password (min 10 characters): ");

  if (password.length < 10) {
    console.error("❌ Error: Password must be at least 10 characters.");
    process.exit(1);
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    console.error("❌ Error: A user with this email already exists.");
    process.exit(1);
  }

  console.log("\nHashing password securely with bcrypt...");
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const admin = await prisma.user.create({
    data: {
      email,
      name: name || "System Administrator",
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "ADMIN_BOOTSTRAP_CREATED",
      targetType: "USER",
      targetId: admin.id,
      metadata: JSON.stringify({ email: admin.email }),
    },
  });

  console.log(`\n✅ Administrator successfully created: ${admin.email} (ID: ${admin.id})`);
  console.log("You can now log in at /login with full administrative permissions.\n");
}

main()
  .catch((e) => {
    console.error("Admin bootstrap error:", e);
    process.exit(1);
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });
