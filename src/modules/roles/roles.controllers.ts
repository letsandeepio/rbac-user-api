import { FastifyReply, FastifyRequest } from "fastify";
import { createRole } from "./roles.service";
import { CreateRoleBody } from "./roles.schemas";

export async function createRoleHandler(
  request: FastifyRequest<{ Body: CreateRoleBody }>,
  reply: FastifyReply
) {
  const { name, permissions, applicationId } = request.body;

  const role = await createRole({
    name,
    permissions,
    applicationId,
  });

  return role;
}
