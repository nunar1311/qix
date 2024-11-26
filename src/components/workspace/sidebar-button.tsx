import { LucideIcon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface SidebarButtonProps {
    icon: LucideIcon;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
}
const SidebarButton = ({
    icon: Icon,
    label,
    isActive,
    onClick,
}: SidebarButtonProps) => {
    return (
        <div className="flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group">
            <Button
                className={cn(
                    "size-10 group-hover:bg-zinc-400/50 bg-transparent shadow-none rounded-xl p-2",
                    isActive && "bg-zinc-400/50",
                )}
                onClick={onClick}
            >
                <Icon
                    className={cn(
                        "size-5 text-zinc-900 group-hover:scale-110 transition-all",
                    )}
                />
            </Button>
            <span className="text-[11px] text-zinc-900">{label}</span>
        </div>
    );
};

export default SidebarButton;
