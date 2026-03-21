import { useEffect, useRef, useState } from "react";
import { Eye } from "lucide-react";

interface VisitorCounterProps {
  pageId: string;
}

export function VisitorCounter({ pageId }: VisitorCounterProps) {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const fetchAndIncrement = async () => {
      try {
        // Attempt to use CountAPI if available (production)
        const isProduction = window.location.hostname !== "localhost" && !window.location.hostname.startsWith("127");
        
        if (isProduction) {
          const namespace = "aditibhatnagar-blog";
          const url = `https://api.countapi.com/hit/${namespace}/${pageId}`;
          console.log("Fetching visitor count from CountAPI:", url);
          
          const response = await fetch(url);
          const data = await response.json();
          console.log("CountAPI response:", data);
          setCount(data.value);
        } else {
          // Fallback to localStorage for local development
          console.log("Using localStorage for local development");
          const storageKey = `visitor-count-${pageId}`;
          const stored = localStorage.getItem(storageKey);
          const currentCount = (stored ? parseInt(stored, 10) : 0) + 1;
          localStorage.setItem(storageKey, currentCount.toString());
          console.log(`Local count for ${pageId}:`, currentCount);
          setCount(currentCount);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        console.error("Failed to fetch visitor count:", errorMsg);
        
        // Fallback to localStorage on error
        try {
          const storageKey = `visitor-count-${pageId}`;
          const stored = localStorage.getItem(storageKey);
          const currentCount = (stored ? parseInt(stored, 10) : 0) + 1;
          localStorage.setItem(storageKey, currentCount.toString());
          setCount(currentCount);
        } catch (storageErr) {
          console.error("localStorage also failed:", storageErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAndIncrement();
  }, [pageId]);

  const formatCount = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  if (loading) {
    return (
      <div className="mt-6 h-5 w-24 animate-pulse rounded bg-muted" />
    );
  }

  if (count === null) {
    return null;
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Eye className="h-3 w-3" />
      <span>{formatCount(count)}</span>
    </div>
  );
}
