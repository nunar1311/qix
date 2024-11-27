import { Hash, Trash, X } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "../ui/button";
import { useGetChannel } from "@/hooks/channel/use-get-channel";
import ChannelNameForm from "./channel-name-form";
import { Separator } from "../ui/separator";
import { format } from "date-fns";
import { vi } from "date-fns/locale/vi";
import { Input } from "../ui/input";
import { useCurrentMember } from "@/hooks/member/use-current-member";
import { useWorkspaceId } from "@/hooks/workspace/use-workspace-id";
import { Label } from "../ui/label";
import { Icons } from "../Icons";
import { useRemoveChannel } from "@/hooks/channel/use-remove-channel";
import { useToast } from "@/hooks/use-toast";
import useConfirm from "@/hooks/use-confirm";

interface ManagerChannelProps {
    channelId: Id<"channels">;
    onClose: () => void;
}

const ManagerChannel = ({
    channelId,
    onClose,
}: ManagerChannelProps) => {
    const workspaceId = useWorkspaceId();

    const [RemoveDialog, confirm] = useConfirm(
        "Xoá kênh",
        "Bạn có chắc chắn muốn xoá kênh này không?",
    );
    const { toast } = useToast();

    const { channel, isLoading } = useGetChannel({ id: channelId });
    const { member, isLoading: loadCurrentMember } = useCurrentMember(
        { workspaceId },
    );

    const { mutate: removeChannel, isPending: removingChannel } =
        useRemoveChannel();

    const handleRemove = async () => {
        const ok = await confirm();
        if (!ok) return;
        removeChannel(
            { id: channelId },
            {
                onSuccess: () => {
                    onClose();
                    toast({
                        title: "Kênh đã được xoá",
                        variant: "default",
                    });
                },
            },
        );
    };

    if (isLoading || loadCurrentMember) {
        return (
            <div className="flex items-center justify-center h-screen ">
                <Icons.load className="size-20 fill-zinc-500" />
            </div>
        );
    }

    return (
        <>
            <RemoveDialog />
            <div className="h-full flex flex-col">
                <div className="flex items-center justify-between h-12 px-4 border-b ">
                    <p className="text-lg font-bold flex items-center gap-1">
                        Quản lý kênh
                    </p>
                    <Button
                        onClick={onClose}
                        variant={"ghost"}
                        size={"sm"}
                    >
                        <X className="size-5" />
                    </Button>
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 p-4 text-xl font-semibold">
                        <Hash className="size-5" /> {channel?.name}
                    </div>
                    {channel && channel._creationTime && (
                        <div className="px-4 pb-4 flex flex-col gap-y-2">
                            <div className="flex flex-col justify-between gap-y-4">
                                {member?.role === "admin" ? (
                                    <ChannelNameForm
                                        value={channel?.name}
                                    />
                                ) : (
                                    <>
                                        <Label className="font-semibold">
                                            Tên kênh
                                        </Label>
                                        <Input
                                            readOnly
                                            value={channel?.name}
                                            className="focus-visible:ring-0"
                                        />
                                    </>
                                )}

                                <Separator />

                                <div className="flex flex-col gap-2">
                                    <p className="text-sm font-semibold">
                                        Ngày tạo
                                    </p>

                                    <Input
                                        readOnly
                                        value={format(
                                            new Date(
                                                channel._creationTime,
                                            ),
                                            "dd MMMM, yyyy",
                                            {
                                                locale: vi,
                                            },
                                        )}
                                        className="focus-visible:ring-0"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col p-4 gap-4">
                        {member?.role === "admin" ? (
                            <Button
                                onClick={handleRemove}
                                isLoading={removingChannel}
                                disabled={removingChannel}
                                className="bg-transparent hover:bg-zinc-200 text-red-500 border  justify-start"
                            >
                                <Trash className="size-5" />
                                <p className="text-xs font-semibold">
                                    Xoá kênh
                                </p>
                            </Button>
                        ) : null}
                        <div className="text-xs text-zinc-500">
                            Channel ID: {channelId}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManagerChannel;
