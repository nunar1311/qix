import { format } from "date-fns";
import { vi } from "date-fns/locale/vi";
import { Hash } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "../ui/button";

interface ChannelHeroProps {
    name: string;
    creationTime: number;

}

const ChannelHero = ({
    name,
    creationTime,

}: ChannelHeroProps) => {
    return (
        <div className="mt-[88px] mx-5 mb-4">
            <div className="text-3xl font-bold flex flex-col items-start mb-2 gap-2">
                <div className="size-16 rounded-full bg-zinc-400 flex items-center justify-center">
                    <Hash className="size-10 text-zinc-50" />
                </div>
                Chào mừng bạn đến với #{name}!
            </div>
            <p>
                Kênh này được tạo vào{" "}
                {format(creationTime, "dd/MM/yyyy", {
                    locale: vi,
                })}
                . Đây chính là khởi đầu của nhóm{" "}
                <strong>{name}</strong>.
            </p>

        </div>
    );
};

export default ChannelHero;
