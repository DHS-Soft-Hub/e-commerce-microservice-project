'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Supported languages
export type Language = 'bg' | 'en';

// Language context type
interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, module: string) => string;
    isInitialized: boolean;
}

// Create language context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation structure interface
interface TranslationValue {
    bg: string;
    en: string;
}

// Module translations interface
interface ModuleTranslations {
    [key: string]: TranslationValue;
}

// Language cache to store loaded translations
const translationCache: Record<string, ModuleTranslations> = {};

// Load translation module
async function loadTranslations(module: string): Promise<ModuleTranslations> {
    if (translationCache[module]) {
        return translationCache[module];
    }

    try {
        let translations;
        if (module === 'auth') {
            // Special case for auth module to load from a different path
            translations = await import(`../features/${module}/presentation/components/language/${module}.json`);
        } else {
            translations = await import(`../features/${module}/components/language/${module}.json`);
        }
        translationCache[module] = translations.default || translations;
        return translationCache[module];
    } catch (error) {
        console.warn(`Failed to load translations for module: ${module}`, error);
        return {};
    }
}

// Language provider component
interface LanguageProviderProps {
    children: ReactNode;
    defaultLanguage?: Language;
}

export function LanguageProvider({ children, defaultLanguage = 'bg' }: LanguageProviderProps) {
    // Initialize with default language to prevent hydration issues
    const [language, setLanguageState] = useState<Language>(defaultLanguage);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load language from localStorage on mount
    useEffect(() => {
        try {
            const savedLanguage = localStorage.getItem('language') as Language;
            if (savedLanguage && (savedLanguage === 'bg' || savedLanguage === 'en')) {
                // Only update if different from current state
                setLanguageState(savedLanguage);
            }
        } catch (error) {
            console.warn('Error loading language from localStorage:', error);
        }
        setIsInitialized(true);
    }, []); // Only run on mount

    // Save language to localStorage when changed
    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        try {
            localStorage.setItem('language', lang);
            // Update document language attribute
            if (typeof document !== 'undefined') {
                document.documentElement.lang = lang;
            }
        } catch (error) {
            console.warn('Error saving language to localStorage:', error);
        }
    };

    // Translation function
    const t = (key: string, module: string): string => {
        const translations = translationCache[module];
        if (!translations) {
            return key;
        }

        const translation = translations[key];
        if (!translation) {
            return key;
        }

        const result = translation[language] || translation.en || key;
        return result;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, isInitialized }}>
            {children}
        </LanguageContext.Provider>
    );
}

// Hook to use language context
export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

// Hook to load translations for a specific module
export function useTranslations(module: string) {
    const { language, t } = useLanguage();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        loadTranslations(module).then(() => {
            setIsLoaded(true);
        });
    }, [module]);

    // Helper function for this specific module
    const translate = (key: string) => t(key, module);

    return { t: translate, isLoaded, language };
}

// Language toggle component
export function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={() => setLanguage('bg')}
                className={`px-3 py-1 text-sm rounded ${language === 'bg'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
            >
                БГ
            </button>
            <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-sm rounded ${language === 'en'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
            >
                EN
            </button>
        </div>
    );
}
