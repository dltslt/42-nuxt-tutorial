<script setup lang="ts">
import { kindLabel, type AnatomyNode } from '../../utils/anatomy'

defineOptions({ name: 'AnatomyBranch' })
defineProps<{ nodes: AnatomyNode[] }>()
</script>

<template>
  <ul class="anatomy-list">
    <li v-for="node in nodes" :key="node.id">
      <ChaptersAnatomyDetails v-if="node.children" class="anatomy-dir" :open="node.open">
        <summary>{{ node.name }}{{ node.name.endsWith('/') ? '' : '/' }}</summary>
        <AnatomyBranch :nodes="node.children" />
      </ChaptersAnatomyDetails>
      <ChaptersAnatomyDetails v-else class="anatomy-file" name="anatomy-file" :open="node.open">
        <summary>
          <span class="anatomy-kind" :data-kind="node.kind">{{ kindLabel[node.kind!] }}</span>
          <span>{{ node.name }}</span>
        </summary>
        <div class="anatomy-body">
          <p class="anatomy-becomes"><InlineText :text="node.becomes ?? ''" /></p>
          <p><InlineText :text="node.text ?? ''" /></p>
        </div>
      </ChaptersAnatomyDetails>
    </li>
  </ul>
</template>
