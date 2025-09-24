'use client'

import HeaderLink from "./header-link";
import Profile from "./profile";

export default function Header() {

    const isAdmin = sessionStorage.getItem("user_role") === "ADMIN";

    switch (isAdmin) {
        case true:
            return (
                <div className="w-full p-4 bg-blue-400 flex justify-center items-center gap-8">
                    <HeaderLink href="/">Home</HeaderLink>
                    <HeaderLink href="/salas">Salas</HeaderLink>
                    <HeaderLink href="/centros">Centros</HeaderLink>
                    <HeaderLink href="/disciplinas">Disciplinas</HeaderLink>
                    <HeaderLink href="/usuarios">Usuários</HeaderLink>
                    <HeaderLink href="/agendamentos">Agendamentos</HeaderLink>
                    <Profile />
                </div>
            );
            break;
        case false:
            return (
                <div>
                    <h1>Header User</h1>
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