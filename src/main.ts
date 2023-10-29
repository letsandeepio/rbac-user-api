import { migrate } from "drizzle-orm/node-postgres/migrator";
import { env } from "./config/env";
import { db } from "./db";
import { buildServer } from "./utils/server";

async function gracefulShutdown({
  app,
}: {
  app: Awaited<ReturnType<typeof buildServer>>;
}) {
  await app.close();
}

async function main() {
  const app = await buildServer();

  await app.listen({
    port: env.PORT,
    host: env.HOST,
  });

  await migrate(db, {
    migrationsFolder: "./migrations",
  });

  const signals = ["SIGINT", "SIGTERM"];

  for (const signal of signals) {
    process.on(signal, () => {
      console.log(`Terminating server. Recieved ${signal}`);
      gracefulShutdown({
        app,
      });
    });
  }
}

main();
