'use client';

import { AgendamentoDTO } from "@/app/core/dto/agendamento.dto";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/api";
import LoadComponent from "@/shared/load";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import CreateAgendamentoModal from "./create-agendamento-modal";
import Swal from "sweetalert2";

export default function AgendamentosUsuario() {
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [agendamentos, setAgendamentos] = useState<AgendamentoDTO[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    async function fetchAgendamentos() {
        setIsLoading(true);
        try {
            const uuid = JSON.parse(sessionStorage.getItem('user_props')!).uuid;
            if (!uuid) throw new Error('UUID do usuário não encontrado');
            const response = await api.get<AgendamentoDTO[]>(`/agendamento/find-by-user/${uuid}`);
            setAgendamentos(response.data);
        } catch(error) {
            console.error("Erro ao buscar agendamentos:", error);
            Swal.fire({
                title: "Erro",
                text: "Não foi possível carregar seus agendamentos",
                icon: "error"
            });
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchAgendamentos();
    }, []);

    const openModalCreateAgendamento = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleAgendamentoCreated = () => {
        fetchAgendamentos();
        closeModal();
    };

    const onClickCancelAgendamento = async (agendamento: AgendamentoDTO) => {
        Swal.fire({
            title: "Cancelar Agendamento",
            text: "Tem certeza que deseja cancelar este agendamento?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, cancelar",
            cancelButtonText: "Manter"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setIsLoading(true);
                    await api.delete(`/agendamento/${agendamento.id}`);
                    Swal.fire({
                        title: "Cancelado!",
                        text: "Agendamento cancelado com sucesso.",
                        icon: "success"
                    });
                    fetchAgendamentos();
                } catch (error: any) {
                    console.error("Error canceling agendamento:", error);
                    Swal.fire({
                        title: "Erro",
                        text: error.response?.data?.message || "Não foi possível cancelar o agendamento",
                        icon: "error"
                    });
                } finally {
                    setIsLoading(false);
                }
            }
        });
    };

    const getStatusBadge = (status: string) => {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower.includes('confirmado') || statusLower.includes('aprovado')) {
            return "bg-green-100 text-green-800 border-green-200";
        } else if (statusLower.includes('pendente') || statusLower.includes('aguardando')) {
            return "bg-amber-100 text-amber-800 border-amber-200";
        } else if (statusLower.includes('cancelado') || statusLower.includes('rejeitado')) {
            return "bg-red-100 text-red-800 border-red-200";
        } else {
            return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const formatDate = (dateString: string | Date) => {
        if (!dateString) return 'N/A';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Data inválida';
            
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return 'Data inválida';
        }
    };

    const formatTime = (timeString: string | Date) => {
        if (!timeString) return 'N/A';
        
        try {
            if (typeof timeString === 'string' && timeString.includes('GMT')) {
                const time = new Date(timeString);
                if (isNaN(time.getTime())) return 'Horário inválido';
                
                return time.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });
            }
            
            const time = new Date(timeString);
            if (isNaN(time.getTime())) return 'Horário inválido';
            
            return time.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        } catch (error) {
            console.error('Erro ao formatar horário:', error);
            return 'Horário inválido';
        }
    };

    const calculateDuration = (horaInicio: string | Date, horaFim: string | Date) => {
        if (!horaInicio || !horaFim) return 'N/A';
        
        try {
            const inicio = new Date(horaInicio);
            const fim = new Date(horaFim);
            
            if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
                return 'N/A';
            }
            
            const diff = fim.getTime() - inicio.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
        } catch (error) {
            console.error('Erro ao calcular duração:', error);
            return 'N/A';
        }
    };

    const getAgendamentoColor = (nome: string) => {
        const colors = [
            "from-blue-500 to-cyan-600",
            "from-purple-500 to-indigo-600",
            "from-emerald-500 to-teal-600",
            "from-amber-500 to-orange-600",
            "from-rose-500 to-pink-600",
            "from-violet-500 to-purple-600",
            "from-green-500 to-emerald-600",
            "from-cyan-500 to-blue-600"
        ];
        const index = nome?.length % colors.length || 0;
        return colors[index];
    };

    const agendamentosConfirmados = agendamentos.filter(ag => 
        ag.status?.toLowerCase().includes('confirmado') || ag.status?.toLowerCase().includes('aprovado')
    ).length;
    
    const agendamentosPendentes = agendamentos.filter(ag => 
        ag.status?.toLowerCase().includes('pendente') || ag.status?.toLowerCase().includes('aguardando')
    ).length;

    const hoje = new Date().toISOString().split('T')[0];
    const agendamentosHoje = agendamentos.filter(ag => {
        if (!ag.data) return false;
        const dataAgendamento = new Date(ag.data).toISOString().split('T')[0];
        return dataAgendamento === hoje;
    }).length;

    if (isLoading) {
        return <LoadComponent />;
    }

    return (
        <div className="p-6 w-full h-full flex flex-col items-center gap-8 bg-gray-50 min-h-screen">
            <div className="w-full max-w-7xl">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Meus Agendamentos</h1>
                        <p className="text-gray-600">Gerencie seus agendamentos de salas</p>
                    </div>
                    <Button 
                        onClick={openModalCreateAgendamento}
                        className="bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl text-white transition-all"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Novo Agendamento
                    </Button>
                </div>
                <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                    <div className="flex flex-wrap items-center gap-6 text-sm text-purple-800">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span>Total de agendamentos: <strong>{agendamentos.length}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>Confirmados: <strong>{agendamentosConfirmados}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                            <span>Pendentes: <strong>{agendamentosPendentes}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>Para hoje: <strong>{agendamentosHoje}</strong></span>
                        </div>
                    </div>
                </div>
            </div>
            {agendamentos.length > 0 ? (
                <>
                    <div className="w-full px-6">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                            <Table className="w-full">
                                <TableHeader className="bg-gradient-to-r from-purple-600 to-indigo-700">
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableHead className="text-white font-bold text-sm py-4 border-r border-purple-500 min-w-[200px]">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>Agendamento</span>
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-white font-bold text-sm py-4 border-r border-purple-500">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Horário</span>
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-white font-bold text-sm py-4 border-r border-purple-500 min-w-[150px]">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                                <span>Status</span>
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-white font-bold text-sm py-4 border-r border-purple-500">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                <span>Sala</span>
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-white font-bold text-sm py-4 border-r border-purple-500">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                                <span>Disciplina</span>
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-white font-bold text-sm py-4 w-[150px]">
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
                                    {agendamentos.map((agendamento, index) => (
                                        <TableRow 
                                            key={v4()} 
                                            className={`
                                                transition-all duration-200 border-b border-gray-100
                                                ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                                hover:bg-purple-50 hover:shadow-sm
                                            `}
                                        >
                                            <TableCell className="py-4 border-r border-gray-100">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 bg-gradient-to-r ${getAgendamentoColor(agendamento.disciplina?.nome || 'Agendamento')} rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                                                        {agendamento.disciplina?.nome?.charAt(0).toUpperCase() || 'A'}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-bold text-gray-800 text-lg">
                                                                {formatDate(agendamento.data!)}
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
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="font-mono text-gray-700 bg-gray-100 px-3 py-1 rounded-lg text-sm border border-gray-200">
                                                        {formatTime(agendamento.horaInicio!)} - {formatTime(agendamento.horaFim!)}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        Duração: {calculateDuration(agendamento.horaInicio!, agendamento.horaFim!)}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 border-r border-gray-100">
                                                <div className="flex justify-center">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(agendamento.status!)}`}>
                                                        {agendamento.status || 'Não definido'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 border-r border-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-700 bg-blue-50 px-2 py-1 rounded text-sm">
                                                        {agendamento.sala?.nome || 'N/A'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 border-r border-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-700">{agendamento.disciplina?.nome || 'N/A'}</span>
                                                    {agendamento.disciplina?.codigo && (
                                                        <span className="text-xs text-gray-500 bg-gray-100 px-1 rounded">
                                                            {agendamento.disciplina.codigo}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex justify-center items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="bg-red-600 hover:bg-red-700 text-white shadow hover:shadow-md transition-all"
                                                        onClick={() => onClickCancelAgendamento(agendamento)}
                                                    >
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        Cancelar
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
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="text-3xl font-bold text-gray-800">{agendamentos.length}</div>
                                <div className="text-gray-600">Total de Agendamentos</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div className="text-3xl font-bold text-gray-800">{agendamentosConfirmados}</div>
                                <div className="text-gray-600">Confirmados</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="text-3xl font-bold text-gray-800">{agendamentosPendentes}</div>
                                <div className="text-gray-600">Pendentes</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="text-3xl font-bold text-gray-800">{agendamentosHoje}</div>
                                <div className="text-gray-600">Para Hoje</div>
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum agendamento encontrado</h3>
                            <p className="text-gray-500 mb-6">Você ainda não possui agendamentos cadastrados.</p>
                            <Button 
                                onClick={openModalCreateAgendamento}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Criar Primeiro Agendamento
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            <CreateAgendamentoModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onAgendamentoCreated={handleAgendamentoCreated}
            />
        </div>
    );
}