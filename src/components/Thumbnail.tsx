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
                <DialogTitle className="relative overflow-hidden max-w-[60px] border rounded-md my-1 cursor-zoom-in">
                    <img
                        src={url}
                        className="rounded-md size-full object-cover"
                        alt="thumbnail"
                    />
                </DialogTitle>
            </DialogTrigger>
            <DialogContent className="max-w-[600px] border-none p-0 shadow-none">
                <img
                    src={url}
                    className="rounded-md size-full object-cover"
                    alt="thumbnail"
                />
            </DialogContent>
        </Dialog>
    );
};

export default Thumbnail;
