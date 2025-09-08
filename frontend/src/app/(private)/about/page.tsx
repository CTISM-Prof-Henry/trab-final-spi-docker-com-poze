import api from "@/lib/api";

export default async function About() {
    try {
        const res = await api.get("auth/me");
        const user = res.data;

        return (
            <div>
                <h1>Hello {user.name}!</h1>
            </div>
        );
    } catch (error) {
        console.error(error);

        return (
            <p>Você não está logado.</p>
        );
    }
}