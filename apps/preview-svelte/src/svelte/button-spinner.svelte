<script lang="ts">
	import { Button } from "@/svelte-ui/button/index.js";
	import { Spinner } from "@/svelte-ui/spinner/index.js";
</script>

<div class="flex gap-2">
	<Button variant="outline" disabled>
		<Spinner data-icon="inline-start" />
		Generating
	</Button>
	<Button variant="secondary" disabled>
		Downloading
		<Spinner data-icon="inline-start" />
	</Button>
</div>
