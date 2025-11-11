'use client';

import { SalaDTO } from "@/app/core/dto/sala.dto";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/api";
import LoadComponent from "@/shared/load";
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
        return <LoadComponent />;
    } else if (salas && salas.length) {
        return (
            <div className="p-6 w-full h-full flex flex-col items-center gap-8 bg-gray-50 min-h-screen">
                <div className="w-full max-w-6xl">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Gerenciamento de Salas</h1>
                    <p className="text-gray-600">Lista de todas as salas cadastradas no sistema</p>
                </div>
                <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <Table className="w-full">
                        <TableHeader className="bg-gradient-to-r from-blue-600 to-blue-700">
                            <TableRow className="border-none hover:bg-transparent">
                                <TableHead className="text-white font-bold text-sm py-4 border-r border-blue-500">
                                    <div className="flex items-center gap-2">
                                        <span>Nome da Sala</span>
                                    </div>
                                </TableHead>
                                <TableHead className="text-white font-bold text-sm py-4 border-r border-blue-500">
                                    <div className="flex items-center gap-2">
                                        <span>Localização</span>
                                    </div>
                                </TableHead>
                                <TableHead className="text-white font-bold text-sm py-4 border-r border-blue-500">
                                    <div className="flex items-center gap-2">
                                        <span>Centro</span>
                                    </div>
                                </TableHead>
                                <TableHead className="text-white font-bold text-sm py-4">
                                    <div className="flex items-center gap-2 justify-center">
                                        <span>Capacidade</span>
                                    </div>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {salas.map((sala, index) => (
                                <TableRow 
                                    key={v4()} 
                                    className={`
                                        transition-all duration-200 border-b border-gray-100
                                        ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                        hover:bg-blue-50 hover:shadow-sm
                                    `}
                                >
                                    <TableCell className="py-4 border-r border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span className="font-semibold text-gray-800">{sala.nome}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 border-r border-gray-100">
                                        <span className="text-gray-700">{sala.localizacao}</span>
                                    </TableCell>
                                    <TableCell className="py-4 border-r border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-700">{sala.centro?.nome}</span>
                                            {sala.centro?.nome && (
                                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                    Ativo
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex justify-center">
                                            <span className="bg-blue-100 text-blue-800 font-semibold px-3 py-1 rounded-full text-sm">
                                                {sala.capacidade} pessoas
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="w-full max-w-6xl flex justify-between items-center text-sm text-gray-600">
                    <div>
                        Mostrando <span className="font-semibold">{salas.length}</span> salas na página <span className="font-semibold">{page + 1}</span> de <span className="font-semibold">{lastPage}</span>
                    </div>
                    <div>
                        Total de páginas: <span className="font-semibold">{lastPage}</span>
                    </div>
                </div>
                <div className="w-full max-w-6xl">
                    <Pagination>
                        <PaginationContent className="flex justify-between w-full items-center gap-4">
                            <PaginationItem>
                                <PaginationPrevious 
                                    onClick={page - 1 < 0 ? fetchSalasPaginated(page) : fetchSalasPaginated(page - 1)}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all font-medium
                                        ${page - 1 < 0 
                                            ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-100" 
                                            : "border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white hover:border-blue-600 shadow-sm"
                                        }
                                    `}
                                />
                            </PaginationItem>

                            <div className="flex items-center gap-2">
                                <PaginationItem>
                                    <Link 
                                        href="#" 
                                        onClick={fetchSalasPaginated(page)}
                                        className="flex items-center justify-center w-12 h-12 border-2 border-blue-500 bg-blue-500 text-white rounded-lg font-bold transition-all hover:bg-blue-600 hover:border-blue-600 shadow-md"
                                    >
                                        {page + 1}
                                    </Link>
                                </PaginationItem>
                                {page + 1 < lastPage && (
                                    <PaginationItem>
                                        <Link 
                                            href="#" 
                                            onClick={fetchSalasPaginated(page + 1)}
                                            className="flex items-center justify-center w-12 h-12 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold transition-all hover:bg-blue-100 hover:border-blue-300 hover:text-blue-700"
                                        >
                                            {page + 2}
                                        </Link>
                                    </PaginationItem>
                                )}
                                {page + 2 < lastPage && page + 3 < lastPage && (
                                    <PaginationItem>
                                        <Link 
                                            href="#" 
                                            onClick={fetchSalasPaginated(page + 2)}
                                            className="flex items-center justify-center w-12 h-12 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold transition-all hover:bg-blue-100 hover:border-blue-300 hover:text-blue-700"
                                        >
                                            {page + 3}
                                        </Link>
                                    </PaginationItem>
                                )}
                                {page !== lastPage - 1 && page + 2 < lastPage && page + 3 < lastPage && (
                                    <PaginationItem>
                                        <PaginationEllipsis className="text-gray-500 text-lg" />
                                    </PaginationItem>
                                )}
                                {page !== lastPage - 1 && page + 2 < lastPage && (
                                    <PaginationItem>
                                        <Link 
                                            href="#" 
                                            onClick={fetchSalasPaginated(lastPage - 1)}
                                            className="flex items-center justify-center w-12 h-12 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold transition-all hover:bg-blue-100 hover:border-blue-300 hover:text-blue-700"
                                        >
                                            {lastPage}
                                        </Link>
                                    </PaginationItem>
                                )}
                            </div>
                            <PaginationItem>
                                <PaginationNext 
                                    onClick={page + 1 >= lastPage ? fetchSalasPaginated(page) : fetchSalasPaginated(page + 1)}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all font-medium
                                        ${page + 1 >= lastPage 
                                            ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-100" 
                                            : "border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white hover:border-blue-600 shadow-sm"
                                        }
                                    `}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        );
    } else {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-gray-50 min-h-screen">
                <div className="text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma sala encontrada</h3>
                    <p className="text-gray-500">Não há salas cadastradas no sistema no momento.</p>
                </div>
            </div>
        );
    }
}