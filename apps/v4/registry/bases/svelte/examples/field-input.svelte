<script lang="ts">
	import * as Field from "$lib/registry/ui/field/index.js";
	import { Input } from "$lib/registry/ui/input/index.js";
</script>

<div class="w-full max-w-md">
	<Field.Set>
		<Field.Group>
			<Field.Field>
				<Field.Label for="username">Username</Field.Label>
				<Input id="username" type="text" placeholder="Max Leiter" />
				<Field.Description>Choose a unique username for your account.</Field.Description>
			</Field.Field>
			<Field.Field>
				<Field.Label for="password">Password</Field.Label>
				<Field.Description>Must be at least 8 characters long.</Field.Description>
				<Input id="password" type="password" placeholder="••••••••" />
			</Field.Field>
		</Field.Group>
	</Field.Set>
</div>
