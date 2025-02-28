
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Enhanced high-level card types for search results
const HighlightCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      "border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10",
      className
    )}
    {...props}
  />
))
HighlightCard.displayName = "HighlightCard"

const PriorityCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      "border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 bg-red-50/50 dark:bg-red-900/10",
      className
    )}
    {...props}
  />
))
PriorityCard.displayName = "PriorityCard"

const ImageCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      "border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10",
      className
    )}
    {...props}
  />
))
ImageCard.displayName = "ImageCard"

const SocialCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      "border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 bg-green-50/50 dark:bg-green-900/10",
      className
    )}
    {...props}
  />
))
SocialCard.displayName = "SocialCard"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  HighlightCard,
  PriorityCard,
  ImageCard,
  SocialCard
}
