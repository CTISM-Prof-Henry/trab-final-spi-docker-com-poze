'use client';

import UserDTO from "@/app/core/dto/user.dto";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/api";
import LoadComponent from "@/shared/load";
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

    const getTipoBadge = (tipo: string) => {
        const tipoLower = tipo?.toLowerCase() || '';
        const styles = {
            admin: "bg-red-100 text-red-800 border-red-200",
            professor: "bg-purple-100 text-purple-800 border-purple-200",
            aluno: "bg-green-100 text-green-800 border-green-200",
            default: "bg-gray-100 text-gray-800 border-gray-200"
        };

        if (tipoLower.includes('admin')) return styles.admin;
        if (tipoLower.includes('professor')) return styles.professor;
        if (tipoLower.includes('aluno')) return styles.aluno;
        return styles.default;
    };

    if (isLoading) {
        return <LoadComponent />;
    } else if (users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-gray-50 min-h-screen">
                <div className="text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum usuário encontrado</h3>
                    <p className="text-gray-500">Não há usuários cadastrados no sistema no momento.</p>
                </div>
            </div>
        );
    } else {
        return (
            <div className="p-6 w-full h-full flex flex-col items-center gap-8 bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="w-full max-w-6xl">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Gerenciamento de Usuários</h1>
                    <p className="text-gray-600">Lista de todos os usuários cadastrados no sistema</p>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-4 text-sm text-blue-800">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span>Total de usuários: <strong>{users.length}</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span>Alunos: <strong>{users.filter(u => u.tipo?.toLowerCase().includes('aluno')).length}</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                <span>Professores: <strong>{users.filter(u => u.tipo?.toLowerCase().includes('professor')).length}</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <span>Administradores: <strong>{users.filter(u => u.tipo?.toLowerCase().includes('admin')).length}</strong></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabela Estilizada */}
                <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <Table className="w-full">
                        <TableHeader className="bg-gradient-to-r from-indigo-600 to-purple-700">
                            <TableRow className="border-none hover:bg-transparent">
                                <TableHead className="text-white font-bold text-sm py-4 border-r border-indigo-500">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>Nome do Usuário</span>
                                    </div>
                                </TableHead>
                                <TableHead className="text-white font-bold text-sm py-4 border-r border-indigo-500">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span>E-mail</span>
                                    </div>
                                </TableHead>
                                <TableHead className="text-white font-bold text-sm py-4 border-r border-indigo-500">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                        </svg>
                                        <span>Matrícula</span>
                                    </div>
                                </TableHead>
                                <TableHead className="text-white font-bold text-sm py-4">
                                    <div className="flex items-center gap-2 justify-center">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        <span>Tipo de Usuário</span>
                                    </div>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user, index) => (
                                <TableRow 
                                    key={v4()} 
                                    className={`
                                        transition-all duration-200 border-b border-gray-100
                                        ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                        hover:bg-indigo-50 hover:shadow-sm
                                    `}
                                >
                                    <TableCell className="py-4 border-r border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                {user.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-800 block">{user.name}</span>
                                                <span className="text-xs text-gray-500">ID: {user.uuid}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 border-r border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-700">{user.email}</span>
                                            {user.email && (
                                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 border-r border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded text-sm">
                                                {user.matricula || 'N/A'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex justify-center">
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getTipoBadge(user.tipo)}`}>
                                                {user.tipo || 'Não definido'}
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Estatísticas no Footer */}
                <div className="w-full max-w-6xl">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                                <div className="text-sm text-blue-800">Total de Usuários</div>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="text-2xl font-bold text-green-600">
                                    {users.filter(u => u.tipo?.toLowerCase().includes('aluno')).length}
                                </div>
                                <div className="text-sm text-green-800">Alunos</div>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                                <div className="text-2xl font-bold text-purple-600">
                                    {users.filter(u => u.tipo?.toLowerCase().includes('professor')).length}
                                </div>
                                <div className="text-sm text-purple-800">Professores</div>
                            </div>
                            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                <div className="text-2xl font-bold text-red-600">
                                    {users.filter(u => u.tipo?.toLowerCase().includes('admin')).length}
                                </div>
                                <div className="text-sm text-red-800">Administradores</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}