import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

export const currentUser = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            return null;
        }

        return await ctx.db.get(userId);
    },
});

export const updateUser = mutation({
    args: {
        username: v.string(),
    },
    handler: async (ctx, { username }) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            throw new Error(
                "Bạn cần đăng nhập để thực hiện thao tác này",
            );
        }

        await ctx.db.patch(userId, {
            username,
        });

        return userId;
    },
});
