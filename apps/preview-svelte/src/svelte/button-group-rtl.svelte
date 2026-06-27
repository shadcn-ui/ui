<script lang="ts">
	import Archive from "~icons/ms/archive";
	import ArrowLeft from "~icons/ms/arrow_left";
	import MoreHorizontal from "~icons/ms/more_horiz";
	import { Button } from "@/svelte-ui/button/index.js";
	import * as ButtonGroup from "@/svelte-ui/button-group/index.js";
	import * as DropdownMenu from "@/svelte-ui/dropdown-menu/index.js";
</script>

<div dir="rtl">
	<ButtonGroup.Root>
		<ButtonGroup.Root class="hidden sm:flex">
			<Button variant="outline" size="icon" aria-label="رجوع">
				<ArrowLeft class="rtl:rotate-180" />
			</Button>
		</ButtonGroup.Root>
		<ButtonGroup.Root>
			<Button size="sm" variant="outline">أرشفة</Button>
			<Button size="sm" variant="outline">تقرير</Button>
		</ButtonGroup.Root>
		<ButtonGroup.Root>
			<Button size="sm" variant="outline">تأجيل</Button>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline" size="icon-sm" aria-label="خيارات إضافية">
							<MoreHorizontal />
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end" class="w-40">
					<DropdownMenu.Group>
						<DropdownMenu.Item>
							<Archive />
							أرشفة
						</DropdownMenu.Item>
					</DropdownMenu.Group>
					<DropdownMenu.Separator />
					<DropdownMenu.Group>
						<DropdownMenu.Item class="text-destructive focus:text-destructive">
							حذف
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</ButtonGroup.Root>
	</ButtonGroup.Root>
</div>
