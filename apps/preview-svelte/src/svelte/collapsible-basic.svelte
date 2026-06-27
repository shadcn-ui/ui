<script lang="ts">
	import ChevronDownIcon from "~icons/ms/keyboard_arrow_down";
	import { Button, buttonVariants } from "@/svelte-ui/button/index.js";
	import * as Card from "@/svelte-ui/card/index.js";
	import * as Collapsible from "@/svelte-ui/collapsible/index.js";
</script>

<Card.Root class="mx-auto w-full max-w-sm">
	<Card.Content>
		<Collapsible.Root class="rounded-md data-[state=open]:bg-muted">
			<Collapsible.Trigger class={buttonVariants({ variant: "ghost", class: "group w-full" })}>
				Product details
				<ChevronDownIcon class="ml-auto group-data-[state=open]:rotate-180" />
			</Collapsible.Trigger>
			<Collapsible.Content class="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
				<div>
					This panel can be expanded or collapsed to reveal additional
					content.
				</div>
				<Button size="xs">Learn More</Button>
			</Collapsible.Content>
		</Collapsible.Root>
	</Card.Content>
</Card.Root>
