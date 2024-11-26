"use client";

import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { useCreateMessage } from "@/hooks/messages/use-create-message";
import { useWorkspaceId } from "@/hooks/workspace/use-workspace-id";
import { useGenerateUploadUrl } from "@/hooks/upload/use-generate-upload-url";
import { useToast } from "@/hooks/use-toast";

const Editor = dynamic(() => import("../Editor"), { ssr: false });

interface ChatInputProps {
    placeholder?: string;
    conversationId: Id<"conversations">;
}

type CreateMessageValues = {
    conversationId: Id<"conversations">;
    workspaceId: Id<"workspaces">;
    content: string;
    image: Id<"_storage"> | undefined;
};

const ChatInput = ({
    placeholder,
    conversationId,
}: ChatInputProps) => {
    const workspaceId = useWorkspaceId();
    const { toast } = useToast();

    const [editorKey, setEditorKey] = useState(0);
    const [isPending, setIsPending] = useState<boolean>(false);

    const editorRef = useRef<Quill | null>(null);

    const { mutate: createMessage } = useCreateMessage();
    const { mutate: generateUploadUrl } = useGenerateUploadUrl();

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
                conversationId,
                workspaceId,
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

    return (
        <div className="px-4 w-full">
            <Editor
                key={editorKey}
                placeholder={placeholder}
                onSubmit={handleSubmit}
                disabled={isPending}
                innerRef={editorRef}
            />
        </div>
    );
};

export default ChatInput;
