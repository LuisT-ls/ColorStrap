"use client"

import { useState, useEffect } from "react"
import { Palette, RefreshCcw, Copy, Wand2 } from "lucide-react"
import { convertColor, getRandomColor } from "@/lib/colors"
import { cn } from "@/lib/utils"

export default function ColorConverter() {
    const [input, setInput] = useState("#3b82f6")
    const [result, setResult] = useState<any>(null)

    useEffect(() => {
        setResult(convertColor(input))
    }, [input])

    const handleRandom = () => {
        setInput(getRandomColor())
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    return (
        <div className="premium-card overflow-hidden flex flex-col group/card">
            <div className="p-5 border-b bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <Palette className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-bold tracking-tight">Conversor</h3>
                </div>
                <button
                    onClick={handleRandom}
                    className="p-2 rounded-xl hover:bg-background transition-all active:scale-95 text-muted-foreground hover:text-primary border border-transparent hover:border-border"
                    title="Cor Aleatória"
                >
                    <Wand2 className="h-4 w-4" />
                </button>
            </div>

            <div className="p-6 space-y-6 flex-grow">
                <div className="space-y-4">
                    <div className="flex gap-3">
                        <div className="relative group overflow-hidden rounded-xl border-2 border-border shadow-sm w-14 h-12 flex-shrink-0 transition-transform hover:scale-105 active:scale-95">
                            <input
                                type="color"
                                value={result?.hex || "#ffffff"}
                                onChange={(e) => setInput(e.target.value)}
                                className="absolute inset-[-15px] w-[200%] h-[200%] cursor-pointer"
                            />
                        </div>
                        <div className="flex-grow">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="#3B82F6"
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 font-mono text-sm outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary transition-all shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    {[
                        { label: "HEX", value: result?.hex },
                        { label: "RGB", value: result?.rgb },
                        { label: "HSL", value: result?.hsl },
                    ].map((item) => (
                        <div key={item.label} className="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-border hover:bg-muted/30 transition-all">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-muted-foreground/40 uppercase w-8 tracking-tighter">{item.label}</span>
                                <code className="text-sm font-mono font-bold tracking-tight">{item.value || "---"}</code>
                            </div>
                            <button
                                onClick={() => item.value && copyToClipboard(item.value)}
                                className="p-2 rounded-lg opacity-0 group-hover:opacity-100 bg-background shadow-sm hover:text-primary transition-all border active:scale-90"
                            >
                                <Copy className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
