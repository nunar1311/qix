import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import UserNameForm from "../UserNameForm";
import { useRemoveWorkspace } from "@/hooks/workspace/use-remove-workspace";
import { useWorkspaceId } from "@/hooks/workspace/use-workspace-id";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "../ui/separator";
import useConfirm from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";

interface SettingsModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialValue: string;
}

const SettingsModal = ({
    open,
    setOpen,
    initialValue,
}: SettingsModalProps) => {
    const workspaceId = useWorkspaceId();
    const [value, setValue] = useState(initialValue);
    const [ConfirmDialog, confirm] = useConfirm(
        "Xoá Workspace",
        "Bạn có chắc chắn muốn xoá Workspace này không?",
    );

    const { toast } = useToast();
    const router = useRouter();

    const {
        mutate: removeWorkspace,
        isPending: isUpdatingWorkspace,
    } = useRemoveWorkspace();

    const handleRemove = async () => {
        const ok = await confirm();

        if (!ok) {
            return;
        }
        removeWorkspace(
            { id: workspaceId },
            {
                onSuccess() {
                    toast({
                        title: "Xoá Workspace thành công",
                        variant: "default",
                    });
                    router.replace("/");
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
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent
                    className={cn(
                        "p-0 bg-zinc-50 overflow-hidden w-[800px] items-start",
                    )}
                >
                    <DialogHeader className="p-4 border-b">
                        <DialogTitle>Cài đặt</DialogTitle>
                    </DialogHeader>
                    <Tabs
                        defaultValue="workspace"
                        className="w-full flex items-start px-4 pb-4 justify-start gap-x-4 h-[500px]"
                    >
                        <TabsList className="flex flex-col">
                            <TabsTrigger
                                value={"workspace"}
                                className=" w-64 py-2"
                            >
                                Workspace
                            </TabsTrigger>
                            <TabsTrigger
                                value={"sound&video"}
                                className=" w-64 py-2"
                            >
                                Âm thanh và video
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="workspace">
                            <div className="flex flex-col justify-between gap-y-4">
                                <UserNameForm value={value} />

                                <Separator />

                                <Button
                                    onClick={handleRemove}
                                    isLoading={isUpdatingWorkspace}
                                    disabled={isUpdatingWorkspace}
                                    className="bg-transparent hover:bg-zinc-200 text-red-500 border border-red-500 justify-start"
                                >
                                    <Trash className="size-5" />
                                    <p className="text-xs font-semibold">
                                        Xoá Workspace
                                    </p>
                                </Button>
                            </div>
                        </TabsContent>
                        <TabsContent value="sound&video">
                            <div>455</div>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default SettingsModal;
