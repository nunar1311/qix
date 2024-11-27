"use client";

import ChatInput from "@/components/channel/ChatInput";
import Header from "@/components/channel/Header";
import MessageList from "@/components/channel/message-list";
import { Icons } from "@/components/Icons";
import { useChannelId } from "@/hooks/channel/use-channel-id";
import { useGetChannel } from "@/hooks/channel/use-get-channel";
import { useGetMessages } from "@/hooks/messages/use-get-messages";
import { usePanel } from "@/hooks/use-panel";
import { useWorkspaceId } from "@/hooks/workspace/use-workspace-id";
import { redirect, useRouter } from "next/navigation";

const ChannelIdPage = () => {
    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();
    const { onOpenManagerChannel } = usePanel();

    const router = useRouter();

    const { results, status, loadMore } = useGetMessages({
        channelId,
    });
    const { channel, isLoading: loadChannel } = useGetChannel({
        id: channelId,
    });

    if (loadChannel || status === "LoadingFirstPage") {
        return (
            <div className="flex items-center justify-center h-screen ">
                <Icons.load className="size-20 fill-zinc-500" />
            </div>
        );
    }

    if (!channel) {
        return redirect(`/workspace/${workspaceId}`);
    }

    return (
        <div className="flex flex-col h-full">
            <Header
                initialValue={channel}
                onClick={() => onOpenManagerChannel(channelId)}
            />
            <MessageList
                channelName={channel.name}
                channelCreationTime={channel._creationTime}
                data={results}
                loadMore={loadMore}
                isLoadingMore={status === "LoadingMore"}
                canLoadMore={status === "CanLoadMore"}
            />
            <ChatInput placeholder={`Nhắn #${channel.name}`} />
        </div>
    );
};

export default ChannelIdPage;
