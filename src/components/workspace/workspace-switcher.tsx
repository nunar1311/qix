"use client";

import { useOnClickOutside } from "@/hooks/use-onclick-outside";
import React, { useRef, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Button } from "../ui/button";
import { useWorkspaceId } from "@/hooks/workspace/use-workspace-id";
import { useGetWorkspace } from "@/hooks/workspace/use-get-workspace";
import { useGetWorkspaces } from "@/hooks/workspace/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/store/use-create-workspace-modal";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const WorkspaceSwitcher = () => {
    const router = useRouter();

    const [open, setOpen] = useState<boolean>(false);
    const [modal, setModal] = useCreateWorkspaceModal();

    const workspaceId = useWorkspaceId();

    const { workspaces } = useGetWorkspaces();
    const { workspace, isLoading: WorkspaceLoading } =
        useGetWorkspace({ id: workspaceId });

    const filteredWorkspaces = workspaces?.filter(
        (workspace) => workspace._id !== workspaceId,
    );

    const ref = useRef<HTMLDivElement>(null);

    useOnClickOutside(ref, () => {
        setOpen(false);
    });

    return (
        <DropdownMenu open={open}>
            <DropdownMenuTrigger
                className="focus:outline-none"
                asChild
            >
                <Button
                    onClick={() => setOpen(!open)}
                    className={cn(
                        "relative overflow-hidden size-10 rounded-xl bg-zinc-900 hover:bg-zinc-700 font-semibold text-lg",
                    )}
                >
                    {WorkspaceLoading ? (
                        <span className=" flex items-center gap-1">
                            <span className="animate-flashing w-1 h-1 bg-white rounded-full inline-block" />
                            <span className="animate-flashing delay-100 w-1 h-1 bg-white rounded-full inline-block" />
                            <span className="animate-flashing delay-200 w-1 h-1 bg-white rounded-full inline-block" />
                        </span>
                    ) : (
                        workspace?.name.charAt(0).toUpperCase()
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                ref={ref}
                align="start"
                side="bottom"
                className="rounded-2xl w-64"
            >
                <DropdownMenuItem
                    onClick={() =>
                        router.push(`/workspace/${workspaceId}`)
                    }
                    className="rounded-xl py-2 px-3 justify-between cursor-pointer capitalize font-semibold gap-0"
                >
                    <div className="flex flex-col items-start justify-start">
                        <p className="truncate w-52">
                            {workspace?.name}
                        </p>
                        <span className="text-xs font-normal text-zinc-600">
                            Workspace đang hoạt động
                        </span>
                    </div>
                    <div className="size-2 bg-blue-500 rounded-full" />
                </DropdownMenuItem>
                {filteredWorkspaces?.map((workspace) => (
                    <DropdownMenuItem
                        key={workspace._id}
                        onClick={() =>
                            router.push(`/workspace/${workspace._id}`)
                        }
                        className="rounded-xl px-3 items-center cursor-pointer capitalize font-semibold"
                    >
                        <div className="shrink-0 flex items-center justify-center overflow-hidden size-10 rounded-xl bg-zinc-200 font-semibold text-lg">
                            {workspace.name.charAt(0).toUpperCase()}
                        </div>
                        <p className=" truncate"> {workspace.name}</p>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => {
                        setOpen(false);
                        setModal(!modal);
                    }}
                    className="rounded-xl py-2.5 px-3 items-center justify-between cursor-pointer capitalize font-semibold"
                >
                    <div className="text-sm font-semibold">
                        Tạo workspace mới
                    </div>
                    <div className="size-8 relative bg-zinc-100 overflow-hidden flex items-center justify-center rounded-lg">
                        <Plus className="size-5 " />
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default WorkspaceSwitcher;
