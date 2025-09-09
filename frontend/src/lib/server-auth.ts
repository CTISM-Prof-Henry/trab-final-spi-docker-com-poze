import { headers } from "next/headers";
import api from "./api";

export async function getCurrentUser() {
    const cookieHeader = (await headers()).get('cookie') ?? "";

    const res = await api.get("auth/me", {
        withCredentials: true,
    });

    if (!res.statusText) {
        return null;
    }

    return res;
}