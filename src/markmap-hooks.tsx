import React, { useEffect, useRef, useState } from 'react';
import { Markmap } from 'markmap-view';
import { transformer } from './markmap';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MarkmapHooksProps {
  markdown: string;
}

export default function MarkmapHooks({ markdown }: MarkmapHooksProps) {
  const refSvg = useRef<SVGSVGElement>(null);
  const refMm = useRef<Markmap>();
  const [currentMarkdown, setCurrentMarkdown] = useState(markdown);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!refMm.current && refSvg.current) {
      const mm = Markmap.create(refSvg.current);
      refMm.current = mm;
    }
  }, []);

  useEffect(() => {
    const mm = refMm.current;
    if (!mm) return;

    const { root } = transformer.transform(currentMarkdown);
    mm.setData(root);

    // Use a small timeout to ensure SVG has updated its dimensions
    const timer = setTimeout(() => {
      mm.fit();
    }, 100);

    return () => clearTimeout(timer);
  }, [currentMarkdown]);

  useEffect(() => {
    const handleResize = () => {
      refMm.current?.fit();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8787";
      const response = await fetch(`${apiUrl}/generate-mindmap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userInput }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.markdown) {
        // Replace escaped `\n` characters with actual line breaks
        const processedMarkdown = data.markdown.replace(/\\n/g, '\n');
        setCurrentMarkdown(processedMarkdown);
      } else {
        throw new Error("Invalid response format: Missing 'markdown' key.");
      }

      setUserInput('');
    } catch (error) {
      console.error("Error fetching mindmap:", error);
      alert("Failed to generate mindmap. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full">
      <svg ref={refSvg} className="w-full h-full" />
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex space-x-2">
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your query (e.g., How to prepare for a marathon)"
            className="w-full py-2 px-4 text-sm border rounded-lg"
          />
          <Button type="submit" className="rounded-lg" disabled={isLoading || !userInput.trim()}>
            {isLoading ? "Loading..." : "Generate"}
          </Button>
        </form>
      </div>
    </div>
  );
}
