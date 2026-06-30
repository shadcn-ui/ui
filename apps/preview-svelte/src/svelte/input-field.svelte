<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import { Input } from "@/svelte-ui/input/index.js";
</script>

<Field.Field>
	<Field.Label for="input-field-username">Username</Field.Label>
	<Input id="input-field-username" type="text" placeholder="Enter your username" />
	<Field.Description>Choose a unique username for your account.</Field.Description>
</Field.Field>
