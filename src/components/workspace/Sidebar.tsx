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
import { usePathname, useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/workspace/use-workspace-id";

const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const { user } = useCurrentUser();
    if (user === null) return null;

    const workspaceId = useWorkspaceId();

    return (
        <aside className="w-[70px] h-full bg-zinc-300 flex flex-col items-center justify-between gap-x-4 pt-2 pb-4">
            <div className="flex flex-col items-center justify-between gap-x-4 gap-y-4">
                <WorkspaceSwitcher />
                <SidebarButton
                    icon={Home}
                    label="Trang chủ"
                    isActive={pathname.includes("/workspace")}
                    onClick={() =>
                        router.push(`/workspace/${workspaceId}`)
                    }
                />
                <SidebarButton
                    icon={MessagesSquare}
                    label="Tin nhắn"
                    isActive={pathname.includes(
                        `/workspace/${workspaceId}/dms`,
                    )}
                    onClick={() =>
                        router.push(`/workspace/${workspaceId}/dms`)
                    }
                />
                <SidebarButton
                    icon={Bell}
                    label="Hoạt động"
                    isActive={pathname.includes(
                        `/workspace/${workspaceId}/activity`,
                    )}
                    onClick={() =>
                        router.push(
                            `/workspace/${workspaceId}/activity`,
                        )
                    }
                />
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
