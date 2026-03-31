<script lang="ts">
	import { Button } from "$lib/registry/ui/button/index.js";
	import { Spinner } from "$lib/registry/ui/spinner/index.js";
</script>

<div class="flex flex-col items-center gap-4">
	<Button disabled size="sm">
		<Spinner />
		Loading...
	</Button>
	<Button variant="outline" disabled size="sm">
		<Spinner />
		Please wait
	</Button>
	<Button variant="secondary" disabled size="sm">
		<Spinner />
		Processing
	</Button>
</div>
