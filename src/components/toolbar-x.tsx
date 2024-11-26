import { CornerUpRight, Pencil, Smile, Trash } from "lucide-react";
import { Button } from "./ui/button";
import Hint from "./Hint";
import EmojiPicker from "./emoji-picker";

interface ToolbarXProps {
    isAuthor: boolean;
    handleEdit: () => void;
    handleThread: () => void;
    handleDelete: () => void;
    handleReaction: (value: string) => void;
    hideThreadButton?: boolean;
}

const ToolbarX = ({
    isAuthor,
    handleDelete,
    handleEdit,
    handleReaction,
    handleThread,
    hideThreadButton,
}: ToolbarXProps) => {
    return (
        <div className="absolute -top-4 right-5">
            <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-zinc-50 rounded-md shadow-md">
                <EmojiPicker
                    onEmojiSelect={(emoji) =>
                        handleReaction(emoji.native)
                    }
                >
                    <Button
                        disabled={false}
                        size={"sm"}
                        variant={"ghost"}
                    >
                        <Smile className="size-5" />
                    </Button>
                </EmojiPicker>
                {!hideThreadButton && (
                    <Hint label="Trả lời tin nhắn">
                        <Button
                            variant={"ghost"}
                            size={"sm"}
                            onClick={handleThread}
                        >
                            <CornerUpRight className="size-5" />
                        </Button>
                    </Hint>
                )}
                {isAuthor && (
                    <Hint label="Chỉnh sửa">
                        <Button
                            variant={"ghost"}
                            size={"sm"}
                            onClick={handleEdit}
                        >
                            <Pencil className="size-5" />
                        </Button>
                    </Hint>
                )}
                {isAuthor && (
                    <Hint label="Xoá tin nhắn">
                        <Button
                            variant={"ghost"}
                            size={"sm"}
                            onClick={handleDelete}
                        >
                            <Trash className="size-5 text-red-500" />
                        </Button>
                    </Hint>
                )}
            </div>
        </div>
    );
};

export default ToolbarX;
