import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandList, CommandEmpty } from "@/components/ui/command";
import { Check, ChevronsUpDown, UserCog, Users, GraduationCap } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { TipoUsuario } from "@/app/core/dto/tipo-usuario.enum";

interface ComboboxFormProps {
    open: boolean;
    onChangeOpen: Dispatch<SetStateAction<boolean>>;
    tipo: TipoUsuario | null;
    onChangeTipo: Dispatch<SetStateAction<TipoUsuario | null>>;
    disabled?: boolean;
}

interface TipoUsuarioForm {
    value: string;
    label: string;
    icon: any;
    description: string;
}

export default function ComboboxFormRegister({ 
    open, 
    onChangeOpen, 
    tipo, 
    onChangeTipo,
    disabled = false 
}: ComboboxFormProps) {

    const tiposUsuario: TipoUsuarioForm[] = [
        { 
            value: TipoUsuario.ALUNO, 
            label: "Aluno", 
            icon: Users,
            description: "Pode visualizar e agendar salas disponíveis"
        },
        { 
            value: TipoUsuario.PROFESSOR, 
            label: "Professor", 
            icon: GraduationCap,
            description: "Pode agendar salas e gerenciar disciplinas"
        },
        { 
            value: TipoUsuario.ADMIN, 
            label: "Administrador", 
            icon: UserCog,
            description: "Acesso completo ao sistema"
        },
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

    const selectedTipo = tiposUsuario.find((t) => t.value === tipo);

    return (
        <Popover open={open} onOpenChange={onChangeOpen}>
            <PopoverTrigger asChild>
                <Button
                    ref={triggerRef}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between py-3 h-auto min-h-[56px] border-gray-300 transition-all",
                        "hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
                        "text-left font-normal bg-white",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={disabled}
                >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        {selectedTipo ? (
                            <>
                                <selectedTipo.icon className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                <div className="flex flex-col items-start flex-1 min-w-0">
                                    <span className="font-medium text-gray-900 text-sm">{selectedTipo.label}</span>
                                    <span className="text-xs text-gray-500 truncate w-full">{selectedTipo.description}</span>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-start flex-1 min-w-0">
                                <span className="text-gray-500 text-sm">Selecione o tipo de usuário</span>
                                <span className="text-xs text-gray-400">Escolha uma das opções</span>
                            </div>
                        )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="p-1 border-gray-200 shadow-xl rounded-lg overflow-hidden w-auto min-w-[280px] max-w-[400px]"
                align="start"
                side="bottom"
                sideOffset={4}
                avoidCollisions={true}
                style={{ width: contentWidth ? Math.max(contentWidth, 280) : 280 }}
            >
                <Command className="border-0 bg-white">
                    <CommandList className="max-h-[240px] overflow-auto">
                        <CommandEmpty className="py-3 text-center text-gray-500 text-sm">
                            Nenhum tipo encontrado.
                        </CommandEmpty>
                        <CommandGroup>
                            {tiposUsuario.map((t) => {
                                const IconComponent = t.icon;
                                return (
                                    <CommandItem
                                        key={t.value}
                                        value={t.value}
                                        onSelect={(currentValue) => {
                                            onChangeTipo(currentValue === tipo ? null : currentValue as TipoUsuario);
                                            onChangeOpen(false);
                                        }}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-3 text-sm cursor-pointer rounded-md transition-all",
                                            "hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700",
                                            tipo === t.value && "bg-blue-50 text-blue-700"
                                        )}
                                    >
                                        <IconComponent className={cn(
                                            "h-4 w-4 flex-shrink-0",
                                            tipo === t.value ? "text-blue-600" : "text-gray-600"
                                        )} />
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <span className={cn(
                                                "font-medium text-sm",
                                                tipo === t.value ? "text-blue-800" : "text-gray-900"
                                            )}>
                                                {t.label}
                                            </span>
                                            <span className={cn(
                                                "text-xs mt-0.5",
                                                tipo === t.value ? "text-blue-600" : "text-gray-500"
                                            )}>
                                                {t.description}
                                            </span>
                                        </div>
                                        <Check
                                            className={cn(
                                                "h-4 w-4 flex-shrink-0 ml-2",
                                                tipo === t.value ? "opacity-100 text-blue-600" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}