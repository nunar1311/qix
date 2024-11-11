"use client";

import { useEffect, useState } from "react";
import CreateWorkspaceModal from "./workspace/create-workspace-modal";
import CreateChannelModal from "./channel/create-channel-modal";
import UpdateUserModal from "./auth/update-user-modal";

export const Modal = () => {
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }
    return (
        <>
            <CreateWorkspaceModal />
            <CreateChannelModal />
            <UpdateUserModal />
        </>
    );
};
