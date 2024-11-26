import { useCurrentMember } from "@/hooks/member/use-current-member";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { useWorkspaceId } from "@/hooks/workspace/use-workspace-id";
import { cn } from "@/lib/utils";
import Hint from "./Hint";
import EmojiPicker from "./emoji-picker";
import { Button } from "./ui/button";
import { Smile } from "lucide-react";
import { useGetMember } from "@/hooks/member/use-get-member";

interface ReactionsProps {
    data?: Array<
        Omit<Doc<"reactions">, "memberId"> & {
            count: number;
            memberIds: Id<"members">[];
        }
    >;
    onChange: (value: string) => void;
}
const Reactions = ({ data, onChange }: ReactionsProps) => {
    const workspaceId = useWorkspaceId();
    const { member } = useCurrentMember({ workspaceId });

    if (data?.length === 0 || !member) {
        return null;
    }
    return (
        <div className="flex items-center gap-1 my-1">
            {data?.map((reaction) => {
                // const { member: userMember } = useGetMember({
                //     id: reaction.memberIds?.[0],
                // });
                return (
                    <Hint
                        key={reaction._id}
                        label={`${reaction.value} đã được tương tác bởi: ${reaction.count === 1 ? "person" : "people"} `}
                    >
                        <button
                            onClick={() => onChange(reaction.value)}
                            className={cn(
                                "flex items-center gap-1 rounded-md h-6 p-1 bg-zinc-200 border border-transparent text-zinc-900 gap-x-1",
                                reaction.memberIds.includes(
                                    member._id,
                                ) &&
                                    "bg-blue-50 border-blue-500 text-blue-500",
                            )}
                        >
                            {reaction.value}
                            <span
                                className={cn(
                                    "text-xs font-semibold text-zinc-600",
                                    reaction.memberIds.includes(
                                        member._id,
                                    ) && "text-blue-500",
                                )}
                            >
                                {reaction.count}
                            </span>
                        </button>
                    </Hint>
                );
            })}
            <EmojiPicker
                onEmojiSelect={(emoji) => onChange(emoji.native)}
            >
                <Button
                    size={"sm"}
                    variant={"ghost"}
                    className="bg-zinc-200 h-6 hover:bg-zinc-300"
                >
                    <Smile className="size-5" />
                </Button>
            </EmojiPicker>
        </div>
    );
};

export default Reactions;
