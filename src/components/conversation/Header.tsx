"use client";

import { Hash, Trash } from "lucide-react";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { Separator } from "../ui/separator";
import { useRemoveChannel } from "@/hooks/channel/use-remove-channel";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import useConfirm from "@/hooks/use-confirm";
import UserAvatar from "../UserAvatar";

interface HeaderProps {
    MemberName?: string;
    MemberImage?: string;
    onClick?: () => void;
}

const Header = ({
    MemberImage,
    MemberName = "Member",
    onClick,
}: HeaderProps) => {
    return (
        <div className="bg-white border-b h-12 flex items-center overflow-hidden px-4">
            <Button
                onClick={onClick}
                size={"sm"}
                className="bg-transparent text-zinc-900 hover:bg-zinc-100"
            >
                <span className="flex items-center gap-x-2 text-lg font-semibold">
                    <UserAvatar
                        user={{
                            image: MemberImage,
                            name: MemberName,
                        }}
                        className="size-7"
                    />
                    <span>{MemberName}</span>
                </span>
            </Button>
        </div>
    );
};

export default Header;
