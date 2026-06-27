<script lang="ts">
	import MinusIcon from "~icons/ms/remove";
	import PlusIcon from "~icons/ms/add";
	import * as Drawer from "@/svelte-ui/drawer/index.js";
	import { Button, buttonVariants } from "@/svelte-ui/button/index.js";

	let goal = $state(350);
</script>

<Drawer.Root>
	<Drawer.Trigger class={buttonVariants({ variant: "outline" })}>فتح الدرج</Drawer.Trigger>
	<Drawer.Content dir="rtl">
		<div class="mx-auto w-full max-w-sm">
			<Drawer.Header>
				<Drawer.Title>نقل الهدف</Drawer.Title>
				<Drawer.Description>حدد هدف نشاطك اليومي.</Drawer.Description>
			</Drawer.Header>
			<div class="p-4 pb-0">
				<div class="flex items-center justify-center space-x-2">
					<Button
						variant="outline"
						size="icon"
						class="size-8 shrink-0 rounded-full"
						onclick={() => (goal = Math.max(200, goal - 10))}
						disabled={goal <= 200}
					>
						<MinusIcon />
						<span class="sr-only">تقليل</span>
					</Button>
					<div class="flex-1 text-center">
						<div class="text-7xl font-bold tracking-tighter">
							{goal}
						</div>
						<div class="text-muted-foreground text-[0.70rem] uppercase">
							سعرات حرارية/يوم
						</div>
					</div>
					<Button
						variant="outline"
						size="icon"
						class="size-8 shrink-0 rounded-full"
						onclick={() => (goal = Math.min(400, goal + 10))}
						disabled={goal >= 400}
					>
						<PlusIcon />
						<span class="sr-only">زيادة</span>
					</Button>
				</div>
			</div>
			<Drawer.Footer>
				<Button>إرسال</Button>
				<Drawer.Close class={buttonVariants({ variant: "outline" })}>إلغاء</Drawer.Close>
			</Drawer.Footer>
		</div>
	</Drawer.Content>
</Drawer.Root>
