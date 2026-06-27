<script setup lang="ts">
import DeleteIcon from '@material-symbols/svg-400/rounded/delete.svg?component'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/ui/alert-dialog'
import { Button } from '@/ui/button'
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <Button variant="destructive">
        Delete Chat
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent size="sm">
      <AlertDialogHeader>
        <AlertDialogMedia class="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
          <DeleteIcon />
        </AlertDialogMedia>
        <AlertDialogTitle>Delete chat?</AlertDialogTitle>
        <AlertDialogDescription>
          This will permanently delete this chat conversation. View
          <a href="#">Settings</a> delete any memories saved during this chat.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
        <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
