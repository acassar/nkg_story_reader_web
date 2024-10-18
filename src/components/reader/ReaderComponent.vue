<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ChatBubble from '../chat/ChatBubble.vue';
import ExampleStory from "@/stories/example/example.json"
import { Story } from '@/class/StoryClass';
import { StoryItem } from '@/class/StoryItem';

const currentStory = ref<Story>()
const storyItems = ref<StoryItem[]>()



const loadStory = async () => {
    try {
        currentStory.value = new Story("Example", ExampleStory)
        storyItems.value = [currentStory.value.items.find(e => e.id === 'start') ?? currentStory.value.items[0]]
    } catch(error) {
        console.log(error)
    }
}

onMounted(() => {
    loadStory();
})

const getItemPosition = (index: number): 'left' | 'right' => {
    return index%2 == 0 ? "left" : "right"
}

</script>

<template>
<div class="container">
    <ChatBubble :position="getItemPosition(index)" :story-item="item" :key="index" v-for="(item, index) of storyItems" :class="getItemPosition"/>
</div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
}
</style>