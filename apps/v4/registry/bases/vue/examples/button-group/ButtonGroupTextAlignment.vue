<script setup lang="ts">
import { Button } from "@/ui/button"
import { ButtonGroup } from "@/ui/button-group"
import { Field } from "@/ui/field"
import { Label } from "@/ui/label"
import { Example } from "@/components/example"
</script>

<template>
  <Example title="Text Alignment">
    <Field>
      <Label id="alignment-label">
        Text Alignment
      </Label>
      <ButtonGroup aria-labelledby="alignment-label">
        <Button variant="outline" size="sm">
          Left
        </Button>
        <Button variant="outline" size="sm">
          Center
        </Button>
        <Button variant="outline" size="sm">
          Right
        </Button>
        <Button variant="outline" size="sm">
          Justify
        </Button>
      </ButtonGroup>
    </Field>
  </Example>
</template>
