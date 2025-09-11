'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/lib/language';
import { Globe } from 'lucide-react';

export function LanguageSelector() {
    const { language, setLanguage } = useLanguage();

    const handleLanguageChange = (lang: 'bg' | 'en') => {
        setLanguage(lang);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Globe className="h-4 w-4" />
                    <span className="sr-only">Change language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => handleLanguageChange('bg')}
                    className={language === 'bg' ? 'bg-accent' : ''}
                >
                    🇧🇬 Български
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => handleLanguageChange('en')}
                    className={language === 'en' ? 'bg-accent' : ''}
                >
                    🇺🇸 English
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
