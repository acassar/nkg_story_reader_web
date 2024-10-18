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

const getItemPosition = (index: number): 'left' | 'right' => {
    return index%2 == 0 ? "left" : "right"
}

</script>

<template>
<div class="container">
    <ChatBubble :position="getItemPosition(index)" :story-item="item" :key="index" v-for="(item, index) of currentStory?.items" :class="getItemPosition"/>
</div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
}
</style>