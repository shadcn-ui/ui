<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/ui/alert-dialog'
import { Button } from '@/ui/button'
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <Button variant="outline">
        Show Dialog
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent size="sm">
      <AlertDialogHeader>
        <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
        <AlertDialogDescription>
          Do you want to allow the USB accessory to connect to this device?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Don't allow</AlertDialogCancel>
        <AlertDialogAction>Allow</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
