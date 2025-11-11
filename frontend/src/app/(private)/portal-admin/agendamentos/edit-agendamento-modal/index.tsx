'use client';

import { AgendamentoDTO } from "@/app/core/dto/agendamento.dto";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useState, useEffect } from "react";
import { SalaDTO } from "@/app/core/dto/sala.dto";
import { DisciplinaDTO } from "@/app/core/dto/disciplina.dto";
import UserDTO from "@/app/core/dto/user.dto";

interface EditAgendamentoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAgendamentoUpdated: () => void;
    agendamento: AgendamentoDTO | null;
}

export default function EditAgendamentoModal({ isOpen, onClose, onAgendamentoUpdated, agendamento }: EditAgendamentoModalProps) {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [disciplinas, setDisciplinas] = useState<DisciplinaDTO[]>([]);
    const [formData, setFormData] = useState({
        data: '',
        horaInicio: '',
        horaFim: '',
        disciplinaId: ''
    });
    const [errors, setErrors] = useState({
        data: '',
        horaInicio: '',
        horaFim: '',
        disciplinaId: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchDados();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && agendamento) {
            const dataFormatada = agendamento.data ? new Date(agendamento.data).toISOString().split('T')[0] : '';
            
            setFormData({
                data: dataFormatada,
                horaInicio: agendamento.horaInicio ? formatTimeForInput(agendamento.horaInicio) : '',
                horaFim: agendamento.horaFim ? formatTimeForInput(agendamento.horaFim) : '',
                disciplinaId: agendamento.disciplina?.id?.toString() || ''
            });
            setErrors({ 
                data: '', 
                horaInicio: '', 
                horaFim: '', 
                disciplinaId: '' 
            });
        }
    }, [isOpen, agendamento]);

    const formatTimeForInput = (timeString: string | Date): string => {
        if (!timeString) return '';
        
        try {
            if (typeof timeString === 'string' && timeString.match(/^\d{2}:\d{2}$/)) {
                return timeString;
            }
            const time = new Date(timeString);
            if (isNaN(time.getTime())) return '';
            
            return time.toTimeString().slice(0, 5);
        } catch (error) {
            console.error('Erro ao formatar horário para input:', error);
            return '';
        }
    };

    const fetchDados = async () => {
        try {
            const disciplinasResponse = await api.get<DisciplinaDTO[]>('/disciplina/find-all');
            setDisciplinas(disciplinasResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            return () => document.removeEventListener('keydown', handleEsc);
        }
    }, [isOpen, onClose]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {
            data: '',
            horaInicio: '',
            horaFim: '',
            disciplinaId: ''
        };

        if (!formData.data) {
            newErrors.data = 'A data é obrigatória';
        }

        if (!formData.horaInicio) {
            newErrors.horaInicio = 'A hora de início é obrigatória';
        }

        if (!formData.horaFim) {
            newErrors.horaFim = 'A hora de fim é obrigatória';
        } else if (formData.horaInicio && formData.horaFim <= formData.horaInicio) {
            newErrors.horaFim = 'A hora de fim deve ser depois da hora de início';
        }

        if (!formData.disciplinaId) {
            newErrors.disciplinaId = 'A disciplina é obrigatória';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        if (!agendamento) return;

        setIsSubmitting(true);
        try {
            const dataObj = new Date(formData.data);
            const [horaInicioHours, horaInicioMinutes] = formData.horaInicio.split(':');
            const horaInicioDate = new Date(dataObj);
            horaInicioDate.setHours(parseInt(horaInicioHours), parseInt(horaInicioMinutes), 0, 0);
            const [horaFimHours, horaFimMinutes] = formData.horaFim.split(':');
            const horaFimDate = new Date(dataObj);
            horaFimDate.setHours(parseInt(horaFimHours), parseInt(horaFimMinutes), 0, 0);

            await api.patch(`/agendamento/${agendamento.id}`, {
                data: dataObj.toISOString(),
                horaInicio: horaInicioDate.toISOString(),
                horaFim: horaFimDate.toISOString(),
                disciplina:  {
                    id: parseInt(formData.disciplinaId),
                }
            });

            onAgendamentoUpdated();
            
        } catch (error: any) {
            console.error("Error updating agendamento:", error);
            alert('Erro ao atualizar agendamento: ' + (error.response?.data?.message || 'Tente novamente'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen || !agendamento) return null;

    return (
        <div 
            className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-700 p-6 rounded-t-2xl sticky top-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Editar Agendamento</h2>
                            <p className="text-blue-100 text-sm">Atualize as informações do agendamento</p>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-2">
                                Data *
                            </label>
                            <input
                                type="date"
                                id="data"
                                name="data"
                                value={formData.data}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                    errors.data ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.data && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.data}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="horaInicio" className="block text-sm font-medium text-gray-700 mb-2">
                                Hora de Início *
                            </label>
                            <input
                                type="time"
                                id="horaInicio"
                                name="horaInicio"
                                value={formData.horaInicio}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                    errors.horaInicio ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.horaInicio && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.horaInicio}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="horaFim" className="block text-sm font-medium text-gray-700 mb-2">
                                Hora de Fim *
                            </label>
                            <input
                                type="time"
                                id="horaFim"
                                name="horaFim"
                                value={formData.horaFim}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                    errors.horaFim ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.horaFim && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.horaFim}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="disciplinaId" className="block text-sm font-medium text-gray-700 mb-2">
                            Disciplina *
                        </label>
                        <select
                            id="disciplinaId"
                            name="disciplinaId"
                            value={formData.disciplinaId}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors.disciplinaId ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Selecione uma disciplina</option>
                            {disciplinas.map(disciplina => (
                                <option key={disciplina.id} value={disciplina.id}>
                                    {disciplina.nome} ({disciplina.codigo})
                                </option>
                            ))}
                        </select>
                        {errors.disciplinaId && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errors.disciplinaId}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="outline"
                            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Atualizando...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-white">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Atualizar Agendamento
                                </div>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}