import { cn } from "@/lib/utils"
import * as React from "react"

const PageHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col space-y-2 mb-6",
            className
        )}
        {...props}
    />
)
PageHeader.displayName = "PageHeader"

const PageHeaderHeading = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
        className={cn(
            "text-2xl font-semibold tracking-tight sm:text-3xl",
            className
        )}
        {...props}
    />
)
PageHeaderHeading.displayName = "PageHeaderHeading"

const PageHeaderDescription = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
        className={cn(
            "text-muted-foreground text-sm",
            className
        )}
        {...props}
    />
)
PageHeaderDescription.displayName = "PageHeaderDescription"

export { PageHeader, PageHeaderDescription, PageHeaderHeading }

