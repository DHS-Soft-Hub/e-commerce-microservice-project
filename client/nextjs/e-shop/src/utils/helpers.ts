// Status color utilities
export const getStatusColor = (status: string): string => {
    switch (status) {
        case 'draft':
            return 'bg-yellow-100 text-yellow-800';
        case 'in_review':
            return 'bg-blue-100 text-blue-800';
        case 'approved':
            return 'bg-green-100 text-green-800';
        case 'archived':
            return 'bg-gray-100 text-gray-800';
        case 'unreviewed':
            return 'bg-gray-100 text-gray-800';
        case 'in_discussion':
            return 'bg-yellow-100 text-yellow-800';
        case 'to_consider':
            return 'bg-orange-100 text-orange-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

// Label color utilities
export const getLabelColor = (label: string): string => {
    switch (label) {
        case 'keynote':
            return 'bg-purple-100 text-purple-800';
        case 'assumption':
            return 'bg-blue-100 text-blue-800';
        case 'constraint':
            return 'bg-red-100 text-red-800';
        case 'dependency':
            return 'bg-indigo-100 text-indigo-800';
        case 'general':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export const formatStatus = (status: string): string => {
    return status.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
};

// Point interface
interface Point {
    status: 'unreviewed' | 'in_discussion' | 'approved' | 'to_consider';
}

// Progress calculation
export const getProgressPercentage = (
    points?: Point[]
): number => {
    if (!points || points.length === 0) {
        return 0;
    }

    const approvedPoints = points.filter(point => point.status === 'approved').length;
    return Math.round((approvedPoints / points.length) * 100);
};

// Date formatting utility
export const formatDate = (dateString: string | Date): string => {
    if (!dateString) return 'Not set';

    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

    if (isNaN(date.getTime())) return 'Invalid date';

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};