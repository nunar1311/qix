"use client";

import { useCurrentMember } from "@/hooks/member/use-current-member";
import { useGetWorkspace } from "@/hooks/workspace/use-get-workspace";
import { useWorkspaceId } from "@/hooks/workspace/use-workspace-id";
import WorkspaceHeader from "./workspace-header";
import { useGetChannels } from "@/hooks/channel/use-get-channels";
import { Hash, SendHorizonal } from "lucide-react";
import SidebarItem from "./sidebar-item";
import { useGetMembers } from "@/hooks/member/use-get-members";
import WorkspaceSidebarSection from "./workspace-sidebar-section";
import UserAvatar from "../UserAvatar";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import DropdownChannel from "../channel/dropdown-channel";
import { useChannelId } from "@/hooks/channel/use-channel-id";
import { useMemberId } from "@/hooks/member/use-member-id";
import { redirect } from "next/navigation";

const WorkspaceSidebar = () => {
    const memberId = useMemberId();
    const workspaceId = useWorkspaceId();
    const channelId = useChannelId();
    const { member, isLoading: memberLoading } = useCurrentMember({
        workspaceId,
    });
    const { channels } = useGetChannels({
        workspaceId,
    });

    const { members } = useGetMembers({
        workspaceId,
    });

    const { user } = useCurrentUser();

    if (user === null) {
        return null;
    }

    const { workspace, isLoading: workspaceLoading } =
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useGetWorkspace({ id: workspaceId });

    if (memberLoading || workspaceLoading) {
        return <div className="">Loading...</div>;
    }

    if (!workspace || !member) {
        return redirect("/");
    }
    return (
        <div className="flex flex-col h-full">
            <WorkspaceHeader
                workspace={workspace}
                isAdmin={member.role === "admin"}
            />
            <div className="flex flex-col px-2 mt-3 ">
                <SidebarItem
                    label="Bản nháp và đã gửi"
                    icon={<SendHorizonal className="size-5" />}
                    // id="drafts&sent"
                />

                <WorkspaceSidebarSection
                    label="Kênh"
                    dropdown={
                        member.role === "admin" ? (
                            <DropdownChannel />
                        ) : undefined
                    }
                >
                    {channels?.map((channel) => (
                        <SidebarItem
                            key={channel._id}
                            icon={
                                <Hash className="size-5 shrink-0" />
                            }
                            label={channel.name}
                            href={`${channel._id}`}
                            variant={
                                channelId === channel._id
                                    ? "active"
                                    : "default"
                            }
                        />
                    ))}
                </WorkspaceSidebarSection>
                <WorkspaceSidebarSection
                    hint="Mở tin nhắn trực tiếp"
                    label="Tin nhắn trực tiếp"
                    onNew={() => {}}
                >
                    {members?.map((_member) => (
                        <SidebarItem
                            key={_member._id}
                            icon={
                                <UserAvatar
                                    user={{
                                        name: _member.user.name || "",
                                        image:
                                            _member.user.image || "",
                                    }}
                                    className="size-5 rounded-lg shrink-0"
                                />
                            }
                            label={_member.user.username || ""}
                            href={`member/${_member._id}`}
                            variant={
                                _member._id === memberId
                                    ? "active"
                                    : "default"
                            }
                        />
                    ))}
                </WorkspaceSidebarSection>
            </div>
        </div>
    );
};

export default WorkspaceSidebar;
