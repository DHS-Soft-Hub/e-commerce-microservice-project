import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Client, Developer } from "@/features/project-management/api/types";
import React from "react";

interface UserAvatarProps {
    developer?: Developer | Client;
    client?: Client;
    size?: "sm" | "md" | "lg";
    showName?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ developer, client, size = "md", showName = false }) => {
    // Use client prop if provided, otherwise fall back to developer prop
    const user = client || developer;

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(part => part[0])
            .join("")
            .toUpperCase();
    };

    const getUserName = (user: Developer | Client) => {
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
        return fullName || user.email.split('@')[0];
    };

    const sizeClasses = {
        sm: "h-6 w-6 text-xs",
        md: "h-8 w-8 text-sm",
        lg: "h-12 w-12 text-base"
    };

    if (!user) {
        return (
            <Avatar className={sizeClasses[size]}>
                <AvatarFallback className="bg-muted">?</AvatarFallback>
            </Avatar>
        );
    }

    const userName = getUserName(user);
    const initials = getInitials(`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email);

    return (
        <div className="flex items-center gap-2">
            <Avatar className={sizeClasses[size]}>
                <AvatarImage src={user.avatar} alt={userName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                    {initials}
                </AvatarFallback>
            </Avatar>
            {showName && <span className="text-sm font-medium">{userName}</span>}
        </div>
    );
};

export default UserAvatar;