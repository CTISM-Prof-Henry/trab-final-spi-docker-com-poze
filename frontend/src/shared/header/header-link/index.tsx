import Link from "next/link";

export default function HeaderLink({ href, children }: Readonly<{ href: string; children: React.ReactNode; }>) {
    return (
        <Link href={href} className="mr-4 text-amber-300 hover:text-amber-500">{children}</Link>
    );
}