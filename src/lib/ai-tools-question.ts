// Optionele vraag in het quickscanformulier: gebruikt de aanvrager al AI-tools die
// zelf iets doen? We tellen de antwoorden om te zien of er vraag is naar een
// inventarisatie van wat zulke tools mogen, voordat daar een product van komt.
export const AI_TOOLS_QUESTION =
  "Gebruiken jullie al AI-tools die zelf iets doen, zoals mails versturen of afspraken inplannen?";

export const AI_TOOLS_OPTIONS = [
  { value: "nee", label: "Nee" },
  { value: "ja-duidelijk", label: "Ja, en we weten wat ze mogen" },
  { value: "ja-onduidelijk", label: "Ja, maar niet precies wat ze mogen" },
  { value: "weet-niet", label: "Weet ik niet" },
] as const;

export type AiToolsAnswer = (typeof AI_TOOLS_OPTIONS)[number]["value"];

export function parseAiToolsAnswer(value: unknown): AiToolsAnswer | null {
  return AI_TOOLS_OPTIONS.find((option) => option.value === value)?.value ?? null;
}

export function aiToolsLabel(value: string | null | undefined): string | null {
  return AI_TOOLS_OPTIONS.find((option) => option.value === value)?.label ?? null;
}
