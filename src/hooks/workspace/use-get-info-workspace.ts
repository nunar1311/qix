import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface UserGetInfoWorkspaceProps {
    id: Id<"workspaces">;
}

export const useGetInfoWorkspace = ({
    id,
}: UserGetInfoWorkspaceProps) => {
    const workspace = useQuery(api.workspaces.getInfoById, { id });
    const isLoading = workspace === undefined;

    return { workspace, isLoading };
};
