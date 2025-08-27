import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

export default function Login() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 min-w-screen">
            <Card className="bg-neutral-800 w-xl min-w-72">
                <CardHeader>
                    <CardTitle>Login page</CardTitle>
                    <CardDescription>Faça login na nossa plataforma!</CardDescription>
                    <CardAction>
                        <Button variant="link">Cadastrar</Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="email@email.com"
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
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}