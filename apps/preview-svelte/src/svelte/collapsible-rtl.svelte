<script lang="ts">
	import ChevronsUpDownIcon from "~icons/ms/unfold_more";
	import * as Collapsible from "@/svelte-ui/collapsible/index.js";
	import { buttonVariants } from "@/svelte-ui/button/index.js";

	let isOpen = $state(false);
</script>

<div dir="rtl">
	<Collapsible.Root bind:open={isOpen} class="flex w-[350px] flex-col gap-2">
		<div class="flex items-center justify-between gap-4 px-4">
			<h4 class="text-sm font-semibold">الطلب #4189</h4>
			<Collapsible.Trigger class={buttonVariants({ variant: "ghost", size: "sm", class: "size-8 p-0" })}>
				<ChevronsUpDownIcon />
				<span class="sr-only">Toggle details</span>
			</Collapsible.Trigger>
		</div>
		<div class="flex items-center justify-between rounded-md border px-4 py-2 text-sm">
			<span class="text-muted-foreground">الحالة</span>
			<span class="font-medium">تم الشحن</span>
		</div>
		<Collapsible.Content class="flex flex-col gap-2">
			<div class="rounded-md border px-4 py-2 text-sm">
				<p class="font-medium">عنوان الشحن</p>
				<p class="text-muted-foreground">100 Market St, San Francisco</p>
			</div>
			<div class="rounded-md border px-4 py-2 text-sm">
				<p class="font-medium">العناصر</p>
				<p class="text-muted-foreground">2x سماعات الاستوديو</p>
			</div>
		</Collapsible.Content>
	</Collapsible.Root>
</div>
