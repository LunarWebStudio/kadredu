export default function LanguageToColor(language: string) {
  switch (language.toLowerCase()) {
    case "python":
      return {
        text: "text-green-500",
        background: "bg-green-500",
      };
    case "javascript":
      return {
        text: "text-yellow-500",
        background: "bg-yellow-500",
      };
    case "typescript":
      return {
        text: "text-blue-500",
        background: "bg-blue-500",
      };
    case "go":
      return {
        text: "text-blue-300",
        background: "bg-blue-300",
      };
    default:
      return {
        text: "text-slate-500",
        background: "bg-slate-500",
      };
  }
}
