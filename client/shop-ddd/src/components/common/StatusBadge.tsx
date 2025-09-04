import { Badge } from "@/components/ui/badge";
import { ProjectStatus, TaskStatus } from "@/features/project-management/api/types";
import React from "react";

interface ProjectStatusBadgeProps {
    status: ProjectStatus;
}

interface TaskStatusBadgeProps {
    status: TaskStatus;
}

export const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({ status }) => {
    const getVariant = () => {
        switch (status) {
            case "open":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "approved":
                return "bg-green-100 text-green-800 border-green-200";
            case "claimed":
                return "bg-purple-100 text-purple-800 border-purple-200";
            default:
                return "";
        }
    };

    const getLabel = () => {
        switch (status) {
            case "open":
                return "Open";
            case "approved":
                return "Approved";
            case "claimed":
                return "Claimed";
            default:
                return status;
        }
    };

    return (
        <Badge variant="outline" className={`${getVariant()} capitalize`}>
            {getLabel()}
        </Badge>
    );
};

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status }) => {
    const getVariant = () => {
        switch (status) {
            case "backlog":
                return "bg-slate-200 text-slate-600 border-slate-300";
            case "todo":
                return "bg-blue-200 text-blue-600 border-blue-300";
            case "in_progress":
                return "bg-amber-200 text-amber-600 border-amber-300";
            case "in_review":
                return "bg-purple-200 text-purple-600 border-purple-300";
            case "completed":
                return "bg-green-200 text-green-600 border-green-300";
            case "blocked":
                return "bg-red-200 text-red-600 border-red-300";
            default:
                return "";
        }
    };

    const getLabel = () => {
        switch (status) {
            case "backlog":
                return "Backlog";
            case "todo":
                return "To Do";
            case "in_progress":
                return "In Progress";
            case "in_review":
                return "In Review";
            case "completed":
                return "Completed";
            case "blocked":
                return "Blocked";
            default:
                return status;
        }
    };

    return (
        <Badge variant="outline" className={`${getVariant()} capitalize`}>
            {getLabel()}
        </Badge>
    );
};