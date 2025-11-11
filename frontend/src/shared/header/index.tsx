'use client'

import { useEffect, useState } from "react";
import HeaderLink from "./header-link";
import Profile from "./profile";
import LoadComponent from "../load";

export default function Header() {
    const [isAdmin, setIsAdmin] = useState<boolean>();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        setIsAdmin(sessionStorage.getItem("user_role") === "ADMIN");
        
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const adminLinks = [
        { href: "/portal-admin/", label: "Dashboard", icon: "🏠" },
        { href: "/portal-admin/salas", label: "Salas", icon: "🚪" },
        { href: "/portal-admin/centros", label: "Centros", icon: "🏛️" },
        { href: "/portal-admin/disciplinas", label: "Disciplinas", icon: "📚" },
        { href: "/portal-admin/usuarios", label: "Usuários", icon: "👥" },
        { href: "/portal-admin/agendamentos", label: "Agendamentos", icon: "📅" }
    ];

    const userLinks = [
        { href: "/", label: "Início", icon: "🏠" },
        { href: "/portal-usuario/agendar", label: "Agendar", icon: "➕" },
    ];

    switch (isAdmin) {
        case true:
            return (
                <header className={`w-full sticky top-0 z-50 transition-all duration-300 ${
                    isScrolled 
                        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
                        : 'bg-gradient-to-r from-blue-600 to-purple-700'
                }`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                        <span className="text-blue-600 font-bold text-sm">SA</span>
                                    </div>
                                    <span className={`font-bold text-lg ${
                                        isScrolled ? 'text-gray-800' : 'text-white'
                                    }`}>
                                        Sistema Acadêmico
                                    </span>
                                </div>
                                <nav className="hidden md:flex items-center gap-1">
                                    {adminLinks.map((link) => (
                                        <HeaderLink 
                                            key={link.href}
                                            href={link.href} 
                                            icon={link.icon}
                                            isScrolled={isScrolled}
                                        >
                                            {link.label}
                                        </HeaderLink>
                                    ))}
                                </nav>
                            </div>
                            <Profile isScrolled={isScrolled} />
                        </div>
                    </div>
                </header>
            );
        case false:
            return (
                <header className={`w-full sticky top-0 z-50 transition-all duration-300 ${
                    isScrolled 
                        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
                        : 'bg-gradient-to-r from-green-600 to-emerald-700'
                }`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                        <span className="text-green-600 font-bold text-sm">SA</span>
                                    </div>
                                    <span className={`font-bold text-lg ${
                                        isScrolled ? 'text-gray-800' : 'text-white'
                                    }`}>
                                        Sistema Acadêmico
                                    </span>
                                </div>
                                <nav className="hidden md:flex items-center gap-1">
                                    {userLinks.map((link) => (
                                        <HeaderLink 
                                            key={link.href}
                                            href={link.href} 
                                            icon={link.icon}
                                            isScrolled={isScrolled}
                                        >
                                            {link.label}
                                        </HeaderLink>
                                    ))}
                                </nav>
                            </div>
                            <Profile isScrolled={isScrolled} />
                        </div>
                    </div>
                </header>
            );
        default:
            return (
                <header className="w-full bg-gray-800 p-4">
                    <div className="max-w-7xl mx-auto">
                        <LoadComponent />
                    </div>
                </header>
            );
    }
}