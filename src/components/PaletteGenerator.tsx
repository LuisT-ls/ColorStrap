"use client"

import { useState, useEffect } from "react"
import { RefreshCw, Save, Copy, SwatchBook } from "lucide-react"
import { getRandomColor, generatePalette, ColorMode } from "@/lib/colors"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export default function PaletteGenerator() {
    const [baseColor, setBaseColor] = useState("#3b82f6")
    const [mode, setMode] = useState<ColorMode>("analogous")
    const [count, setCount] = useState(5)
    const [palette, setPalette] = useState<string[]>([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        handleGenerate()
    }, [])

    const handleGenerate = () => {
        const newColor = getRandomColor()
        setBaseColor(newColor)
        setPalette(generatePalette(newColor, mode, count))
    }

    const handleUpdate = (newMode: ColorMode, newCount: number) => {
        setMode(newMode)
        setCount(newCount)
        setPalette(generatePalette(baseColor, newMode, newCount))
    }

    const copyToClipboard = (color: string) => {
        navigator.clipboard.writeText(color)
        // Here I could add a toast notification
    }

    if (!mounted) return null

    return (
        <section id="palettes" className="mb-24 scroll-mt-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div className="space-y-1">
                    <span className="section-label">Palette Studio</span>
                    <h2 className="text-3xl font-extrabold tracking-tight">Gerador de Paletas</h2>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleGenerate}
                        className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-2xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 active:scale-95 group"
                    >
                        <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                        Nova Paleta
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                <div className="xl:col-span-3 space-y-8">
                    <div className="premium-card p-3 md:p-4 overflow-hidden shadow-2xl">
                        <div className="flex h-[350px] md:h-[500px] rounded-[1.8rem] overflow-hidden shadow-inner border bg-muted">
                            {palette.map((color, i) => (
                                <motion.div
                                    key={`${color}-${i}`}
                                    layoutId={`swatch-${i}`}
                                    role="button"
                                    tabIndex={0}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                        delay: i * 0.05
                                    }}
                                    className="flex-grow group relative flex flex-col items-center justify-end pb-12 cursor-pointer overflow-hidden"
                                    style={{ backgroundColor: color }}
                                    onClick={() => copyToClipboard(color)}
                                >
                                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                                    <div className="bg-white/95 dark:bg-black/60 backdrop-blur-xl p-4 rounded-2xl opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-6 transition-all duration-300 shadow-xl scale-90 group-hover:scale-100">
                                        <Copy className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="mt-6 px-4 py-2 rounded-2xl bg-black/30 backdrop-blur-md shadow-lg border border-white/15">
                                        <span className="font-mono text-[13px] font-black text-white tracking-widest">
                                            {color.toUpperCase()}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4">
                        <p className="text-sm text-muted-foreground font-semibold italic opacity-60">
                            Dica: Clique em uma cor para copiar o código HEX
                        </p>
                        <button
                            className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary hover:text-primary-hover transition-colors group"
                        >
                            <Save className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                            Salvar Paleta
                        </button>
                    </div>
                </div>

                <div className="xl:col-span-1 space-y-6">
                    <div className="premium-card p-8 shadow-premium h-full flex flex-col">
                        <h3 className="font-black uppercase tracking-tight text-lg mb-8 flex items-center gap-3">
                            <SwatchBook className="h-5 w-5 text-primary" />
                            Ajustes
                        </h3>
                        <div className="space-y-10 flex-grow">
                            <div className="space-y-4">
                                <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">Harmonia Visual</label>
                                <div className="grid grid-cols-1 gap-2.5">
                                    {["analogous", "complementary", "triadic", "tetradic", "monochromatic"].map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => handleUpdate(m as ColorMode, count)}
                                            className={cn(
                                                "w-full text-left px-5 py-4 rounded-2xl text-[13px] font-bold transition-all border shadow-sm",
                                                mode === m
                                                    ? "bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-[1.03] z-10"
                                                    : "bg-background hover:bg-muted border-transparent hover:border-border"
                                            )}
                                        >
                                            {m.charAt(0).toUpperCase() + m.slice(1).replace("analogous", "Análogas").replace("complementary", "Complementares").replace("triadic", "Triádicas").replace("tetradic", "Tetrádicas").replace("monochromatic", "Monocromática")}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6 pt-6 border-t border-border/50">
                                <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 flex justify-between">
                                    <span>Variações</span>
                                    <span className="text-primary bg-primary/10 px-3 py-1 rounded-full text-[10px] tracking-[0.2em]">{count} CORES</span>
                                </label>
                                <div className="px-1">
                                    <input
                                        type="range"
                                        min="3"
                                        max="10"
                                        value={count}
                                        onChange={(e) => handleUpdate(mode, parseInt(e.target.value))}
                                        className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                                    />
                                    <div className="flex justify-between text-[10px] font-black text-muted-foreground/40 mt-3 tracking-widest">
                                        <span>03</span>
                                        <span>10</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
