"use client";
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
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useUpdateUserModal } from "@/store/use-update-user-modal";
import { useUpdateUser } from "@/hooks/user/use-update-user";

const formSchema = z.object({
    username: z
        .string()
        .min(3, "Tên không gian làm việc tối thiểu 3 ký tự"),
});

const UpdateUserModal = () => {
    const router = useRouter();
    const { toast } = useToast();

    const [open, setOpen] = useUpdateUserModal();
    const { mutate, isPending } = useUpdateUser();

    const handleClose = () => {
        setOpen(false);
        form.reset();
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        mutate(
            { username: data.username },
            {
                onSuccess: () => {
                    handleClose();
                    toast({
                        title: "Tạo username thành công",
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
                    <DialogTitle>Tạo Username</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((e) =>
                            onSubmit(e),
                        )}
                    >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="mb-6">
                                    <FormLabel>Username</FormLabel>
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
                                disabled={
                                    isPending ||
                                    !form.formState.isValid
                                }
                                type="submit"
                                className="w-40"
                                isLoading={isPending}
                            >
                                Tạo username
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateUserModal;
