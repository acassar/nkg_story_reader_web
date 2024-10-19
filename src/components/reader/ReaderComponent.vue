<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import ChatBubble from '../chat/ChatBubble.vue';
import ExampleStory from "@/stories/example/example.json"
import { Story } from '@/class/StoryClass';
import { StoryItem } from '@/class/StoryItem';

const currentStory = ref<Story>()
const storyItems = ref<StoryItem[]>([])

const lastItem = computed(() => (storyItems.value?.length ?? 0) > 0 ? storyItems.value![storyItems.value!.length - 1] : undefined)
const choices = computed(() => {
    if(!lastItem.value)
    return []
    return getChildren(lastItem.value)
})

onMounted(() => {
    loadStory();
})

const loadStory = async () => {
    try {
        currentStory.value = new Story("Example", ExampleStory)
        selectItem(currentStory.value.items.find(e => e.id === 'start') ?? currentStory.value.items[0])
    } catch(error) {
        console.log(error)
    }
}

const getItemPosition = (storyItem: StoryItem): 'left' | 'right' => {
    console.log(storyItem)
    if(storyItem.nodeType === 'CHOICE')
        return 'right'
    return 'left'
}

const selectItem = (item: StoryItem) => {
    storyItems.value?.push(item)
    handleAutoText(item)
}

const getChildren = (storyItem: StoryItem) => {
    const relatedNodes = currentStory.value?.edges.filter(edge => edge.from === storyItem?.id)
    return currentStory.value?.items.filter(child => relatedNodes?.map(e => e.to).includes(child.id))
}

const handleAutoText = (item: StoryItem) => {
    const children = getChildren(item)
    if(children?.length === 1)
        selectItem(children.pop()!)
}

</script>

<template>
<div class="container">
    <ChatBubble :position="getItemPosition(item)" :story-item="item" :key="index" v-for="(item, index) of storyItems" :class="getItemPosition"/>
    <button :key="choice.id" v-for="choice in choices" @click="selectItem(choice)">
        {{ choice.text }}
    </button>
</div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
}
</style>