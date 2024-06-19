export default function LanguageToColor(language: string) {
  switch (language.toLowerCase()) {
    case "python":
      return "text-green-500";
    case "javascript":
      return "text-yellow-500";
    case "typescript":
      return "text-blue-500";
    case "go":
      return "text-blue-300";
    default:
      return "text-slate-500";
  }
}
