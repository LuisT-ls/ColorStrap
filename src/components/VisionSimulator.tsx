"use client"

import { useState, useRef } from "react"
import { Eye, Upload, Image as ImageIcon } from "lucide-react"

export default function VisionSimulator() {
    const [visionType, setVisionType] = useState("protanopia")
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const originalRef = useRef<HTMLImageElement>(null)

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && originalRef.current) {
            const reader = new FileReader()
            reader.onload = (event) => {
                if (originalRef.current) {
                    originalRef.current.src = event.target?.result as string
                }
            }
            reader.readAsDataURL(file)
        }
    }

    const applySimulation = () => {
        const canvas = canvasRef.current
        const img = originalRef.current
        if (!canvas || !img || !img.complete) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        // Simple matrices for simulation
        const matrices: Record<string, number[]> = {
            protanopia: [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],
            deuteranopia: [0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7],
            tritanopia: [0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525],
            achromatopsia: [0.299, 0.587, 0.114, 0.299, 0.587, 0.114, 0.299, 0.587, 0.114]
        }

        const m = matrices[visionType]

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]

            data[i] = r * m[0] + g * m[1] + b * m[2]
            data[i + 1] = r * m[3] + g * m[4] + b * m[5]
            data[i + 2] = r * m[6] + g * m[7] + b * m[8]
        }

        ctx.putImageData(imageData, 0, 0)
    }

    return (
        <div className="premium-card p-1 md:p-1.5 shadow-premium overflow-hidden">
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-0">
                <div className="xl:col-span-2 p-8 md:p-12 space-y-8 bg-muted/20 border-b xl:border-b-0 xl:border-r border-dashed border-border/50">
                    <div className="space-y-1">
                        <span className="section-label">Accessibility Lab</span>
                        <h3 className="text-2xl font-black tracking-tight">Daltonismo</h3>
                        <p className="text-sm text-muted-foreground">Analise como usuários com diferentes tipos de daltonismo percebem suas imagens e designs.</p>
                    </div>

                    <div className="space-y-4">
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-3xl p-10 hover:bg-primary/5 hover:border-primary/40 cursor-pointer transition-all group relative overflow-hidden">
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Upload className="h-10 w-10 text-primary/40 group-hover:text-primary group-hover:scale-110 transition-all mb-4" />
                            <span className="text-sm font-bold text-muted-foreground group-hover:text-primary">Escolher Imagem</span>
                            <p className="text-[10px] text-muted-foreground/60 mt-1">Arraste ou clique para carregar</p>
                            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                        </label>

                        <div className="space-y-2">
                            <label className="section-label">Tipo de Visão</label>
                            <select
                                value={visionType}
                                onChange={(e) => {
                                    setVisionType(e.target.value)
                                    setTimeout(applySimulation, 0)
                                }}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                            >
                                <option value="protanopia">Protanopia (Sem Vermelho)</option>
                                <option value="deuteranopia">Deuteranopia (Sem Verde)</option>
                                <option value="tritanopia">Tritanopia (Sem Azul)</option>
                                <option value="achromatopsia">Acromatopsia (Cinza)</option>
                            </select>
                        </div>
                    </div>

                    <img
                        ref={originalRef}
                        className="hidden"
                        onLoad={applySimulation}
                        alt="Original"
                    />
                </div>

                <div className="xl:col-span-3 p-8 md:p-12 flex items-center justify-center bg-background/50 relative">
                    <div className="absolute top-4 right-4 z-10">
                        <div className="bg-primary/90 backdrop-blur-md text-[10px] font-black text-white px-3 py-1 rounded-full shadow-lg items-center gap-2 flex">
                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            SIMULAÇÃO ATIVA
                        </div>
                    </div>

                    <div className="w-full aspect-video rounded-2xl border-2 border-border/50 shadow-2xl overflow-hidden flex items-center justify-center bg-muted/40 relative group">
                        <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />

                        {!originalRef.current?.src && (
                            <div className="flex flex-col items-center text-muted-foreground/30 text-center space-y-4 animate-in fade-in zoom-in duration-1000">
                                <div className="relative">
                                    <ImageIcon className="h-20 w-20" />
                                    <Eye className="h-8 w-8 absolute -bottom-2 -right-2 text-primary" />
                                </div>
                                <p className="text-xs font-bold uppercase tracking-widest max-w-[180px]">O resultado da simulação aparecerá aqui</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
