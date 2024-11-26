"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Info, Search } from "lucide-react";
import { useWorkspaceId } from "@/hooks/workspace/use-workspace-id";
import { useGetWorkspace } from "@/hooks/workspace/use-get-workspace";
import { useGetChannels } from "@/hooks/channel/use-get-channels";
import { useGetMembers } from "@/hooks/member/use-get-members";
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import { useRouter } from "next/navigation";

const Toolbar = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const { workspace } = useGetWorkspace({ id: workspaceId });
    const { channels } = useGetChannels({ workspaceId });
    const { members } = useGetMembers({ workspaceId });

    const [open, setOpen] = useState(false);

    const onChannelClick = (channelId: string) => {
        setOpen(false);

        router.push(`/workspace/${workspaceId}/${channelId}`);
    };

    const onMemberClick = (memberId: string) => {
        setOpen(false);

        router.push(`/workspace/${workspaceId}/member/${memberId}`);
    };
    return (
        <nav className="bg-zinc-300 flex items-center justify-between h-12 p-1.5">
            <div className="flex-1" />
            <div className="min-w-[280px] max-[642px] grow-[2] shrink">
                <Button
                    size={"sm"}
                    className="w-full justify-start h-7 px-2 bg-zinc-200 hover:bg-zinc-100"
                    onClick={() => setOpen(true)}
                >
                    <Search className="size-5 text-zinc-500 " />
                    <span className="ml-2 text-zinc-500 capitalize">
                        Tìm kiếm trong {workspace?.name}
                    </span>
                </Button>
                <CommandDialog open={open} onOpenChange={setOpen}>
                    <CommandInput
                        placeholder={`Tìm kiếm trong ${workspace?.name}`}
                    />
                    <CommandList>
                        <CommandEmpty>
                            Không tìm thấy kết quả.
                        </CommandEmpty>
                        <CommandGroup heading="Kênh">
                            {channels?.map((channel) => (
                                <CommandItem
                                    onSelect={() =>
                                        onChannelClick(channel._id)
                                    }
                                    key={channel._id}
                                >
                                    {channel.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup heading="Thành viên">
                            {members?.map((member) => (
                                <CommandItem
                                    onSelect={() =>
                                        onMemberClick(member._id)
                                    }
                                    key={member._id}
                                >
                                    <UserAvatar
                                        user={{
                                            image: member.user.image,
                                            name: member.user.name,
                                        }}
                                        className="size-6"
                                    />
                                    {member.user.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </CommandDialog>
            </div>
            <div className="ml-auto flex-1 flex items-center justify-end">
                <Button
                    size={"sm"}
                    className="bg-transparent rounded-full size-8 shadow-none hover:bg-zinc-200"
                >
                    <Info className="size-5 text-zinc-500" />
                </Button>
            </div>
        </nav>
    );
};

export default Toolbar;
