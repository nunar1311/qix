"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Copy, RefreshCcw, Trash } from "lucide-react";
import { useRemoveWorkspace } from "@/hooks/workspace/use-remove-workspace";
import { useWorkspaceId } from "@/hooks/workspace/use-workspace-id";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "../ui/separator";
import useConfirm from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { useNewJoinCode } from "@/hooks/workspace/use-new-join-code";

interface SettingsModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    name: string;
    joinCode: string;
}

const InviteModal = ({
    open,
    setOpen,
    name,
    joinCode,
}: SettingsModalProps) => {
    const workspaceId = useWorkspaceId();

    const { toast } = useToast();

    const { mutate: newJoinCode, isPending: isLoadNewJoinCode } =
        useNewJoinCode();

    const handleCopyCode = () => {
        navigator.clipboard.writeText(joinCode).then(() => {
            toast({
                title: "Sao chép mã mời thành công",
                variant: "default",
            });
        });
    };

    const handleCopyLink = () => {
        const invite = `${window.location.origin}/join/${workspaceId}`;

        navigator.clipboard.writeText(invite).then(() => {
            toast({
                title: "Sao chép mã mời thành công",
                variant: "default",
            });
        });
    };

    const handleNewJoinCode = () => {
        newJoinCode(
            { workspaceId },
            {
                onSuccess: () => {
                    toast({
                        title: "Tạo mã mới thành công",
                        variant: "default",
                    });
                },
                onError: () => {
                    toast({
                        title: "Có lỗi xảy ra",
                        variant: "destructive",
                    });
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className={cn(
                    "p-0 bg-zinc-50 overflow-hidden w-[500px] items-start",
                )}
            >
                <DialogHeader className="p-4 border-b">
                    <DialogTitle>
                        Mời mọi người đến {name}
                    </DialogTitle>
                    <DialogDescription>
                        Sử dụng mã bên dưới để mời mọi người
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-y-4 items-center justify-center py-7">
                    <div className="flex items-center gap-x-2">
                        <p className="text-4xl font-bold tracking-widest uppercase">
                            {joinCode}
                        </p>
                        <Button
                            variant={"ghost"}
                            onClick={handleCopyCode}
                        >
                            <Copy className="size-5" />
                        </Button>
                    </div>
                    <Button
                        onClick={handleCopyLink}
                        variant={"ghost"}
                        disabled={isLoadNewJoinCode}
                    >
                        Sao chép link <Copy className="size-5" />
                    </Button>
                </div>
                <DialogFooter className="p-4">
                    <Button
                        onClick={() => setOpen(false)}
                        disabled={isLoadNewJoinCode}
                        variant={"link"}
                    >
                        Đóng
                    </Button>
                    <Button
                        onClick={handleNewJoinCode}
                        disabled={isLoadNewJoinCode}
                        className="w-40"
                    >
                        Tạo mã mới
                        <RefreshCcw
                            className={cn(
                                "size-5",
                                isLoadNewJoinCode && "animate-spin",
                            )}
                        />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default InviteModal;
