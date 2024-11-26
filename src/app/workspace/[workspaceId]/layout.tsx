"use client";

import Toolbar from "@/components/workspace/Toolbar";
import Sidebar from "@/components/workspace/Sidebar";
import React, { ReactNode } from "react";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import WorkspaceSidebar from "@/components/workspace/workspace-sidebar";
import { usePanel } from "@/hooks/use-panel";
import { Id } from "../../../../convex/_generated/dataModel";
import Thread from "@/components/Thread";
import ProfileMember from "@/components/profile-member";
import ManagerChannel from "@/components/channel/manager-channel";

const WorkspaceIdLayout = ({ children }: { children: ReactNode }) => {
    const {
        parentMessageId,
        profileMemberId,
        managerChannelId,
        onClose,
    } = usePanel();

    const showPanel =
        !!parentMessageId || !!profileMemberId || !!managerChannelId;

    return (
        <div className="h-full">
            <Toolbar />
            <div className="absolute w-5 h-5 bg-zinc-300 left-[67px]">
                <div className="w-5 h-5 bg-zinc-100 rounded-tl-xl"></div>
            </div>
            <div className="flex h-[calc(100vh-49px)]">
                <Sidebar />
                <ResizablePanelGroup
                    direction="horizontal"
                    autoSaveId={"ca-workspace-layout"}
                >
                    <ResizablePanel
                        defaultSize={20}
                        minSize={20}
                        maxSize={20}
                        className="bg-zinc-100"
                    >
                        <WorkspaceSidebar />
                    </ResizablePanel>
                    <ResizablePanel minSize={50} defaultSize={80}>
                        {children}
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    {showPanel ? (
                        <>
                            <ResizableHandle withHandle />
                            <ResizablePanel
                                defaultSize={40}
                                minSize={20}
                                maxSize={50}
                            >
                                {parentMessageId ? (
                                    <Thread
                                        messageId={
                                            parentMessageId as Id<"messages">
                                        }
                                        onClose={onClose}
                                    />
                                ) : profileMemberId ? (
                                    <ProfileMember
                                        memberId={
                                            profileMemberId as Id<"members">
                                        }
                                        onClose={onClose}
                                    />
                                ) : managerChannelId ? (
                                    <ManagerChannel
                                        channelId={
                                            managerChannelId as Id<"channels">
                                        }
                                        onClose={onClose}
                                    />
                                ) : (
                                    <span className="flex items-center gap-1">
                                        <span className="animate-flashing w-1 h-1 bg-white rounded-full inline-block" />
                                        <span className="animate-flashing delay-100 w-1 h-1 bg-white rounded-full inline-block" />
                                        <span className="animate-flashing delay-200 w-1 h-1 bg-white rounded-full inline-block" />
                                    </span>
                                )}
                            </ResizablePanel>
                        </>
                    ) : null}
                </ResizablePanelGroup>
            </div>
        </div>
    );
};

export default WorkspaceIdLayout;
