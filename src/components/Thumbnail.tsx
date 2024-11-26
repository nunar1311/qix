import Image from "next/image";

interface ThumbnailProps {
    url: string | null | undefined;
}

const Thumbnail = ({ url }: ThumbnailProps) => {
    if (!url) return null;
    return (
        <div className="relative overflow-hidden max-w-[360px] border shadow-lg my-1 cursor-zoom-in">
            <img
                src={url}
                className="rounded-md size-full object-cover"
                alt="thumbnail"
            />
        </div>
    );
};

export default Thumbnail;
