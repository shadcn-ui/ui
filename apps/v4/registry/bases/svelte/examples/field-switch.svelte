<script lang="ts">
	import * as Field from "$lib/registry/ui/field/index.js";
	import { Switch } from "$lib/registry/ui/switch/index.js";
</script>

<div class="w-full max-w-md">
	<Field.Field orientation="horizontal">
		<Field.Content>
			<Field.Label for="2fa">Multi-factor authentication</Field.Label>
			<Field.Description>
				Enable multi-factor authentication. If you do not have a two-factor device, you can
				use a one-time code sent to your email.
			</Field.Description>
		</Field.Content>
		<Switch id="2fa" />
	</Field.Field>
</div>
