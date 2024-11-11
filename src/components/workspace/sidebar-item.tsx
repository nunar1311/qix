"use client";

import { cva, VariantProps } from "class-variance-authority";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/hooks/workspace/use-workspace-id";
import { ReactNode } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sidebarItemVariants = cva(
    "flex items-center gap-1.5 w-full rounded-lg justify-start font-normal h-7 px-[18px] text-sm overflow-hidden ",
    {
        variants: {
            variant: {
                default: "text-zinc-900 hover:bg-zinc-200",
                active: "text-zinc-900 bg-zinc-200 hover:bg-zinc-200",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

interface SidebarItemProps {
    label: string;
    id?: string;
    icon: ReactNode;
    variant?: VariantProps<typeof sidebarItemVariants>["variant"];
}

const SidebarItem = ({
    label,
    id,
    icon,
    variant,
}: SidebarItemProps) => {
    const workspaceId = useWorkspaceId();
    return (
        <Link
            href={`/workspace/${workspaceId}/${id}`}
            className={cn(sidebarItemVariants({ variant }))}
        >
            {icon}
            <span className="ml-2">{label}</span>
        </Link>
    );
};

export default SidebarItem;
