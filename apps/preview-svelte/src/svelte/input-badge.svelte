<script lang="ts">
	import { Badge } from "@/svelte-ui/badge/index.js";
	import * as Field from "@/svelte-ui/field/index.js";
	import { Input } from "@/svelte-ui/input/index.js";
</script>

<Field.Field>
	<Field.Label for="input-badge">
		Webhook URL
		<Badge variant="secondary" class="ml-auto">Beta</Badge>
	</Field.Label>
	<Input id="input-badge" type="url" placeholder="https://api.example.com/webhook" />
</Field.Field>
