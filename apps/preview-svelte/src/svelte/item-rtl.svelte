<script lang="ts">
	import * as Item from "@/svelte-ui/item/index.js";
	import { Button } from "@/svelte-ui/button/index.js";
	import BadgeCheckIcon from "~icons/ms/verified";
	import ChevronRightIcon from "~icons/ms/chevron_right";
</script>

<div class="flex w-full max-w-md flex-col gap-6" dir="rtl">
	<Item.Root variant="outline" dir="rtl">
		<Item.Content>
			<Item.Title>عنصر أساسي</Item.Title>
			<Item.Description>عنصر بسيط يحتوي على عنوان ووصف.</Item.Description>
		</Item.Content>
		<Item.Actions>
			<Button variant="outline" size="sm">إجراء</Button>
		</Item.Actions>
	</Item.Root>
	<Item.Root variant="outline" size="sm" dir="rtl">
		{#snippet child({ props })}
			<a href="#/" {...props}>
				<Item.Media>
					<BadgeCheckIcon class="size-5" />
				</Item.Media>
				<Item.Content>
					<Item.Title>تم التحقق من ملفك الشخصي.</Item.Title>
				</Item.Content>
				<Item.Actions>
					<ChevronRightIcon class="size-4" />
				</Item.Actions>
			</a>
		{/snippet}
	</Item.Root>
</div>
