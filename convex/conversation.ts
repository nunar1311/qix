import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { auth } from "./auth";

export const createOrGet = mutation({
    args: {
        workspaceId: v.id("workspaces"),
        memberId: v.id("members"),
    },
    handler: async (ctx, { memberId, workspaceId }) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const currentMember = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_user_id", (q) =>
                q.eq("workspaceId", workspaceId).eq("userId", userId),
            )
            .unique();

        const otherMember = await ctx.db.get(memberId);
        if (!currentMember || !otherMember) {
            throw new Error("Not found");
        }

        const existingConversation = await ctx.db
            .query("conversations")
            .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
            .filter((q) =>
                q.or(
                    q.and(
                        q.eq(q.field("memberAId"), currentMember._id),
                        q.eq(q.field("memberBId"), otherMember._id),
                    ),
                    q.and(
                        q.eq(q.field("memberAId"), otherMember._id),
                        q.eq(q.field("memberBId"), currentMember._id),
                    ),
                ),
            )
            .unique();

        if (existingConversation) {
            return existingConversation._id;
        }

        const conversationId = await ctx.db.insert("conversations", {
            workspaceId: workspaceId,
            memberAId: currentMember._id,
            memberBId: otherMember._id,
        });

        const conversation = await ctx.db.get(conversationId);
        if (!conversation) {
            throw new Error("Not found");
        }

        return conversation._id;
    },
});
