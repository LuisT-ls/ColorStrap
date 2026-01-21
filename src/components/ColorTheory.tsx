"use client"

import { useState, useMemo } from "react"
import { BookOpen, Info, Lightbulb, Heart, Zap, Shield, ZapOff } from "lucide-react"
import ColorWheel from "./ColorWheel"
import { cn } from "@/lib/utils"
import chroma from "chroma-js"

export default function ColorTheory() {
    const [selectedHarmonhy, setSelectedHarmony] = useState(0)
    const [baseColor, setBaseColor] = useState("#6366f1")

    const dynamicHarmonies = useMemo(() => {
        const h = chroma(baseColor).get('hsl.h')
        return [
            {
                title: "Cores Complementares",
                description: "Cores opostas na roda de cores. Criam alto contraste e vibração visual. Ideal para destacar elementos.",
                colors: [baseColor, chroma(baseColor).set('hsl.h', (h + 180) % 360).hex()]
            },
            {
                title: "Split Complementares",
                description: "Uma cor base combinada com as duas cores adjacentes à sua complementar. Oferece contraste suave e equilíbrio.",
                colors: [
                    baseColor,
                    chroma(baseColor).set('hsl.h', (h + 150) % 360).hex(),
                    chroma(baseColor).set('hsl.h', (h + 210) % 360).hex()
                ]
            },
            {
                title: "Cores Análogas",
                description: "Cores adjacentes na roda de cores. Criam harmonias suaves e naturais, excelentes para criar unidade.",
                colors: [
                    chroma(baseColor).set('hsl.h', (h - 30 + 360) % 360).hex(),
                    baseColor,
                    chroma(baseColor).set('hsl.h', (h + 30) % 360).hex()
                ]
            },
            {
                title: "Cores Triádicas",
                description: "Três cores equidistantes na roda de cores. Oferecem alto contraste mantendo harmonia e equilíbrio.",
                colors: [
                    baseColor,
                    chroma(baseColor).set('hsl.h', (h + 120) % 360).hex(),
                    chroma(baseColor).set('hsl.h', (h + 240) % 360).hex()
                ]
            }
        ]
    }, [baseColor])

    const psychology = [
        {
            title: "Cores Quentes",
            icon: <Zap className="h-5 w-5 text-orange-500" />,
            meanings: "Energia, paixão, otimismo.",
            description: "Vermelho, laranja e amarelo estimulam ação e chamam atenção.",
            bg: "bg-orange-500/10",
            border: "border-orange-500/20"
        },
        {
            title: "Cores Frias",
            icon: <ZapOff className="h-5 w-5 text-blue-500" />,
            meanings: "Calma, confiança, seriedade.",
            description: "Azul, verde e violeta transmitem profissionalismo e estabilidade.",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20"
        },
        {
            title: "Cores Neutras",
            icon: <Shield className="h-5 w-5 text-slate-500" />,
            meanings: "Equilíbrio, sofisticação.",
            description: "Preto, branco e cinza são excelentes bases para suporte visual.",
            bg: "bg-slate-500/10",
            border: "border-slate-500/20"
        }
    ]

    return (
        <div className="space-y-16">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch">
                <div className="premium-card p-10 md:p-16 flex flex-col items-center justify-center space-y-10 min-h-[500px] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: baseColor }} />
                    <div className="text-center space-y-2">
                        <span className="section-label">Interactive Tool</span>
                        <h3 className="text-2xl font-black uppercase tracking-tight">Roda de Cores</h3>
                        <div className="flex items-center justify-center gap-2 pt-2">
                            <div className="w-12 h-6 rounded-lg shadow-inner border border-white/20" style={{ backgroundColor: baseColor }} />
                            <code className="text-sm font-black text-primary">{baseColor}</code>
                        </div>
                    </div>
                    <ColorWheel size={320} onColorSelect={setBaseColor} />
                    <div className="text-center max-w-sm">
                        <p className="text-sm text-muted-foreground font-medium italic">"As cores são as teclas, o olho o martelo, a alma é o piano com suas muitas cordas."</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        {dynamicHarmonies.map((h, i) => (
                            <button
                                key={h.title}
                                onClick={() => setSelectedHarmony(i)}
                                className={cn(
                                    "p-6 rounded-3xl border text-left transition-all duration-300 group",
                                    selectedHarmonhy === i
                                        ? "bg-primary text-white shadow-xl shadow-primary/20 border-transparent scale-[1.02]"
                                        : "bg-card hover:bg-muted border-border"
                                )}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-black uppercase tracking-tight text-sm">{h.title}</h4>
                                    <div className="flex -space-x-2">
                                        {h.colors.map(c => (
                                            <div key={c} className="w-6 h-6 rounded-full border-2 border-background shadow-sm" style={{ backgroundColor: c }} />
                                        ))}
                                    </div>
                                </div>
                                <p className={cn(
                                    "text-xs font-medium leading-relaxed line-clamp-2",
                                    selectedHarmonhy === i ? "text-white/80" : "text-muted-foreground"
                                )}>
                                    {h.description}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {psychology.map((p) => (
                    <div key={p.title} className={cn("premium-card p-8 space-y-4 border-2", p.bg, p.border)}>
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-white/50 dark:bg-black/20 shadow-sm">
                                {p.icon}
                            </div>
                            <h4 className="font-black uppercase tracking-tight text-sm">{p.title}</h4>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-black text-primary/80 uppercase tracking-widest">{p.meanings}</p>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">{p.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="premium-card p-8 md:p-12 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="bg-primary/10 p-4 rounded-3xl">
                        <Lightbulb className="h-10 w-10 text-primary animate-pulse" />
                    </div>
                    <div className="space-y-4 flex-grow text-center md:text-left">
                        <h3 className="text-xl font-black uppercase tracking-tight">Dicas de Acessibilidade</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                <p className="text-sm font-medium text-muted-foreground">Mantenha contraste mínimo de 4.5:1 para textos normais e 3:1 para textos grandes.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                <p className="text-sm font-medium text-muted-foreground">Não use apenas a cor para transmitir informações (use ícones ou padrões).</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                <p className="text-sm font-medium text-muted-foreground">Evite combinações de vermelho/verde para elementos funcionais.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                <p className="text-sm font-medium text-muted-foreground">Teste sempre suas interfaces em monitores com calibrações diferentes.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
