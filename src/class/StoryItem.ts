import type { Story } from './StoryClass'

export type NodeType = 'BAD' | 'GOOD' | 'TEXT' | 'CHOICE'

export class ConditionalActivation {
  activatedByKey: string | undefined
  activatedByValue: string | undefined
  activateKey: string | undefined
  activateValue: string | undefined

  constructor(
    activatedByKey: string | undefined,
    activatedByValue: string | undefined,
    activateKey: string | undefined,
    activateValue: string | undefined,
  ) {
    this.activatedByKey = activatedByKey
    this.activatedByValue = activatedByValue
    this.activateKey = activateKey
    this.activateValue = activateValue
  }
}

export class StoryItem {
  id: string
  text: string
  nodeType: NodeType
  minutesToWait: number
  conditionalActivation: ConditionalActivation | undefined
  isChoosing: boolean = false

  constructor(
    id: string,
    text: string,
    nodeType: NodeType,
    minutesToWait: number = 0,
    conditionalActivation: ConditionalActivation | undefined,
  ) {
    this.id = id
    this.text = text
    this.nodeType = nodeType
    this.minutesToWait = minutesToWait
    this.conditionalActivation = conditionalActivation
  }

  static stringToNodeType(type: string): NodeType {
    switch (type) {
      case 'bad':
        return 'BAD'
      case 'good':
        return 'GOOD'
      case 'text':
        return 'TEXT'
      case 'choice':
        return 'CHOICE'
      default:
        throw new Error('Node type not recognized')
    }
  }

  nodeTypeToString(): string {
    switch (this.nodeType) {
      case 'BAD':
        return 'bad'
      case 'GOOD':
        return 'good'
      case 'TEXT':
        return 'text'
      case 'CHOICE':
        return 'choice'
      default:
        return 'unknown'
    }
  }

  hasCondition(): boolean {
    return (
      !!this.conditionalActivation?.activatedByKey &&
      !!this.conditionalActivation?.activatedByValue
    )
  }

  hasActivation(): boolean {
    return (
      !!this.conditionalActivation?.activateKey &&
      !!this.conditionalActivation?.activateValue
    )
  }

  isSelectable(story: Story): boolean {
    if (this.hasCondition()) {
      return (
        story.conditions[this.conditionalActivation!.activatedByKey!] ==
        this.conditionalActivation!.activatedByValue
      )
    }
    return true
  }

  toJson(): string {
    return `
  {
    "id": "$id",
    "text": "${this.text.replace('\n', ' ')}",
    "node_type": "${this.nodeTypeToString()}",
    "minutes_to_wait": "$minutesToWait",
    "conditional_activation": {
      "activated_by_key": "${this.conditionalActivation?.activatedByKey ?? ''}",
      "activated_by_value": "${this.conditionalActivation?.activatedByValue ?? ''}",
      "activate_key": "${this.conditionalActivation?.activateKey ?? ''}",
      "activate_value": "${this.conditionalActivation?.activateValue ?? ''}"
    }
  }
    `
  }
}
