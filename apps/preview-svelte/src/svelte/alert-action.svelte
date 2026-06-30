<script lang="ts">
	import * as Alert from "@/svelte-ui/alert/index.js";
	import { Button } from "@/svelte-ui/button/index.js";
</script>

<Alert.Root class="max-w-md">
	<Alert.Title>Dark mode is now available</Alert.Title>
	<Alert.Description>
		Enable it under your profile settings to get started.
	</Alert.Description>
	<Alert.Action>
		<Button size="xs" variant="default">Enable</Button>
	</Alert.Action>
</Alert.Root>
