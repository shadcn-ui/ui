<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { Check, Code2, Copy } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    code?: string
    previewClass?: string
  }>(),
  {
    title: undefined,
    description: undefined,
    code: undefined,
    previewClass: undefined,
  },
)

const showCode = ref(false)
const copied = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | undefined

const lineCount = computed(() =>
  props.code ? props.code.replace(/\n$/, '').split('\n').length : 0,
)

async function copyCode() {
  if (!props.code) return

  try {
    await navigator.clipboard.writeText(props.code)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = props.code
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }

  copied.value = true
  if (resetTimer) clearTimeout(resetTimer)
  resetTimer = setTimeout(() => {
    copied.value = false
  }, 1800)
}

onBeforeUnmount(() => {
  if (resetTimer) clearTimeout(resetTimer)
})
</script>

<template>
  <section class="saaze-demo" dir="rtl">
    <header class="saaze-demo__header">
      <div class="saaze-demo__heading">
        <h3 v-if="title" class="saaze-demo__title">{{ title }}</h3>
        <p v-if="description" class="saaze-demo__description">{{ description }}</p>
      </div>

      <div v-if="code" class="saaze-demo__actions">
        <button
          type="button"
          class="saaze-demo__action"
          :aria-expanded="showCode"
          aria-controls="saaze-demo-code"
          @click="showCode = !showCode"
        >
          <Code2 aria-hidden="true" />
          <span>{{ showCode ? 'بستن کد' : 'نمایش کد' }}</span>
        </button>
        <button
          v-if="showCode"
          type="button"
          class="saaze-demo__action"
          aria-live="polite"
          @click="copyCode"
        >
          <Check v-if="copied" aria-hidden="true" />
          <Copy v-else aria-hidden="true" />
          <span>{{ copied ? 'کپی شد' : 'کپی کد' }}</span>
        </button>
      </div>
    </header>

    <div :class="['saaze-demo__preview', previewClass]">
      <slot />
    </div>

    <div v-if="code && showCode" id="saaze-demo-code" class="saaze-demo__code">
      <div class="saaze-demo__code-bar">
        <span class="saaze-demo__code-dot" aria-hidden="true"></span>
        <span class="saaze-demo__code-label">Vue SFC</span>
        <span class="saaze-demo__code-lines">{{ lineCount }} خط</span>
      </div>
      <pre dir="ltr" tabindex="0"><code>{{ code }}</code></pre>
    </div>
  </section>
</template>

<style scoped>
.saaze-demo {
  margin: 24px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background-color: var(--vp-c-bg);
  overflow: hidden;
  box-shadow: 0 1px 2px rgb(15 23 42 / 4%);
}

.saaze-demo__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.saaze-demo__heading {
  min-width: 0;
}

.saaze-demo__title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.saaze-demo__description {
  margin: 4px 0 0;
  font-size: 13px;
  line-height: 1.8;
  color: var(--vp-c-text-2);
}

.saaze-demo__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.saaze-demo__action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition:
    color 0.2s,
    border-color 0.2s,
    background-color 0.2s;
}

.saaze-demo__action:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.saaze-demo__action:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.saaze-demo__action svg {
  width: 15px;
  height: 15px;
}

.saaze-demo__preview {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  padding: 28px 20px;
  min-height: 120px;
  background-color: var(--vp-c-bg);
  background-image: radial-gradient(var(--vp-c-divider) 0.7px, transparent 0.7px);
  background-size: 16px 16px;
}

.saaze-demo__code {
  border-top: 1px solid var(--vp-c-divider);
  background-color: var(--vp-code-block-bg);
}

.saaze-demo__code-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 16px;
  border-bottom: 1px solid var(--vp-code-block-divider-color);
  color: var(--vp-c-text-3);
  font-size: 11px;
  letter-spacing: 0.04em;
}

.saaze-demo__code-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background-color: #f2b134;
}

.saaze-demo__code-label {
  font-weight: 600;
}

.saaze-demo__code-lines {
  margin-inline-start: auto;
}

.saaze-demo__code pre {
  margin: 0;
  padding: 16px 20px 20px;
  overflow-x: auto;
  direction: ltr;
  text-align: left;
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
  line-height: 1.85;
  color: var(--vp-code-block-color);
  tab-size: 2;
}

.saaze-demo__code code {
  font-family: inherit;
  white-space: pre;
}

@media (max-width: 640px) {
  .saaze-demo__preview {
    padding: 20px 16px;
  }
}
</style>
