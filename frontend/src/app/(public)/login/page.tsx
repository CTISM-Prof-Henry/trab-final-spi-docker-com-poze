'use client';
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SpiUtils from "@/shared/utils/spiUtils";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { useState } from "react";

export default function Login() {

    const [matricula, setMatricula] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    function handleSubmit() {
        event?.preventDefault();
        console.log({ matricula, password });
    }

    return (
        <div>
            <h3 className="text-3xl text-center mb-8">Sistema de Agendamento de Salas!</h3>
            <div className="flex items-center justify-center p-4 min-w-screen">
                <Card className="bg-neutral-100 w-xl min-w-72">
                    <CardHeader>
                        <CardTitle><span className="text-2xl">Login </span></CardTitle>
                        <CardDescription>Faça login na nossa plataforma!</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="matricula">Matricula</Label>
                                    <Input
                                        id="matricula"
                                        type="text"
                                        onChange={(e) => SpiUtils.maskMatricula(e, setMatricula)}
                                        placeholder="Insira sua matrícula"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Senha</Label>
                                    </div>
                                    <Input 
                                        id="password"
                                        type="password" 
                                        placeholder="Digite sua senha"
                                        onChange={(e) => setPassword(e.target.value)}
                                        required />
                                </div>
                            </div>
                            <CardAction>
                                <div className="grid grid-cols-3 gap-2 mt-4">
                                    <Button variant="link" className="text-sm text-blue-500 hover:underline mb-4">Esqueci minha senha</Button>
                                    <Button variant="link" className="text-sm text-blue-500 hover:underline mb-4">
                                        <Link href="/register">Cadastrar-se</Link>
                                    </Button>
                                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">Entrar</Button>
                                </div>
                            </CardAction>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}