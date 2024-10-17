export class StoryEdge {
  private from: string
  private to: string

  constructor(from: string, to: string) {
    this.from = from
    this.to = to
  }

  toJson(): string {
    return `{\n    "from": "${this.from}",\n    "to": "${this.to}"\n}`
  }
}
