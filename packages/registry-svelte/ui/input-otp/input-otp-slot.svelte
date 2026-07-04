<script lang="ts">
	import { PinInput as InputOTPPrimitive } from "bits-ui";
	import { getContext } from "svelte";
	import { cn } from "$lib/utils.js";
	import { INPUT_OTP_DISABLED_KEY } from "./disabled-context.js";

	let {
		ref = $bindable(null),
		cell,
		class: className,
		...restProps
	}: InputOTPPrimitive.CellProps = $props();

	const disabled = getContext<() => boolean>(INPUT_OTP_DISABLED_KEY);
</script>

<InputOTPPrimitive.Cell
	{cell}
	bind:ref
	data-slot="input-otp-slot"
	data-disabled={disabled?.()}
	class={cn(
		"cn-input-otp-slot relative flex items-center justify-center data-[active=true]:z-10",
		className
	)}
	{...restProps}
>
	{cell.char}
	{#if cell.hasFakeCaret}
		<div
			class="cn-input-otp-caret pointer-events-none absolute inset-0 flex items-center justify-center"
		>
			<div class="cn-input-otp-caret-line bg-foreground h-4 w-px"></div>
		</div>
	{/if}
</InputOTPPrimitive.Cell>
