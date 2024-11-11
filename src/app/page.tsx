"use client";

import { useCurrentUser } from "@/hooks/user/use-current-user";
import { useGetWorkspaces } from "@/hooks/workspace/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/store/use-create-workspace-modal";
import { useUpdateUserModal } from "@/store/use-update-user-modal";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function Home() {
    const [open, setOpen] = useCreateWorkspaceModal();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_open, _setOpen] = useUpdateUserModal();
    const { workspaces, isLoading } = useGetWorkspaces();
    const { user } = useCurrentUser();
    const router = useRouter();

    console.log(user?.username);

    const workspaceId = useMemo(
        () => workspaces?.[0]?._id,
        [workspaces],
    );

    useEffect(() => {
        if (isLoading) return;
        if (!user?.username) {
            _setOpen(true);
        }

        if (workspaceId) {
            router.replace(`/workspace/${workspaceId}`);
        } else if (!open) {
            setOpen(true);
        }
    }, [
        workspaceId,
        isLoading,
        open,
        setOpen,
        router,
        _setOpen,
        user,
    ]);

    return <div>Home</div>;
}
