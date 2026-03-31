<script lang="ts">
	import * as Field from "$lib/registry/ui/field/index.js";
	import * as RadioGroup from "$lib/registry/ui/radio-group/index.js";

	let computeEnvironment = $state("kubernetes");
</script>

<div class="w-full max-w-md">
	<Field.Group>
		<Field.Set>
			<Field.Label for="compute-environment-p8w">Compute Environment</Field.Label>
			<Field.Description>Select the compute environment for your cluster.</Field.Description>
			<RadioGroup.Root bind:value={computeEnvironment}>
				<Field.Label for="kubernetes-r2h">
					<Field.Field orientation="horizontal">
						<Field.Content>
							<Field.Title>Kubernetes</Field.Title>
							<Field.Description>
								Run GPU workloads on a K8s configured cluster.
							</Field.Description>
						</Field.Content>
						<RadioGroup.Item value="kubernetes" id="kubernetes-r2h" />
					</Field.Field>
				</Field.Label>
				<Field.Label for="vm-z4k">
					<Field.Field orientation="horizontal">
						<Field.Content>
							<Field.Title>Virtual Machine</Field.Title>
							<Field.Description>
								Access a VM configured cluster to run GPU workloads.
							</Field.Description>
						</Field.Content>
						<RadioGroup.Item value="vm" id="vm-z4k" />
					</Field.Field>
				</Field.Label>
			</RadioGroup.Root>
		</Field.Set>
	</Field.Group>
</div>
