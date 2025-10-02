'use client'

import { useEffect, useState } from "react";
import HeaderLink from "./header-link";
import Profile from "./profile";

export default function Header() {

    const [isAdmin, setIsAdmin] = useState<boolean>();

    useEffect(() => {
        setIsAdmin(sessionStorage.getItem("user_role") === "ADMIN");
    }, []);

    switch (isAdmin) {
        case true:
            return (
                <div className="w-full p-4 bg-blue-400 flex justify-center items-center gap-8">
                    <HeaderLink href="/portal-admin/">Home</HeaderLink>
                    <HeaderLink href="/portal-admin/salas">Salas</HeaderLink>
                    <HeaderLink href="/portal-admin/centros">Centros</HeaderLink>
                    <HeaderLink href="/portal-admin/disciplinas">Disciplinas</HeaderLink>
                    <HeaderLink href="/portal-admin/usuarios">Usuários</HeaderLink>
                    <HeaderLink href="/portal-admin/agendamentos">Agendamentos</HeaderLink>
                    <Profile />
                </div>
            );
            break;
        case false:
            return (
                <div className="w-full p-4 bg-blue-400 flex justify-center items-center gap-8">
                    <HeaderLink href="/">Início</HeaderLink>
                    <HeaderLink href="/agendar">Agendar</HeaderLink>
                    <HeaderLink href="/meus-agendamentos">Meus Agendamentos</HeaderLink>
                    <Profile />
                </div>
            );
            break;
        default:
            return (
                <div>
                    <h1>Header Default</h1>
                </div>
            );
            break;
    }
}