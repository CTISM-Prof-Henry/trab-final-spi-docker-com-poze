import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent, } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandList, } from "@/components/ui/command";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { TipoUsuario } from "@/app/core/dto/tipo-usuario.enum";

interface ComboboxFormProps {
    open: boolean;
    onChangeOpen: Dispatch<SetStateAction<boolean>>;
    tipo: TipoUsuario | null;
    onChangeTipo: Dispatch<SetStateAction<TipoUsuario | null>>;
}

interface TipoUsuarioForm {
    value: string;
    label: string;
}

export default function ComboboxFormRegister({ open, onChangeOpen, tipo, onChangeTipo, }: ComboboxFormProps) {

    const tiposUsuario: TipoUsuarioForm[] = [
        { value: TipoUsuario.ALUNO, label: "Aluno" },
        { value: TipoUsuario.PROFESSOR, label: "Professor" },
        { value: TipoUsuario.ADMIN, label: "Admin" },
    ];

    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const [contentWidth, setContentWidth] = useState<number>();

    useEffect(() => {
        function updateWidth() {
        if (triggerRef.current) {
            setContentWidth(triggerRef.current.offsetWidth);
        }
        }

        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    return (
        <Popover open={open} onOpenChange={onChangeOpen}>
            <PopoverTrigger asChild>
                <Button
                    ref={triggerRef}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {tipo ? tiposUsuario.find((t) => t.value === tipo)?.label : "Selecione o tipo de usuário"}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="p-0"
                align="start"
                side="bottom"
                sideOffset={6}
                style={{ width: contentWidth }}
            >
                <Command>
                    <CommandList>
                        <CommandGroup className="bg-neutral-200">
                            {tiposUsuario.map((t) => (
                                <CommandItem
                                    key={t.value}
                                    value={t.value}
                                    onSelect={(currentValue) => {
                                        onChangeTipo(currentValue === tipo ? null : currentValue as TipoUsuario);
                                        onChangeOpen(false);
                                    }}
                                    className="flex cursor-pointer items-center px-3 py-2 text-sm hover:bg-neutral-100"
                                >
                                    <CheckIcon
                                        className={cn(
                                        "mr-2 h-4 w-4",
                                        tipo === t.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {t.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
