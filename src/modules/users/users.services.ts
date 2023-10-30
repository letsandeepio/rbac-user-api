import { InferInsertModel } from "drizzle-orm";
import { applicatons, users } from "../../db/schema";
import { db } from "../../db";
import argon2 from "argon2";

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
}
