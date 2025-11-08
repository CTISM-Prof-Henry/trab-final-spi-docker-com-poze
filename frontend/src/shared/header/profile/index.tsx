'use client';

import { useState, useRef, useEffect } from "react";
import profileExample from "../../../../public/user-shield-alt-1-svgrepo-com.png";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Profile({ isScrolled }: { isScrolled: boolean }) {
    const [expandProfile, setExpandProfile] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const userProps = JSON.parse(sessionStorage.getItem("user_props")!);
    const userRole = sessionStorage.getItem("user_role");

    const onClickExpandProfile = () => {
        setExpandProfile(!expandProfile);
    }

    async function onClickLogout() {
        try {
            const response = await api.post("/auth/logout");
            console.log(response);
            sessionStorage.removeItem("user_role");
            router.push("/login");
        } catch (err) {
            console.error("Erro ao deslogar:", err);
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setExpandProfile(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={onClickExpandProfile}
                className={`
                    flex items-center gap-3 p-1 rounded-full transition-all duration-200
                    ${isScrolled 
                        ? 'hover:bg-gray-100' 
                        : 'hover:bg-white/10'
                    }
                    ${expandProfile ? (isScrolled ? 'bg-gray-100' : 'bg-white/10') : ''}
                `}
            >
                <div className="flex items-center gap-2">
                    <div className="text-right hidden sm:block">
                        <div className={`text-sm font-medium ${
                            isScrolled ? 'text-gray-700' : 'text-white'
                        }`}>
                            {userProps.nome}
                        </div>
                        <div className={`text-xs ${
                            isScrolled ? 'text-gray-500' : 'text-white/80'
                        }`}>
                            {userRole}
                        </div>
                    </div>
                    <div className={`
                        w-10 h-10 rounded-full border-2 transition-all duration-200 overflow-hidden
                        ${isScrolled 
                            ? 'border-gray-300 hover:border-gray-400' 
                            : 'border-white/30 hover:border-white/50'
                        }
                        ${expandProfile ? (isScrolled ? 'border-gray-400' : 'border-white/50') : ''}
                    `}>
                        <Image 
                            src={profileExample.src} 
                            width={40} 
                            height={40} 
                            className="w-full h-full object-cover bg-gray-200" 
                            alt="Foto de perfil"
                        />
                    </div>
                </div>
            </button>
            {expandProfile && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-lg">
                                U
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-800 truncate">{userProps.nome}</div>
                                <div className="text-sm text-gray-600 truncate">{userProps.email}</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-2">
                        <button className="w-full flex items-center gap-3 px-3 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                            <span className="text-lg">👤</span>
                            <div>
                                <div className="font-medium">Meu Perfil</div>
                                <div className="text-xs text-gray-500">Configurações da conta</div>
                            </div>
                        </button>
                        <div className="border-t border-gray-200 my-2"></div>
                        <button
                            onClick={onClickLogout}
                            className="w-full flex items-center gap-3 px-3 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <span className="text-lg">🚪</span>
                            <div>
                                <div className="font-medium">Sair</div>
                                <div className="text-xs text-red-500">Encerrar sessão</div>
                            </div>
                        </button>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                        <div className="text-xs text-gray-500 text-center">
                            v1.0.0 • Sistema Acadêmico
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}