import { FaCaretRight } from "react-icons/fa";
import { Button } from "../ui/button";
import { useToggle } from "react-use";
import { Plus } from "lucide-react";
import { ReactNode } from "react";
import Hint from "../Hint";
import { cn } from "@/lib/utils";

interface WorkspaceSidebarSectionProps {
    children: ReactNode;
    label: string;
    hint?: string;
    dropdown?: ReactNode;
    onNew?: () => void;
}

const WorkspaceSidebarSection = ({
    children,
    label,
    hint,
    dropdown,
    onNew,
}: WorkspaceSidebarSectionProps) => {
    const [on, toggle] = useToggle(true);
    return (
        <div className="flex flex-col mt-3 px-2">
            <div className="flex items-center gap-1 mb-1">
                <Button
                    onClick={toggle}
                    className="size-7 p-0.5 bg-transparent hover:bg-zinc-200 text-zinc-900 shrink-0"
                >
                    <FaCaretRight
                        className={cn(
                            "size-5 transition-transform",
                            on && "rotate-90",
                        )}
                    />
                </Button>

                <div className="w-full flex items-center justify-between group text-sm">
                    {dropdown || label}
                    {onNew ? (
                        <Hint
                            label={hint || ""}
                            side="top"
                            align="center"
                        >
                            <Button className="size-7 p-0.5 bg-transparent hover:bg-zinc-200 text-zinc-900 shrink-0 opacity-0 group-hover:opacity-100">
                                <Plus className="size-5" />
                            </Button>
                        </Hint>
                    ) : null}
                </div>
            </div>
            {on ? children : null}
        </div>
    );
};

export default WorkspaceSidebarSection;
