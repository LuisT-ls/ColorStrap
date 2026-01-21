"use client"

import { useState, useEffect } from "react"
import { Palette, Copy, Check } from "lucide-react"
import { generatePalette, ColorMode } from "@/lib/colors"
import { cn } from "@/lib/utils"

export default function ColorSchemeGenerator() {
    const [baseColor, setBaseColor] = useState("#6366f1")
    const [mode, setMode] = useState<ColorMode>("monochromatic")
    const [colors, setColors] = useState<string[]>([])
    const [copied, setCopied] = useState<string | null>(null)

    useEffect(() => {
        const generated = generatePalette(baseColor, mode, 5)
        setColors(generated)
    }, [baseColor, mode])

    const copyToClipboard = (color: string) => {
        navigator.clipboard.writeText(color)
        setCopied(color)
        setTimeout(() => setCopied(null), 2000)
    }

    return (
        <div className="premium-card overflow-hidden flex flex-col group/card h-full">
            <div className="p-5 border-b bg-muted/20">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <Palette className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-bold tracking-tight">Esquemas de Cores</h3>
                </div>
            </div>

            <div className="p-6 space-y-6 flex-grow">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="section-label">Cor Base</label>
                        <div className="relative w-full h-12 rounded-xl border-2 border-border overflow-hidden shadow-sm transition-transform hover:scale-[1.01]">
                            <input
                                type="color"
                                value={baseColor}
                                onChange={(e) => setBaseColor(e.target.value)}
                                className="absolute inset-[-15px] w-[200%] h-[200%] cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="section-label">Tipo de Esquema</label>
                        <select
                            value={mode}
                            onChange={(e) => setMode(e.target.value as ColorMode)}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm cursor-pointer"
                        >
                            <option value="monochromatic">Monocromático</option>
                            <option value="analogous">Análogo</option>
                            <option value="complementary">Complementar</option>
                            <option value="splitComplementary">Complementar Dividido</option>
                            <option value="triadic">Triádico</option>
                            <option value="tetradic">Tetrádico</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-5 gap-2 mt-4">
                    {colors.map((color, i) => (
                        <button
                            key={`${color}-${i}`}
                            onClick={() => copyToClipboard(color)}
                            className="group/swatch relative aspect-square rounded-xl border border-black/5 shadow-sm transition-all hover:scale-110 active:scale-95 overflow-hidden"
                            style={{ backgroundColor: color }}
                            title={color}
                        >
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/swatch:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                                {copied === color ? (
                                    <Check className="h-4 w-4 text-white" />
                                ) : (
                                    <Copy className="h-4 w-4 text-white" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="pt-4 text-center">
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-40">Clique para copiar o HEX</p>
                </div>
            </div>
        </div>
    )
}
