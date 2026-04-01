import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from '@/ui/native-select';

<template>
  <NativeSelect>
    <NativeSelectOption value="">Select department</NativeSelectOption>
    <NativeSelectOptGroup label="Engineering">
      <NativeSelectOption value="frontend">Frontend</NativeSelectOption>
      <NativeSelectOption value="backend">Backend</NativeSelectOption>
      <NativeSelectOption value="devops">DevOps</NativeSelectOption>
    </NativeSelectOptGroup>
    <NativeSelectOptGroup label="Sales">
      <NativeSelectOption value="sales-rep">Sales Rep</NativeSelectOption>
      <NativeSelectOption value="account-manager">Account Manager</NativeSelectOption>
      <NativeSelectOption value="sales-director">Sales Director</NativeSelectOption>
    </NativeSelectOptGroup>
    <NativeSelectOptGroup label="Operations">
      <NativeSelectOption value="support">Customer Support</NativeSelectOption>
      <NativeSelectOption value="product-manager">Product Manager</NativeSelectOption>
      <NativeSelectOption value="ops-manager">Operations Manager</NativeSelectOption>
    </NativeSelectOptGroup>
  </NativeSelect>
</template>
