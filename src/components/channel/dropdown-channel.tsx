"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import { useCreateChannelModal } from "@/store/use-create-channel-modal";

const DropdownChannel = () => {
    const [open, setOpen] = useCreateChannelModal();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="h-7 px-2 bg-transparent hover:bg-zinc-200 text-zinc-900 shrink-0 group">
                    Kênh
                    <ChevronDown className="size-5 opacity-0 group-hover:opacity-100" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                side="bottom"
                className="rounded-2xl w-56"
            >
                <DropdownMenuItem
                    onClick={() => setOpen(true)}
                    className="rounded-xl py-2 px-3 items-center cursor-pointer capitalize font-semibold"
                >
                    Tạo kênh mới
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl py-2 px-3 items-center cursor-pointer capitalize font-semibold">
                    Sắp xếp kênh
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default DropdownChannel;
