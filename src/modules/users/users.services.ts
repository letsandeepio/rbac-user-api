import argon2 from "argon2";
import { InferInsertModel, and, eq } from "drizzle-orm";
import { db } from "../../db";
import { applicatons, roles, userToRoles, users } from "../../db/schema";
import { logger } from "../../utils/logger";

export async function createUser(data: InferInsertModel<typeof users>) {
  const hashedPassword = await argon2.hash(data.password);

  const result = await db
    .insert(users)
    .values({
      ...data,
      password: hashedPassword,
    })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      applicationId: applicatons.id,
    });

  return result[0];
}

export async function getUsersByApplication(applicationId: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.applicationId, applicationId));

  return result;
}

// many to many relationship
export async function assignRoleToUser(
  data: InferInsertModel<typeof userToRoles>
) {
  const result = await db.insert(userToRoles).values(data).returning();

  return result[0];
}

export async function getUserByEmail({
  email,
  applicationId,
}: {
  email: string;
  applicationId: string;
}) {
  logger.debug(email);
  logger.debug(applicationId);

  // LEFT JOIN

  // FROM usersToRoles
  // ON userToRoles.userId = users.id
  // AND userToRoles.applicationId = users.applicationId

  const result = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), eq(users.applicationId, applicationId)))
    .leftJoin(
      userToRoles,
      and(
        eq(userToRoles.userId, users.id),
        eq(userToRoles.applicationId, users.applicationId)
      )
    )
    .leftJoin(roles, eq(roles.id, userToRoles.roleId));

  // LEFT JOIN
  // FROM roles
  // ON roles.id = usersToRoles.roleId

  if (!result.length) {
    return null;
  }

  return result;
}
