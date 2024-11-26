import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { auth } from "./auth";
import { Doc, Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

const populateUser = (ctx: QueryCtx, userId: Id<"users">) => {
    return ctx.db.get(userId);
};

const populateMember = (ctx: QueryCtx, memberId: Id<"members">) => {
    return ctx.db.get(memberId);
};

const populateReactions = (
    ctx: QueryCtx,
    messageId: Id<"messages">,
) => {
    return ctx.db
        .query("reactions")
        .withIndex("by_message_id", (q) =>
            q.eq("messageId", messageId),
        )
        .collect();
};

const populateThread = async (
    ctx: QueryCtx,
    messageId: Id<"messages">,
) => {
    const messages = await ctx.db
        .query("messages")
        .withIndex("by_parent_message_id", (q) =>
            q.eq("parentMessageId", messageId),
        )
        .collect();

    if (messages.length === 0) {
        return {
            count: 0,
            image: undefined,
            timestamp: 0,
            name: "",
        };
    }

    const lastMessage = messages[messages.length - 1];

    const lastMessageMember = await populateMember(
        ctx,
        lastMessage.memberId,
    );

    if (!lastMessageMember) {
        return {
            count: 0,
            image: undefined,
            timestamp: 0,
            name: "",
        };
    }

    const lastMessageUser = await populateUser(
        ctx,
        lastMessageMember.userId,
    );

    return {
        count: messages.length,
        image: lastMessageUser?.image,
        timestamp: lastMessage._creationTime,
        name: lastMessageUser?.username,
    };
};

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

export const update = mutation({
    args: {
        id: v.id("messages"),
        body: v.string(),
    },
    handler: async (ctx, { id, body }) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error(
                "Bạn cần đăng nhập để thực hiện thao tác này",
            );
        }

        const message = await ctx.db.get(id);
        if (!message) {
            throw new Error("Tin nhắn không tồn tại");
        }

        const member = await getMember(
            ctx,
            message.workspaceId,
            userId,
        );

        if (!member || member._id !== message.memberId) {
            throw new Error(
                "Bạn không có quyền thực hiện thao tác này",
            );
        }

        await ctx.db.patch(id, {
            content: body,
            updatedAt: Date.now(),
        });

        return id;
    },
});

export const remove = mutation({
    args: {
        id: v.id("messages"),
    },
    handler: async (ctx, { id }) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error(
                "Bạn cần đăng nhập để thực hiện thao tác này",
            );
        }

        const message = await ctx.db.get(id);
        if (!message) {
            throw new Error("Tin nhắn không tồn tại");
        }

        const member = await getMember(
            ctx,
            message.workspaceId,
            userId,
        );

        if (!member || member._id !== message.memberId) {
            throw new Error(
                "Bạn không có quyền thực hiện thao tác này",
            );
        }

        await ctx.db.delete(id);

        return id;
    },
});

export const get = query({
    args: {
        channelId: v.optional(v.id("channels")),
        conversationId: v.optional(v.id("conversations")),
        parentMessageId: v.optional(v.id("messages")),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (
        ctx,
        {
            channelId,
            conversationId,
            paginationOpts,
            parentMessageId,
        },
    ) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error(
                "Bạn cần đăng nhập để thực hiện thao tác này",
            );
        }

        let _conversationId = conversationId;
        if (!conversationId && !channelId && parentMessageId) {
            const parentMessage = await ctx.db.get(parentMessageId);
            if (!parentMessage) {
                throw new Error("Tin nhắn không tồn tại");
            }

            _conversationId = parentMessage.conversationId;
        }

        const result = await ctx.db
            .query("messages")
            .withIndex(
                "by_channel_id_parent_message_id_conversation_id",
                (q) =>
                    q
                        .eq("channelId", channelId)
                        .eq("parentMessageId", parentMessageId)
                        .eq("conversationId", _conversationId),
            )
            .order("desc")
            .paginate(paginationOpts);

        return {
            ...result,
            page: await Promise.all(
                result.page
                    .map(async (message) => {
                        const member = await populateMember(
                            ctx,
                            message.memberId,
                        );
                        const user = member
                            ? await populateUser(ctx, member.userId)
                            : null;

                        if (!user || !member) {
                            return null;
                        }
                        const reactions = await populateReactions(
                            ctx,
                            message._id,
                        );
                        const thread = await populateThread(
                            ctx,
                            message._id,
                        );

                        const reactionCounts = reactions.map(
                            (reaction) => {
                                return {
                                    ...reaction,
                                    count: reactions.filter(
                                        (r) =>
                                            r.value ===
                                            reaction.value,
                                    ).length,
                                };
                            },
                        );

                        const dedupeReactions = reactionCounts.reduce(
                            (acc, reaction) => {
                                const existingReaction = acc.find(
                                    (r) => r.value === reaction.value,
                                );

                                if (existingReaction) {
                                    existingReaction.memberIds =
                                        Array.from(
                                            new Set([
                                                ...existingReaction.memberIds,
                                                reaction.memberId,
                                            ]),
                                        );
                                } else {
                                    acc.push({
                                        ...reaction,
                                        memberIds: [
                                            reaction.memberId,
                                        ],
                                    });
                                }

                                return acc;
                            },
                            [] as (Doc<"reactions"> & {
                                count: number;
                                memberIds: Id<"members">[];
                            })[],
                        );

                        const reactionsWithoutMemberIdProperty =
                            dedupeReactions.map(
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                ({ memberId, ...rest }) => rest,
                            );

                        return {
                            ...message,
                            image: message.image
                                ? await ctx.storage.getUrl(
                                      message.image,
                                  )
                                : undefined,
                            member,
                            user,
                            reactions:
                                reactionsWithoutMemberIdProperty,
                            threadCount: thread?.count,
                            threadImage: thread?.image,
                            threadName: thread?.name,
                            threadTimestamp: thread?.timestamp,
                        };
                    })
                    .filter(
                        (
                            message,
                        ): message is NonNullable<typeof message> =>
                            message !== null,
                    ),
            ),
        };
    },
});

export const create = mutation({
    args: {
        content: v.string(),
        image: v.optional(v.id("_storage")),
        workspaceId: v.id("workspaces"),
        channelId: v.optional(v.id("channels")),
        conversationId: v.optional(v.id("conversations")),
        parentMessageId: v.optional(v.id("messages")),
    },
    handler: async (
        ctx,
        {
            workspaceId,
            channelId,
            parentMessageId,
            content,
            conversationId,
            image,
        },
    ) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            throw new Error(
                "Bạn cần đăng nhập để thực hiện thao tác này",
            );
        }

        const member = await getMember(ctx, workspaceId, userId);

        if (!member) {
            throw new Error(
                "Bạn không có quyền thực hiện thao tác này",
            );
        }

        let _conversationId = conversationId;

        if (!conversationId && !channelId && parentMessageId) {
            const parentMessage = await ctx.db.get(parentMessageId);
            if (!parentMessage) {
                throw new Error("Tin nhắn không tồn tại");
            }

            _conversationId = parentMessage.conversationId;
        }

        const messageId = await ctx.db.insert("messages", {
            memberId: member._id,
            workspaceId: workspaceId,
            content: content,
            image: image,
            channelId: channelId,
            conversationId: _conversationId,
            parentMessageId: parentMessageId,
        });

        return messageId;
    },
});

export const getById = query({
    args: {
        id: v.id("messages"),
    },
    handler: async (ctx, { id }) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error(
                "Bạn cần đăng nhập để thực hiện thao tác này",
            );
        }

        const message = await ctx.db.get(id);
        if (!message) {
            return null;
        }

        const currentMember = await getMember(
            ctx,
            message.workspaceId,
            userId,
        );
        if (!currentMember) {
            return null;
        }

        const member = await populateMember(ctx, message.memberId);
        if (!member) {
            return null;
        }

        const user = await populateUser(ctx, member.userId);
        if (!user) {
            return null;
        }

        const reactions = await populateReactions(ctx, id);

        const reactionWithCounts = reactions.map((reaction) => {
            return {
                ...reaction,
                count: reactions.filter(
                    (r) => r.value === reaction.value,
                ).length,
            };
        });

        const dedupeReactions = reactionWithCounts.reduce(
            (acc, reaction) => {
                const existingReaction = acc.find(
                    (r) => r.value === reaction.value,
                );

                if (existingReaction) {
                    existingReaction.memberIds = Array.from(
                        new Set([
                            ...existingReaction.memberIds,
                            reaction.memberId,
                        ]),
                    );
                } else {
                    acc.push({
                        ...reaction,
                        memberIds: [reaction.memberId],
                    });
                }

                return acc;
            },
            [] as (Doc<"reactions"> & {
                count: number;
                memberIds: Id<"members">[];
            })[],
        );

        const reactionsWithoutMemberIdProperty = dedupeReactions.map(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ({ memberId, ...rest }) => rest,
        );

        return {
            ...message,
            image: message.image
                ? await ctx.storage.getUrl(message.image)
                : undefined,
            user,
            member,
            reactions: reactionsWithoutMemberIdProperty,
        };
    },
});