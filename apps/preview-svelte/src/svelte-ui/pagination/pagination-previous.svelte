<script lang="ts">
	import { cn } from "@/svelte-lib/utils.js";
	import { PaginationLink } from "./index.js";
	import IconPlaceholder from "@/svelte-components/icon-placeholder/icon-placeholder.svelte";

	type PageData = { type: "page"; value: number; key?: string };

	let {
		class: className,
		// page and isActive are optional for Previous/Next navigation buttons
		page = { type: "page", value: 0 } as PageData,
		isActive = false,
		...restProps
	}: {
		class?: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		page?: any;
		isActive?: boolean;
		[key: string]: unknown;
	} = $props();
</script>

<PaginationLink
	aria-label="Go to previous page"
	size="default"
	{page}
	{isActive}
	class={cn("cn-pagination-previous", className)}
	{...restProps as Record<string, unknown>}
>
	<IconPlaceholder
		lucide="ChevronLeftIcon"
		materialSymbols="chevron_left"
		tabler="IconChevronLeft"
		hugeicons="ArrowLeft01Icon"
		phosphor="CaretLeftIcon"
		remixicon="RiArrowLeftSLine"
		data-icon="inline-start"
	/>
	<span class="cn-pagination-previous-text hidden sm:block">Previous</span>
</PaginationLink>
