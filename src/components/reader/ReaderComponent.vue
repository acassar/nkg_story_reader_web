<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ChatBubble from '../chat/ChatBubble.vue';
import ExampleStory from "@/stories/example/example.json"
import { Story } from '@/class/StoryClass';

const currentStory = ref<Story>()

const loadStory = async () => {
    try {
        currentStory.value = new Story("Example", ExampleStory)
    } catch(error) {
        console.log(error)
    }
}

onMounted(() => {
    loadStory();
})

</script>

<template>
<ChatBubble :story-item="item" :key="index" v-for="(item, index) of currentStory?.items" />
</template>

<style scoped>

</style>