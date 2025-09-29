import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const db = new PrismaClient();

async function main() {
  const hash = (p: string) => bcrypt.hashSync(p, 10);

  await db.user.upsert({
    where: { email: "admin@demo.test" },
    update: { passwordHash: hash("Passw0rd!"), name: "Admin", role: "admin" },
    create: { email: "admin@demo.test", name: "Admin", role: "admin", passwordHash: hash("Passw0rd!") }
  });

  await db.user.upsert({
    where: { email: "alice@demo.test" },
    update: {},
    create: { email: "alice@demo.test", name: "Alice", role: "member", passwordHash: hash("alice123!") }
  });

  await db.user.upsert({
    where: { email: "bob@demo.test" },
    update: {},
    create: { email: "bob@demo.test", name: "Bob", role: "member", passwordHash: hash("bob123!") }
  });

  await db.project.create({
    data: {
      name: "Sample Project",
      description: "Demo",
      tasks: { create: [
        { title: "Set up repo", assignee: { connect: { email: "alice@demo.test" } } },
        { title: "Design DB schema", status: "in_progress", assignee: { connect: { email: "bob@demo.test" } } }
      ]}
    }
  });
}
main().finally(() => db.$disconnect());
