<script lang="ts">
	import { Label } from "@/svelte-ui/label/index.js";
	import { Switch } from "@/svelte-ui/switch/index.js";
</script>

<div class="flex items-center space-x-2">
	<Switch id="airplane-mode" />
	<Label for="airplane-mode">Airplane Mode</Label>
</div>
