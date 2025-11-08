import { Loader2Icon } from "lucide-react";

export default function LoadComponent() {
    return (
        <div className="flex items-center justify-center h-screen w-screen z-50">
            <Loader2Icon className="animate-spin mx-auto z-50" size={48} />
        </div>
    );
}