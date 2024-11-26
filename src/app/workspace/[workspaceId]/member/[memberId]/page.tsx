"use client";

import { useCreateOrGetConversation } from "@/hooks/conversation/use-create-or-get-conversation";
import { useMemberId } from "@/hooks/member/use-member-id";
import { useWorkspaceId } from "@/hooks/workspace/use-workspace-id";
import React, { useEffect, useState } from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import Conversation from "@/components/conversation/Conversation";
import { Icons } from "@/components/Icons";

const MemberIdPage = () => {
    const memberId = useMemberId();
    const workspaceId = useWorkspaceId();

    const [conversationId, setConversationId] =
        useState<Id<"conversations"> | null>(null);

    const { mutate, isPending } = useCreateOrGetConversation();

    useEffect(() => {
        mutate(
            {
                workspaceId,
                memberId,
            },
            {
                onSuccess(data) {
                    setConversationId(data);
                },
            },
        );
    }, [workspaceId, memberId, mutate]);

    if (isPending) {
        return (
            <div className="flex items-center justify-center h-screen ">
                <Icons.load className="size-20 fill-zinc-500" />
            </div>
        );
    }

    if (!conversationId) {
        return <div>Not found</div>;
    }
    return <Conversation id={conversationId} />;
};

export default MemberIdPage;
