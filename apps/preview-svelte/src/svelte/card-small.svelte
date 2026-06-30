<script lang="ts">
	import { Button } from "@/svelte-ui/button/index.js";
	import * as Card from "@/svelte-ui/card/index.js";
</script>

<Card.Root size="sm" class="mx-auto w-full max-w-sm">
	<Card.Header>
		<Card.Title>Small Card</Card.Title>
		<Card.Description>This card uses the small size variant.</Card.Description>
	</Card.Header>
	<Card.Content>
		<p>
			The card component supports a size prop that can be set to
			"sm" for a more compact appearance.
		</p>
	</Card.Content>
	<Card.Footer>
		<Button variant="outline" size="sm" class="w-full">Action</Button>
	</Card.Footer>
</Card.Root>
