'use client';

import { DisciplinaDTO } from "@/app/core/dto/disciplina.dto";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

export default function DisciplinasAdmin() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [disciplinas, setDisciplinas] = useState<DisciplinaDTO[]>([]);

    useEffect(() => {
        setIsLoading(true);
        const fetchDisciplinas = async () => {
            try {
                const response = await api.get("/disciplina/find-all");
                setDisciplinas(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching disciplinas:", error);
                setIsLoading(false);
            }
        };
    
        fetchDisciplinas();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    } else if (disciplinas.length === 0) {
        return <div className="p-4 w-full h-full text-center">Nenhuma disciplina cadastrada</div>;
    } else {
         return (
            <div className="p-4 w-full h-full">
                <Table className="max-w-lg mx-auto border border-neutral-800">
                    <TableHeader className="w-[100px] bg-gray-200">
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Endereço</TableHead>
                            <TableHead>Carga Horária</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {disciplinas.map((disciplina) => (
                            <TableRow key={v4()} className="hover:bg-neutral-200">
                                <TableCell>{disciplina.nome}</TableCell>
                                <TableCell>{disciplina.codigo}</TableCell>
                                <TableCell>{disciplina.cargaHoraria}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );       
    }
}