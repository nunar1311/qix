"use client";

import ChatInput from "@/components/channel/ChatInput";
import Header from "@/components/channel/Header";
import { useChannelId } from "@/hooks/channel/use-channel-id";
import { useGetChannel } from "@/hooks/channel/use-get-channel";

const ChannelIdPage = () => {
    const channelId = useChannelId();
    const { channel, isLoading: loadChannel } = useGetChannel({
        id: channelId,
    });

    if (loadChannel) {
        return <div>Loading...</div>;
    }

    if (!channel) {
        return <div>Not found</div>;
    }

    return (
        <div className="flex flex-col h-full">
            <Header initialValue={channel} />
            <div className="flex-1"></div>
            <ChatInput placeholder={`Tin nhắn #${channel.name}`} />
        </div>
    );
};

export default ChannelIdPage;
