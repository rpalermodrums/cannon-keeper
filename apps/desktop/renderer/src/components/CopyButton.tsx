import { useState, type JSX } from "react";
import { Check, Copy } from "lucide-react";

type CopyButtonProps = {
  text: string;
  label?: string;
  className?: string;
};

export function CopyButton({ text, label = "Copy", className = "" }: CopyButtonProps): JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API may not be available
    }
  };

  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1.5 border border-border rounded-sm bg-surface-2 px-2 py-1 text-xs text-text-secondary transition-colors duration-100 hover:enabled:bg-white dark:hover:enabled:bg-surface-1 cursor-pointer ${className}`}
      title={copied ? "Copied!" : label}
      onClick={() => void handleCopy()}
    >
      {copied ? <Check size={14} className="text-ok" /> : <Copy size={14} />}
      <span>{copied ? "Copied" : label}</span>
    </button>
  );
}
