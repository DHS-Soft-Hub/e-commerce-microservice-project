"use client"

import { HelpCircle } from "lucide-react";
import * as React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

interface HelperTooltipProps {
    content: string;
    position?: 'top' | 'right' | 'bottom' | 'left';
    size?: number;
    className?: string;
}

/**
 * A reusable helper icon component that displays a tooltip when hovered
 * 
 * @param content - The tooltip text to display
 * @param position - The position of the tooltip (default: 'top')
 * @param size - The size of the icon in pixels (default: 16)
 * @param className - Additional CSS classes for styling
 */
const HelperTooltip: React.FC<HelperTooltipProps> = ({
    content,
    position = 'top',
    size = 16,
    className = '',
}) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className={`inline-flex items-center text-muted-foreground cursor-help ${className}`}>
                        <HelpCircle size={size} />
                    </span>
                </TooltipTrigger>
                <TooltipContent side={position}>
                    <div className="whitespace-pre-line">
                        {content}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default HelperTooltip;