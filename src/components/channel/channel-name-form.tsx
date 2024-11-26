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
} from "../ui/form";
import { Input } from "../ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { useChannelId } from "@/hooks/channel/use-channel-id";
import { useUpdateChannel } from "@/hooks/channel/use-update-channel";

const formSchema = z.object({
    name: z
        .string()
        .min(3, "Tên không gian làm việc tối thiểu 3 ký tự"),
});

interface UserNameFormProps {
    value?: string;
}

const ChannelNameForm = ({ value }: UserNameFormProps) => {
    const channelId = useChannelId();

    const [open, setOpen] = useState<boolean>(false);
    const { toast } = useToast();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: value || "",
        },
    });

    const { mutate: updateChannel, isPending: loadChannel } =
        useUpdateChannel();

    const onSubmit = (value: z.infer<typeof formSchema>) => {
        updateChannel(
            { id: channelId, name: value.name },
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
                                Tên kênh
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={!open || loadChannel}
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
                            className="text-xs text-blue-500 w-20 hover:underline truncate"
                        >
                            Lưu thay đổi
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

export default ChannelNameForm;
