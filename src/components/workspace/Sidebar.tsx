"use client";

import Profile from "../Profile";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import WorkspaceSwitcher from "./workspace-switcher";
import SidebarButton from "./sidebar-button";
import {
    Bell,
    Home,
    MessagesSquare,
    MoreHorizontal,
} from "lucide-react";
import { usePathname } from "next/navigation";

const Sidebar = () => {
    const pathname = usePathname();

    const { user } = useCurrentUser();
    if (user === null) return null;

    return (
        <aside className="w-[70px] h-full bg-zinc-300 flex flex-col items-center justify-between gap-x-4 pt-2 pb-4">
            <div className="flex flex-col items-center justify-between gap-x-4 gap-y-4">
                <WorkspaceSwitcher />
                <SidebarButton
                    icon={Home}
                    label="Trang chủ"
                    isActive={pathname.includes("/workspace")}
                />
                <SidebarButton
                    icon={MessagesSquare}
                    label="Tin nhắn"
                />
                <SidebarButton icon={Bell} label="Hoạt động" />
                <SidebarButton
                    icon={MoreHorizontal}
                    label="Xem thêm"
                />
            </div>
            <Profile user={user} />
        </aside>
    );
};

export default Sidebar;
