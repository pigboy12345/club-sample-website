"use client";

import { Share2 } from "lucide-react";
import toast from "react-hot-toast";

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
}

export default function ShareButton({ title, text, url }: ShareButtonProps) {
  async function share() {
    const shareUrl = new URL(url, window.location.origin).toString();

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: shareUrl });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;

      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard");
      } catch {
        toast.error("Unable to share or copy this link");
      }
    }
  }

  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded border border-gray-400 px-3 py-1.5 text-gray-900 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
      onClick={share}
      aria-label={`Share ${title}`}
      title={`Share ${title}`}
    >
      <Share2 className="h-4 w-4" aria-hidden="true" />
      <span>Share</span>
    </button>
  );
}