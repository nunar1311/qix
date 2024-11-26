import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

const generateCode = () => {
    const code = Array.from(
        { length: 6 },
        () =>
            "0123456789abcdefghijklmnopqrstuvwxyz"[
                Math.floor(Math.random() * 36)
            ],
    ).join("");

    return code;
};

const joinCode = generateCode();

export const create = mutation({
    args: {
        name: v.string(),
    },
    handler: async (ctx, { name }) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Bạn cần đăng nhập để tạo workspace");
        }

        const workspaceId = await ctx.db.insert("workspaces", {
            name: name,
            joinCode: joinCode,
            userId: userId,
        });

        await ctx.db.insert("members", {
            userId,
            workspaceId,
            role: "admin",
        });

        await ctx.db.insert("channels", {
            name: "all-abc",
            workspaceId,
        });

        return workspaceId;
    },
});

export const join = mutation({
    args: {
        joinCode: v.string(),
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, { joinCode, workspaceId }) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error(
                "Bạn cần đăng nhập để tham gia workspace",
            );
        }

        const workspace = await ctx.db.get(workspaceId);

        if (!workspace) {
            throw new Error("Workspace không tồn tại");
        }

        if (workspace.joinCode !== joinCode.toLowerCase()) {
            throw new Error("Mã tham gia không tồ tại");
        }

        const existingMember = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_user_id", (q) =>
                q.eq("workspaceId", workspaceId).eq("userId", userId),
            )
            .unique();

        if (existingMember) {
            throw new Error("Bạn đã tham gia workspace này");
        }

        await ctx.db.insert("members", {
            userId,
            workspaceId: workspace._id,
            role: "member",
        });

        return workspace._id;
    },
});

export const newJoinCode = mutation({
    args: {
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, { workspaceId }) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Đã có lỗi xảy ra, vui lòng thử lại sau");
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_user_id", (q) =>
                q.eq("workspaceId", workspaceId).eq("userId", userId),
            )
            .unique();

        if (!member || member.role !== "admin") {
            throw new Error("Đã có lỗi xảy ra, vui lòng thử lại sau");
        }

        await ctx.db.patch(workspaceId, { joinCode: generateCode() });

        return workspaceId;
    },
});

export const get = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            return [];
        }

        const members = await ctx.db
            .query("members")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .collect();

        const workspaceIds = members.map(
            (member) => member.workspaceId,
        );

        const workspaces = [];

        for (const workspaceId of workspaceIds) {
            const workspace = await ctx.db.get(workspaceId);
            if (workspace) {
                workspaces.push(workspace);
            }
        }

        return workspaces;
    },
});

export const getById = query({
    args: {
        id: v.id("workspaces"),
    },
    handler: async (ctx, { id }) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Bạn cần đăng nhập để làm việc này");
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_user_id", (q) =>
                q.eq("workspaceId", id).eq("userId", userId),
            )
            .unique();

        if (!member) {
            return null;
        }

        return await ctx.db.get(id);
    },
});

export const getInfoById = query({
    args: { id: v.id("workspaces") },
    handler: async (ctx, { id }) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            return null;
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_user_id", (q) =>
                q.eq("workspaceId", id).eq("userId", userId),
            )
            .unique();

        const workspace = await ctx.db.get(id);

        return {
            name: workspace?.name,
            isMember: !!member,
        };
    },
});

export const update = mutation({
    args: {
        id: v.id("workspaces"),
        name: v.string(),
    },
    handler: async (ctx, { id, name }) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Bạn cần đăng nhập để làm việc này");
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_user_id", (q) =>
                q.eq("workspaceId", id).eq("userId", userId),
            )
            .unique();

        if (!member || member.role !== "admin") {
            throw new Error("Bạn cần là admin để sửa workspace");
        }

        await ctx.db.patch(id, { name: name });

        return id;
    },
});

export const remove = mutation({
    args: {
        id: v.id("workspaces"),
    },
    handler: async (ctx, { id }) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Bạn cần đăng nhập để làm việc này");
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_user_id", (q) =>
                q.eq("workspaceId", id).eq("userId", userId),
            )
            .unique();

        if (!member || member.role !== "admin") {
            throw new Error("Bạn cần là admin để sửa workspace");
        }

        const [
            members,
            channels,
            conversations,
            messages,
            reactions,
        ] = await Promise.all([
            ctx.db
                .query("members")
                .withIndex("by_workspace_id", (q) =>
                    q.eq("workspaceId", id),
                )
                .collect(),
            ctx.db
                .query("channels")
                .withIndex("by_workspace_id", (q) =>
                    q.eq("workspaceId", id),
                )
                .collect(),
            ctx.db
                .query("conversations")
                .withIndex("by_workspace_id", (q) =>
                    q.eq("workspaceId", id),
                )
                .collect(),
            ctx.db
                .query("messages")
                .withIndex("by_workspace_id", (q) =>
                    q.eq("workspaceId", id),
                )
                .collect(),

            ctx.db
                .query("reactions")
                .withIndex("by_workspace_id", (q) =>
                    q.eq("workspaceId", id),
                )
                .collect(),
        ]);

        for (const member of members) {
            await ctx.db.delete(member._id);
        }

        for (const channel of channels) {
            await ctx.db.delete(channel._id);
        }

        for (const conversation of conversations) {
            await ctx.db.delete(conversation._id);
        }

        for (const message of messages) {
            await ctx.db.delete(message._id);
        }

        for (const reaction of reactions) {
            await ctx.db.delete(reaction._id);
        }

        await ctx.db.delete(id);

        return id;
    },
});
