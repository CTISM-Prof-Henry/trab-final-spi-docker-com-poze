'use client';
import UserDTO from "@/app/core/dto/user.dto";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import SpiUtils from "@/shared/utils/spiUtils";
import { Label } from "@radix-ui/react-label";
import { AxiosResponse } from "axios";
import { AlertCircle, BookOpen, Eye, EyeOff, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LoginResponse {
    user: UserDTO;
}

export default function Login() {
    const [matricula, setMatricula] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const res: AxiosResponse<LoginResponse> = await api.post("/auth/login", { matricula, password });
            sessionStorage.setItem("user_role", res.data.user.tipo);
            sessionStorage.setItem("user_props", JSON.stringify({ 
                nome: res.data.user.name, 
                matricula: res.data.user.matricula, 
                email: res.data.user.email 
            }));
            router.push("/");
        } catch (error: any) {
            setError(error.response?.data?.message || "Falha no login. Verifique suas credenciais.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
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
                {error && (
                    <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50 text-red-800">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>{error}</AlertTitle>
                    </Alert>
                )}
                <Card className="shadow-2xl border-0">
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-2xl font-bold text-gray-800">Bem-vindo de volta!</CardTitle>
                        <CardDescription className="text-gray-600">
                            Faça login para acessar sua conta
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Matrícula Field */}
                            <div className="space-y-2">
                                <Label htmlFor="matricula" className="text-sm font-medium text-gray-700">
                                    Matrícula
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                        Senha
                                    </Label>
                                    <Button
                                        variant="link"
                                        className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto"
                                        type="button"
                                    >
                                        Esqueceu a senha?
                                    </Button>
                                </div>
                                <div className="relative">
                                    <Input 
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        placeholder="Digite sua senha"
                                        onChange={(e) => setPassword(e.target.value)}
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
                            <Button 
                                type="submit" 
                                className="w-full py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Entrando...
                                    </div>
                                ) : (
                                    "Entrar na plataforma"
                                )}
                            </Button>
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Não tem uma conta?{" "}
                                    <Link 
                                        href="/register" 
                                        className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        Cadastre-se
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