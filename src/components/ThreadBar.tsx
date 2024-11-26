import { ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import UserAvatar from "./UserAvatar";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale/vi";

interface ThreadBarProps {
    count?: number;
    image?: string;
    timestamp?: number;
    name?: string;
    onClick?: () => void;
}

const ThreadBar = ({
    count,
    image,
    timestamp,
    name = "Member",
    onClick,
}: ThreadBarProps) => {
    if (!count || !timestamp) return null;

    return (
        <Button
            variant={"ghost"}
            onClick={onClick}
            className="group/thread-bar p-1 bg-transparent hover:bg-zinc-50 hover:border items-center justify-between min-w-40 w-96 mb-1"
        >
            <div className="flex items-center gap-2">
                <UserAvatar
                    user={{ image: image, name: name }}
                    className="size-7"
                />
                <p className="text-blue-500 font-semibold text-xs">
                    {count} trả lời
                </p>
                <p className="text-zinc-600 text-xs group-hover/thread-bar:hidden">
                    {formatDistanceToNow(timestamp, {
                        addSuffix: true,
                        locale: vi,
                    })}
                </p>
                <span className="text-zinc-600 text-xs hidden group-hover/thread-bar:inline-block">
                    Xem chủ đề
                </span>
            </div>
            <ChevronRight className="size-5 text-zinc-500 opacity-0 group-hover/thread-bar:opacity-100 shrink-0" />
        </Button>
    );
};

export default ThreadBar;
