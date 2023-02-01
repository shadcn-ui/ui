"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const dialogVariants = cva(
	"fixed z-50 scale-100 gap-4 bg-white p-6 opacity-100 dark:bg-slate-900",
	{
		variants: {
			type: {
				modal:
					"grid w-full animate-in fade-in-90 slide-in-from-bottom-10 sm:max-w-lg sm:rounded-lg sm:zoom-in-90 sm:slide-in-from-bottom-0",
				"drawer-top": "animate-in slide-in-from-top w-full duration-300",
				"drawer-bottom": "animate-in slide-in-from-bottom w-full duration-300",
				"drawer-left": "animate-in slide-in-from-left h-full duration-300",
				"drawer-right": "animate-in slide-in-from-right h-full duration-300",
			},
		},
		defaultVariants: {
			type: "modal",
		},
	},
);

const portalVariants = cva("fixed inset-0 z-50 flex", {
	variants: {
		type: {
			modal: "justify-center items-start sm:items-center",
			"drawer-top": "items-start",
			"drawer-bottom": "items-end",
			"drawer-left": "justify-start",
			"drawer-right": "justify-end",
		},
	},
	defaultVariants: { type: "modal" },
});
interface DialogPortalProps
	extends DialogPrimitive.DialogPortalProps,
		VariantProps<typeof portalVariants> {}

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = ({
	type,
	className,
	children,
	...props
}: DialogPortalProps) => (
	<DialogPrimitive.Portal className={cn(className)} {...props}>
		<div className={portalVariants({ type })}>{children}</div>
	</DialogPrimitive.Portal>
);
DialogPortal.displayName = DialogPrimitive.Portal.displayName;

const DialogOverlay = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, children, ...props }, ref) => (
	<DialogPrimitive.Overlay
		className={cn(
			"fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in",
			className,
		)}
		{...props}
		ref={ref}
	/>
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export interface DialogContentProps
	extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
		VariantProps<typeof dialogVariants> {}

const DialogContent = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Content>,
	DialogContentProps
>(({ className, type, children, ...props }, ref) => (
	<DialogPortal type={type}>
		<DialogOverlay />
		<DialogPrimitive.Content
			ref={ref}
			className={cn(dialogVariants({ type }), className)}
			{...props}
		>
			{children}
			<DialogPrimitive.Close className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800">
				<X className="h-4 w-4" />
				<span className="sr-only">Close</span>
			</DialogPrimitive.Close>
		</DialogPrimitive.Content>
	</DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			"flex flex-col space-y-2 text-center sm:text-left",
			className,
		)}
		{...props}
	/>
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
			className,
		)}
		{...props}
	/>
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Title
		ref={ref}
		className={cn(
			"text-lg font-semibold text-slate-900",
			"dark:text-slate-50",
			className,
		)}
		{...props}
	/>
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Description
		ref={ref}
		className={cn("text-sm text-slate-500", "dark:text-slate-400", className)}
		{...props}
	/>
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
};
