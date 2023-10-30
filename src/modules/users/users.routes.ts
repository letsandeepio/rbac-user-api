import { FastifyInstance } from "fastify";
import { createUserJsonSchema, loginBodyJsonSchema } from "./users.schemas";
import { createUserHandler, loginHandler } from "./users.controllers";

export async function usersRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      schema: createUserJsonSchema,
    },
    createUserHandler
  );

  app.post(
    "/login",
    {
      schema: loginBodyJsonSchema,
    },
    loginHandler
  );
}
