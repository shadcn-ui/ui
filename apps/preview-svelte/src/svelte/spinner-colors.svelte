<script lang="ts">
	import { Spinner } from "@/svelte-ui/spinner/index.js";
</script>

<div class="flex items-center gap-6">
	<Spinner color="default" />
	<Spinner color="primary" />
	<Spinner color="inherit" />
	<div class="rounded-md bg-primary p-2">
		<Spinner color="onPrimary" />
	</div>
</div>
