"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "./ui/form";
import { Input } from "./ui/input";
import { useState } from "react";
import { useUpdateWorkspace } from "@/hooks/workspace/use-update-workspace";
import { useWorkspaceId } from "@/hooks/workspace/use-workspace-id";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";

const formSchema = z.object({
    name: z
        .string()
        .min(3, "Tên không gian làm việc tối thiểu 3 ký tự"),
});

interface UserNameFormProps {
    value: string;
}

const UserNameForm = ({ value }: UserNameFormProps) => {
    const workspaceId = useWorkspaceId();

    const [open, setOpen] = useState<boolean>(false);
    const { toast } = useToast();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: value || "",
        },
    });

    const {
        mutate: updateWorkspace,
        isPending: isUpdatingWorkspace,
    } = useUpdateWorkspace();

    const onSubmit = (value: z.infer<typeof formSchema>) => {
        updateWorkspace(
            { id: workspaceId, name: value.name },
            {
                onSuccess() {
                    setOpen(false);
                    toast({
                        title: "Đổi tên thành công.",
                        variant: "default",
                    });
                },
                onError(error) {
                    toast({
                        title: "Đổi tên thất bại.",
                        description: error.message,
                    });
                },
            },
        );
    };
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-end gap-4"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormLabel className="text-sm font-semibold">
                                Tên Workspace
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={
                                        !open || isUpdatingWorkspace
                                    }
                                    className="bg-zinc-50"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                {open ? (
                    <div className="flex items-center gap-2">
                        <Button
                            variant={"link"}
                            type="button"
                            onClick={() => {
                                form.reset();
                                setOpen(false);
                            }}
                            className="text-xs text-zinc-900 w-10 hover:underline"
                        >
                            Hủy
                        </Button>
                        <Button
                            variant={"link"}
                            type="submit"
                            className="text-xs text-blue-500 w-10 hover:underline"
                        >
                            Ok
                        </Button>
                    </div>
                ) : (
                    <Button
                        type="button"
                        variant={"link"}
                        onClick={() => setOpen(true)}
                        className="text-xs text-blue-500 w-[88px] hover:underline"
                    >
                        Chỉnh sửa
                    </Button>
                )}
            </form>
        </Form>
    );
};

export default UserNameForm;
