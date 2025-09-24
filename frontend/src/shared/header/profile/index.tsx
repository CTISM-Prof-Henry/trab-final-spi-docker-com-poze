'use client';

import { useState } from "react";
import profileExample from "../../../../public/user-shield-alt-1-svgrepo-com.png";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Profile() {

    const [expandProfile, setExpandProfile] = useState<boolean>(false);
    const router = useRouter();

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

    return (
        <div>
            <img src={profileExample.src} onClick={onClickExpandProfile} className="w-[40px] bg-neutral-200 rounded-2xl"/>
            {expandProfile ? (
                <div className="absolute w-48 bg-white rounded-lg shadow-lg p-4 flex flex-col gap-4">
                    <button
                        className="w-full text-left text-red-500 hover:text-red-700"
                        onClick={onClickLogout}
                    >
                        Sair
                    </button>
                </div>
            ) : null}
        </div>
    );
}