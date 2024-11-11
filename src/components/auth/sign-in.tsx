"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/Icons";
import { useAuthActions } from "@convex-dev/auth/react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
});

interface SignInProps {
    handleSent: (email: string) => void;
}

const SignIn = ({ handleSent }: SignInProps) => {
    const [isPending, setIsPending] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>();

    const { signIn } = useAuthActions();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        setIsPending(true);
        signIn("resend", {
            email: values.email,
        })
            .then(() => {
                handleSent?.(values.email);
            })
            .catch(() => {
                setError("Đăng nhập không thành công");
            })
            .finally(() => {
                setIsPending(false);
            });
    };

    const handleSignIn = (provider: "github" | "google") => {
        setIsPending(true);
        signIn(provider).finally(() => {
            setIsPending(false);
        });
    };

    return (
        <div className="w-full md:w-7/12 max-w-sm min-w-min mx-auto md:py-20 py-8 ">
            <h2 className="font-semibold text-lg md:text-xl">
                Đăng nhập
            </h2>
            <p className="text-zinc-600 font-light text-sm">
                Đăng nhập vào tài khoản của bạn
            </p>

            <div className="mt-8">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="mb-8"
                    >
                        {!!error ? (
                            <div className="px-4 py-2 mb-8 border-l-2 border-blue-500 text-sm">
                                {error}
                            </div>
                        ) : null}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="mb-6">
                                    <FormMessage
                                        className={cn(
                                            "px-4 py-2 mb-8 border-l-2 border-blue-500 text-sm text-zinc-900",
                                        )}
                                    />
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            autoFocus
                                            required
                                            className="bg-zinc-50"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            size={"default"}
                            className="w-full"
                            disabled={isPending}
                            isLoading={isPending}
                        >
                            Tiếp tục
                        </Button>
                    </form>
                </Form>
                <div className="flex flex-col mb-6">
                    <hr className="h-0 border-t mt-0.5" />
                    <div className="-mt-2.5 text-sm text-center">
                        <span className="px-2 bg-white text-zinc-600">
                            Hoặc với
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-x-2">
                    <Button
                        className="w-full"
                        variant={"outline"}
                        disabled={isPending}
                        isLoading={isPending}
                        onClick={() => handleSignIn("github")}
                    >
                        <Icons.github className="w-5 h-5 mr-2" />
                        Github
                    </Button>
                    <Button
                        className="w-full"
                        variant={"outline"}
                        disabled={isPending}
                        onClick={() => handleSignIn("google")}
                        isLoading={isPending}
                    >
                        <Icons.google className="w-5 h-5 mr-2" />
                        Google
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
