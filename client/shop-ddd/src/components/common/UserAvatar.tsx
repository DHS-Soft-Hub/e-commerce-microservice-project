import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

interface UserAvatarProps {
    user?: { email: string; first_name?: string; last_name?: string; avatar?: string };
    size?: "sm" | "md" | "lg";
    showName?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = "md", showName = false }) => {
    // Use user prop if provided
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(part => part[0])
            .join("")
            .toUpperCase();
    };

    const getUserName = (user: { email: string; first_name?: string; last_name?: string }) => {
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
        return fullName || user.email.split('@')[0];
    };

    const userName = user ? getUserName(user) : "Unknown User";

    const sizeClasses = {
        sm: "h-6 w-6 text-xs",
        md: "h-8 w-8 text-sm",
        lg: "h-12 w-12 text-base"
    };

    if (!userName) {
        return (
            <Avatar className={sizeClasses[size]}>
                <AvatarFallback className="bg-muted">?</AvatarFallback>
            </Avatar>
        );
    }

    const initials = getInitials(userName);

    return (
        <div className="flex items-center gap-2">
            <Avatar className={sizeClasses[size]}>
                <AvatarImage src={user?.avatar} alt={userName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                    {initials}
                </AvatarFallback>
            </Avatar>
            {showName && <span className="text-sm font-medium">{userName}</span>}
        </div>
    );
};

export default UserAvatar;