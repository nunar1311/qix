import { useQueryState } from "nuqs";

export const useManagerChannelId = () => {
    return useQueryState("managerChannelId");
};
