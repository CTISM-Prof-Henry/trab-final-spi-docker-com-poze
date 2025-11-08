'use client';

import { SalaDTO } from "@/app/core/dto/sala.dto";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

export default function AdminSalas() {

    const [salas, setSalas] = useState<SalaDTO[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(20);
    const [lastPage, setLastPage] = useState<number>(0);

    useEffect(() => {
        setIsLoading(true);

        const fetchSalasPaginated = async () => {
            try {
                const response = await api.get(`/sala/find-all/paginated/${page}/${limit}`);
                console.log(response);
                setSalas(response.data.data.salas);
                setIsLoading(false);
                setPage(Number(response.data.data.page));
                setLastPage(Number(response.data.data.lastPage));
            } catch(error) {
                console.error("Erro ao buscar salas: " + error)
                setIsLoading(false);
            }
        }

        fetchSalasPaginated();
    }, []);

    const fetchSalasPaginated = (pageNumber: number) => async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        setIsLoading(true);
        setPage(pageNumber);
        try {
            const response = await api.get(`/sala/find-all/paginated/${pageNumber}/${limit}`);
            setSalas(response.data.data.salas);
            setIsLoading(false);
            setPage(Number(response.data.data.page));
            setLastPage(Number(response.data.data.lastPage));
        } catch(error) {
            console.error("Erro ao buscar salas: " + error)
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (
            <div>Carregando...</div>
        );
    } else if (salas && salas.length) {
        return (
            <div className="p-4 w-full h-full">
                <Table className="max-w-lg mx-auto border border-neutral-800">
                    <TableHeader className="w-[100px] bg-gray-200">
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Localização</TableHead>
                            <TableHead>Centro</TableHead>
                            <TableHead>Capacidade</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {salas.map((sala) => (
                            <TableRow key={v4()} className="hover:bg-neutral-200">
                                <TableCell>{sala.nome}</TableCell>
                                <TableCell>{sala.localizacao}</TableCell>
                                <TableCell>{sala.centro?.nome}</TableCell>
                                <TableCell>{sala.capacidade}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div>
                    <Pagination>
                        <PaginationContent>
                            <PaginationPrevious onClick={page - 1 < 0 ? fetchSalasPaginated(page) : fetchSalasPaginated(page - 1)}/>
                            <PaginationItem>
                                <PaginationContent>
                                    <Link href="#" onClick={fetchSalasPaginated(page)}>
                                        {page + 1}
                                    </Link>
                                </PaginationContent>
                            </PaginationItem>
                            {page + 1 < lastPage && 
                            <PaginationItem>
                                <PaginationContent>
                                     <Link href="#" onClick={fetchSalasPaginated(page + 1)}>
                                        {page + 2}
                                    </Link>
                                </PaginationContent>
                            </PaginationItem>}
                            {page + 2 < lastPage && page + 3 < lastPage &&
                            <PaginationItem>
                                <PaginationContent>
                                     <Link href="#" onClick={fetchSalasPaginated(page + 2)}>
                                        {page + 3}
                                    </Link>
                                </PaginationContent>
                            </PaginationItem>}
                            {page != lastPage - 1 && page + 2 < lastPage && page + 3 < lastPage &&
                            <PaginationItem>
                                <PaginationEllipsis />    
                            </PaginationItem>}
                            {page != lastPage - 1 && page + 2 < lastPage &&
                            <PaginationItem>
                                <PaginationContent>
                                    <Link href="#" onClick={fetchSalasPaginated(lastPage - 1)}>
                                        {lastPage}
                                    </Link>
                                </PaginationContent>
                            </PaginationItem>}
                            <PaginationContent>
                                <PaginationNext onClick={page + 1 >= lastPage ? fetchSalasPaginated(page) : fetchSalasPaginated(page + 1)}/>
                            </PaginationContent>
                        </PaginationContent>
                    </Pagination>
                </div>
        </div>
    );
    } else {
        <div>Nenhuma sala encontrada...</div>
    }
}