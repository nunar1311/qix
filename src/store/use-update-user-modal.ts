import { atom, useAtom } from "jotai";

const modalState = atom(false);

export const useUpdateUserModal = () => {
    return useAtom(modalState);
};
