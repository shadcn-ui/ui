<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import { Switch } from "@/svelte-ui/switch/index.js";
</script>

<Field.Group class="w-full max-w-sm">
	<Field.Label>
		<Field.Field orientation="horizontal">
			<Field.Content>
				<Field.Title>Share across devices</Field.Title>
				<Field.Description>
					Focus is shared across devices, and turns off when you leave the app.
				</Field.Description>
			</Field.Content>
			<Switch id="switch-share" />
		</Field.Field>
	</Field.Label>
	<Field.Label>
		<Field.Field orientation="horizontal">
			<Field.Content>
				<Field.Title>Enable notifications</Field.Title>
				<Field.Description>
					Receive notifications when focus mode is enabled or disabled.
				</Field.Description>
			</Field.Content>
			<Switch id="switch-notifications" checked />
		</Field.Field>
	</Field.Label>
</Field.Group>
