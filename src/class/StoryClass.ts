import { StoryEdge } from './StoryEdge'
import { ConditionalActivation, StoryItem, type NodeType } from './StoryItem'

type JsonObject = Record<string, unknown>

export class Story {
  title: string
  items: StoryItem[] = []
  edges: StoryEdge[] = []
  conditions: Record<string, string> = {}

  constructor(title: string, data: JsonObject) {
    this.title = title

    for (const item of data['nodes'] as JsonObject[]) {
      this.items.push(this.convertToStoryItem(item))
    }

    for (const edge of data['edges'] as JsonObject[]) {
      this.edges.push(
        new StoryEdge(edge['from'] as string, edge['to'] as string),
      )
    }
  }

  getNodeType(nodeType: string): NodeType {
    return StoryItem.stringToNodeType(nodeType)
  }

  addStoryConditionActivated(storyitem: StoryItem): void {
    if (
      storyitem.hasActivation() &&
      storyitem.conditionalActivation?.activateKey
    ) {
      this.conditions[storyitem.conditionalActivation!.activateKey!] =
        storyitem.conditionalActivation!.activateValue!
    }
  }

  convertToStoryItem(data: JsonObject): StoryItem {
    const conditionalActivation = data['conditional_activation'] as
      | JsonObject
      | undefined
    let conditionalActivationObject: ConditionalActivation | undefined
    if (conditionalActivation) {
      conditionalActivationObject = new ConditionalActivation(
        conditionalActivation['activated_by_key'] as string | undefined,
        conditionalActivation['activated_by_value'] as string | undefined,
        conditionalActivation['activate_key'] as string | undefined,
        conditionalActivation['activate_value'] as string | undefined,
      )
    }

    return new StoryItem(
      data['id'] as string,
      data['text'] as string,
      this.getNodeType(data['node_type'] as string),
      parseInt(data['minutes_to_wait'] as string),
      conditionalActivationObject,
    )
  }
}
