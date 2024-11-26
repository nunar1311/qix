import Quill from "quill";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("./Editor"), { ssr: false });

import { useRef, useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useGetMessage } from "@/hooks/messages/use-get-message";

import { useCurrentMember } from "@/hooks/member/use-current-member";
import { useWorkspaceId } from "@/hooks/workspace/use-workspace-id";

import { useChannelId } from "@/hooks/channel/use-channel-id";
import { useGetMessages } from "@/hooks/messages/use-get-messages";
import { differenceInMinutes, format } from "date-fns";
import { vi } from "date-fns/locale/vi";
import { formatDateLabel } from "./channel/message-list";
import Message from "./channel/message";
import { useCreateMessage } from "@/hooks/messages/use-create-message";
import { useGenerateUploadUrl } from "@/hooks/upload/use-generate-upload-url";
import { useToast } from "@/hooks/use-toast";

interface ThreadProps {
    messageId: Id<"messages">;
    onClose: () => void;
}

type CreateMessageValues = {
    channelId: Id<"channels">;
    workspaceId: Id<"workspaces">;
    parentMessageId: Id<"messages">;
    content: string;
    image: Id<"_storage"> | undefined;
};

const TIME_THRESHOLD = 5;

const Thread = ({ messageId, onClose }: ThreadProps) => {
    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();

    const [editorKey, setEditorKey] = useState(0);
    const [isPending, setIsPending] = useState<boolean>(false);

    const editorRef = useRef<Quill | null>(null);

    const { member } = useCurrentMember({ workspaceId });
    const { message, isLoading: loadingMessage } = useGetMessage({
        id: messageId,
    });

    const { mutate: createMessage } = useCreateMessage();
    const { mutate: generateUploadUrl } = useGenerateUploadUrl();

    const { results, status, loadMore } = useGetMessages({
        channelId,
        parentMessageId: messageId,
    });

    const canLoadMore = status === "CanLoadMore";
    const isLoadingMore = status === "LoadingMore";

    const [editingId, setEditingId] = useState<Id<"messages"> | null>(
        null,
    );

    const { toast } = useToast();

    const handleSubmit = async ({
        body,
        image,
    }: {
        body: string;
        image: File | null;
    }) => {
        try {
            setIsPending(true);
            editorRef?.current?.enable(false);

            const values: CreateMessageValues = {
                channelId,
                workspaceId,
                parentMessageId: messageId,
                content: body,
                image: undefined,
            };

            if (image) {
                const url = await generateUploadUrl(
                    {},
                    {
                        throwError: true,
                    },
                );

                if (!url) {
                    throw new Error("Không thể tạo URL tải lên");
                }

                const result = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": image.type },
                    body: image,
                });

                if (!result.ok) {
                    throw new Error("Không thể tải lên ảnh");
                }

                console.log(result);

                const { storageId } = await result.json();

                values.image = storageId;
            }
            await createMessage(values, { throwError: true });

            setEditorKey((prev) => prev + 1);
        } catch {
            toast({
                title: "Không thể gửi tin nhắn",
                variant: "destructive",
            });
        } finally {
            setIsPending(false);
            editorRef?.current?.enable(true);
        }
    };

    const groupedMessages = results?.reduce(
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
        {} as Record<string, typeof results>,
    );

    if (loadingMessage || status === "LoadingFirstPage") {
        return (
            // <div className="h-full flex flex-col">
            //     <div className="flex items-center justify-between h-12 px-4 border-b ">
            //         <p className="text-lg font-bold">Chủ đề</p>
            //         <Button
            //             onClick={onClose}
            //             variant={"ghost"}
            //             size={"sm"}
            //         >
            //             <X className="size-5" />
            //         </Button>
            //     </div>
            <div className="flex flex-col gap-y-2 items-center justify-center h-full">
                <p>Đang tải...</p>
            </div>
            // </div>
        );
    }

    if (!message) {
        return (
            <div className="h-full flex flex-col">
                <div className="flex items-center justify-between h-12 px-4 border-b ">
                    <p className="text-lg font-bold">Chủ đề</p>
                    <Button
                        onClick={onClose}
                        variant={"ghost"}
                        size={"sm"}
                    >
                        <X className="size-5" />
                    </Button>
                </div>
                <div className="flex flex-col gap-y-2 items-center justify-center h-full">
                    <p>Không tìm thấy tin nhắn</p>
                </div>
            </div>
        );
    }
    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between h-12 px-4 border-b ">
                <p className="text-lg font-bold">Chủ đề</p>
                <Button
                    onClick={onClose}
                    variant={"ghost"}
                    size={"sm"}
                >
                    <X className="size-5" />
                </Button>
            </div>

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
                                const prevMessage =
                                    messages[index - 1];
                                const isCompact =
                                    prevMessage &&
                                    prevMessage.user._id ===
                                        message?.user._id &&
                                    differenceInMinutes(
                                        new Date(
                                            message._creationTime,
                                        ),
                                        new Date(
                                            prevMessage._creationTime,
                                        ),
                                    ) < TIME_THRESHOLD;

                                if (!message) return null;
                                return (
                                    <Message
                                        key={message._id}
                                        hideThreadButton
                                        memberId={message.memberId}
                                        authorAvatar={
                                            message?.user.image
                                        }
                                        authorName={
                                            message?.user.username
                                        }
                                        isAuthor={
                                            message?.memberId ===
                                            member?._id
                                        }
                                        body={message?.content ?? ""}
                                        image={message?.image}
                                        createdAt={
                                            message?._creationTime ??
                                            0
                                        }
                                        updatedAt={message?.updatedAt}
                                        id={message?._id}
                                        reactions={message?.reactions}
                                        isEditing={
                                            editingId === message?._id
                                        }
                                        setEditingId={setEditingId}
                                        isCompact={isCompact ?? false}
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
                <Message
                    image={message.image}
                    hideThreadButton
                    memberId={message?.memberId}
                    authorAvatar={message?.user.image}
                    authorName={message?.user.username}
                    isAuthor={message?.memberId === member?._id}
                    body={message?.content}
                    createdAt={message?._creationTime || 0}
                    updatedAt={message?.updatedAt}
                    id={message?._id}
                    reactions={message?.reactions}
                    isEditing={editingId === message?._id}
                    setEditingId={setEditingId}
                />
            </div>
            <div className="px-4">
                <Editor
                    key={editorKey}
                    onSubmit={handleSubmit}
                    innerRef={editorRef}
                    disabled={isPending}
                    placeholder="Trả lời..."
                />
            </div>
        </div>
    );
};

export default Thread;
