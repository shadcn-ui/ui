<script lang="ts">
	import { Button } from "@/svelte-ui/button/index.js";
	import * as Field from "@/svelte-ui/field/index.js";
	import { Input } from "@/svelte-ui/input/index.js";
</script>

<Field.Field orientation="horizontal">
	<Input type="search" placeholder="Search..." />
	<Button>Search</Button>
</Field.Field>
