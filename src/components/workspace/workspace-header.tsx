"use client";

import { ChevronDown, ListFilter, SquarePen } from "lucide-react";
import { Doc } from "../../../convex/_generated/dataModel";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Hint from "../Hint";
import { useState } from "react";
import InviteModal from "./invite-modal";
import SettingsModal from "./settings-modal";

interface WorkspaceHeaderProps {
    workspace: Doc<"workspaces">;
    isAdmin?: boolean;
}

const WorkspaceHeader = ({
    workspace,
    isAdmin,
}: WorkspaceHeaderProps) => {
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [inviteOpen, setInviteOpen] = useState<boolean>(false);
    return (
        <>
            <InviteModal
                open={inviteOpen}
                setOpen={setInviteOpen}
                name={workspace.name}
                joinCode={workspace.joinCode}
            />
            <SettingsModal
                open={settingsOpen}
                setOpen={setSettingsOpen}
                initialValue={workspace.name}
            />
            <div className="flex items-center justify-between px-2 h-12 gap-0.5 z-40">
                <DropdownMenu>
                    <DropdownMenuTrigger
                        className="focus:outline-none"
                        asChild
                    >
                        <Button
                            size={"sm"}
                            className="font-semibold bg-transparent text-zinc-900 hover:bg-zinc-200 w-auto text-base"
                        >
                            <span className="truncate">
                                {workspace.name}
                            </span>
                            <ChevronDown className="size-5 ml-1 shrink-0" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        side="bottom"
                        align="start"
                        className="w-64 rounded-2xl"
                    >
                        {isAdmin ? (
                            <>
                                <DropdownMenuItem className="rounded-xl px-2 items-center cursor-pointer capitalize font-semibold">
                                    <div className="shrink-0 flex items-center justify-center overflow-hidden size-10 rounded-xl bg-zinc-200 font-semibold text-lg">
                                        {workspace.name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                    <div className="flex flex-col items-start justify-start">
                                        <p className="truncate w-52">
                                            {workspace?.name}
                                        </p>
                                        <span className="text-xs font-normal text-zinc-600">
                                            Workspace đang hoạt động
                                        </span>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        setInviteOpen(true)
                                    }
                                    className="rounded-xl py-2.5 px-3 items-center cursor-pointer capitalize font-semibold"
                                >
                                    Tham gia vào {workspace.name}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        setSettingsOpen(true)
                                    }
                                    className="rounded-xl py-2.5 px-3 items-center cursor-pointer capitalize font-semibold"
                                >
                                    Cài đặt
                                </DropdownMenuItem>
                            </>
                        ) : null}
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex items-center">
                    <Hint side="bottom" label="Lọc cuộc trò chuyện">
                        <Button
                            size={"sm"}
                            className="bg-transparent hover:bg-zinc-200 text-zinc-900"
                        >
                            <ListFilter className="size-5" />
                        </Button>
                    </Hint>
                    <Hint side="bottom" label="Tin nhắn mới">
                        <Button
                            size={"sm"}
                            className="bg-transparent hover:bg-zinc-200 text-zinc-900"
                        >
                            <SquarePen className="size-5" />
                        </Button>
                    </Hint>
                </div>
            </div>
        </>
    );
};

export default WorkspaceHeader;
