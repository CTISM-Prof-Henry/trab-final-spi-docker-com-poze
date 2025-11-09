'use client';

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SpiUtils from "@/shared/utils/spiUtils";
import { Label } from "@radix-ui/react-label";
import { AlertCircle, BookOpen, Eye, EyeOff, Mail, User, UserCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ComboboxFormRegister from "./components/combobox-form-register";
import UserDTO from "@/app/core/dto/user.dto";
import { TipoUsuario } from "@/app/core/dto/tipo-usuario.enum";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Register() {
    const [isMessageVisible, setIsMessageVisible] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [matricula, setMatricula] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [tipo, setTipo] = useState<TipoUsuario | null>(null);
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<string>>) {
        setState(e.target.value);
    }

    function alterTextMessage(text: string) {
        setMessage(text);
        setIsMessageVisible(true);
    }

    async function getFormData(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        
        if (password !== confirmPassword) {
            alterTextMessage("As senhas não coincidem!");
            setIsLoading(false);
            return;
        } else if (!tipo) {
            alterTextMessage("Você deve escolher um tipo de usuário.");
            setIsLoading(false);
            return;
        }
        
        setIsMessageVisible(false);
        const user: UserDTO = {
            name,
            email,
            matricula,
            password,
            tipo,
        };
        
        try {
            await api.post("/users", { ...user });
            router.push("/login");
        } catch (err: any) {
            console.error(err);
            setMessage(err.response?.data?.message || "Houve um erro interno. Tente novamente...");
            setIsMessageVisible(true);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            UniSchedule
                        </h1>
                    </div>
                    <p className="text-gray-600">Sistema de Agendamento de Salas Universitárias</p>
                </div>
                {isMessageVisible && (
                    <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50 text-red-800">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>{message}</AlertTitle>
                    </Alert>
                )}
                <Card className="shadow-2xl border-0">
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-2xl font-bold text-gray-800">Crie sua conta</CardTitle>
                        <CardDescription className="text-gray-600">
                            Cadastre-se para começar a usar a plataforma
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={getFormData} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                        Nome Completo
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => handleChange(e, setName)}
                                            placeholder="Insira seu nome completo"
                                            className="pl-10 pr-4 py-6 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                        Email
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => handleChange(e, setEmail)}
                                            placeholder="Insira seu email"
                                            className="pl-10 pr-4 py-6 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="matricula" className="text-sm font-medium text-gray-700">
                                        Matrícula
                                    </Label>
                                    <div className="relative">
                                        <UserCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="matricula"
                                            type="text"
                                            value={matricula}
                                            onChange={(e) => SpiUtils.maskMatricula(e, setMatricula)}
                                            placeholder="Insira sua matrícula"
                                            className="pl-10 pr-4 py-6 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                        Tipo de Usuário
                                    </Label>
                                    <ComboboxFormRegister 
                                        open={open}
                                        onChangeOpen={setOpen}
                                        tipo={tipo}
                                        onChangeTipo={setTipo}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                        Senha
                                    </Label>
                                    <div className="relative">
                                        <Input 
                                            id="password" 
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            placeholder="Digite sua senha" 
                                            onChange={(e) => handleChange(e, setPassword)}
                                            className="pr-10 py-6 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            required
                                            disabled={isLoading}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={isLoading}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                                        Confirmar Senha
                                    </Label>
                                    <div className="relative">
                                        <Input 
                                            id="confirm-password"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => handleChange(e, setConfirmPassword)}
                                            placeholder="Confirme sua senha"
                                            className="pr-10 py-6 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            required
                                            disabled={isLoading}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            disabled={isLoading}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Criando conta...
                                    </div>
                                ) : (
                                    "Criar minha conta"
                                )}
                            </Button>
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Já tem uma conta?{" "}
                                    <Link 
                                        href="/login" 
                                        className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        Fazer login
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                <div className="text-center mt-8">
                    <p className="text-xs text-gray-500">
                        © 2024 UniSchedule. Sistema de agendamento universitário.
                    </p>
                </div>
            </div>
        </div>
    );
}