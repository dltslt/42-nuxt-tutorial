<script setup lang="ts">
import { kindLabel, type AnatomyNode } from '../../utils/anatomy'

defineOptions({ name: 'AnatomyBranch' })
defineProps<{ nodes: AnatomyNode[] }>()
</script>

<template>
  <ul class="anatomy-list">
    <!-- v-memo keeps the first render. A later patch would write `open` back and undo the click. -->
    <li v-for="node in nodes" :key="node.id" v-memo="[node.id]">
      <details v-if="node.children" class="anatomy-dir" :open="node.open">
        <summary>{{ node.name }}{{ node.name.endsWith('/') ? '' : '/' }}</summary>
        <AnatomyBranch :nodes="node.children" />
      </details>
      <details v-else class="anatomy-file" name="anatomy-file" :open="node.open">
        <summary>
          <span class="anatomy-kind" :data-kind="node.kind">{{ kindLabel[node.kind!] }}</span>
          <span>{{ node.name }}</span>
        </summary>
        <div class="anatomy-body">
          <p class="anatomy-becomes"><InlineText :text="node.becomes ?? ''" /></p>
          <p><InlineText :text="node.text ?? ''" /></p>
        </div>
      </details>
    </li>
  </ul>
</template>
