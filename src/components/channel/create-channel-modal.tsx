"use client";
import { useCreateChannelModal } from "@/store/use-create-channel-modal";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCreateChannel } from "@/hooks/channel/use-create-channel";
import { useWorkspaceId } from "@/hooks/workspace/use-workspace-id";

const formSchema = z.object({
    name: z
        .string()
        .min(3, "Tên không gian làm việc tối thiểu 3 ký tự"),
});

const CreateChannelModal = () => {
    const router = useRouter();
    const { toast } = useToast();

    const [open, setOpen] = useCreateChannelModal();
    const { mutate, isPending } = useCreateChannel();
    const workspaceId = useWorkspaceId();

    const handleClose = () => {
        setOpen(false);
        form.reset();
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        mutate(
            { name: data.name, workspaceId: workspaceId },
            {
                onSuccess: (data) => {
                    handleClose();
                    router.push(`/workspace/${workspaceId}/${data}`);
                    toast({
                        title: "Tạo kênh thành công",
                        variant: "default",
                    });
                },
            },
        );
    };
    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Tạo Kênh</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((e) =>
                            onSubmit(e),
                        )}
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="mb-6">
                                    <FormLabel>Tên Kênh</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            autoFocus
                                            required
                                            disabled={isPending}
                                            className="bg-zinc-50"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className=" pt-4 gap-2">
                            <Button
                                type="button"
                                onClick={() => handleClose()}
                                className="w-20 hover:bg-transparent"
                                variant={"link"}
                                disabled={isPending}
                            >
                                Huỷ bỏ
                            </Button>
                            <Button
                                disabled={
                                    isPending ||
                                    !form.formState.isValid
                                }
                                type="submit"
                                className="w-40"
                                isLoading={isPending}
                            >
                                Tạo Kênh
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateChannelModal;
