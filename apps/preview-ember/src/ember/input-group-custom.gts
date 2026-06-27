import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from '@/ember-ui/input-group';

<template>
  <div class="grid w-full max-w-sm gap-6">
    <InputGroup>
      <textarea
        data-slot="input-group-control"
        class="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
        placeholder="Autoresize textarea..."
      ></textarea>
      <InputGroupAddon @align="block-end">
        <InputGroupButton @class="ml-auto" @size="sm" @variant="default">
          Submit
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  </div>
</template>
