import {
    differenceInMinutes,
    format,
    isToday,
    isYesterday,
} from "date-fns";
import { vi } from "date-fns/locale/vi";

import { GetMessageReturnType } from "@/hooks/messages/use-get-messages";
import Message from "./message";
import ChannelHero from "./channel-hero";
import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { useWorkspaceId } from "@/hooks/workspace/use-workspace-id";
import { useCurrentMember } from "@/hooks/member/use-current-member";
import ConversationHero from "../conversation/conversation-hero";

const TIME_THRESHOLD = 5;

interface MessageListProps {
    memberName?: string;
    memberUsername?: string;
    memberAvatar?: string;
    channelName?: string;
    channelCreationTime?: number;
    data: GetMessageReturnType | undefined;
    loadMore: () => void;
    isLoadingMore: boolean;
    canLoadMore: boolean;
    variant?: "channel" | "conversation" | "thread";
}

export const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return "Hôm nay";
    if (isYesterday(date)) return "Hôm qua";
    return format(date, "EEEE, dd MMMM", { locale: vi });
};

const MessageList = ({
    memberName,
    memberUsername,
    memberAvatar,
    channelName,
    channelCreationTime,
    data,
    loadMore,
    isLoadingMore,
    canLoadMore,
    variant = "channel",
}: MessageListProps) => {
    const [editingId, setEditingId] = useState<Id<"messages"> | null>(
        null,
    );

    const workspaceId = useWorkspaceId();

    const { member: currentMember } = useCurrentMember({
        workspaceId,
    });

    const groupedMessages = data?.reduce(
        (groups, message) => {
            if (message) {
                const date = new Date(message._creationTime);
                const dateKey = format(date, "yyyy-MM-dd", {
                    locale: vi,
                });
                if (!groups[dateKey]) {
                    groups[dateKey] = [];
                }
                groups[dateKey].unshift(message);
            }

            return groups;
        },
        {} as Record<string, typeof data>,
    );
    return (
        <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar transition-all antialiased">
            {Object.entries(groupedMessages || {}).map(
                ([dateKey, messages]) => (
                    <div key={dateKey}>
                        <div className="text-center my-2 relative  ">
                            <hr className="absolute top-1/2 left-0 right-0 border-t" />
                            <span className="relative inline-block px-4 py-1 text-xs rounded-full bg-zinc-50 border">
                                {formatDateLabel(dateKey)}
                            </span>
                        </div>
                        {messages.map((message, index) => {
                            const prevMessage = messages[index - 1];
                            const isCompact =
                                prevMessage &&
                                prevMessage.user._id ===
                                    message?.user._id &&
                                differenceInMinutes(
                                    new Date(message._creationTime),
                                    new Date(
                                        prevMessage._creationTime,
                                    ),
                                ) < TIME_THRESHOLD;
                            return (
                                <Message
                                    key={message?._id}
                                    id={message?._id}
                                    memberId={message?.memberId}
                                    authorName={
                                        message?.user.username
                                    }
                                    authorAvatar={message?.user.image}
                                    isAuthor={
                                        message?.memberId ===
                                        currentMember?._id
                                    }
                                    reactions={message?.reactions}
                                    body={message?.content ?? ""}
                                    image={message?.image}
                                    updatedAt={message?.updatedAt}
                                    createdAt={
                                        message?._creationTime ?? 0
                                    }
                                    isEditing={
                                        editingId === message?._id
                                    }
                                    setEditingId={setEditingId}
                                    isCompact={isCompact ?? false}
                                    hideThreadButton={
                                        variant === "thread"
                                    }
                                    threadCount={message?.threadCount}
                                    threadImage={message?.threadImage}
                                    threadTimestamp={
                                        message?.threadTimestamp
                                    }
                                    threadName={message?.threadName}
                                />
                            );
                        })}
                    </div>
                ),
            )}
            <div
                className="h-1"
                ref={(el) => {
                    if (el) {
                        const observer = new IntersectionObserver(
                            ([entry]) => {
                                if (
                                    entry.isIntersecting &&
                                    canLoadMore
                                ) {
                                    loadMore();
                                }
                            },
                            {
                                threshold: 1.0,
                            },
                        );
                        observer.observe(el);

                        return () => {
                            observer.disconnect();
                        };
                    }
                }}
            />
            {isLoadingMore && (
                <div className="text-center my-2 relative  ">
                    <hr className="absolute top-1/2 left-0 right-0 border-t" />
                    <span className="relative inline-block px-4 py-1 text-xs rounded-full bg-zinc-50 border">
                        <span className="flex items-center gap-1">
                            <span className="animate-flashing w-1 h-1 bg-zinc-500 rounded-full inline-block" />
                            <span className="animate-flashing delay-100 w-1 h-1 bg-zinc-500 rounded-full inline-block" />
                            <span className="animate-flashing delay-200 w-1 h-1 bg-zinc-500 rounded-full inline-block" />
                        </span>
                    </span>
                </div>
            )}
            {variant === "channel" &&
                channelName &&
                channelCreationTime && (
                    <ChannelHero
                        name={channelName}
                        creationTime={channelCreationTime}
                    />
                )}
            {variant === "conversation" &&
                memberName &&
                memberAvatar &&
                memberUsername && (
                    <ConversationHero
                        name={memberName}
                        image={memberAvatar}
                        username={memberUsername}
                    />
                )}
        </div>
    );
};

export default MessageList;
