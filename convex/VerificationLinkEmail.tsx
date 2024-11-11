import {
    Button,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Section,
    Tailwind,
    Text,
} from "@react-email/components";

interface VerificationLinkEmailProps {
    url: string;
    email: string;
}

export default function VerificationLinkEmail({
    url,
    email,
}: VerificationLinkEmailProps) {
    return (
        <Html>
            <Tailwind>
                <Head />
                <Container>
                    <Heading className="flex items-center justify-center container h-24 text-zinc-900 font-bold">
                        Qix
                    </Heading>
                    <Section>
                        <Text className="text-lg font-semibold">
                            Này, {email}
                        </Text>
                        <Text>
                            Cảm ơn bạn đã đăng ký tài khoản trên Qix!
                            Trước khi bắt đầu, chúng tôi cần xác nhận
                            rằng đây là bạn. Nhấp vào bên dưới để xác
                            minh địa chỉ email của bạn:
                        </Text>
                        <Link
                            className="my-4 bg-zinc-900 text-white "
                            href={url}
                        >
                            Xác minh Email
                        </Link>
                    </Section>
                </Container>
            </Tailwind>
        </Html>
    );
}
