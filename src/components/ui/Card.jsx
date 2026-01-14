import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function Card({ className, children, ...props }) {
    return (
        <div
            className={twMerge(clsx("bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm", className))}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }) {
    return (
        <div className={twMerge(clsx("px-6 py-4 border-b border-slate-800", className))} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ className, children, ...props }) {
    return (
        <h3 className={twMerge(clsx("text-lg font-semibold text-slate-100", className))} {...props}>
            {children}
        </h3>
    );
}

export function CardContent({ className, children, ...props }) {
    return (
        <div className={twMerge(clsx("p-6", className))} {...props}>
            {children}
        </div>
    );
}
