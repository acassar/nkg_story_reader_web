export class StoryEdge {
  from: string
  to: string

  constructor(from: string, to: string) {
    this.from = from
    this.to = to
  }

  toJson(): string {
    return `{\n    "from": "${this.from}",\n    "to": "${this.to}"\n}`
  }
}
