'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderLink({ 
    href, 
    children, 
    icon,
    isScrolled 
}: Readonly<{ 
    href: string; 
    children: React.ReactNode; 
    icon?: string;
    isScrolled: boolean;
}>) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link 
            href={href} 
            className={`
                relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                    ? isScrolled 
                        ? 'bg-blue-100 text-blue-700 shadow-sm' 
                        : 'bg-white/20 text-white shadow-lg'
                    : isScrolled
                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                }
            `}
        >
            {icon && <span className="text-base">{icon}</span>}
            {children}
            {isActive && (
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                    isScrolled ? 'bg-blue-600' : 'bg-white'
                }`}></div>
            )}
        </Link>
    );
}