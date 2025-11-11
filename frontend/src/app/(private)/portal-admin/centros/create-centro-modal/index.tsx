'use client';

import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useState, useEffect } from "react";

interface CreateCentroModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCentroCreated: () => void;
}

export default function CreateCentroModal({ isOpen, onClose, onCentroCreated }: CreateCentroModalProps) {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        nome: '',
        localizacao: ''
    });
    const [errors, setErrors] = useState({
        nome: '',
        localizacao: ''
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({ nome: '', localizacao: '' });
            setErrors({ nome: '', localizacao: '' });
        }
    }, [isOpen]);

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
            localizacao: ''
        };

        if (!formData.nome.trim()) {
            newErrors.nome = 'O nome do centro é obrigatório';
        } else if (formData.nome.trim().length < 2) {
            newErrors.nome = 'O nome deve ter pelo menos 2 caracteres';
        }

        if (!formData.localizacao.trim()) {
            newErrors.localizacao = 'A localização é obrigatória';
        } else if (formData.localizacao.trim().length < 5) {
            newErrors.localizacao = 'A localização deve ter pelo menos 5 caracteres';
        }

        setErrors(newErrors);
        return !newErrors.nome && !newErrors.localizacao;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post("/centro", {
                nome: formData.nome.trim(),
                localizacao: formData.localizacao.trim()
            });

            onCentroCreated();
            
        } catch (error: any) {
            console.error("Error creating centro:", error);
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Novo Centro</h2>
                            <p className="text-emerald-100 text-sm">Adicione um novo centro universitário</p>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                            Nome do Centro *
                        </label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                                errors.nome ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Ex: Centro de Tecnologia"
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
                        <label htmlFor="localizacao" className="block text-sm font-medium text-gray-700 mb-2">
                            Localização *
                        </label>
                        <textarea
                            id="localizacao"
                            name="localizacao"
                            value={formData.localizacao}
                            onChange={handleInputChange}
                            rows={3}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none ${
                                errors.localizacao ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Ex: Av. Principal, 123 - Campus Universitário"
                        />
                        {errors.localizacao && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errors.localizacao}
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
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all"
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
                                    Criar Centro
                                </div>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}