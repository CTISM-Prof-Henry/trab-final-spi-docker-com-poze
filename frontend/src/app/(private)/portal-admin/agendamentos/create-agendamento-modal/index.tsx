'use client';

import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useState, useEffect } from "react";
import { SalaDTO } from "@/app/core/dto/sala.dto";
import { DisciplinaDTO } from "@/app/core/dto/disciplina.dto";
import UserDTO from "@/app/core/dto/user.dto";
import { CentroDTO } from "@/app/core/dto/centro.dto";
import { parse } from "path";

interface CreateAgendamentoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAgendamentoCreated: () => void;
}

export default function CreateAgendamentoModal({ isOpen, onClose, onAgendamentoCreated }: CreateAgendamentoModalProps) {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [centros, setCentros] = useState<CentroDTO[]>([]);
    const [salas, setSalas] = useState<SalaDTO[]>([]);
    const [disciplinas, setDisciplinas] = useState<DisciplinaDTO[]>([]);
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [formData, setFormData] = useState({
        data: '',
        horaInicio: '',
        horaFim: '',
        userUuid: '',
        centroId: '',
        salaId: '',
        disciplinaId: ''
    });
    const [errors, setErrors] = useState({
        data: '',
        horaInicio: '',
        horaFim: '',
        userUuid: '',
        centroId: '',
        salaId: '',
        disciplinaId: ''
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({ 
                data: '', 
                horaInicio: '', 
                horaFim: '', 
                userUuid: '', 
                centroId: '',
                salaId: '', 
                disciplinaId: '' 
            });
            setErrors({ 
                data: '', 
                horaInicio: '', 
                horaFim: '', 
                userUuid: '', 
                centroId: '',
                salaId: '', 
                disciplinaId: '' 
            });
            fetchDados();
        }
    }, [isOpen]);

    const fetchDados = async () => {
        try {
            const [centrosRes, disciplinasRes, usersRes] = await Promise.all([
                api.get("/centro/find-all"),
                api.get("/disciplina/find-all"),
                api.get("/users/find-all")
            ]);
            setCentros(centrosRes.data);
            setDisciplinas(disciplinasRes.data);
            setUsers(usersRes.data);
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

    const handleInputChangeCentro = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            salaId: ''
        }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        fetchSalasByCentro(value);
    };

    const fetchSalasByCentro = async (centroId: string) => {
        try {
            const salasRes = await api.get(`/sala/find-all-by-centro-id/${centroId}`);
            setSalas(salasRes.data);
        } catch (error) {
            console.error("Error fetching salas by centro:", error);
        }
    };

    const validateForm = () => {
        const newErrors = {
            data: '',
            horaInicio: '',
            horaFim: '',
            userUuid: '',
            centroId: '',
            salaId: '',
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

        if (!formData.userUuid) {
            newErrors.userUuid = 'O usuário é obrigatório';
        }

        if (!formData.centroId) {
            newErrors.centroId = 'O centro é obrigatório';
        }

        if (!formData.salaId) {
            newErrors.salaId = 'A sala é obrigatória';
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

        setIsSubmitting(true);
        try {
            const dataObj = new Date(formData.data);
            const [horaInicioHours, horaInicioMinutes] = formData.horaInicio.split(':');
            const horaInicioDate = new Date(dataObj);
            horaInicioDate.setHours(parseInt(horaInicioHours), parseInt(horaInicioMinutes), 0, 0);
            const [horaFimHours, horaFimMinutes] = formData.horaFim.split(':');
            const horaFimDate = new Date(dataObj);
            horaFimDate.setHours(parseInt(horaFimHours), parseInt(horaFimMinutes), 0, 0);

            await api.post("/agendamento", {
                data: dataObj.toISOString(),
                horaInicio: horaInicioDate.toISOString(),
                horaFim: horaFimDate.toISOString(),
                user: {
                    uuid: formData.userUuid
                },
                sala: {
                    id: parseInt(formData.salaId)
                },
                disciplina: {
                    id: parseInt(formData.disciplinaId)
                }
            });

            onAgendamentoCreated();
        } catch (error: any) {
            console.error("Error creating agendamento:", error);
            alert('Erro ao criar agendamento: ' + (error.response?.data?.message || 'Tente novamente'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 rounded-t-2xl sticky top-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Novo Agendamento</h2>
                            <p className="text-purple-100 text-sm">Agende uma sala para sua disciplina</p>
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
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
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
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
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
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
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
                        <label htmlFor="userUuid" className="block text-sm font-medium text-gray-700 mb-2">
                            Usuário *
                        </label>
                        <select
                            id="userUuid"
                            name="userUuid"
                            value={formData.userUuid}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                                errors.userUuid ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Selecione um usuário</option>
                            {users.map(user => (
                                <option key={user.uuid} value={user.uuid}>
                                    {user.name} - {user.matricula}
                                </option>
                            ))}
                        </select>
                        {errors.userUuid && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errors.userUuid}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="centroId" className="block text-sm font-medium text-gray-700 mb-2">
                            Centro *
                        </label>
                        <select
                            id="centroId"
                            name="centroId"
                            value={formData.centroId}
                            onChange={handleInputChangeCentro}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                                errors.centroId ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Selecione um centro</option>
                            {centros.map(centro => (
                                <option key={centro.id} value={centro.id}>
                                    {centro.nome} - {centro.localizacao})
                                </option>
                            ))}
                        </select>
                        {errors.centroId && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errors.centroId}
                            </p>
                        )}
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
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
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

                    <div>
                        <label htmlFor="salaId" className="block text-sm font-medium text-gray-700 mb-2">
                            Sala *
                        </label>
                        <select
                            id="salaId"
                            name="salaId"
                            value={formData.salaId}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                                errors.salaId? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Selecione uma Sala</option>
                            {salas.map(sala => (
                                <option key={sala.id} value={sala.id}>
                                    {sala.nome} - ({sala.capacidade} lugares)
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
                            className="flex-1 bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl transition-all"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Criando...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-white">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Criar Agendamento
                                </div>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}