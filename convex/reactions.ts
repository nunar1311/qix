import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, QueryCtx } from "./_generated/server";
import { auth } from "./auth";

const getMember = async (
    ctx: QueryCtx,
    workspaceId: Id<"workspaces">,
    userId: Id<"users">,
) => {
    return ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) =>
            q.eq("workspaceId", workspaceId).eq("userId", userId),
        )
        .unique();
};

const populateUser = (ctx: QueryCtx, id: Id<"users">) => {
    return ctx.db.get(id);
};

export const toggle = mutation({
    args: {
        messageId: v.id("messages"),
        value: v.string(),
    },
    handler: async (ctx, { messageId, value }) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const message = await ctx.db.get(messageId);
        if (!message) {
            throw new Error("Message not found");
        }

        const member = await getMember(
            ctx,
            message.workspaceId,
            userId,
        );
        if (!member) {
            throw new Error("Unauthorized");
        }

        // const user = await populateUser(ctx, member.userId);
        // if (!user) {
        //     return null;
        // }

        const existingMessageReactionFromUser = await ctx.db
            .query("reactions")
            .filter((q) =>
                q.and(
                    q.eq(q.field("messageId"), messageId),
                    q.eq(q.field("memberId"), member._id),
                    q.eq(q.field("value"), value),
                ),
            )
            .first();

        if (existingMessageReactionFromUser) {
            await ctx.db.delete(existingMessageReactionFromUser._id);

            return existingMessageReactionFromUser._id;
        } else {
            const newReactionId = await ctx.db.insert("reactions", {
                value: value,
                messageId: messageId,
                memberId: member._id,
                workspaceId: message.workspaceId,
            });

            return newReactionId;
        }
    },
});
