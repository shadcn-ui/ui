import { PgDatabase } from "drizzle-orm/pg-core"
import { Adapter, AdapterUser } from "next-auth/adapters"
import { accounts, sessions, users, verificationTokens } from "./schema"
import { and, eq } from "drizzle-orm"
import { Awaitable } from "next-auth"

type CustomAdapter = Omit<Adapter, "createUser"> & {
    createUser: (user: Omit<AdapterUser & { username: string }, "id">) => Awaitable<AdapterUser & { username: string }>
}


export function CustomPgDrizzleAdapter(client: InstanceType<typeof PgDatabase>): CustomAdapter {

    return {
        async createUser(data) {
            return await client
                .insert(users)
                .values({ ...data, id: crypto.randomUUID(), username: data.username })
                .returning()
                .then((res) => res[0] ?? null)
        },
        async getUser(data) {
            return await client
                .select()
                .from(users)
                .where(eq(users.id, data))
                .then((res) => res[0] ?? null)
        },
        async getUserByEmail(data) {
            return await client
                .select()
                .from(users)
                .where(eq(users.email, data))
                .then((res) => res[0] ?? null)
        },
        async createSession(data) {
            return await client
                .insert(sessions)
                .values(data)
                .returning()
                .then((res) => res[0])
        },
        async getSessionAndUser(data) {
            return await client
                .select({
                    session: sessions,
                    user: users,
                })
                .from(sessions)
                .where(eq(sessions.sessionToken, data))
                .innerJoin(users, eq(users.id, sessions.userId))
                .then((res) => res[0] ?? null)
        },
        async updateUser(data) {
            if (!data.id) {
                throw new Error("No user id.")
            }

            return await client
                .update(users)
                .set(data)
                .where(eq(users.id, data.id))
                .returning()
                .then((res) => res[0])
        },
        async updateSession(data) {
            return await client
                .update(sessions)
                .set(data)
                .where(eq(sessions.sessionToken, data.sessionToken))
                .returning()
                .then((res) => res[0])
        },
        async linkAccount(rawAccount) {
            const updatedAccount = await client
                .insert(accounts)
                .values(rawAccount)
                .returning()
                .then((res) => res[0])

            // Drizzle will return `null` for fields that are not defined.
            // However, the return type is expecting `undefined`.
            const account = {
                ...updatedAccount,
                access_token: updatedAccount.access_token ?? undefined,
                token_type: updatedAccount.token_type ?? undefined,
                id_token: updatedAccount.id_token ?? undefined,
                refresh_token: updatedAccount.refresh_token ?? undefined,
                scope: updatedAccount.scope ?? undefined,
                expires_at: updatedAccount.expires_at ?? undefined,
                session_state: updatedAccount.session_state ?? undefined,
            }

            return account
        },
        async getUserByAccount(account) {
            const dbAccount =
                (await client
                    .select()
                    .from(accounts)
                    .where(
                        and(
                            eq(accounts.providerAccountId, account.providerAccountId),
                            eq(accounts.provider, account.provider)
                        )
                    )
                    .leftJoin(users, eq(accounts.userId, users.id))
                    .then((res) => res[0])) ?? null

            if (!dbAccount) {
                return null
            }

            return dbAccount.user
        },
        async deleteSession(sessionToken) {
            const session = await client
                .delete(sessions)
                .where(eq(sessions.sessionToken, sessionToken))
                .returning()
                .then((res) => res[0] ?? null)

            return session
        },
        async createVerificationToken(token) {
            return await client
                .insert(verificationTokens)
                .values(token)
                .returning()
                .then((res) => res[0])
        },
        async useVerificationToken(token) {
            try {
                return await client
                    .delete(verificationTokens)
                    .where(
                        and(
                            eq(verificationTokens.identifier, token.identifier),
                            eq(verificationTokens.token, token.token)
                        )
                    )
                    .returning()
                    .then((res) => res[0] ?? null)
            } catch (err) {
                throw new Error("No verification token found.")
            }
        },
        async deleteUser(id) {
            await client
                .delete(users)
                .where(eq(users.id, id))
                .returning()
                .then((res) => res[0] ?? null)
        },
        async unlinkAccount(account) {
            const { type, provider, providerAccountId, userId } = await client
                .delete(accounts)
                .where(
                    and(
                        eq(accounts.providerAccountId, account.providerAccountId),
                        eq(accounts.provider, account.provider)
                    )
                )
                .returning()
                .then((res) => res[0] ?? null)

            return { provider, type, providerAccountId, userId }
        },
    }
}
