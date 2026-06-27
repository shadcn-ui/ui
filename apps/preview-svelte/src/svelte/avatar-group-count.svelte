<script lang="ts">
	import * as Avatar from "@/svelte-ui/avatar/index.js";
</script>

<Avatar.Group class="grayscale">
	<Avatar.Root>
		<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
		<Avatar.Fallback>CN</Avatar.Fallback>
	</Avatar.Root>
	<Avatar.Root>
		<Avatar.Image src="https://github.com/maxleiter.png" alt="@maxleiter" />
		<Avatar.Fallback>LR</Avatar.Fallback>
	</Avatar.Root>
	<Avatar.Root>
		<Avatar.Image src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
		<Avatar.Fallback>ER</Avatar.Fallback>
	</Avatar.Root>
	<Avatar.GroupCount>+3</Avatar.GroupCount>
</Avatar.Group>
