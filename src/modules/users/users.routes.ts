import { FastifyInstance } from "fastify";
import {
  assignRoleToUserHandler,
  createUserHandler,
  loginHandler,
} from "./users.controllers";
import {
  assignRoleToUserBodyJsonSchema,
  createUserJsonSchema,
  loginBodyJsonSchema,
} from "./users.schemas";

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

  app.post(
    "/roles",
    {
      schema: assignRoleToUserBodyJsonSchema,
    },
    assignRoleToUserHandler
  );
}
