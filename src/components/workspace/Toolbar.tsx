"use client";

import React from "react";
import { Button } from "../ui/button";
import { Info, Search } from "lucide-react";
import { useWorkspaceId } from "@/hooks/workspace/use-workspace-id";
import { useGetWorkspace } from "@/hooks/workspace/use-get-workspace";

const Toolbar = () => {
    const workspaceId = useWorkspaceId();
    const { workspace } = useGetWorkspace({ id: workspaceId });
    return (
        <nav className="bg-zinc-300 flex items-center justify-between h-12 p-1.5">
            <div className="flex-1" />
            <div className="min-w-[280px] max-[642px] grow-[2] shrink">
                <Button
                    size={"sm"}
                    className="w-full justify-start h-7 px-2 bg-zinc-200 hover:bg-zinc-100"
                >
                    <Search className="size-5 text-zinc-500 " />
                    <span className="ml-2 text-zinc-500 capitalize">
                        Tìm kiếm trong {workspace?.name}
                    </span>
                </Button>
            </div>
            <div className="ml-auto flex-1 flex items-center justify-end">
                <Button
                    size={"sm"}
                    className="bg-transparent rounded-full size-8 shadow-none hover:bg-zinc-200"
                >
                    <Info className="size-5 text-zinc-500" />
                </Button>
            </div>
        </nav>
    );
};

export default Toolbar;
