"use client";

import { Hash, Trash } from "lucide-react";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import ChannelNameForm from "./channel-name-form";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { Separator } from "../ui/separator";
import { useRemoveChannel } from "@/hooks/channel/use-remove-channel";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import useConfirm from "@/hooks/use-confirm";

interface HeaderProps {
    initialValue?: Doc<"channels">;
}

const Header = ({ initialValue }: HeaderProps) => {
    const { mutate: removeChannel, isPending: loadChannel } =
        useRemoveChannel();

    const { toast } = useToast();
    const router = useRouter();

    const [ConfirmDialog, confirm] = useConfirm(
        "Xoá kênh",
        "Bạn có chắc chắn muốn xoá kênh này không?",
    );

    const handleRemove = async () => {
        const ok = await confirm();

        if (!ok) {
            return;
        }
        removeChannel(
            { id: initialValue?._id as Id<"channels"> },
            {
                onSuccess() {
                    toast({
                        title: "Xoá kênh thành công",
                        variant: "default",
                    });
                    router.replace(
                        `/workspace/${initialValue?.workspaceId}`,
                    );
                },
                onError(error) {
                    toast({
                        title: "Xoá Workspace thất bại",
                        description: error.message,
                    });
                },
            },
        );
    };
    return (
        <>
            <ConfirmDialog />
            <div className="bg-white border-b h-12 flex items-center overflow-hidden px-4">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            size={"sm"}
                            className="bg-transparent text-zinc-900 hover:bg-zinc-100"
                        >
                            <span className="flex items-center gap-x-2 text-lg font-semibold">
                                <Hash className="size-5" />
                                <span>{initialValue?.name}</span>
                            </span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[500px] p-0">
                        <DialogHeader className="p-4 border-b">
                            <DialogTitle className="flex items-center gap-x-2 text-lg font-semibold">
                                <Hash className="size-5" />
                                {initialValue?.name}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="px-4 pb-4 flex flex-col gap-y-2">
                            <div className="flex flex-col justify-between gap-y-4">
                                <ChannelNameForm
                                    value={initialValue?.name || ""}
                                />

                                <Separator />

                                <Button
                                    onClick={handleRemove}
                                    isLoading={loadChannel}
                                    disabled={loadChannel}
                                    className="bg-transparent hover:bg-zinc-200 text-red-500 border  justify-start"
                                >
                                    <Trash className="size-5" />
                                    <p className="text-xs font-semibold">
                                        Xoá kênh
                                    </p>
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
};

export default Header;
