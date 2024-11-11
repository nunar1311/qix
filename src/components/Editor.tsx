"use client";

import Quill, { type QuillOptions } from "quill";
import "quill/dist/quill.snow.css";
import {
    MutableRefObject,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { Button } from "./ui/button";
import {
    CaseSensitive,
    ImageIcon,
    SendHorizonal,
    Smile,
} from "lucide-react";
import Hint from "./Hint";
import { Delta, Op } from "quill/core";
import { list } from "postcss";

type EditorValue = {
    image: File | null;
    body: string;
};

interface EditorProps {
    onSubmit: ({ image, body }: EditorValue) => void;
    onCancel?: () => void;
    placeholder?: string;
    defaultValue?: Delta | Op[];
    disabled?: boolean;
    innerRef?: MutableRefObject<Quill | null>;
    variant?: "create" | "update";
}

const Editor = ({
    variant = "create",
    onSubmit,
    onCancel,
    placeholder = "Nhập nội dung",
    defaultValue = [],
    disabled = false,
    innerRef,
}: EditorProps) => {
    const [text, setText] = useState("");
    const [isToolbarVisible, setIsToolbarVisible] = useState(true);

    const submitRef = useRef(onSubmit);
    const placeholderRef = useRef(placeholder);
    const quillRef = useRef<Quill | null>(null);
    const defaultValueRef = useRef(defaultValue);
    const containerRef = useRef<HTMLDivElement>(null);
    const disabledRef = useRef(disabled);

    useLayoutEffect(() => {
        submitRef.current = onSubmit;
        placeholderRef.current = placeholder;
        defaultValueRef.current = defaultValue;
        disabledRef.current = disabled;
    });

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const editorContainer = container.appendChild(
            container.ownerDocument.createElement("div"),
        );

        const options: QuillOptions = {
            theme: "snow",
            placeholder: placeholderRef.current,
            modules: {
                toolbar: [
                    ["bold", "italic", "underline"],
                    ["link"],
                    [{ list: "ordered" }, { list: "bullet" }],
                ],
                // keyboard: {
                //     bindings: {
                //         enter: {
                //             key: "Enter",
                //             handler: (value: any) => {
                //                 console.log(value);
                //             },
                //         },
                //     },
                // },
            },
        };

        const quill = new Quill(editorContainer, options);
        quillRef.current = quill;
        quillRef.current.focus();

        if (innerRef) {
            innerRef.current = quill;
        }

        quill.setContents(defaultValueRef.current);
        setText(quill.getText());

        quill.on(Quill.events.TEXT_CHANGE, () => {
            setText(quill.getText());
        });

        return () => {
            quill.off(Quill.events.TEXT_CHANGE);
            if (container) {
                container.innerHTML = "";
            }
            if (quillRef.current) {
                quillRef.current = null;
            }
            if (innerRef) {
                innerRef.current = null;
            }
        };
    }, [innerRef]);

    const toggleToolbar = () => {
        setIsToolbarVisible((current) => !current);
        const toolbarElement =
            containerRef.current?.querySelector(".ql-toolbar");

        if (toolbarElement) {
            toolbarElement.classList.toggle("hidden");
        }
    };

    const isEmpty =
        text.replace(/<(.|\n)*?>/g, "").trim().length === 0;
    return (
        <div className="flex flex-col">
            <div className="flex flex-col border rounded-md overflow-hidden focus-within:border-zinc-300 bg-white transition w-full">
                <div
                    ref={containerRef}
                    className="h-full ql-custom w-full"
                />
                <div className="px-2 pb-2 w-full flex items-center justify-between">
                    <div className="flex items-center gap-x-1">
                        <Hint
                            label={isToolbarVisible ? "Hide" : "Show"}
                        >
                            <Button
                                variant={"ghost"}
                                size={"sm"}
                                onClick={toggleToolbar}
                                disabled={disabled}
                            >
                                <CaseSensitive className="size-5" />
                            </Button>
                        </Hint>
                        <Hint label="Emoji">
                            <Button
                                variant={"ghost"}
                                size={"sm"}
                                disabled={disabled}
                            >
                                <Smile className="size-5" />
                            </Button>
                        </Hint>
                        {variant === "create" ? (
                            <Hint label="Hình ảnh">
                                <Button variant={"ghost"} size={"sm"}>
                                    <ImageIcon className="size-5" />
                                </Button>
                            </Hint>
                        ) : null}
                    </div>
                    {variant === "update" ? (
                        <div className="ml-auto flex items-center gap-x-2">
                            <Button
                                variant={"ghost"}
                                size={"sm"}
                                disabled={disabled}
                            >
                                Huỷ
                            </Button>
                            <Button
                                size={"sm"}
                                disabled={disabled || isEmpty}
                            >
                                Lưu thay đổi
                            </Button>
                        </div>
                    ) : null}
                    {variant === "create" ? (
                        <Button
                            disabled={disabled || isEmpty}
                            variant={"ghost"}
                            size={"sm"}
                        >
                            <SendHorizonal className="size-5 fill-current" />
                        </Button>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default Editor;
