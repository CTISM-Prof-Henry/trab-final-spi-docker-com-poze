'use client';

import { AgendamentoDTO } from "@/app/core/dto/agendamento.dto";
import api from "@/lib/api";
import { useEffect, useState } from "react";

export default function AgendamentosAdmin() {
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [agendamentos, setAgendamentos] = useState<AgendamentoDTO[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingAgendamento, setEditingAgendamento] = useState<boolean>(false);

    async function fetchAgendamentos() {
        setIsLoading(true);
        try {
            //const response = await api.get<AgendamentoDTO[]>('/agendamentos');
            //setAgendamentos(response.data);
        } catch(error) {
            console.error("Erro ao buscar agendamentos:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchAgendamentos();
    }, []);

    return (
        <div>
            <div>Agendamentos Admin - Em andamento...</div>
        </div>
    );
}