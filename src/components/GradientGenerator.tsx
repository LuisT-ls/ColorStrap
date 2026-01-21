"use client"

import { useState, useEffect } from "react"
import { Copy, Plus, Trash2, Box } from "lucide-react"
import { cn } from "@/lib/utils"

export default function GradientGenerator() {
    const [colors, setColors] = useState(["#3b82f6", "#8b5cf6"])
    const [type, setType] = useState<"linear" | "radial" | "conic">("linear")
    const [angle, setAngle] = useState(90)

    const getGradient = () => {
        const colorStr = colors.join(", ")
        switch (type) {
            case "linear": return `linear-gradient(${angle}deg, ${colorStr})`
            case "radial": return `radial-gradient(circle, ${colorStr})`
            case "conic": return `conic-gradient(from ${angle}deg, ${colorStr})`
            default: return ""
        }
    }

    const addColor = () => {
        setColors([...colors, "#ffffff"])
    }

    const removeColor = (index: number) => {
        if (colors.length > 2) {
            setColors(colors.filter((_, i) => i !== index))
        }
    }

    const updateColor = (index: number, value: string) => {
        const newColors = [...colors]
        newColors[index] = value
        setColors(newColors)
    }

    return (
        <div className="premium-card overflow-hidden flex flex-col group/card h-full">
            <div className="p-5 border-b bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <Box className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-bold tracking-tight">Gradientes</h3>
                </div>
                <button
                    onClick={addColor}
                    className="p-2 rounded-xl hover:bg-background transition-all active:scale-95 text-muted-foreground hover:text-primary border border-transparent hover:border-border"
                    title="Adicionar Cor"
                >
                    <Plus className="h-5 w-5" />
                </button>
            </div>

            <div className="p-6 space-y-6 flex-grow flex flex-col">
                <div
                    className="h-32 rounded-2xl shadow-inner border border-white/10 overflow-hidden relative"
                    style={{ background: getGradient() }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>

                <div className="space-y-6 flex-grow">
                    <div>
                        <label className="section-label">Cores do Gradiente</label>
                        <div className="flex flex-wrap gap-3">
                            {colors.map((color, i) => (
                                <div key={i} className="flex items-center gap-1.5 bg-muted/50 p-1.5 rounded-2xl border border-transparent hover:border-border transition-all">
                                    <div className="relative w-10 h-10 rounded-xl border border-border overflow-hidden flex-shrink-0 shadow-sm">
                                        <input
                                            type="color"
                                            value={color}
                                            onChange={(e) => updateColor(i, e.target.value)}
                                            className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer"
                                        />
                                    </div>
                                    {colors.length > 2 && (
                                        <button
                                            onClick={() => removeColor(i)}
                                            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="section-label">Tipo</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value as any)}
                                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wider outline-none focus:ring-4 focus:ring-primary/15 transition-all"
                            >
                                <option value="linear">Linear</option>
                                <option value="radial">Radial</option>
                                <option value="conic">Cônico</option>
                            </select>
                        </div>
                        {type !== "radial" && (
                            <div className="space-y-2">
                                <label className="section-label flex justify-between">
                                    <span>Ângulo</span>
                                    <span className="text-primary">{angle}°</span>
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="360"
                                    value={angle}
                                    onChange={(e) => setAngle(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary mt-2"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t border-dashed">
                    <div className="bg-muted px-4 py-3 rounded-xl border flex items-center justify-between gap-4">
                        <code className="text-[10px] font-mono truncate font-bold opacity-60">{getGradient()}</code>
                        <button
                            onClick={() => navigator.clipboard.writeText(getGradient())}
                            className="p-2 hover:bg-background rounded-lg transition-all active:scale-90 border shadow-sm"
                            title="Copiar CSS"
                        >
                            <Copy className="h-4 w-4 text-primary" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
