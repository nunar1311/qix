import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface UseGetMembersProps {
    workspaceId: Id<"workspaces">;
}

export const useGetMembers = ({
    workspaceId,
}: UseGetMembersProps) => {
    const members = useQuery(api.members.get, { workspaceId });
    const isLoading = members === undefined;

    return { members, isLoading };
};
