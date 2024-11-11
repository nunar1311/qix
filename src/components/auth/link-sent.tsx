import React from "react";
import { Button } from "../ui/button";
import { SignInFlow } from "./type";
import { Flame } from "lucide-react";

interface LinkSentProps {
    handleCancel: (value: SignInFlow) => void;
}

const LinkSent = ({ handleCancel }: LinkSentProps) => {
    return (
        <div className="flex flex-col items-center justify-center gap-y-2">
            <Flame className="w-12 h-12 text-primary" />
            <div>Kiểm tra email của bạn</div>
            <div>Chúng tôi đã gửi một liên kết đến email của bạn</div>
            <Button
                variant={"link"}
                onClick={() => handleCancel("SIGN_IN")}
            >
                Quay lại
            </Button>
        </div>
    );
};

export default LinkSent;
