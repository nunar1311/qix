import UserAvatar from "../UserAvatar";

interface ConversationHeroProps {
    name: string;
    image: string;
    username: string;
}

const ConversationHero = ({
    name,
    image,
    username,
}: ConversationHeroProps) => {
    return (
        <div className="mt-[88px] mx-5 mb-4">
            <div className="text-2xl font-bold flex flex-col items-start mb-2 gap-2">
                <UserAvatar
                    user={{ image: image, name: name }}
                    className="size-20"
                />
                <p>{name}</p>
                <p className="font-normal text-xl">{username}</p>
            </div>
            <p>
                Đây là phần mở đầu trong lịch sử các tin nhắn trực
                tiếp của bạn với <strong>{name}</strong>.
            </p>
        </div>
    );
};

export default ConversationHero;
