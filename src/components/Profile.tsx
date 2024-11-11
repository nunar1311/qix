"use client";

import React, { useRef, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import UserAvatar from "./UserAvatar";
import { useOnClickOutside } from "../hooks/use-onclick-outside";
import { cn } from "../lib/utils";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ArrowLeft, ChevronRight, Moon, Sun } from "lucide-react";
import { User } from "@auth/core/types";
import { useAuthActions } from "@convex-dev/auth/react";

interface ProfileProps extends React.HTMLAttributes<HTMLDivElement> {
    user?: Pick<User, "name" | "image">;
}

const Profile = ({ user }: ProfileProps) => {
    const [showMoreToggle, setShowMoreToggle] =
        useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const { signOut } = useAuthActions();

    const { theme, setTheme } = useTheme();

    const ref = useRef<HTMLDivElement>(null);

    useOnClickOutside(ref, () => {
        setOpen(false);
        setShowMoreToggle(false);
    });

    return (
        <DropdownMenu open={open}>
            <DropdownMenuTrigger asChild>
                <UserAvatar
                    onClick={() => setOpen(!open)}
                    user={{
                        name: user?.name || null,
                        image: user?.image || null,
                    }}
                    className="size-10"
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                ref={ref}
                align="end"
                side="bottom"
                sideOffset={-50}
                className={cn(
                    "z-[100] h-[179px] w-64 rounded-2xl ml-2 transition-all ease-out duration-200",
                    !open && "hidden",
                    showMoreToggle ? "w-80 h-[94px]" : null,
                )}
            >
                {!showMoreToggle && (
                    <>
                        <DropdownMenuItem
                            onClick={() => setShowMoreToggle(true)}
                            className="rounded-xl py-2.5 px-2 flex items-center justify-between"
                        >
                            <div className="text-sm font-semibold">
                                Giao diện
                            </div>
                            <ChevronRight className="size-5" />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={"/settings"}
                                className="text-sm font-semibold rounded-xl py-2.5 px-2"
                            >
                                Cài đặt
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link
                                href={"/settings"}
                                className="text-sm font-semibold rounded-xl py-2.5 px-2"
                            >
                                Báo cáo sự cố
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <button
                                onClick={() => signOut()}
                                className="text-sm w-full font-semibold rounded-xl py-2.5 px-2"
                            >
                                Đăng xuất
                            </button>
                        </DropdownMenuItem>
                    </>
                )}
                {showMoreToggle && (
                    <div className="flex flex-col gap-2">
                        <div className="w-full flex items-center font-semibold py-2 px-2">
                            <div
                                onClick={() =>
                                    setShowMoreToggle(false)
                                }
                                className="absolute top-0 w-12 h-12 flex items-center justify-center "
                            >
                                <ArrowLeft className="size-5" />
                            </div>
                            <div className="text-center flex-1 text-sm">
                                Giao diện
                            </div>
                        </div>

                        <Tabs defaultValue={theme}>
                            <TabsList className="w-full rounded-xl h-[40px]">
                                <TabsTrigger
                                    value="light"
                                    className="h-full w-1/3 rounded-lg"
                                    onClick={() => setTheme("light")}
                                >
                                    <Sun className="w-5 h-5" />
                                </TabsTrigger>
                                <TabsTrigger
                                    value="dark"
                                    className="h-full w-1/3 rounded-lg"
                                    onClick={() => setTheme("dark")}
                                >
                                    <Moon className="w-5 h-5" />
                                </TabsTrigger>
                                <TabsTrigger
                                    value="system"
                                    className="h-full w-1/3 rounded-lg text-sm"
                                    onClick={() => setTheme("system")}
                                >
                                    Tự động
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Profile;
