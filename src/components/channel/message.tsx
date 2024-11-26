import dynamic from "next/dynamic";
import { Doc, Id } from "../../../convex/_generated/dataModel";

const Renderer = dynamic(() => import("../Renderer"), {
    ssr: false,
});
const Editor = dynamic(() => import("../Editor"), {
    ssr: false,
});

import { format, isToday, isYesterday } from "date-fns";
import { vi } from "date-fns/locale/vi";

import Hint from "../Hint";
import UserAvatar from "../UserAvatar";
import { cn } from "@/lib/utils";
import ToolbarX from "../toolbar-x";
import { useRemoveMessage } from "@/hooks/messages/use-remove-message";
import useConfirm from "@/hooks/use-confirm";
import { useToggleReaction } from "@/hooks/reaction/use-toggle-reaction";
import Reactions from "../Reactions";
import { usePanel } from "@/hooks/use-panel";
import ThreadBar from "../ThreadBar";
import Thumbnail from "../Thumbnail";
import { useUpdateMessage } from "@/hooks/messages/use-update-message";
import { useToast } from "@/hooks/use-toast";

interface MessageProps {
    id: Id<"messages">;
    memberId: Id<"members">;
    authorName?: string;
    authorAvatar?: string;
    isAuthor: boolean;
    reactions: Array<
        Omit<
            Doc<"reactions">,
            "memberId" & {
                count: number;
                memberIds: Id<"members">[];
            }
        >
    >;
    body: Doc<"messages">["content"];
    image: string | null | undefined;
    createdAt: Doc<"messages">["_creationTime"];
    updatedAt: Doc<"messages">["updatedAt"];
    isEditing: boolean;
    isCompact?: boolean;
    setEditingId: (id: Id<"messages"> | null) => void;
    hideThreadButton?: boolean;
    threadCount?: number;
    threadImage?: string;
    threadTimestamp?: number;
    threadName?: string;
}

const formatFullTime = (date: Date) => {
    return `lúc ${format(new Date(date), "HH:mm EEEE, dd MMMM, yyyy", { locale: vi })}`;
};

const Message = ({
    id,
    memberId,
    authorName = "Member",
    authorAvatar,
    isAuthor,
    reactions,
    body,
    image,
    createdAt,
    updatedAt,
    isEditing,
    isCompact,
    setEditingId,
    hideThreadButton,
    threadCount,
    threadImage,
    threadTimestamp,
    threadName,
}: MessageProps) => {
    const {
        parentMessageId,
        profileMemberId,
        onOpenMessage,
        onOpenProfile,
        onClose,
    } = usePanel();

    const [ConfirmDialog, confirm] = useConfirm(
        "Xoá tin nhắn",
        "Bạn có chắc chắn muốn xoá tin nhắn này?",
    );

    const { toast } = useToast();

    const { mutate: updateMessage } = useUpdateMessage();
    const { mutate: removeMessage, isPending: removingMessage } =
        useRemoveMessage();

    const { mutate: toggleReaction, isPending: togglingReaction } =
        useToggleReaction();

    const handleReaction = (value: string) => {
        toggleReaction({ messageId: id as Id<"messages">, value });
    };

    const isPending = removingMessage || togglingReaction;

    const handleUpdate = async ({ body }: { body: string }) => {
        updateMessage(
            { id, body },
            {
                onSuccess: () => {
                    setEditingId(null);
                },
                onError: () => {
                    toast({
                        title: "Cập nhật tin nhắn thất bại",
                    });
                },
            },
        );
    };

    const handleDelete = async () => {
        const ok = await confirm();
        if (!ok) return;

        removeMessage(
            { id: id as Id<"messages"> },
            {
                onSuccess: () => {
                    if (parentMessageId === id) {
                        onClose();
                    }
                },
            },
        );
    };

    if (isCompact) {
        return (
            <>
                <ConfirmDialog />
                <div
                    className={cn(
                        "flex gap-2 p-0.5 px-5 group relative hover:bg-zinc-100 items-start",
                        {
                            "bg-zinc-200 hover:bg-zinc-200":
                                isEditing,
                        },
                    )}
                >
                    <div className="flex items-center gap-2">
                        <Hint
                            label={formatFullTime(
                                new Date(createdAt),
                            )}
                        >
                            <button className="text-xs text-zinc-900 opacity-0 group-hover:opacity-100 w-10 leading-6 text-center">
                                {format(createdAt, "HH:mm")}
                            </button>
                        </Hint>
                    </div>
                    <div className="flex flex-col w-full items-start gap-x-2">
                        {isEditing ? (
                            <div className="w-full h-full">
                                <Editor
                                    onSubmit={handleUpdate}
                                    disabled={false}
                                    defaultValue={JSON.parse(body)}
                                    onCancel={() =>
                                        setEditingId(null)
                                    }
                                    variant="update"
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 w-full">
                                <Renderer value={body} />
                                <Thumbnail url={image} />
                                {updatedAt ? (
                                    <span className="text-xs text-zinc-600">
                                        (Đã chỉnh sửa)
                                    </span>
                                ) : null}
                            </div>
                        )}

                        <Reactions
                            data={reactions}
                            onChange={handleReaction}
                        />
                        <ThreadBar
                            count={threadCount}
                            image={threadImage}
                            timestamp={threadTimestamp}
                            name={threadName}
                            onClick={() => onOpenMessage(id)}
                        />
                    </div>

                    {!isEditing ? (
                        <ToolbarX
                            isAuthor={isAuthor}
                            handleEdit={() => setEditingId(id)}
                            handleThread={() => onOpenMessage(id)}
                            handleDelete={handleDelete}
                            handleReaction={handleReaction}
                            hideThreadButton={hideThreadButton}
                        />
                    ) : null}
                </div>
            </>
        );
    }

    return (
        <>
            <ConfirmDialog />
            <div
                className={cn(
                    "flex gap-2 p-0.5 px-5 group relative hover:bg-zinc-100 flex-col",
                    {
                        "bg-zinc-200 hover:bg-zinc-200": isEditing,
                    },
                )}
            >
                <div className={"flex items-start gap-4"}>
                    <UserAvatar
                        user={{
                            name: authorName,
                            image: authorAvatar,
                        }}
                        className="size-8 mt-1 cursor-pointer"
                        onClick={() => onOpenProfile(memberId)}
                    />
                    <div className="flex flex-col w-full overflow-hidden">
                        <div className="text-sm">
                            <button
                                onClick={() =>
                                    onOpenProfile(memberId)
                                }
                                className="font-semibold text-zinc-900"
                            >
                                {authorName}
                            </button>
                            <span>&nbsp;&nbsp;</span>
                            <Hint
                                label={formatFullTime(
                                    new Date(createdAt),
                                )}
                            >
                                <button className="text-xs text-zinc-600">
                                    {isToday(createdAt)
                                        ? "Hôm nay"
                                        : isYesterday(createdAt)
                                          ? "Hôm qua"
                                          : format(
                                                createdAt,
                                                "MMM d, yyyy",
                                            )}{" "}
                                    lúc {format(createdAt, "HH:mm")}
                                </button>
                            </Hint>
                        </div>
                        <div className="flex items-center gap-2">
                            {isEditing ? (
                                <div className="w-full h-full">
                                    <Editor
                                        onSubmit={handleUpdate}
                                        disabled={false}
                                        defaultValue={JSON.parse(
                                            body,
                                        )}
                                        onCancel={() =>
                                            setEditingId(null)
                                        }
                                        variant="update"
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Renderer value={body} />
                                    <Thumbnail url={image} />
                                    {updatedAt ? (
                                        <span className="text-xs text-zinc-600">
                                            (Đã chỉnh sửa)
                                        </span>
                                    ) : null}
                                </div>
                            )}
                        </div>
                        <Reactions
                            data={reactions}
                            onChange={handleReaction}
                        />
                        <ThreadBar
                            count={threadCount}
                            image={threadImage}
                            name={threadName}
                            timestamp={threadTimestamp}
                            onClick={() => onOpenMessage(id)}
                        />
                    </div>
                </div>
                {!isEditing ? (
                    <ToolbarX
                        isAuthor={isAuthor}
                        handleEdit={() => setEditingId(id)}
                        handleThread={() => onOpenMessage(id)}
                        handleDelete={handleDelete}
                        handleReaction={handleReaction}
                        hideThreadButton={hideThreadButton}
                    />
                ) : null}
            </div>
        </>
    );
};

export default Message;
