<script lang="ts" module>
	import { type VariantProps, tv } from "tailwind-variants";

	export const inputVariants = tv({
		base: "cn-input file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
		variants: {
			variant: {
				outline: "cn-input-variant-outline", // [FORCE-UI]
				filled: "cn-input-variant-filled", // [FORCE-UI]
				underline: "cn-input-variant-underline", // [FORCE-UI]
				ghost: "cn-input-variant-ghost", // [FORCE-UI]
			},
		},
		defaultVariants: {
			variant: "outline",
		},
	});

	export type InputVariant = VariantProps<typeof inputVariants>["variant"];
</script>

<script lang="ts">
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from "svelte/elements";
	import { cn, type WithElementRef } from "@/svelte-lib/utils.js";

	type InputType = Exclude<HTMLInputTypeAttribute, "file">;

	type Props = WithElementRef<
		Omit<HTMLInputAttributes, "type"> &
			({ type: "file"; files?: FileList } | { type?: InputType; files?: undefined })
	> & {
		variant?: InputVariant; // [FORCE-UI]
	};

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		files = $bindable(),
		class: className,
		variant, // [FORCE-UI]
		"data-slot": dataSlot = "input",
		...restProps
	}: Props = $props();
</script>

{#if type === "file"}
	<input
		bind:this={ref}
		data-slot={dataSlot}
		class={cn(inputVariants({ variant }), className)}
		type="file"
		bind:files
		bind:value
		{...restProps}
	/>
{:else}
	<input
		bind:this={ref}
		data-slot={dataSlot}
		class={cn(inputVariants({ variant }), className)}
		{type}
		bind:value
		{...restProps}
	/>
{/if}
