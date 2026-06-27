<script setup lang="ts">
import BluetoothIcon from '@material-symbols/svg-400/rounded/bluetooth.svg?component'
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
  <div class="flex gap-4" dir="rtl">
    <AlertDialog>
      <AlertDialogTrigger as-child>
        <Button variant="outline">
          إظهار الحوار
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
          <AlertDialogDescription>
            لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف حسابك نهائيًا من خوادمنا.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction>متابعة</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <AlertDialog>
      <AlertDialogTrigger as-child>
        <Button variant="outline">
          إظهار الحوار (صغير)
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm" dir="rtl">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <BluetoothIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>السماح للملحق بالاتصال؟</AlertDialogTitle>
          <AlertDialogDescription>
            هل تريد السماح لملحق USB بالاتصال بهذا الجهاز؟
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>عدم السماح</AlertDialogCancel>
          <AlertDialogAction>السماح</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
