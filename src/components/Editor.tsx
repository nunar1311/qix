import Quill, { type QuillOptions } from "quill";
import { Delta, Op } from "quill/core";
import {
    MutableRefObject,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { Button } from "./ui/button";
import { ImageIcon, SendHorizonal, Smile, X } from "lucide-react";
import Hint from "./Hint";

import "quill/dist/quill.snow.css";

import { cn } from "@/lib/utils";
import Image from "next/image";
import EmojiPicker from "./emoji-picker";

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
    placeholder,
    defaultValue = [],
    disabled = false,
    innerRef,
}: EditorProps) => {
    const [text, setText] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const submitRef = useRef(onSubmit);
    const placeholderRef = useRef(placeholder);
    const quillRef = useRef<Quill | null>(null);
    const defaultValueRef = useRef(defaultValue);
    const disabledRef = useRef(disabled);
    const imageElementRef = useRef<HTMLInputElement | null>(null);

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
                toolbar: false,
                keyboard: {
                    bindings: {
                        enter: {
                            key: "Enter",
                            handler: () => {
                                const text = quill.getText();
                                const addedImage =
                                    imageElementRef.current
                                        ?.files?.[0] || null;

                                const isEmpty =
                                    !addedImage &&
                                    text
                                        .replace(/<(.|\n)*?>/g, "")
                                        .trim().length === 0;
                                if (isEmpty) {
                                    return;
                                }
                                const body = JSON.stringify(
                                    quill.getContents(),
                                );
                                submitRef.current?.({
                                    body,
                                    image: addedImage,
                                });
                            },
                        },
                        shift_enter: {
                            key: "Enter",
                            shiftKey: true,
                            handler: () => {
                                quill.insertText(
                                    quill.getSelection()?.index || 0,
                                    "\n",
                                );
                            },
                        },
                    },
                },
            },
        };

        const quill = new Quill(editorContainer, options);
        quillRef.current = quill;

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
            if (innerRef?.current) {
                innerRef.current = null;
            }
        };
    }, [innerRef]);

    const onEmojiSelect = (emoji: any) => {
        const quill = quillRef.current;
        quill?.insertText(
            quill.getSelection()?.index || 0,
            emoji.native,
        );
    };

    const isEmpty =
        !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

    return (
        <div className="flex flex-col">
            <input
                type="file"
                accept="image/*"
                ref={imageElementRef}
                onChange={(e) => setImage(e.target.files![0])}
                className="hidden"
            />
            <div
                className={cn(
                    "flex justify-between items-end border rounded-md overflow-hidden transition bg-white",
                    disabled && "opacity-50",
                )}
            >
                <div className="flex flex-col w-full">
                    {!!image ? (
                        <div className="p-2">
                            <div className="relative size-16 flex items-center justify-center group/image">
                                <button
                                    onClick={() => {
                                        setImage(null);
                                        imageElementRef.current!.value =
                                            "";
                                    }}
                                    className="hidden top-0 right-0 group-hover/image:flex items-center justify-center rounded-full bg-zinc-900 text-zinc-50 size-5 z-[4]"
                                >
                                    <X className="size-3.5" />
                                </button>
                                <Image
                                    src={URL.createObjectURL(image)}
                                    fill
                                    className="rounded-xl overflow-hidden object-cover"
                                    alt="image"
                                />
                            </div>
                        </div>
                    ) : null}
                    <div
                        ref={containerRef}
                        className="ql-custom h-full w-full"
                    />
                </div>
                <div className="flex px-2 py-1 z-[5] gap-x-1">
                    <EmojiPicker onEmojiSelect={onEmojiSelect}>
                        <Button
                            disabled={false}
                            size={"sm"}
                            variant={"ghost"}
                        >
                            <Smile className="size-5" />
                        </Button>
                    </EmojiPicker>
                    {variant === "create" ? (
                        <>
                            <Hint label="Hình ảnh">
                                <Button
                                    disabled={false}
                                    size={"sm"}
                                    variant={"ghost"}
                                    onClick={() =>
                                        imageElementRef.current?.click()
                                    }
                                >
                                    <ImageIcon className="size-5" />
                                </Button>
                            </Hint>
                            <Button
                                disabled={disabled || isEmpty}
                                size={"sm"}
                                variant={"ghost"}
                                className={cn(
                                    "ml-auto bg-blue-500 hover:bg-blue-600 text-zinc-50 hover:text-zinc-50",
                                )}
                                onClick={() => {
                                    onSubmit({
                                        image,
                                        body: JSON.stringify(
                                            quillRef.current?.getContents(),
                                        ),
                                    });
                                }}
                            >
                                <SendHorizonal className="size-5" />
                            </Button>
                        </>
                    ) : null}
                </div>
            </div>
            {variant === "create" ? (
                <div
                    className={cn(
                        "p-2 text-xs text-zinc-600 flex justify-end opacity-0 transition",
                        !isEmpty && "opacity-100",
                    )}
                >
                    <p>
                        <strong className="text-blue-500">
                            Shift + Return
                        </strong>{" "}
                        để thêm dòng mới.
                    </p>
                </div>
            ) : null}
        </div>
    );
};

export default Editor;
