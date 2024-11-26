import { useGetMember } from "@/hooks/member/use-get-member";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import { ChevronDown, Mail, X } from "lucide-react";
import UserAvatar from "./UserAvatar";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { useCurrentMember } from "@/hooks/member/use-current-member";
import { useWorkspaceId } from "@/hooks/workspace/use-workspace-id";
import { useRemoveMember } from "@/hooks/member/use-remove-member";
import { useUpdateMember } from "@/hooks/member/use-update-member";
import { useToast } from "@/hooks/use-toast";
import useConfirm from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface ProfileMemberProps {
    memberId: Id<"members">;
    onClose: () => void;
}

const ProfileMember = ({ memberId, onClose }: ProfileMemberProps) => {
    const workspaceId = useWorkspaceId();

    const { toast } = useToast();
    const router = useRouter();

    const [UpdateDialog, confirmUpdate] = useConfirm(
        "Cấp quyền",
        "Bạn có chắc chắn muốn cấp quyền cho thành viên này?",
    );

    const [LeaveDialog, confirmLeave] = useConfirm(
        "Rời khỏi nhóm",
        "Bạn có chắc chắn muốn rời khỏi workspace?",
    );

    const [RemoveDialog, confirmRemove] = useConfirm(
        "Xoá khỏi nhóm",
        "Bạn có chắc chắn xoá thành viên này?",
    );

    const { member, isLoading: loadingMember } = useGetMember({
        id: memberId,
    });

    const { member: currentMember, isLoading: loadingCurrentMember } =
        useCurrentMember({ workspaceId });

    const { mutate: removeMember, isPending: removingMember } =
        useRemoveMember();

    const { mutate: updateMember, isPending: updatingMember } =
        useUpdateMember();

    const onRemove = async () => {
        const ok = await confirmRemove();

        if (!ok) {
            return;
        }

        removeMember(
            { id: memberId },
            {
                onSuccess: () => {
                    toast({
                        title: "Xoá thành viên thành công",
                    });
                    onClose();
                },
                onError: () => {
                    toast({
                        title: "Xoá thành viên thất bại",
                        variant: "destructive",
                    });
                },
            },
        );
    };

    const onLeave = async () => {
        const ok = await confirmLeave();

        if (!ok) {
            return;
        }

        removeMember(
            { id: memberId },
            {
                onSuccess: () => {
                    router.replace("/");
                    toast({
                        title: "Rời khỏi nhóm thành công",
                    });
                    onClose();
                },
                onError: () => {
                    toast({
                        title: "Rời khỏi nhóm thất bại",
                        variant: "destructive",
                    });
                },
            },
        );
    };

    const onUpdate = async (role: "admin" | "member") => {
        const ok = await confirmUpdate();

        if (!ok) {
            return;
        }

        updateMember(
            { id: memberId, role },
            {
                onSuccess: () => {
                    toast({
                        title: "Cấp quyền thành công",
                    });
                },
                onError: () => {
                    toast({
                        title: "Cấp quyền thất bại",
                        variant: "destructive",
                    });
                },
            },
        );
    };

    if (loadingMember || loadingCurrentMember) {
        return (
            <div className="flex flex-col gap-y-2 items-center justify-center h-full">
                <p>Đang tải...</p>
            </div>
        );
    }
    if (!member) {
        return (
            <div className="h-full flex flex-col">
                <div className="flex items-center justify-between h-12 px-4 border-b ">
                    <p className="text-lg font-bold">Chủ đề</p>
                    <Button
                        onClick={onClose}
                        variant={"ghost"}
                        size={"sm"}
                    >
                        <X className="size-5" />
                    </Button>
                </div>
                <div className="flex flex-col gap-y-2 items-center justify-center h-full">
                    <p>Không tìm thấy thành viên</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <UpdateDialog />
            <LeaveDialog />
            <RemoveDialog />
            <div className="h-full flex flex-col">
                <div className="flex items-center justify-between h-12 px-4 border-b ">
                    <p className="text-lg font-bold">Trang cá nhân</p>
                    <Button
                        onClick={onClose}
                        variant={"ghost"}
                        size={"sm"}
                    >
                        <X className="size-5" />
                    </Button>
                </div>
                <div className="flex flex-col items-center justify-center py-4">
                    <UserAvatar
                        user={{ image: member.user.image }}
                        className="size-full max-w-52 max-h-52 rounded-lg"
                    />
                    <div className="flex flex-col w-full items-center p-4">
                        <p className="text-xl font-bold">
                            {member.user.name}
                        </p>
                        <p className=" text-zinc-500">
                            {member.user.username}
                        </p>
                        {currentMember?.role === "admin" &&
                        currentMember._id !== memberId ? (
                            <div className="flex w-full items-center gap-2 mt-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className="w-1/2 capitalize font-semibold"
                                        >
                                            {member.role === "admin"
                                                ? "Quản trị viên"
                                                : "Thành viên"}
                                            <ChevronDown className="size-5 ml-2" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-40">
                                        <DropdownMenuRadioGroup
                                            value={member.role}
                                            onValueChange={(role) =>
                                                onUpdate(
                                                    role as
                                                        | "admin"
                                                        | "member",
                                                )
                                            }
                                        >
                                            <DropdownMenuRadioItem value="admin">
                                                Quản trị viên
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="member">
                                                Thành viên
                                            </DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button
                                    onClick={onRemove}
                                    variant={"outline"}
                                    className="w-1/2 capitalize text-red-500 font-semibold"
                                >
                                    Xoá thành viên
                                </Button>
                            </div>
                        ) : currentMember?._id === memberId &&
                          currentMember?.role !== "admin" ? (
                            <div className="mt-4">
                                <Button
                                    onClick={onLeave}
                                    variant={"outline"}
                                    className="w-full capitalize"
                                >
                                    Rời khỏi nhóm
                                </Button>
                            </div>
                        ) : null}
                    </div>
                    <Separator />
                    <div className="flex flex-col items-start w-full p-4">
                        <p className="text-sm font-bold mb-4">
                            Thông tin liên hệ
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="bg-zinc-100 size-10 rounded-lg flex items-center justify-center">
                                <Mail className="size-5" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-xs font-semibold text-zinc-600">
                                    Địa Chỉ Email
                                </p>
                                <Link
                                    className="text-blue-500 text-xs"
                                    href={`mailto:${member.user.email}`}
                                >
                                    {member.user.email}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileMember;
