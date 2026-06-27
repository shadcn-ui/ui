<script lang="ts">
	import { Badge } from "@/svelte-ui/badge/index.js";
	import { Button } from "@/svelte-ui/button/index.js";
	import * as Card from "@/svelte-ui/card/index.js";
</script>

<Card.Root class="relative mx-auto w-full max-w-sm pt-0">
	<div class="absolute inset-0 z-30 aspect-video bg-black/35" />
	<img
		src="https://avatar.vercel.sh/shadcn1"
		alt="Event cover"
		class="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
	/>
	<Card.Header>
		<Card.Action>
			<Badge variant="secondary">Featured</Badge>
		</Card.Action>
		<Card.Title>Design systems meetup</Card.Title>
		<Card.Description>
			A practical talk on component APIs, accessibility, and shipping faster.
		</Card.Description>
	</Card.Header>
	<Card.Footer>
		<Button class="w-full">View Event</Button>
	</Card.Footer>
</Card.Root>
