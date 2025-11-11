'use client';

import { AgendamentoDTO } from "@/app/core/dto/agendamento.dto";
import { CentroDTO } from "@/app/core/dto/centro.dto";
import { SalaDTO } from "@/app/core/dto/sala.dto";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import LoadComponent from "@/shared/load";
import { useEffect, useState } from "react";

export default function PortalAdminHome() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [agendamentos, setAgendamentos] = useState<AgendamentoDTO[]>([]);
    const [centros, setCentros] = useState<CentroDTO[]>([]);
    const [salas, setSalas] = useState<SalaDTO[]>([]);
    const [agendamentosHoje, setAgendamentosHoje] = useState<AgendamentoDTO[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const [agendamentosRes, centrosRes, salasRes] = await Promise.all([
                api.get("/agendamento/find-all"),
                api.get("/centro/find-all"),
                api.get("/sala/find-all")
            ]);

            setAgendamentos(agendamentosRes.data);
            setCentros(centrosRes.data);
            setSalas(salasRes.data);

            const hoje = new Date().toISOString().split('T')[0];
            const agendamentosDeHoje = agendamentosRes.data.filter((ag: AgendamentoDTO) => {
                if (!ag.data) return false;
                const dataAgendamento = new Date(ag.data).toISOString().split('T')[0];
                return dataAgendamento === hoje;
            });
            setAgendamentosHoje(agendamentosDeHoje);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string | Date) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        } catch (error) {
            return 'Data inválida';
        }
    };

    const formatTime = (timeString: string | Date) => {
        if (!timeString) return 'N/A';
        try {
            const time = new Date(timeString);
            return time.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            });
        } catch (error) {
            return 'Horário inválido';
        }
    };

    const getStatusBadge = (status: string) => {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower.includes('confirmado')) {
            return "bg-green-100 text-green-800";
        } else if (statusLower.includes('pendente')) {
            return "bg-amber-100 text-amber-800";
        } else if (statusLower.includes('cancelado')) {
            return "bg-red-100 text-red-800";
        } else {
            return "bg-gray-100 text-gray-800";
        }
    };

    const totalAgendamentos = agendamentos.length;
    const agendamentosConfirmados = agendamentos.filter(ag => 
        ag.status?.toLowerCase().includes('confirmado')
    ).length;
    const agendamentosPendentes = agendamentos.filter(ag => 
        ag.status?.toLowerCase().includes('pendente')
    ).length;
    const totalCentros = centros.length;
    const totalSalas = salas.length;
    const taxaOcupacao = totalSalas > 0 ? Math.round((agendamentosConfirmados / totalSalas) * 100) : 0;

    if (isLoading) {
        return <LoadComponent />;
    }

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard Administrativo</h1>
                    <p className="text-gray-600 mt-2">Visão geral do sistema de agendamentos</p>
                </div>
                <div className="text-sm text-gray-500">
                    {new Date().toLocaleDateString('pt-BR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}
                </div>
            </div>

            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-blue-700 text-sm font-medium">
                            Total de Agendamentos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-900">{totalAgendamentos}</div>
                        <p className="text-blue-600 text-xs mt-1">
                            {agendamentosConfirmados} confirmados
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-green-700 text-sm font-medium">
                            Para Hoje
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-900">{agendamentosHoje.length}</div>
                        <p className="text-green-600 text-xs mt-1">
                            Agendamentos hoje
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-amber-700 text-sm font-medium">
                            Pendentes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-amber-900">{agendamentosPendentes}</div>
                        <p className="text-amber-600 text-xs mt-1">
                            Aguardando aprovação
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-purple-700 text-sm font-medium">
                            Infraestrutura
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-900">{totalSalas}</div>
                        <p className="text-purple-600 text-xs mt-1">
                            {totalCentros} centros • {taxaOcupacao}% ocupação
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Agendamentos de Hoje</CardTitle>
                        <CardDescription>
                            {agendamentosHoje.length > 0 
                                ? `${agendamentosHoje.length} agendamentos para hoje` 
                                : 'Nenhum agendamento para hoje'
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {agendamentosHoje.length > 0 ? (
                            <div className="space-y-4">
                                {agendamentosHoje.slice(0, 5).map((agendamento) => (
                                    <div key={agendamento.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {agendamento.sala?.nome || 'Sala não definida'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {formatTime(agendamento.horaInicio!)} - {formatTime(agendamento.horaFim!)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(agendamento.status!)}`}>
                                                {agendamento.status}
                                            </span>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {agendamento.disciplina?.nome}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {agendamentosHoje.length > 5 && (
                                    <Button variant="outline" className="w-full" asChild>
                                        <a href="/portal-admin/agendamentos">
                                            Ver todos os {agendamentosHoje.length} agendamentos
                                        </a>
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="mt-2">Nenhum agendamento para hoje</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ações Rápidas</CardTitle>
                            <CardDescription>Gerencie o sistema</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full justify-start" asChild>
                                <a href="/portal-admin/agendamentos">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Novo Agendamento
                                </a>
                            </Button>
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <a href="/portal-admin/salas">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    Gerenciar Salas
                                </a>
                            </Button>
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <a href="/portal-admin/centros">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Gerenciar Centros
                                </a>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Status do Sistema</CardTitle>
                            <CardDescription>Resumo da infraestrutura</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Centros Ativos</span>
                                <span className="font-medium">{totalCentros}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Salas Disponíveis</span>
                                <span className="font-medium">{totalSalas}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Taxa de Ocupação</span>
                                <span className="font-medium">{taxaOcupacao}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Agendamentos Pendentes</span>
                                <span className="font-medium text-amber-600">{agendamentosPendentes}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Próximos Dias</CardTitle>
                            <CardDescription>Agendamentos futuros</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {agendamentos.slice(0, 3).map((agendamento) => (
                                    <div key={agendamento.id} className="flex items-center justify-between text-sm">
                                        <div>
                                            <div className="font-medium">{agendamento.sala?.nome}</div>
                                            <div className="text-gray-500">{formatDate(agendamento.data!)}</div>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(agendamento.status!)}`}>
                                            {agendamento.status}
                                        </span>
                                    </div>
                                ))}
                                {agendamentos.length === 0 && (
                                    <div className="text-center text-gray-500 py-2">
                                        Nenhum agendamento futuro
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-white rounded-lg border">
                    <div className="text-2xl font-bold text-gray-800">{totalAgendamentos}</div>
                    <div className="text-sm text-gray-600">Total de Agendamentos</div>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                    <div className="text-2xl font-bold text-gray-800">{agendamentosConfirmados}</div>
                    <div className="text-sm text-gray-600">Confirmados</div>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                    <div className="text-2xl font-bold text-gray-800">{agendamentosPendentes}</div>
                    <div className="text-sm text-gray-600">Pendentes de Aprovação</div>
                </div>
            </div>
        </div>
    );
}