"use client";

import { useState } from "react";
import SignUp from "./link-sent";
import { SignInFlow } from "./type";
import SignIn from "./sign-in";
import Link from "next/link";
import { Righteous } from "next/font/google";
import { cn } from "@/lib/utils";

import { Circle, Flame, SquareArrowOutUpRight } from "lucide-react";
import LinkSent from "./link-sent";
const righteous = Righteous({
    subsets: ["latin"],
    weight: ["400"],
});

const AuthScreen = () => {
    const [step, setStep] = useState<SignInFlow>("SIGN_IN");
    return (
        <main className="flex flex-col md:flex-row-reverse h-screen">
            <section className="w-full md:w-1/3 flex mx-auto items-start md:items-center px-4 md:px-0">
                <div className="flex flex-row items-center w-full max-w-sm min-w-min mx-auto md:mx-0 my-auto relative md:-left-4 text-primary">
                    <Link
                        href={"/"}
                        className={cn(
                            "bg-white text-3xl py-8 flex items-center gap-2",
                            righteous.className,
                        )}
                    >
                        <Flame className="w-9 h-9" strokeWidth={3} />
                        Qix
                    </Link>
                    <div
                        className={cn(
                            "items-start absolute gap-x-4 top-36 left-2 hidden",
                            step === "SIGN_IN" ? "md:flex" : "hidden",
                        )}
                    >
                        <div className="bg-white text-primary">
                            <Circle
                                strokeWidth={2.3}
                                className="w-2 h-2 m-1"
                            />
                        </div>
                        <div className="text-sm -mt-1 max-w-[280px]">
                            Thông tin chi tiết: Báo cáo độ trễ tối đa
                            <Link
                                href="/"
                                className="flex items-center gap-x-1 text-blue-500"
                            >
                                Đọc thêm{" "}
                                <SquareArrowOutUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <div className="md:flex justify-center items-center px-4 md:px-0 md:w-2/3 md:border-r transition-all">
                {step === "SIGN_IN" ? (
                    <SignIn handleSent={() => setStep("LINK_SENT")} />
                ) : (
                    <LinkSent
                        handleCancel={() => setStep("SIGN_IN")}
                    />
                )}
            </div>
        </main>
    );
};

export default AuthScreen;
