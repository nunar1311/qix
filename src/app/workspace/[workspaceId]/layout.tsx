import Toolbar from "@/components/workspace/Toolbar";
import Sidebar from "@/components/workspace/Sidebar";
import React, { ReactNode } from "react";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import WorkspaceSidebar from "@/components/workspace/workspace-sidebar";

const WorkspaceIdLayout = ({ children }: { children: ReactNode }) => {
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
                        minSize={11}
                        className="bg-zinc-100"
                    >
                        <WorkspaceSidebar />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel minSize={80}>
                        {children}
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
};

export default WorkspaceIdLayout;
