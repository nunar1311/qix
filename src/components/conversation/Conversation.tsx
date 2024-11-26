import { useMemberId } from "@/hooks/member/use-member-id";
import { Id } from "../../../convex/_generated/dataModel";
import { useGetMember } from "@/hooks/member/use-get-member";
import { useGetMessages } from "@/hooks/messages/use-get-messages";
import Header from "./Header";
import MessageList from "../channel/message-list";
import ChatInput from "./ChatInput";
import { usePanel } from "@/hooks/use-panel";

interface ConversationProps {
    id: Id<"conversations">;
}

const Conversation = ({ id }: ConversationProps) => {
    const memberId = useMemberId();

    const { onOpenProfile } = usePanel();

    const { member, isLoading: memberLoading } = useGetMember({
        id: memberId,
    });

    const { results, status, loadMore } = useGetMessages({
        conversationId: id,
    });

    if (memberLoading || status === "LoadingFirstPage") {
        return <div>Loading...</div>;
    }
    return (
        <div className="flex flex-col h-full">
            <Header
                MemberName={member?.user.username}
                MemberImage={member?.user.image}
                onClick={() => onOpenProfile(memberId)}
            />
            <MessageList
                variant="conversation"
                memberUsername={member?.user.username}
                memberName={member?.user.name}
                memberAvatar={member?.user.image}
                data={results}
                loadMore={loadMore}
                isLoadingMore={status === "LoadingMore"}
                canLoadMore={status === "CanLoadMore"}
            />
            <ChatInput
                placeholder={`Nhắn ${member?.user.username}`}
                conversationId={id}
            />
        </div>
    );
};

export default Conversation;
