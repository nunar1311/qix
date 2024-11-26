"use client";

import { Icons } from "@/components/Icons";
import { buttonVariants } from "@/components/ui/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { useGetInfoWorkspace } from "@/hooks/workspace/use-get-info-workspace";
import { useInviteWorkspace } from "@/hooks/workspace/use-invite-workspace";
import { useWorkspaceId } from "@/hooks/workspace/use-workspace-id";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Flame } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";

const JoinPage = () => {
    const workspaceId = useWorkspaceId();

    const { mutate } = useInviteWorkspace();
    const { workspace, isLoading } = useGetInfoWorkspace({
        id: workspaceId,
    });

    const { toast } = useToast();
    const router = useRouter();

    const isMember = useMemo(
        () => workspace?.isMember,
        [workspace?.isMember],
    );

    useEffect(() => {
        if (isMember) {
            router.push(`/workspace/${workspaceId}`);
        }
    }, [isMember, router, workspaceId]);

    const handleComplete = (values: string) => {
        mutate(
            { workspaceId, joinCode: values },
            {
                onSuccess: () => {
                    router.push(`/workspace/${workspaceId}`);
                    toast({
                        title: `Tham gia ${workspace?.name} thành công`,
                        variant: "default",
                    });
                },
                onError: () => {
                    toast({
                        title: "Mã không hợp lệ",
                        variant: "destructive",
                    });
                },
            },
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen ">
                <Icons.load className="size-20 fill-zinc-500" />
            </div>
        );
    }

    return (
        <div className="h-screen relative flex flex-col gap-y-8 items-center justify-center bg-zinc-50 p-8 rounded-xl">
            <Flame className="size-10" />
            <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
                <div className="flex flex-col gap-y-2 items-center justify-center">
                    <h1 className="text-2xl font-bold">
                        Tham gia {workspace?.name}
                    </h1>
                    <p className="text-zinc-600">
                        Nhập mã không gian làm việc để tham gia
                    </p>
                </div>
                <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    onComplete={handleComplete}
                    autoFocus
                    disabled={isLoading}
                >
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
                <div className="flex gap-x-4">
                    <Link
                        href={"/"}
                        className={buttonVariants({
                            variant: "outline",
                        })}
                    >
                        Trở về trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default JoinPage;
