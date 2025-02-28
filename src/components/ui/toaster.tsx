
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { AlertCircle, CheckCircle, Info } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} {...props} className="group">
            <div className="flex">
              {variant === "destructive" && (
                <AlertCircle className="h-5 w-5 text-destructive mr-2 flex-shrink-0" />
              )}
              {variant === "success" && (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              )}
              {(!variant || variant === "default") && (
                <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
              )}
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
