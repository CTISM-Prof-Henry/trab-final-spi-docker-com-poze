'use client';

import { DisciplinaDTO } from "@/app/core/dto/disciplina.dto";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/api";
import LoadComponent from "@/shared/load";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { v4 } from "uuid";
import CreateDisciplinaModal from "./create-disciplina-modal";
import EditDisciplinaModal from "./edit-disciplina-modal";

export default function DisciplinasAdmin() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [disciplinas, setDisciplinas] = useState<DisciplinaDTO[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [editingDisciplina, setEditingDisciplina] = useState<DisciplinaDTO | null>(null);

    const fetchDisciplinas = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/disciplina/find-all");
            setDisciplinas(response.data);
        } catch (error) {
            console.error("Error fetching disciplinas:", error);
        } finally {
            setIsLoading(false);
        }
    }
    
    useEffect(() => {
        fetchDisciplinas();
    }, []);

    const getDisciplinaColor = (nome: string) => {
        const colors = [
            "from-blue-500 to-cyan-600",
            "from-purple-500 to-indigo-600",
            "from-orange-500 to-red-600",
            "from-green-500 to-emerald-600",
            "from-pink-500 to-rose-600",
            "from-yellow-500 to-amber-600",
            "from-teal-500 to-cyan-600",
            "from-violet-500 to-purple-600"
        ];
        const index = nome?.length % colors.length || 0;
        return colors[index];
    };

    const getCargaHorariaBadge = (cargaHoraria: number) => {
        if (cargaHoraria <= 40) {
            return "bg-blue-100 text-blue-800 border-blue-200";
        } else if (cargaHoraria <= 80) {
            return "bg-green-100 text-green-800 border-green-200";
        } else if (cargaHoraria <= 120) {
            return "bg-amber-100 text-amber-800 border-amber-200";
        } else {
            return "bg-red-100 text-red-800 border-red-200";
        }
    };

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const handleDisciplinaCreated = () => {
        fetchDisciplinas();
        closeCreateModal();
    };

    const onClickMakeAction = (action: "edit" | "delete", disciplina: DisciplinaDTO) => {
        if (action === "delete") {
            Swal.fire({
                title: "Você tem certeza?",
                text: `Esta ação excluirá a disciplina "${disciplina.nome}" permanentemente.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sim, excluir!",
                cancelButtonText: "Cancelar"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        setIsLoading(true);
                        await api.delete(`/disciplina/${disciplina.id}`);
                        Swal.fire({
                            title: "Excluída!",
                            text: "A disciplina foi excluída com sucesso.",
                            icon: "success"
                        });
                        fetchDisciplinas();
                    } catch (error) {
                        console.error("Error deleting disciplina:", error);
                        Swal.fire("Erro", "Não foi possível excluir a disciplina.", "error");
                    } finally {
                        setIsLoading(false);
                    }
                }
            });
        } else if (action === "edit") {
            setEditingDisciplina(disciplina);
            setIsEditModalOpen(true);
        }
    };

    const handleDisciplinaUpdated = () => {
        fetchDisciplinas();
        setIsEditModalOpen(false);
        setEditingDisciplina(null);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingDisciplina(null);
    };

    const totalCargaHoraria = disciplinas.reduce((sum, disc) => sum + (disc.cargaHoraria || 0), 0);
    const mediaCargaHoraria = disciplinas.length > 0 ? totalCargaHoraria / disciplinas.length : 0;
    const disciplinasLongas = disciplinas.filter(disc => (disc.cargaHoraria || 0) > 80).length;

    if (isLoading) {
        return <LoadComponent />;
    }

    return (
        <div className="p-6 w-full h-full flex flex-col items-center gap-8 bg-gray-50 min-h-screen">
            <div className="w-full max-w-7xl">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gerenciamento de Disciplinas</h1>
                        <p className="text-gray-600">Lista de todas as disciplinas acadêmicas cadastradas</p>
                    </div>
                    <Button 
                        onClick={openCreateModal}
                        className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all text-white"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nova Disciplina
                    </Button>
                </div>
                
                {/* Statistics Banner */}
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <div className="flex flex-wrap items-center gap-6 text-sm text-blue-800">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>Total de disciplinas: <strong>{disciplinas.length}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>Média de carga horária: <strong>{mediaCargaHoraria.toFixed(0)}h</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                            <span>Disciplinas longas (+80h): <strong>{disciplinasLongas}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span>Carga horária total: <strong>{totalCargaHoraria}h</strong></span>
                        </div>
                    </div>
                </div>
            </div>
            {disciplinas.length > 0 ? (
                <>
                    <div className="w-full px-6">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                            <Table className="w-full">
                                <TableHeader className="bg-gradient-to-r from-blue-600 to-cyan-700">
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableHead className="text-white font-bold text-sm py-4 border-r border-blue-500 min-w-[300px]">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                                <span>Disciplina</span>
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-white font-bold text-sm py-4 border-r border-blue-500 min-w-[200px]">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                                </svg>
                                                <span>Código</span>
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-white font-bold text-sm py-4 border-r border-blue-500">
                                            <div className="flex items-center gap-2 justify-center">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Carga Horária</span>
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
                                    {disciplinas.map((disciplina, index) => (
                                        <TableRow 
                                            key={v4()} 
                                            className={`
                                                transition-all duration-200 border-b border-gray-100
                                                ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                                hover:bg-blue-50 hover:shadow-sm
                                            `}
                                        >
                                            <TableCell className="py-4 border-r border-gray-100">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 bg-gradient-to-r ${getDisciplinaColor(disciplina.nome!)} rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                                                        {disciplina.nome?.charAt(0).toUpperCase() || 'D'}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-bold text-gray-800 text-lg">{disciplina.nome}</span>
                                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                                                                Ativa
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
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-gray-700 bg-gray-100 px-3 py-2 rounded-lg text-sm border border-gray-200">
                                                        {disciplina.codigo || 'N/A'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 border-r border-gray-100">
                                                <div className="flex justify-center">
                                                    <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getCargaHorariaBadge(disciplina.cargaHoraria!)}`}>
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {disciplina.cargaHoraria}h
                                                        </div>
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex justify-center items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="bg-blue-600 hover:bg-blue-700 text-white shadow hover:shadow-md transition-all"
                                                        onClick={() => onClickMakeAction("edit", disciplina)}
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
                                                        onClick={() => onClickMakeAction("delete", disciplina)}
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
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div className="text-3xl font-bold text-gray-800">{disciplinas.length}</div>
                                <div className="text-gray-600">Total de Disciplinas</div>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="text-3xl font-bold text-gray-800">{mediaCargaHoraria.toFixed(0)}h</div>
                                <div className="text-gray-600">Média de Carga Horária</div>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <div className="text-3xl font-bold text-gray-800">{disciplinasLongas}</div>
                                <div className="text-gray-600">Disciplinas Longas</div>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div className="text-3xl font-bold text-gray-800">{totalCargaHoraria}h</div>
                                <div className="text-gray-600">Carga Horária Total</div>
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma disciplina encontrada</h3>
                            <p className="text-gray-500 mb-6">Não há disciplinas cadastradas no sistema no momento.</p>
                            <Button 
                                onClick={openCreateModal}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Criar Primeira Disciplina
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            <CreateDisciplinaModal
                isOpen={isCreateModalOpen}
                onClose={closeCreateModal}
                onDisciplinaCreated={handleDisciplinaCreated}
            />
            <EditDisciplinaModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                onDisciplinaUpdated={handleDisciplinaUpdated}
                disciplina={editingDisciplina}
            />
        </div>
    );
}