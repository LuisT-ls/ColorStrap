"use client"

import { useEffect, useRef, useState } from "react"
import chroma from "chroma-js"
import { cn } from "@/lib/utils"

interface ColorWheelProps {
    size?: number
    onColorSelect?: (color: string) => void
}

export default function ColorWheel({ size = 300, onColorSelect }: ColorWheelProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [pos, setPos] = useState({ x: size / 2, y: size / 2 })

    useEffect(() => {
        drawWheel()
    }, [size, pos])

    const drawWheel = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const cx = size / 2
        const cy = size / 2
        const radius = size / 2 - 10

        ctx.clearRect(0, 0, size, size)

        // Draw wheel background (360 degrees)
        for (let angle = 0; angle < 360; angle++) {
            const startAngle = (angle - 1) * (Math.PI / 180)
            const endAngle = (angle + 1) * (Math.PI / 180)

            ctx.beginPath()
            ctx.moveTo(cx, cy)
            ctx.arc(cx, cy, radius, startAngle, endAngle)
            ctx.closePath()

            const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
            gradient.addColorStop(0, "white")
            gradient.addColorStop(1, `hsl(${angle}, 100%, 50%)`)

            ctx.fillStyle = gradient
            ctx.fill()
        }

        // Draw selector handle
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2)
        ctx.strokeStyle = "white"
        ctx.lineWidth = 4
        ctx.stroke()

        ctx.shadowBlur = 10
        ctx.shadowColor = "rgba(0,0,0,0.5)"
        ctx.stroke()
        ctx.shadowBlur = 0

        ctx.beginPath()
        ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(0,0,0,0.2)"
        ctx.lineWidth = 1
        ctx.stroke()
    }

    const updateColor = (x: number, y: number) => {
        const cx = size / 2
        const cy = size / 2
        const radius = size / 2 - 10

        const dx = x - cx
        const dy = y - cy
        const distance = Math.sqrt(dx * dx + dy * dy)

        let finalX = x
        let finalY = y

        if (distance > radius) {
            finalX = cx + (dx / distance) * radius
            finalY = cy + (dy / distance) * radius
        }

        setPos({ x: finalX, y: finalY })

        const angle = (Math.atan2(finalY - cy, finalX - cx) * 180 / Math.PI + 360) % 360
        const saturation = Math.min(1, distance / radius)
        const hex = chroma.hsl(angle, saturation, 0.5).hex().toUpperCase()

        if (onColorSelect) onColorSelect(hex)
    }

    const handlePointer = (e: React.PointerEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        updateColor(x, y)
    }

    return (
        <div className="relative flex items-center justify-center select-none">
            <div className="relative group p-4">
                <div className="absolute inset-0 bg-primary/10 blur-[100px] opacity-3 transition-opacity group-hover:opacity-10" />
                <canvas
                    ref={canvasRef}
                    width={size}
                    height={size}
                    onPointerDown={(e) => {
                        (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId)
                        setIsDragging(true)
                        handlePointer(e)
                    }}
                    onPointerMove={(e) => {
                        if (isDragging) handlePointer(e)
                    }}
                    onPointerUp={(e) => {
                        (e.target as HTMLCanvasElement).releasePointerCapture(e.pointerId)
                        setIsDragging(false)
                    }}
                    className="cursor-crosshair relative z-10 touch-none active:scale-[1.02] transition-transform duration-200 drop-shadow-2xl"
                />
            </div>
        </div>
    )
}
