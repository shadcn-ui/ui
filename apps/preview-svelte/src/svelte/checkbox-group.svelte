<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import { Checkbox } from "@/svelte-ui/checkbox/index.js";
</script>

<Field.Set>
	<Field.Legend variant="label">Show these items on the desktop:</Field.Legend>
	<Field.Description>Select the items you want to show on the desktop.</Field.Description>
	<Field.Group class="gap-3">
		<Field.Field orientation="horizontal">
			<Checkbox
				id="finder-pref-9k2-hard-disks-ljj-checkbox"
				name="finder-pref-9k2-hard-disks-ljj-checkbox"
				checked
			/>
			<Field.Label for="finder-pref-9k2-hard-disks-ljj-checkbox" class="font-normal">
				Hard disks
			</Field.Label>
		</Field.Field>
		<Field.Field orientation="horizontal">
			<Checkbox
				id="finder-pref-9k2-external-disks-1yg-checkbox"
				name="finder-pref-9k2-external-disks-1yg-checkbox"
				checked
			/>
			<Field.Label for="finder-pref-9k2-external-disks-1yg-checkbox" class="font-normal">
				External disks
			</Field.Label>
		</Field.Field>
		<Field.Field orientation="horizontal">
			<Checkbox
				id="finder-pref-9k2-cds-dvds-fzt-checkbox"
				name="finder-pref-9k2-cds-dvds-fzt-checkbox"
			/>
			<Field.Label for="finder-pref-9k2-cds-dvds-fzt-checkbox" class="font-normal">
				CDs, DVDs, and iPods
			</Field.Label>
		</Field.Field>
		<Field.Field orientation="horizontal">
			<Checkbox
				id="finder-pref-9k2-connected-servers-6l2-checkbox"
				name="finder-pref-9k2-connected-servers-6l2-checkbox"
			/>
			<Field.Label for="finder-pref-9k2-connected-servers-6l2-checkbox" class="font-normal">
				Connected servers
			</Field.Label>
		</Field.Field>
	</Field.Group>
</Field.Set>
