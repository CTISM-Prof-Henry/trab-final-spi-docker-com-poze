'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { AgendamentoDTO } from "@/app/core/dto/agendamento.dto";
import { SalaDTO } from "@/app/core/dto/sala.dto";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import LoadComponent from "@/shared/load";
import Swal from "sweetalert2";

export default function PortalUsuarioHome() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [agendamentosHoje, setAgendamentosHoje] = useState<AgendamentoDTO[]>([]);
    const [proximosAgendamentos, setProximosAgendamentos] = useState<AgendamentoDTO[]>([]);
    const [salasDisponiveis, setSalasDisponiveis] = useState<SalaDTO[]>([]);
    const [stats, setStats] = useState({
        totalAgendamentos: 0,
        agendamentosConfirmados: 0,
        agendamentosPendentes: 0
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const userUuid = JSON.parse(sessionStorage.getItem('user_props')!).uuid;
            
            const [agendamentosRes, salasRes] = await Promise.all([
                api.get(`/agendamento/find-by-user/${userUuid}`),
                api.get('/sala/find-all-livres/paginated/0/20')
            ]);

            const agendamentos: AgendamentoDTO[] = agendamentosRes.data;
            const hoje = new Date().toISOString().split('T')[0];
            
            const hojeAgendamentos = agendamentos.filter(ag => {
                if (!ag.data) return false;
                const dataAgendamento = new Date(ag.data).toISOString().split('T')[0];
                return dataAgendamento === hoje;
            });
            setAgendamentosHoje(hojeAgendamentos);

            const futuros = agendamentos.filter(ag => {
                if (!ag.data) return false;
                const dataAgendamento = new Date(ag.data);
                const hoje = new Date();
                hoje.setHours(0, 0, 0, 0);
                return dataAgendamento > hoje;
            }).slice(0, 5);
            setProximosAgendamentos(futuros);

            setSalasDisponiveis(salasRes.data.data.salas.slice(0, 6));

            setStats({
                totalAgendamentos: agendamentos.length,
                agendamentosConfirmados: agendamentos.filter(ag => 
                    ag.status?.toLowerCase().includes('confirmado') || 
                    ag.status?.toLowerCase().includes('aprovado')
                ).length,
                agendamentosPendentes: agendamentos.filter(ag => 
                    ag.status?.toLowerCase().includes('pendente') || 
                    ag.status?.toLowerCase().includes('aguardando')
                ).length
            });

        } catch (error) {
            console.error("Erro ao carregar dashboard:", error);
            Swal.fire({
                title: "Erro",
                text: "Não foi possível carregar os dados do dashboard",
                icon: "error"
            });
        } finally {
            setIsLoading(false);
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
        } catch {
            return 'N/A';
        }
    };

    const formatDate = (dateString: string | Date) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return 'N/A';
        }
    };

    const getStatusBadge = (status: string) => {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower.includes('confirmado') || statusLower.includes('aprovado')) {
            return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmado</Badge>;
        } else if (statusLower.includes('pendente') || statusLower.includes('aguardando')) {
            return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pendente</Badge>;
        } else if (statusLower.includes('cancelado') || statusLower.includes('rejeitado')) {
            return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelado</Badge>;
        } else {
            return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status || 'N/A'}</Badge>;
        }
    };

    const navigateToAgendamentos = () => {
        router.push('/portal-usuario/agendar');
    };

    const navigateToSalas = () => {
        router.push('/portal-usuario/salas');
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Bom dia";
        if (hour < 18) return "Boa tarde";
        return "Boa noite";
    };

    if (isLoading) {
        return <LoadComponent />;
    }

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        {getGreeting()}, {JSON.parse(sessionStorage.getItem('user_props')!).nome}!
                    </h1>
                    <p className="text-gray-600 mt-2">Aqui está o resumo do seus agendamentos</p>
                </div>
                <Button 
                    onClick={navigateToAgendamentos}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Novo Agendamento
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100">Total de Agendamentos</p>
                                <p className="text-3xl font-bold">{stats.totalAgendamentos}</p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100">Confirmados</p>
                                <p className="text-3xl font-bold">{stats.agendamentosConfirmados}</p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-amber-100">Pendentes</p>
                                <p className="text-3xl font-bold">{stats.agendamentosPendentes}</p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Agendamentos de Hoje
                        </CardTitle>
                        <CardDescription>
                            Suas reservas para hoje
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {agendamentosHoje.length > 0 ? (
                            <div className="space-y-3">
                                {agendamentosHoje.map((agendamento) => (
                                    <div key={agendamento.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {formatTime(agendamento.horaInicio!)} - {formatTime(agendamento.horaFim!)}
                                                </p>
                                                <p className="text-sm text-gray-600">{agendamento.sala?.nome}</p>
                                            </div>
                                        </div>
                                        {getStatusBadge(agendamento.status!)}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-gray-500">
                                <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="mt-2">Nenhum agendamento para hoje</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Próximos Agendamentos
                        </CardTitle>
                        <CardDescription>
                            Suas próximas reservas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {proximosAgendamentos.length > 0 ? (
                            <div className="space-y-3">
                                {proximosAgendamentos.map((agendamento) => (
                                    <div key={agendamento.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {formatDate(agendamento.data!)}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {formatTime(agendamento.horaInicio!)} - {agendamento.sala?.nome}
                                                </p>
                                            </div>
                                        </div>
                                        {getStatusBadge(agendamento.status!)}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-gray-500">
                                <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="mt-2">Nenhum agendamento futuro</p>
                            </div>
                        )}
                        {proximosAgendamentos.length > 0 && (
                            <div className="mt-4">
                                <Button 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={navigateToAgendamentos}
                                >
                                    Ver Todos os Agendamentos
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Salas Disponíveis
                            </CardTitle>
                            <CardDescription>
                                Conheça nossas salas para agendamento
                            </CardDescription>
                        </div>
                        <Button variant="outline" onClick={navigateToSalas}>
                            Ver Todas
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {salasDisponiveis.map((sala) => (
                            <div key={sala.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{sala.nome}</h3>
                                        <p className="text-sm text-gray-600">
                                            Capacidade: {sala.capacidade} pessoas
                                        </p>
                                        {sala.centro && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                {sala.centro.nome}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Ações Rápidas</CardTitle>
                    <CardDescription>
                        Acesse rapidamente as funcionalidades principais
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
                        <Button 
                            className="h-16 flex-col gap-2 bg-blue-600 hover:bg-blue-700"
                            onClick={navigateToAgendamentos}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Novo Agendamento
                        </Button>
                        
                        <Button 
                            className="h-16 flex-col gap-2 bg-green-600 hover:bg-green-700"
                            onClick={navigateToAgendamentos}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Meus Agendamentos
                        </Button>
                        
                        <Button 
                            className="h-16 flex-col gap-2 bg-purple-600 hover:bg-purple-700"
                            onClick={navigateToSalas}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Explorar Salas
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}