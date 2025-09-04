import { LoginForm } from "@/features/auth/presentation/components/forms/LoginForm";
import { AuthStateProvider } from "@/features/auth/presentation/providers";


export default function LoginPage() {
    return (
        <AuthStateProvider>
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <LoginForm />
            </div>
        </AuthStateProvider>
    );
}