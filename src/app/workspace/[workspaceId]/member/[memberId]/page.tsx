"use client";

import { useCreateOrGetConversation } from "@/hooks/conversation/use-create-or-get-conversation";
import { useMemberId } from "@/hooks/member/use-member-id";
import { useWorkspaceId } from "@/hooks/workspace/use-workspace-id";
import React, { useEffect, useState } from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import Conversation from "@/components/conversation/Conversation";

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
        return <div>Loading...</div>;
    }

    if (!conversationId) {
        return <div>Not found</div>;
    }
    return <Conversation id={conversationId} />;
};

export default MemberIdPage;
