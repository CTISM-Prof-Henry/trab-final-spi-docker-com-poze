'use client';

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import SpiUtils from "@/shared/utils/spiUtils";
import { Label } from "@radix-ui/react-label";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Command, CommandGroup, CommandItem, CommandList } from "cmdk";
import { AlertCircleIcon, CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ComboboxFormRegister from "./components/ComboboxFormRegister";


export default function Register() {
    const [isPassowordCoincide, setIsPasswordCoincide] = useState<boolean>(true);
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [matricula, setMatricula] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [tipo, setTipo] = useState<string>('');
    

    function handleChange(e: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<string>>) {
        setState(e.target.value);
    }

    function getFormData() {
        event?.preventDefault();
        if (password !== confirmPassword) {
            setIsPasswordCoincide(false);
            return;
        }
        console.log({ name, email, matricula, password, confirmPassword, tipo });
    }

    return (
        <div>
            <h3 className="text-3xl text-center mb-8">Sistema de Agendamento de Salas!</h3>
            <Alert variant="destructive" hidden={isPassowordCoincide} className="max-w-xl mx-auto mb-4 bg-neutral-100 text-red-800">
                <AlertCircleIcon/>
                <AlertTitle>As senhas não coincidem!</AlertTitle>
            </Alert>
            <div className="flex items-center justify-center p-4 min-w-screen">
                <Card className="bg-neutral-100 w-xl min-w-72">
                    <CardHeader>
                        <CardTitle><span className="text-2xl">Cadastro</span></CardTitle>
                        <CardDescription>Cadastre-se na nossa plataforma!</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={getFormData}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nome</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        onChange={(e) => handleChange(e, setName)}
                                        placeholder="Insira seu email"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="text"
                                        onChange={(e) => handleChange(e, setEmail)}
                                        placeholder="Insira seu email"
                                        required
                                    />
                                </div>
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
                                        onChange={(e) => handleChange(e, setPassword)}
                                        required />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="confirm-password">Confirme a senha</Label>
                                    </div>
                                    <Input 
                                        id="confirm-password"
                                        type="password" 
                                        onChange={(e) => handleChange(e, setConfirmPassword)}
                                        placeholder="Confirme sua senha"
                                        required />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <ComboboxFormRegister 
                                            open={open}
                                            onChangeOpen={setOpen}
                                            tipo={tipo}
                                            onChangeTipo={setTipo}/>
                                    </div>
                                    
                                </div>
                            </div>
                            <CardAction>
                                <div className="flex justify-center mt-4 space-x-80">
                                    <Button variant="link" className="text-sm text-blue-500 hover:underline mb-4">
                                        <Link href="/login">Fazer login</Link>
                                    </Button>
                                    <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">Entrar</Button>
                                </div>
                                    
                            </CardAction>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}