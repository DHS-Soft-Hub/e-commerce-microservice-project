import { Check, ChevronsUpDown } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface ComboboxOption {
    value: string;
    label: string;
}

interface ComboboxFieldProps {
    options: ComboboxOption[];
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export const ComboboxField: React.FC<ComboboxFieldProps> = ({
    options,
    placeholder,
    value,
    onChange,
    disabled = false,
}) => {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                        "w-full justify-between bg-white/60 dark:bg-gray-800/60 border-gray-200/80 dark:border-gray-600/80 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200",
                        !value && "text-muted-foreground"
                    )}
                >
                    {value
                        ? options.find((option) => option.value === value)?.label || placeholder
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-gray-200/60 dark:border-gray-700/40">
                <Command className="bg-transparent">
                    <CommandInput
                        placeholder={`Search ${placeholder.toLowerCase()}...`}
                        className="bg-white/60 dark:bg-gray-800/60 border-gray-200/80 dark:border-gray-600/80"
                    />
                    <CommandEmpty className="text-gray-500 dark:text-gray-400">No {placeholder.toLowerCase()} found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-auto">
                        {options.map((option) => (
                            <CommandItem
                                key={option.value}
                                value={option.value}
                                onSelect={(currentValue) => {
                                    onChange(currentValue);
                                    setOpen(false);
                                }}
                                className="hover:bg-white/60 dark:hover:bg-gray-800/60 data-[selected]:bg-white/80 dark:data-[selected]:bg-gray-800/80"
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === option.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {option.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};