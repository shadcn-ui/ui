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
	aria-label="Go to next page"
	size="default"
	{page}
	{isActive}
	class={cn("cn-pagination-next", className)}
	{...restProps as Record<string, unknown>}
>
	<span class="cn-pagination-next-text hidden sm:block">Next</span>
	<IconPlaceholder
		lucide="ChevronRightIcon"
		materialSymbols="chevron_right"
		tabler="IconChevronRight"
		hugeicons="ArrowRight01Icon"
		phosphor="CaretRightIcon"
		remixicon="RiArrowRightSLine"
		data-icon="inline-end"
	/>
</PaginationLink>
