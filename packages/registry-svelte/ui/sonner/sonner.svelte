<script lang="ts">
	import { Toaster as Sonner, type ToasterProps as SonnerProps } from "svelte-sonner";
	import { mode } from "mode-watcher";
	import IconPlaceholder from "$lib/components/icon-placeholder/icon-placeholder.svelte";

	let { ...restProps }: SonnerProps = $props();
</script>

<Sonner
	theme={mode.current}
	class="toaster group"
	richColors
	closeButton
	style="--normal-bg: var(--color-surface); --normal-text: var(--color-surface-foreground); --normal-border: var(--color-border); --width: 312px; --success-bg: var(--color-success-subtle); --success-border: var(--color-success); --success-text: var(--color-success); --warning-bg: var(--color-warning-subtle); --warning-border: var(--color-warning); --warning-text: var(--color-warning); --info-bg: var(--color-info-subtle); --info-border: var(--color-info); --info-text: var(--color-info); --error-bg: var(--color-error-subtle); --error-border: var(--color-error); --error-text: var(--color-error);"
	{...restProps}
>
	{#snippet loadingIcon()}
		<IconPlaceholder
			lucide="Loader2Icon"
		materialSymbols="progress_activity"
			tabler="IconLoader"
			hugeicons="Loading03Icon"
			phosphor="SpinnerIcon"
			remixicon="RiLoaderLine"
			class="size-4 animate-spin"
		/>
	{/snippet}
	{#snippet successIcon()}
		<IconPlaceholder
			lucide="CircleCheckIcon"
		materialSymbols="check_circle"
			tabler="IconCircleCheck"
			hugeicons="CheckmarkCircle02Icon"
			phosphor="CheckCircleIcon"
			remixicon="RiCheckboxCircleLine"
			class="size-4"
		/>
	{/snippet}
	{#snippet errorIcon()}
		<IconPlaceholder
			lucide="OctagonXIcon"
		materialSymbols="dangerous"
			tabler="IconAlertOctagon"
			hugeicons="MultiplicationSignCircleIcon"
			phosphor="XCircleIcon"
			remixicon="RiErrorWarningLine"
			class="size-4"
		/>
	{/snippet}
	{#snippet infoIcon()}
		<IconPlaceholder
			lucide="InfoIcon"
		materialSymbols="info"
			tabler="IconInfoCircle"
			hugeicons="InformationCircleIcon"
			phosphor="InfoIcon"
			remixicon="RiInformationLine"
			class="size-4"
		/>
	{/snippet}
	{#snippet warningIcon()}
		<IconPlaceholder
			lucide="TriangleAlertIcon"
		materialSymbols="warning"
			tabler="IconAlertTriangle"
			hugeicons="Alert02Icon"
			phosphor="WarningIcon"
			remixicon="RiCloseCircleLine"
			class="size-4"
		/>
	{/snippet}
</Sonner>
