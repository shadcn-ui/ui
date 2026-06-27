<script lang="ts">
	import { Toaster as Sonner, type ToasterProps as SonnerProps } from "svelte-sonner";
	import { mode } from "mode-watcher";
	import IconPlaceholder from "@/svelte-components/icon-placeholder/icon-placeholder.svelte";

	let { ...restProps }: SonnerProps = $props();
</script>

<Sonner
	theme={$mode}
	class="toaster group"
	style="--normal-bg: var(--color-popover); --normal-text: var(--color-popover-foreground); --normal-border: var(--color-border);"
	{...restProps}
>
	<svelte:fragment slot="loading-icon">
		<IconPlaceholder
			lucide="Loader2Icon"
			materialSymbols="progress_activity"
			tabler="IconLoader"
			hugeicons="Loading03Icon"
			phosphor="SpinnerIcon"
			remixicon="RiLoaderLine"
			class="size-4 animate-spin"
		/>
	</svelte:fragment>
	<svelte:fragment slot="success-icon">
		<IconPlaceholder
			lucide="CircleCheckIcon"
			materialSymbols="check_circle"
			tabler="IconCircleCheck"
			hugeicons="CheckmarkCircle02Icon"
			phosphor="CheckCircleIcon"
			remixicon="RiCheckboxCircleLine"
			class="size-4"
		/>
	</svelte:fragment>
	<svelte:fragment slot="error-icon">
		<IconPlaceholder
			lucide="OctagonXIcon"
			materialSymbols="dangerous"
			tabler="IconAlertOctagon"
			hugeicons="MultiplicationSignCircleIcon"
			phosphor="XCircleIcon"
			remixicon="RiErrorWarningLine"
			class="size-4"
		/>
	</svelte:fragment>
	<svelte:fragment slot="info-icon">
		<IconPlaceholder
			lucide="InfoIcon"
			materialSymbols="info"
			tabler="IconInfoCircle"
			hugeicons="InformationCircleIcon"
			phosphor="InfoIcon"
			remixicon="RiInformationLine"
			class="size-4"
		/>
	</svelte:fragment>
	<svelte:fragment slot="warning-icon">
		<IconPlaceholder
			lucide="TriangleAlertIcon"
			materialSymbols="warning"
			tabler="IconAlertTriangle"
			hugeicons="Alert02Icon"
			phosphor="WarningIcon"
			remixicon="RiCloseCircleLine"
			class="size-4"
		/>
	</svelte:fragment>
</Sonner>
