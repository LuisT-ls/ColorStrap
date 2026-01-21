import chroma from 'chroma-js'

export type ColorMode = 'analogous' | 'complementary' | 'triadic' | 'tetradic' | 'monochromatic' | 'splitComplementary'

export const getRandomColor = (): string => {
    return chroma.random().hex()
}

export const generatePalette = (baseColor: string, mode: ColorMode, count: number): string[] => {
    let colors: string[] = []

    switch (mode) {
        case 'analogous':
            colors = chroma
                .scale([
                    chroma(baseColor).set('hsl.h', '-30'),
                    baseColor,
                    chroma(baseColor).set('hsl.h', '+30')
                ])
                .mode('lch')
                .colors(count)
            break
        case 'complementary':
            const complement = chroma(baseColor).set('hsl.h', '+180')
            colors = chroma.scale([baseColor, complement]).mode('lch').colors(count)
            break
        case 'splitComplementary':
            const baseHue = chroma(baseColor).get('hsl.h')
            colors = [
                baseColor,
                chroma(baseColor).set('hsl.h', (baseHue + 150) % 360).hex(),
                chroma(baseColor).set('hsl.h', (baseHue + 210) % 360).hex()
            ]
            if (count > 3) {
                const extra = chroma.scale([colors[1], colors[2]]).mode('lch').colors(count - 3)
                colors = [...colors, ...extra].slice(0, count)
            }
            break
        case 'triadic':
            colors = [
                baseColor,
                chroma(baseColor).set('hsl.h', '+120').hex(),
                chroma(baseColor).set('hsl.h', '+240').hex()
            ]

            if (count > 3) {
                const scale1 = chroma.scale([baseColor, chroma(baseColor).set('hsl.h', '+120')]).mode('lch')
                const scale2 = chroma.scale([chroma(baseColor).set('hsl.h', '+120'), chroma(baseColor).set('hsl.h', '+240')]).mode('lch')
                const scale3 = chroma.scale([chroma(baseColor).set('hsl.h', '+240'), baseColor]).mode('lch')

                const extraColors: string[] = []
                const extraPerSegment = Math.floor((count - 3) / 3) + 1

                for (let i = 1; i < extraPerSegment; i++) {
                    extraColors.push(scale1(i / extraPerSegment).hex())
                    extraColors.push(scale2(i / extraPerSegment).hex())
                    extraColors.push(scale3(i / extraPerSegment).hex())
                }

                colors = [...colors, ...extraColors].slice(0, count)
            }
            break
        case 'tetradic':
            colors = [
                baseColor,
                chroma(baseColor).set('hsl.h', '+90').hex(),
                chroma(baseColor).set('hsl.h', '+180').hex(),
                chroma(baseColor).set('hsl.h', '+270').hex()
            ]

            if (count > 4) {
                const extraColors: string[] = []
                for (let i = 1; i < count - 3; i++) {
                    const angle = ((i * 360) / (count - 3)) % 360
                    extraColors.push(chroma(baseColor).set('hsl.h', `+${angle}`).hex())
                }
                colors = [...colors, ...extraColors].slice(0, count)
            }
            break
        case 'monochromatic':
            colors = chroma
                .scale([
                    chroma(baseColor).brighten(2),
                    baseColor,
                    chroma(baseColor).darken(2)
                ])
                .mode('lch')
                .colors(count)
            break
    }

    return colors
}

export const getContrastRatio = (fg: string, bg: string): number => {
    return chroma.contrast(fg, bg)
}

export const getWCAGPass = (ratio: number, level: 'AA' | 'AAA', size: 'normal' | 'large' = 'normal') => {
    const threshold = {
        AA: size === 'normal' ? 4.5 : 3,
        AAA: size === 'normal' ? 7 : 4.5
    }
    return ratio >= threshold[level]
}

export const convertColor = (color: string) => {
    try {
        const c = chroma(color)
        return {
            hex: c.hex().toUpperCase(),
            rgb: c.css(),
            hsl: c.css('hsl'),
            hsv: c.hsv(),
            lab: c.lab(),
            valid: true
        }
    } catch (e) {
        return { valid: false }
    }
}

export const simulateColorVision = (r: number, g: number, b: number, type: string) => {
    let simulated: number[]
    switch (type) {
        case 'protanopia':
            simulated = chroma.rgb(r, g, b).set('lch.h', '-30').rgb()
            break
        case 'deuteranopia':
            simulated = chroma.rgb(r, g, b).set('lch.h', '+30').rgb()
            break
        case 'tritanopia':
            simulated = chroma.rgb(r, g, b).desaturate(1).rgb()
            break
        case 'achromatopsia':
            simulated = chroma.rgb(r, g, b).desaturate(2).rgb()
            break
        default:
            simulated = [r, g, b]
    }
    return simulated
}

export const getHarmonyColors = (hue: number) => {
    return {
        complementary: [(hue + 180) % 360],
        triadic: [(hue + 120) % 360, (hue + 240) % 360],
        tetradic: [(hue + 90) % 360, (hue + 180) % 360, (hue + 270) % 360],
        analogous: [(hue + 30) % 360, (hue - 30 + 360) % 360],
        splitComplementary: [(hue + 150) % 360, (hue + 210) % 360],
        monochromatic: [
            { h: hue, s: 80, l: 30 },
            { h: hue, s: 80, l: 40 },
            { h: hue, s: 80, l: 50 },
            { h: hue, s: 80, l: 60 },
            { h: hue, s: 80, l: 70 }
        ]
    }
}
