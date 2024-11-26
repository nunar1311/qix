"use client";

import { Hash } from "lucide-react";
import { Button } from "../ui/button";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { Separator } from "../ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import useConfirm from "@/hooks/use-confirm";

interface HeaderProps {
    initialValue?: Doc<"channels">;
    onClick?: () => void;
}

const Header = ({ initialValue, onClick }: HeaderProps) => {
    return (
        <div className="bg-white border-b h-12 flex items-center overflow-hidden px-4">
            <Button
                onClick={onClick}
                size={"sm"}
                className="bg-transparent text-zinc-900 hover:bg-zinc-100"
            >
                <span className="flex items-center gap-x-2 text-lg font-semibold">
                    <Hash className="size-5" />
                    {initialValue?.name}
                </span>
            </Button>
        </div>
    );
};

export default Header;
