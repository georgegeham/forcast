import db from "./db";
import { user } from "./schemas/auth-schema";
import { userProfile } from "./schemas/user-profile-schema";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const ADMIN_NAME = process.env.ADMIN_NAME!;

async function seed() {
  console.log("Seeding admin user...");

  const existing = await db
    .select()
    .from(user)
    .where(eq(user.email, ADMIN_EMAIL))
    .limit(1);

  if (existing.length > 0) {
    console.log("Admin user already exists, updating role...");
    await db
      .update(user)
      .set({ role: "admin" })
      .where(eq(user.email, ADMIN_EMAIL));
    console.log("Admin role updated.");
    return;
  }

  const userId = nanoid();
  const profileId = nanoid();

  await db.insert(user).values({
    id: userId,
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    emailVerified: true,
    role: "admin",
    completedProfile: true,
  });

  await db.insert(userProfile).values({
    id: profileId,
    userId,
    bio: "System administrator",
  });

  console.log("Admin user created.");
  console.log(`  Email: ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  console.log("Note: You need to sign up through the app to set a password.");
  console.log("Or run the create-admin script to set the password.");
}

seed()
  .then(() => {
    console.log("Seed complete.");
    process.exit(0);
  })
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  });
