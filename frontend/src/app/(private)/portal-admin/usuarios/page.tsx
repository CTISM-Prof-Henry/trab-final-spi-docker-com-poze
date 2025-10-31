'use client';

import UserDTO from "@/app/core/dto/user.dto";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

export default function UsuariosAdmin() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<UserDTO[]>([]);

    useEffect(() => {
        setIsLoading(true);
        const fetchUsers = async () => {
            try {
                const response = await api.get<UserDTO[]>('/users/find-all');
                setUsers(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
                setIsLoading(false);
            }
        }

        fetchUsers();
    }, []);

    if (isLoading) {
        return (
            <div>Loading...</div>
        );
    } else if (users.length === 0) {
        return (
            <div className="p-4 w-full h-full text-center">Nenhum usuário cadastrado</div>
        );
    } else {
        return (
            <div className="p-4 w-full h-full">
                <Table className="max-w-lg mx-auto border border-neutral-800">
                    <TableHeader className="w-[100px] bg-gray-200">
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Matrícula</TableHead>
                            <TableHead>Tipo</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={v4()} className="hover:bg-neutral-200">
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.matricula}</TableCell>
                                <TableCell>{user.tipo}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }
}