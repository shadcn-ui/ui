function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "cn-textarea flex field-sizing-content min-h-16 w-full outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        props.rows !== undefined && "field-sizing-fixed",   // 👈 ADD THIS LINE
        className
      )}
      {...props}
    />
  )
}