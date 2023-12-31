import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { SYSTEM_ROLES } from "../../config/permissions";
import { logger } from "../../utils/logger";
import { getRoleByName } from "../roles/roles.service";
import {
  AssignRoleToUserBody,
  CreateUserBody,
  LoginBody,
} from "./users.schemas";
import {
  assignRoleToUser,
  createUser,
  getUserByEmail,
  getUsersByApplication,
} from "./users.services";

export async function createUserHandler(
  request: FastifyRequest<{
    Body: CreateUserBody;
  }>,
  reply: FastifyReply
) {
  const { initialUser, ...data } = request.body;

  logger.debug(request.body);

  const roleName = initialUser
    ? SYSTEM_ROLES.SUPER_ADMIN
    : SYSTEM_ROLES.APPLICATION_USER;

  logger.debug(roleName);

  // TODO: If this the first user being created set the role to Super-Admin
  // Right now we always have to send "initialUser" to true, when sending
  // the request for first user

  if (roleName === SYSTEM_ROLES.SUPER_ADMIN) {
    const appUsers = await getUsersByApplication(data.applicationId);

    if (appUsers.length > 0) {
      return reply.code(400).send({
        message: "Application already has super admin user",
        extensions: {
          code: "APPLICATION_ALREADY_HAS_SUPER_USER",
          applicationId: data.applicationId,
        },
      });
    }
  }

  const role = await getRoleByName({
    name: roleName,
    applicationId: data.applicationId,
  });

  if (!role) {
    return reply.code(404).send({
      message: "Role not found",
    });
  }

  try {
    const user = await createUser(data);

    // assign role to the user

    await assignRoleToUser({
      userId: user.id,
      applicationId: data.applicationId,
      roleId: role.id,
    });

    return user;
  } catch (ex: any) {
    reply.code(500).send(`Application Error: ${ex.message}`);
  }
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginBody;
  }>,
  reply: FastifyReply
) {
  const { applicationId, email, password } = request.body;

  const user = await getUserByEmail({ applicationId, email });

  if (!user) {
    return reply.code(400).send({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email,
      applicationId,
      scopes: user.permissions,
    },
    "secret"
  ); // change this secret or signing method

  return { token };
}
export async function assignRoleToUserHandler(
  request: FastifyRequest<{
    Body: AssignRoleToUserBody;
  }>,
  reply: FastifyReply
) {
  const { userId, roleId } = request.body;

  const user = request.user;

  const applicationId = user.applicationId;

  try {
    const result = await assignRoleToUser({
      userId,
      roleId,
      applicationId,
    });

    return result;
  } catch (error) {
    logger.error(error, `Error assigning role to user`);
    return reply.code(500).send({
      message: "Error assigning role to user",
    });
  }
}
