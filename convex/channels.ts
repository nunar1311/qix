import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

export const create = mutation({
    args: {
        workspaceId: v.id("workspaces"),
        name: v.string(),
    },
    handler: async (ctx, { workspaceId, name }) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error(
                "Bạn cần đăng nhập để thực hiện thao tác này",
            );
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_user_id", (q) =>
                q.eq("workspaceId", workspaceId).eq("userId", userId),
            )
            .unique();

        if (!member || member.role !== "admin") {
            throw new Error(
                "Bạn không có quyền thực hiện thao tác này",
            );
        }

        const parsedName = name.replace(/\s+/g, "-").toLowerCase();

        const channelId = await ctx.db.insert("channels", {
            name: parsedName,
            workspaceId: workspaceId,
        });

        return channelId;
    },
});

export const get = query({
    args: {
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, { workspaceId }) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            return [];
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_user_id", (q) =>
                q.eq("workspaceId", workspaceId).eq("userId", userId),
            )
            .unique();

        if (!member) {
            return [];
        }

        const channels = await ctx.db
            .query("channels")
            .withIndex("by_workspace_id", (q) =>
                q.eq("workspaceId", workspaceId),
            )
            .collect();

        return channels;
    },
});

export const getById = query({
    args: {
        id: v.id("channels"),
    },
    handler: async (ctx, { id }) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            return null;
        }

        const channel = await ctx.db.get(id);

        if (!channel) {
            return null;
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_user_id", (q) =>
                q
                    .eq("workspaceId", channel.workspaceId)
                    .eq("userId", userId),
            )
            .unique();

        if (!member) {
            return null;
        }

        return channel;
    },
});

export const update = mutation({
    args: {
        id: v.id("channels"),
        name: v.string(),
    },
    handler: async (ctx, { id, name }) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const channel = await ctx.db.get(id);

        if (!channel) {
            throw new Error("Channel not found");
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_user_id", (q) =>
                q
                    .eq("workspaceId", channel.workspaceId)
                    .eq("userId", userId),
            )
            .unique();

        if (!member || member.role !== "admin") {
            throw new Error("Unauthorized");
        }

        await ctx.db.patch(id, { name: name });

        return id;
    },
});

export const remove = mutation({
    args: {
        id: v.id("channels"),
    },
    handler: async (ctx, { id }) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const channel = await ctx.db.get(id);

        if (!channel) {
            throw new Error("Channel not found");
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_user_id", (q) =>
                q
                    .eq("workspaceId", channel.workspaceId)
                    .eq("userId", userId),
            )
            .unique();

        if (!member || member.role !== "admin") {
            throw new Error("Unauthorized");
        }

        await ctx.db.delete(id);

        return id;
    },
});
