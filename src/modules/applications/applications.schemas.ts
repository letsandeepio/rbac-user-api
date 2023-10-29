import { InferInsertModel } from "drizzle-orm";
import { db } from "../../db";
import { applicatons } from "../../db/schema";

export async function createApplication(
  data: InferInsertModel<typeof applicatons>
) {
  const result = await db.insert(applicatons).values(data).returning();

  return result[0];
}

export async function getApplications() {
  const result = await db
    .select({
      id: applicatons.id,
      name: applicatons.name,
      createdAt: applicatons.createdAt,
    })
    .from(applicatons);

  return result;
}
