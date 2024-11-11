"use client";

import { useGetChannels } from "@/hooks/channel/use-get-channels";
import { useCurrentMember } from "@/hooks/member/use-current-member";
import { useGetWorkspace } from "@/hooks/workspace/use-get-workspace";
import { useWorkspaceId } from "@/hooks/workspace/use-workspace-id";
import { useCreateChannelModal } from "@/store/use-create-channel-modal";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

const WorkspaceIdPage = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const [open, setOpen] = useCreateChannelModal();

    const { workspace, isLoading: isLoadWorkspace } = useGetWorkspace(
        {
            id: workspaceId,
        },
    );
    const { channels, isLoading: isLoadChannels } = useGetChannels({
        workspaceId: workspaceId,
    });

    const { member, isLoading: isLoadMember } = useCurrentMember({
        workspaceId: workspaceId,
    });

    const channelId = useMemo(() => channels?.[0]?._id, [channels]);

    const isAdmin = useMemo(() => member?.role === "admin", [member]);

    useEffect(() => {
        if (
            !workspace ||
            isLoadWorkspace ||
            !member ||
            isLoadMember ||
            isLoadChannels
        ) {
            return;
        }

        if (channelId) {
            router.push(`/workspace/${workspaceId}/${channelId}`);
        } else if (!open && isAdmin) {
            setOpen(true);
        }
    }, [
        channelId,
        isLoadWorkspace,
        isLoadChannels,
        workspace,
        workspaceId,
        open,
        setOpen,
        router,
        member,
        isLoadMember,
        isAdmin,
    ]);

    if (isLoadWorkspace || isLoadChannels || isLoadMember) {
        return <div>Loading...</div>;
    }

    if (!workspace || !member) {
        return redirect("/");
    }

    return <div>Không thấy kênh nào tìm thấy</div>;
};

export default WorkspaceIdPage;
