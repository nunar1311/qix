"use client";

import { Icons } from "@/components/Icons";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { useGetWorkspaces } from "@/hooks/workspace/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/store/use-create-workspace-modal";
import { useUpdateUserModal } from "@/store/use-update-user-modal";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function Home() {
    const [open, setOpen] = useCreateWorkspaceModal();
    const [_open, _setOpen] = useUpdateUserModal();
    const { workspaces, isLoading } = useGetWorkspaces();
    const { user } = useCurrentUser();
    const router = useRouter();

    const workspaceId = useMemo(
        () => workspaces?.[0]?._id,
        [workspaces],
    );

    useEffect(() => {
        if (isLoading) return;

        if (!user?.username && !_open) {
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
        _open,
        _setOpen,
        user,
    ]);

    return (
        <div className="flex items-center justify-center h-screen ">
            <Icons.load className="size-20 fill-zinc-500" />
        </div>
    );
}
