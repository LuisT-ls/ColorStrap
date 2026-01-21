"use client"

import { useState, useEffect } from "react"
import { Check, X, ShieldCheck } from "lucide-react"
import { getContrastRatio, getWCAGPass } from "@/lib/colors"
import { cn } from "@/lib/utils"

export default function ContrastChecker() {
    const [fg, setFg] = useState("#000000")
    const [bg, setBg] = useState("#ffffff")
    const [ratio, setRatio] = useState(21)

    useEffect(() => {
        setRatio(getContrastRatio(fg, bg))
    }, [fg, bg])

    const aaPass = getWCAGPass(ratio, "AA")
    const aaaPass = getWCAGPass(ratio, "AAA")

    return (
        <div className="premium-card overflow-hidden flex flex-col group/card h-full">
            <div className="p-5 border-b bg-muted/20">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-bold tracking-tight">Contraste</h3>
                </div>
            </div>

            <div className="p-6 space-y-6 flex-grow flex flex-col">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="section-label">Texto</label>
                        <div className="relative w-full h-12 rounded-xl border-2 border-border overflow-hidden flex-shrink-0 shadow-sm transition-transform hover:scale-[1.02]">
                            <input
                                type="color"
                                value={fg}
                                onChange={(e) => setFg(e.target.value)}
                                className="absolute inset-[-15px] w-[200%] h-[200%] cursor-pointer"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="section-label">Fundo</label>
                        <div className="relative w-full h-12 rounded-xl border-2 border-border overflow-hidden flex-shrink-0 shadow-sm transition-transform hover:scale-[1.02]">
                            <input
                                type="color"
                                value={bg}
                                onChange={(e) => setBg(e.target.value)}
                                className="absolute inset-[-15px] w-[200%] h-[200%] cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                <div
                    className="p-8 rounded-2xl text-center transition-all border shadow-premium font-bold text-xl h-28 flex items-center justify-center animate-in zoom-in-95 duration-500"
                    style={{ color: fg, backgroundColor: bg }}
                >
                    Visualização em Tempo Real
                </div>

                <div className="space-y-3 bg-muted/30 p-5 rounded-2xl border border-transparent hover:border-border transition-all mt-auto">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">Ratio</span>
                        <span className={cn(
                            "font-mono font-black text-2xl tracking-tighter",
                            aaPass ? "text-green-500" : "text-amber-500"
                        )}>
                            {ratio.toFixed(2)}:1
                        </span>
                    </div>

                    <div className="space-y-2">
                        {[
                            { label: "WCAG AA (Normal)", pass: aaPass },
                            { label: "WCAG AAA (Normal)", pass: aaaPass },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between border-t border-muted pt-2 first:border-0 first:pt-0">
                                <span className="text-sm font-medium opacity-70">{item.label}</span>
                                <div className={cn(
                                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm",
                                    item.pass ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-red-500/10 text-red-600 border border-red-500/20"
                                )}>
                                    {item.pass ? <Check className="h-3 w-3 stroke-[4]" /> : <X className="h-3 w-3 stroke-[4]" />}
                                    {item.pass ? "Passou" : "Falhou"}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
