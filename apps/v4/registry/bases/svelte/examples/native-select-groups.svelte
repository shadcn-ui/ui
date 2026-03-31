<script lang="ts">
	import * as NativeSelect from "$lib/registry/ui/native-select/index.js";
</script>

<NativeSelect.Root>
	<NativeSelect.Option value="">Select department</NativeSelect.Option>
	<NativeSelect.OptGroup label="Engineering">
		<NativeSelect.Option value="frontend">Frontend</NativeSelect.Option>
		<NativeSelect.Option value="backend">Backend</NativeSelect.Option>
		<NativeSelect.Option value="devops">DevOps</NativeSelect.Option>
	</NativeSelect.OptGroup>
	<NativeSelect.OptGroup label="Sales">
		<NativeSelect.Option value="sales-rep">Sales Rep</NativeSelect.Option>
		<NativeSelect.Option value="account-manager">Account Manager</NativeSelect.Option>
		<NativeSelect.Option value="sales-director">Sales Director</NativeSelect.Option>
	</NativeSelect.OptGroup>
	<NativeSelect.OptGroup label="Operations">
		<NativeSelect.Option value="support">Customer Support</NativeSelect.Option>
		<NativeSelect.Option value="product-manager">Product Manager</NativeSelect.Option>
		<NativeSelect.Option value="ops-manager">Operations Manager</NativeSelect.Option>
	</NativeSelect.OptGroup>
</NativeSelect.Root>
