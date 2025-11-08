'use client';

import { CentroDTO } from "@/app/core/dto/centro.dto";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/api";
import LoadComponent from "@/shared/load";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

export default function CentrosAdmin() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [centros, setCentros] = useState<CentroDTO[]>([]);

    useEffect(() => {
        setIsLoading(true);
        const fetchCentros = async () => {
            try {
                const response = await api.get("/centro/find-all");
                setCentros(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching centros:", error);
                setIsLoading(false);
            }
        }

        fetchCentros();
    }, []);

    if (isLoading) {
        return (
            <LoadComponent />
        );
    }  else if (centros.length === 0) {
        return <div className="p-4 w-full h-full text-center">Nenhum centro cadastrado</div>;
    } else {
        return (
            <div className="p-4 w-full h-full">
                <Table className="max-w-lg mx-auto border border-neutral-800">
                    <TableHeader className="w-[100px] bg-gray-200">
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Endereço</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {centros.map((centro) => (
                            <TableRow key={v4()} className="hover:bg-neutral-200">
                                <TableCell>{centro.nome}</TableCell>
                                <TableCell>{centro.localizacao}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }
}