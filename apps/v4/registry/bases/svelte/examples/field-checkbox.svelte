<script lang="ts">
	import * as Field from "$lib/registry/ui/field/index.js";
	import { Checkbox } from "$lib/registry/ui/checkbox/index.js";
</script>

<div class="w-full max-w-md">
	<Field.Group>
		<Field.Set>
			<Field.Legend variant="label">Show these items on the desktop</Field.Legend>
			<Field.Description>Select the items you want to show on the desktop.</Field.Description>
			<Field.Group class="gap-3">
				<Field.Field orientation="horizontal">
					<Checkbox id="finder-pref-9k2-hard-disks-ljj" checked />
					<Field.Label for="finder-pref-9k2-hard-disks-ljj" class="font-normal">
						Hard disks
					</Field.Label>
				</Field.Field>
				<Field.Field orientation="horizontal">
					<Checkbox id="finder-pref-9k2-external-disks-1yg" />
					<Field.Label for="finder-pref-9k2-external-disks-1yg" class="font-normal">
						External disks
					</Field.Label>
				</Field.Field>
				<Field.Field orientation="horizontal">
					<Checkbox id="finder-pref-9k2-cds-dvds-fzt" />
					<Field.Label for="finder-pref-9k2-cds-dvds-fzt" class="font-normal">
						CDs, DVDs, and iPods
					</Field.Label>
				</Field.Field>
				<Field.Field orientation="horizontal">
					<Checkbox id="finder-pref-9k2-connected-servers-6l2" />
					<Field.Label for="finder-pref-9k2-connected-servers-6l2" class="font-normal">
						Connected servers
					</Field.Label>
				</Field.Field>
			</Field.Group>
		</Field.Set>
		<Field.Separator />
		<Field.Field orientation="horizontal">
			<Checkbox id="finder-pref-9k2-sync-folders-nep" checked />
			<Field.Content>
				<Field.Label for="finder-pref-9k2-sync-folders-nep">
					Sync Desktop & Documents folders
				</Field.Label>
				<Field.Description>
					Your Desktop & Documents folders are being synced with iCloud Drive. You can
					access them from other devices.
				</Field.Description>
			</Field.Content>
		</Field.Field>
	</Field.Group>
</div>
