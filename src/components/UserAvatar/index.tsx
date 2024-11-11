import { User } from "@auth/core/types";
import { AvatarProps } from "@radix-ui/react-avatar";
import React from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Image from "next/image";

interface UserAvatarProps extends AvatarProps {
    user: Pick<User, "image" | "name">;
}

const UserAvatar = ({ user, ...props }: UserAvatarProps) => {
    return (
        <Avatar {...props}>
            {user?.image ? (
                <div className="relative aspect-square w-full h-full">
                    <Image
                        alt={user.name || ""}
                        src={user.image}
                        referrerPolicy="no-referrer"
                        fill
                        sizes="100%"
                    />
                </div>
            ) : (
                <AvatarFallback>
                    <div className="relative aspect-square w-full h-full animate-pulse" />
                </AvatarFallback>
            )}
        </Avatar>
    );
};

export default UserAvatar;
