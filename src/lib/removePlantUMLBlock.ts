export default function removePlantUMLBlock(input: string): string {
    const regex = /^```plantuml\s*([\s\S]*?)\s*```$/m;
    const match = input.match(regex);
    return match ? match[1].trim() : input;
  }

  