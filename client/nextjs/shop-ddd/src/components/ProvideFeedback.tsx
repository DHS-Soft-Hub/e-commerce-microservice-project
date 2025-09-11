import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Check } from 'lucide-react';
import React, { useState } from 'react';

interface ProvideFeedbackProps {
    /**
     * The ID of the entity to provide feedback for
     */
    entityId: number | string;

    /**
     * The title to display in the feedback card
     * @default "Provide Feedback"
     */
    title?: string;

    /**
     * Placeholder text for the textarea
     * @default "Write your feedback or questions..."
     */
    placeholder?: string;

    /**
     * Minimum height for the textarea
     * @default "min-h-32"
     */
    textareaHeight?: string;

    /**
     * The label for the submit button
     * @default "Submit Feedback"
     */
    submitButtonLabel?: string;

    /**
     * Custom validation function that determines if feedback can be submitted
     * @param content The current feedback content
     * @returns Boolean indicating if the feedback can be submitted
     * @default (content) => !!content.trim()
     */
    canSubmit?: (content: string) => boolean;

    /**
     * Function called when feedback is submitted
     * @param content The feedback content
     * @param entityId The ID of the entity the feedback is for
     * @returns Promise that resolves when submission is complete
     */
    onSubmit: (content: string, entityId: number | string) => Promise<void>;

    /**
     * Additional CSS classes for the card
     */
    className?: string;

    /**
     * Whether the component should use a sticky position
     * @default false
     */
    sticky?: boolean;

    /**
     * The top position value when sticky is true
     * @default "top-28"
     */
    stickyTop?: string;
}

export const ProvideFeedback: React.FC<ProvideFeedbackProps> = ({
    entityId,
    title = "Provide Feedback",
    placeholder = "Write your feedback or questions...",
    textareaHeight = "min-h-32",
    submitButtonLabel = "Submit Feedback",
    canSubmit = (content) => !!content.trim(),
    onSubmit,
    className = "",
    sticky = false,
    stickyTop = "top-28"
}) => {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!canSubmit(content)) return;

        setIsSubmitting(true);
        setSubmitSuccess(false);
        setSubmitError(null);

        try {
            await onSubmit(content, entityId);

            // Reset form on success
            setContent('');
            setSubmitSuccess(true);

            // Clear success message after 5 seconds
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 5000);
        } catch (error) {
            console.error('Failed to submit feedback:', error);
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : 'Failed to submit your feedback. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const cardClasses = `${className} ${sticky ? `sticky ${stickyTop}` : ''}`;

    return (
        <Card className={cardClasses}>
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <Textarea
                    id={`feedback-${entityId}`}
                    placeholder={placeholder}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={textareaHeight}
                />

                {/* Success message */}
                {submitSuccess && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-100 text-green-800 rounded-md flex items-start">
                        <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">Your feedback has been submitted successfully.</p>
                    </div>
                )}

                {/* Error message */}
                {submitError && (
                    <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md flex items-start">
                        <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{submitError}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-end pt-0">
                <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit(content) || isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : submitButtonLabel}
                </Button>
            </CardFooter>
        </Card>
    );
};