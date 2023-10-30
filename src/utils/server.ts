import fastify from "fastify";
import { logger } from "./logger";
import guard from "fastify-guard";
import { applicationRoutes } from "../modules/applications/applications.routes";
import { usersRoutes } from "../modules/users/users.routes";
import { roleRoutes } from "../modules/roles/roles.routes";
import jwt from "jsonwebtoken";

type User = {
  id: string;
  scopes: Array<string>;
};

declare module "fastify" {
  interface FastifyRequest {
    user: User;
  }
}

export async function buildServer() {
  const app = fastify({
    logger,
  });

  app.decorateRequest("user", null);

  app.addHook("onRequest", async function (request, reply) {
    const authHeader = request.headers.authorization;

    // user is not authorized
    if (!authHeader) {
      return;
    }

    try {
      const token = authHeader.replace("Bearer ", "");
      const decoded = jwt.verify(token, "secret") as User;

      request.user = decoded;
    } catch (error) {}
  });

  app.register(guard, {
    requestProperty: "user",
    scopeProperty: "scopes",
    errorHandler: (result, request, reply) => {
      return reply.status(401).send("Unauthorized");
    },
  });

  app.register(applicationRoutes, { prefix: "api/v1/applications" });
  app.register(usersRoutes, { prefix: "api/v1/users" });
  app.register(roleRoutes, { prefix: "api/v1/roles" });

  return app;
}
