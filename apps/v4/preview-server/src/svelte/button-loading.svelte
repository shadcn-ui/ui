<script lang="ts">
	import { Button } from "@/svelte-ui/button/index.js";
	import { Spinner } from "@/svelte-ui/spinner/index.js";
</script>

<Button size="sm" variant="outline" disabled>
	<Spinner />
	Submit
</Button>
