import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";

interface ThumbnailProps {
    url: string | null | undefined;
}

const Thumbnail = ({ url }: ThumbnailProps) => {
    if (!url) return null;

    return (
        <Dialog>
            <DialogTrigger>
                <DialogTitle className="relative overflow-hidden max-w-[360px] border rounded-md my-1 cursor-zoom-in">
                    <Image
                        src={url}
                        className="rounded-md size-full object-cover"
                        alt="thumbnail"
                        fill
                    />
                </DialogTitle>
            </DialogTrigger>
            <DialogContent className="max-w-[600px] border-none p-0 shadow-none">
                <Image
                    src={url}
                    className="rounded-md size-full object-cover"
                    alt="thumbnail"
                    fill
                />
            </DialogContent>
        </Dialog>
    );
};

export default Thumbnail;
