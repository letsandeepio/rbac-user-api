import { FastifyReply, FastifyRequest } from "fastify";
import { createRole } from "./roles.service";
import { CreateRoleBody } from "./roles.schemas";

export async function createRoleHandler(
  request: FastifyRequest<{ Body: CreateRoleBody }>,
  reply: FastifyReply
) {
  const { name, permissions } = request.body;

  const user = request.user;

  const applicationId = user.applicationId;

  const role = await createRole({
    name,
    permissions,
    applicationId,
  });

  return role;
}
