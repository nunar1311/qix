"use client";

import { ReactNode } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";

interface HintProps {
    label: string;
    children: ReactNode;
    align?: "start" | "end" | "center";
    side?: "top" | "bottom" | "left" | "right";
}

const Hint = ({ label, children, side, align }: HintProps) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent
                    side={side}
                    align={align}
                    className="bg-zinc-50 text-zinc-900 shadow"
                >
                    <p className="font-medium text-xs">{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default Hint;
