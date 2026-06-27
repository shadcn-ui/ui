<script lang="ts">
	import * as Avatar from "@/svelte-ui/avatar/index.js";
</script>

<div class="flex flex-row flex-wrap items-center gap-6 md:gap-12" dir="rtl">
	<Avatar.Root>
		<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" class="grayscale" />
		<Avatar.Fallback>CN</Avatar.Fallback>
	</Avatar.Root>
	<Avatar.Root>
		<Avatar.Image src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
		<Avatar.Fallback>ER</Avatar.Fallback>
		<Avatar.Badge class="bg-green-600 dark:bg-green-800" />
	</Avatar.Root>
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
</div>
