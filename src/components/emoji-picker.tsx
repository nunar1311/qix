import { ReactNode, useState } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./ui/popover";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";

interface EmojiPickerProps {
    onEmojiSelect: (emoji: any) => void;
    children: ReactNode;
    hint?: string;
}
const EmojiPicker = ({
    onEmojiSelect,
    children,
    hint = "Nhãn dán",
}: EmojiPickerProps) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const onSelect = (emoji: any) => {
        onEmojiSelect(emoji);
        setPopoverOpen(false);

        setTimeout(() => {
            setTooltipOpen(false);
        }, 100);
    };
    return (
        <TooltipProvider>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <Tooltip
                    open={tooltipOpen}
                    onOpenChange={setTooltipOpen}
                    delayDuration={50}
                >
                    <PopoverTrigger asChild>
                        <TooltipTrigger asChild>
                            {children}
                        </TooltipTrigger>
                    </PopoverTrigger>
                    <TooltipContent className="bg-zinc-50 text-zinc-900 shadow">
                        <p className="font-medium text-xs">{hint}</p>
                    </TooltipContent>
                </Tooltip>
                <PopoverContent className="p-0 w-full border-none shadow-none">
                    <Picker data={data} onEmojiSelect={onSelect} />
                </PopoverContent>
            </Popover>
        </TooltipProvider>
    );
};

export default EmojiPicker;
