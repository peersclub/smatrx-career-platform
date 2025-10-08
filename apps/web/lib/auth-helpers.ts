import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

/**
 * Extended session type with user.id
 * This matches our NextAuth callbacks configuration in auth.ts
 */
export interface ExtendedSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
  expires: string;
}

/**
 * Type-safe auth helper that includes user.id
 *
 * The session callback in auth.ts adds user.id to the session,
 * but TypeScript doesn't know about it by default.
 * This helper provides proper typing.
 */
export async function auth(): Promise<ExtendedSession | null> {
  const session = await getServerSession(authOptions);
  return session as ExtendedSession | null;
}

/**
 * Helper to get authenticated user ID or throw
 *
 * Usage:
 * ```ts
 * const userId = await requireAuth();
 * // userId is guaranteed to be a string here
 * ```
 */
export async function requireAuth(): Promise<string> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user.id;
}
