'use client';

import { CentroDTO } from "@/app/core/dto/centro.dto";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/api";
import LoadComponent from "@/shared/load";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import CreateCentroModal from "./create-centro-modal";
import EditCentroModal from "./edit-centro-modal";

export default function CentrosAdmin() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [centros, setCentros] = useState<CentroDTO[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [editingCentro, setEditingCentro] = useState<CentroDTO | null>(null);

    useEffect(() => {
        fetchCentros();
    }, []);

    const fetchCentros = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/centro/find-all");
            setCentros(response.data);
        } catch (error) {
            console.error("Error fetching centros:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getCenterColor = (nome: string) => {
        const colors = [
            "from-emerald-500 to-teal-600",
            "from-amber-500 to-orange-600",
            "from-cyan-500 to-blue-600",
            "from-violet-500 to-purple-600",
            "from-rose-500 to-pink-600",
            "from-lime-500 to-green-600",
            "from-sky-500 to-cyan-600",
            "from-fuchsia-500 to-purple-600"
        ];
        const index = nome?.length % colors.length || 0;
        return colors[index];
    };

    const openModalCreateCentro = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleCentroCreated = () => {
        fetchCentros();
        closeModal();
    };

    const onClickMakeAction = async (action: "edit" | "delete", centro: CentroDTO) => {
        if (action === "delete") {
            setIsLoading(true);
            try {
                const response = await api.delete(`/centro/${centro.id}`);
                console.log(response);
                fetchCentros();
            } catch (error) {
                console.error("Error deleting centro:", error);
            } finally {
                setIsLoading(false);
            }
        } else if (action === "edit") {
            setEditingCentro(centro);
            setIsEditModalOpen(true);
        }
        return;
    }
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingCentro(null);
    };

    const handleCentroUpdated = () => {
        fetchCentros();
        setIsEditModalOpen(false);
        setEditingCentro(null);
    };


    if (isLoading) {
        return <LoadComponent />;
    }

    return (
        <div className="p-6 w-full h-full flex flex-col items-center gap-8 bg-gray-50 min-h-screen">
            <div className="w-full max-w-7xl">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gerenciamento de Centros</h1>
                        <p className="text-gray-600">Lista de todos os centros universitários cadastrados</p>
                    </div>
                    <Button 
                        onClick={openModalCreateCentro}
                        className="bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Novo Centro
                    </Button>
                </div>                
                <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center gap-6 text-sm text-emerald-800">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                            <span>Total de centros: <strong>{centros.length}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                            <span>Ativos: <strong>{centros.length}</strong></span>
                        </div>
                    </div>
                </div>
            </div>
            {centros.length > 0 ? (
                <>
                    <div className="w-full px-6">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                            <Table className="w-full">
                                <TableHeader className="bg-gradient-to-r from-emerald-600 to-teal-700">
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableHead className="text-white font-bold text-sm py-4 border-r border-emerald-500 min-w-[300px]">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                <span>Centro Universitário</span>
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-white font-bold text-sm py-4 border-r border-emerald-500 min-w-[300px]">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span>Localização</span>
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-white font-bold text-sm py-4 w-[200px]">
                                            <div className="flex items-center gap-2 justify-center">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                                <span>Ações</span>
                                            </div>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {centros.map((centro, index) => (
                                        <TableRow 
                                            key={v4()} 
                                            className={`
                                                transition-all duration-200 border-b border-gray-100
                                                ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                                hover:bg-emerald-50 hover:shadow-sm
                                            `}
                                        >
                                            <TableCell className="py-4 border-r border-gray-100">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 bg-gradient-to-r ${getCenterColor(centro.nome!)} rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                                                        {centro.nome?.charAt(0).toUpperCase() || 'C'}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-bold text-gray-800 text-lg">{centro.nome}</span>
                                                            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-medium">
                                                                Ativo
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 border-r border-gray-100">
                                                <div className="flex items-start gap-3">
                                                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                    <div>
                                                        <span className="text-gray-700 font-medium block">{centro.localizacao}</span>
                                                        <span className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Cadastrado recentemente
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex justify-center items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="bg-blue-600 hover:bg-blue-700 text-white shadow hover:shadow-md transition-all"
                                                        onClick={() => onClickMakeAction("edit", centro)}
                                                    >
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="bg-red-600 hover:bg-red-700 text-white shadow hover:shadow-md transition-all"
                                                        onClick={() => onClickMakeAction("delete", centro)}
                                                    >
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Excluir
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    <div className="w-full max-w-7xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div className="text-3xl font-bold text-gray-800">{centros.length}</div>
                                <div className="text-gray-600">Total de Centros</div>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div className="text-3xl font-bold text-gray-800">{centros.length}</div>
                                <div className="text-gray-600">Centros Ativos</div>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="text-3xl font-bold text-gray-800">{new Date().getFullYear()}</div>
                                <div className="text-gray-600">Ano de Cadastro</div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="w-full max-w-7xl">
                    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-lg border border-gray-200">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum centro encontrado</h3>
                            <p className="text-gray-500 mb-6">Não há centros cadastrados no sistema no momento.</p>
                            <Button 
                                onClick={openModalCreateCentro}
                                className="bg-emerald-600 hover:bg-emerald-700"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Criar Primeiro Centro
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <CreateCentroModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onCentroCreated={handleCentroCreated}
            />
            <EditCentroModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                onCentroUpdated={handleCentroUpdated}
                centro={editingCentro}
            />
        </div>
    );
}