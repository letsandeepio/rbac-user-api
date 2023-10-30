import fastify from "fastify";
import { logger } from "./logger";
import { applicationRoutes } from "../modules/applications/applications.routes";
import { usersRoutes } from "../modules/users/users.routes";
import { roleRoutes } from "../modules/roles/roles.routes";

export async function buildServer() {
  const app = fastify({
    logger,
  });

  app.register(applicationRoutes, { prefix: "api/v1/applications" });
  app.register(usersRoutes, { prefix: "api/v1/users" });
  app.register(roleRoutes, { prefix: "api/v1/roles" });

  return app;
}
