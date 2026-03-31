<script lang="ts">
	import * as Field from "$lib/registry/ui/field/index.js";
	import { Checkbox } from "$lib/registry/ui/checkbox/index.js";
</script>

<div class="w-full max-w-md">
	<Field.Group>
		<Field.Set>
			<Field.Label>Responses</Field.Label>
			<Field.Description>
				Get notified when ChatGPT responds to requests that take time, like research or
				image generation.
			</Field.Description>
			<Field.Group data-slot="checkbox-group">
				<Field.Field orientation="horizontal">
					<Checkbox id="push" checked disabled />
					<Field.Label for="push" class="font-normal">Push notifications</Field.Label>
				</Field.Field>
			</Field.Group>
		</Field.Set>
		<Field.Separator />
		<Field.Set>
			<Field.Label>Tasks</Field.Label>
			<Field.Description>
				Get notified when tasks you've created have updates.
				<a href="#/">Manage tasks</a>
			</Field.Description>
			<Field.Group data-slot="checkbox-group">
				<Field.Field orientation="horizontal">
					<Checkbox id="push-tasks" />
					<Field.Label for="push-tasks" class="font-normal">
						Push notifications
					</Field.Label>
				</Field.Field>
				<Field.Field orientation="horizontal">
					<Checkbox id="email-tasks" />
					<Field.Label for="email-tasks" class="font-normal">
						Email notifications
					</Field.Label>
				</Field.Field>
			</Field.Group>
		</Field.Set>
	</Field.Group>
</div>
