'use client';

import { DisciplinaDTO } from "@/app/core/dto/disciplina.dto";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useState, useEffect } from "react";

interface EditDisciplinaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDisciplinaUpdated: () => void;
    disciplina: DisciplinaDTO | null;
}

export default function EditDisciplinaModal({ isOpen, onClose, onDisciplinaUpdated, disciplina }: EditDisciplinaModalProps) {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        nome: '',
        codigo: '',
        cargaHoraria: ''
    });
    const [errors, setErrors] = useState({
        nome: '',
        codigo: '',
        cargaHoraria: ''
    });

    useEffect(() => {
        if (isOpen && disciplina) {
            setFormData({
                nome: disciplina.nome || '',
                codigo: disciplina.codigo || '',
                cargaHoraria: disciplina.cargaHoraria?.toString() || ''
            });
            setErrors({ nome: '', codigo: '', cargaHoraria: '' });
        }
    }, [isOpen, disciplina]);

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            nome: '',
            codigo: '',
            cargaHoraria: ''
        };

        if (!formData.nome.trim()) {
            newErrors.nome = 'O nome da disciplina é obrigatório';
        } else if (formData.nome.trim().length < 2) {
            newErrors.nome = 'O nome deve ter pelo menos 2 caracteres';
        }

        if (!formData.codigo.trim()) {
            newErrors.codigo = 'O código da disciplina é obrigatório';
        } else if (formData.codigo.trim().length < 2) {
            newErrors.codigo = 'O código deve ter pelo menos 2 caracteres';
        }

        if (!formData.cargaHoraria.trim()) {
            newErrors.cargaHoraria = 'A carga horária é obrigatória';
        } else {
            const carga = parseInt(formData.cargaHoraria);
            if (isNaN(carga) || carga <= 0) {
                newErrors.cargaHoraria = 'A carga horária deve ser um número positivo';
            } else if (carga > 200) {
                newErrors.cargaHoraria = 'A carga horária não pode ser maior que 200 horas';
            }
        }

        setErrors(newErrors);
        return !newErrors.nome && !newErrors.codigo && !newErrors.cargaHoraria;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        if (!disciplina) return;

        setIsSubmitting(true);
        try {
            await api.patch(`/disciplina/${disciplina.id}`, {
                nome: formData.nome.trim(),
                codigo: formData.codigo.trim(),
                cargaHoraria: parseInt(formData.cargaHoraria)
            });

            onDisciplinaUpdated();
            
        } catch (error: any) {
            console.error("Error updating disciplina:", error);
            alert('Erro ao atualizar disciplina: ' + (error.response?.data?.message || 'Tente novamente'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen || !disciplina) return null;

    return (
        <div 
            className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Editar Disciplina</h2>
                            <p className="text-purple-100 text-sm">Atualize as informações da disciplina</p>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                            Nome da Disciplina *
                        </label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                                errors.nome ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Ex: Cálculo I"
                            autoFocus
                        />
                        {errors.nome && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errors.nome}
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-2">
                            Código da Disciplina *
                        </label>
                        <input
                            type="text"
                            id="codigo"
                            name="codigo"
                            value={formData.codigo}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                                errors.codigo ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Ex: MAT101"
                        />
                        {errors.codigo && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errors.codigo}
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="cargaHoraria" className="block text-sm font-medium text-gray-700 mb-2">
                            Carga Horária (horas) *
                        </label>
                        <input
                            type="number"
                            id="cargaHoraria"
                            name="cargaHoraria"
                            value={formData.cargaHoraria}
                            onChange={handleInputChange}
                            min="1"
                            max="200"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                                errors.cargaHoraria ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Ex: 60"
                        />
                        {errors.cargaHoraria && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errors.cargaHoraria}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-3 pt-4">
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
                                    Atualizando...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-white">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Atualizar Disciplina
                                </div>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}