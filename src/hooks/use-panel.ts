import { useParentMessageId } from "@/store/use-parent-message-id";
import { useProfileMemberId } from "@/store/use-profile-member-id";
import { useManagerChannelId } from "@/store/use-manager-channel-id";

export const usePanel = () => {
    const [parentMessageId, setParentMessageId] =
        useParentMessageId();
    const [profileMemberId, setProfileMemberId] =
        useProfileMemberId();
    const [managerChannelId, setManagerChannelId] =
        useManagerChannelId();

    const onOpenManagerChannel = (channelId: string) => {
        setManagerChannelId(channelId);
        setParentMessageId(null);
        setProfileMemberId(null);
    };

    const onOpenProfile = (memberId: string) => {
        setProfileMemberId(memberId);
        setParentMessageId(null);
        setManagerChannelId(null);
    };

    const onOpenMessage = (messageId: string) => {
        setParentMessageId(messageId);
        setProfileMemberId(null);
        setManagerChannelId(null);
    };

    const onClose = () => {
        setParentMessageId(null);
        setProfileMemberId(null);
        setManagerChannelId(null);
    };

    return {
        parentMessageId,
        profileMemberId,
        managerChannelId,
        onOpenManagerChannel,
        onOpenProfile,
        onOpenMessage,
        onClose,
    };
};
