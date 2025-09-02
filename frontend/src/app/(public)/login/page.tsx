'use client';

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";

export default function Login() {
    function handleMaskedInput(event: React.ChangeEvent<HTMLInputElement>) {
        let value = event.target.value;
        value = value.replace(/\D/g, '');
        event.target.value = value;
    }
    
    return (
        <div className="flex min-h-screen items-center justify-center p-4 min-w-screen">
            <Card className="bg-neutral-800 w-xl min-w-72">
                <CardHeader>
                    <CardTitle>Login page</CardTitle>
                    <CardDescription>Faça login na nossa plataforma!</CardDescription>
                    <CardAction>
                        <Button variant="link">
                            <Link href="/register">Cadastrar</Link>
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Matricula</Label>
                                <Input
                                    id="matricula"
                                    type="text"
                                    onChange={handleMaskedInput}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input id="password" type="password" required />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-center">
                            <Button type="submit" className="w-full" variant="outline">Login</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}