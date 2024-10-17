<script setup lang="ts">
import type { StoryItem } from '@/class/StoryItem';

defineProps<{
storyItem: StoryItem
}>();
</script>

<template>
<div>{{ storyItem.text }}</div>
</template>

<style scoped>

</style>