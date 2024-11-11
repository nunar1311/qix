"use client";

import { useCreateWorkspaceModal } from "@/store/use-create-workspace-modal";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";
import { useCreateWorkspace } from "@/hooks/workspace/use-create-workspace";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
    name: z
        .string()
        .min(3, "Tên không gian làm việc tối thiểu 3 ký tự"),
});

const CreateWorkspaceModal = () => {
    const router = useRouter();
    const { toast } = useToast();

    const [open, setOpen] = useCreateWorkspaceModal();
    const { mutate, isPending } = useCreateWorkspace();

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
            { name: data.name },
            {
                onSuccess: (data) => {
                    handleClose();
                    router.push(`/workspace/${data}`);
                    toast({
                        title: "Tạo không gian làm việc thành công",
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
                    <DialogTitle>Tạo Workspace</DialogTitle>
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
                                    <FormLabel>
                                        Tên Workspace
                                    </FormLabel>
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
                                Tạo Workspace
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateWorkspaceModal;
