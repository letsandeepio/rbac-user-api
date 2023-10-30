import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserBody } from "./users.schemas";
import { SYSTEM_ROLES } from "../../config/permissions";
import { getRoleByName } from "../roles/roles.service";
import {
  assignRoleToUser,
  createUser,
  getUsersByApplication,
} from "./users.services";
import { logger } from "../../utils/logger";

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
      applicatonId: data.applicationId,
      roleId: role.id,
    });

    return user;
  } catch (ex: any) {
    logger.debug(ex.message);
  }
}
