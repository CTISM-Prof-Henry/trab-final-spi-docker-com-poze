'use client';

import { SalaDTO } from "@/app/core/dto/sala.dto";
import api from "@/lib/api";
import { useEffect, useState } from "react";

export default function AdminSalas() {

    const [salas, setSalas] = useState<SalaDTO[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(20);

    useEffect(() => {
        setIsLoading(true);

        const fetchSalasPaginated = async () => {
            try {
                const response = await api.get(`/sala/find-all/paginated/${page}/${limit}`);
                console.log(response);
            } catch(error) {
                console.error("Erro ao buscar salas: " + error)
            }
        }

        fetchSalasPaginated();
    }, []);

    return (
        <div>
            <div>
                Salas Admin - Em andamento...
            </div>
        </div>
    );
}