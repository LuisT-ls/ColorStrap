"use client"

import Link from "next/link"
import { Palette, Github, Instagram, Linkedin, Mail, ExternalLink, Heart } from "lucide-react"

export default function Footer() {
    const currentYear = new Date().getFullYear()

    const links = {
        ferramentas: [
            { name: "Paletas", href: "#palettes" },
            { name: "Conversor", href: "#tools" },
            { name: "Esquemas", href: "#tools" },
            { name: "Contraste", href: "#tools" },
        ],
        recursos: [
            { name: "Teoria das Cores", href: "#color-theory" },
            { name: "Daltonismo", href: "#accessibility" },
            { name: "Acessibilidade", href: "#accessibility" },
            { name: "Dicas de Design", href: "#color-theory" },
        ],
        social: [
            { name: "GitHub", href: "https://github.com/LuisT-ls/ColorStrap", icon: <Github className="h-4 w-4" /> },
            { name: "Instagram", href: "https://instagram.com/luis.tei", icon: <Instagram className="h-4 w-4" /> },
            { name: "LinkedIn", href: "https://linkedin.com/in/luis-tei", icon: <Linkedin className="h-4 w-4" /> },
        ]
    }

    return (
        <footer className="bg-card/50 border-t border-border mt-32 relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

            <div className="layout-container py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                                <Palette className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-extrabold text-2xl tracking-tighter">ColorStrap</span>
                        </Link>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-[240px]">
                            Sua ferramenta definitiva para exploração de cores, acessibilidade e design de alta precisão.
                        </p>
                        <div className="flex items-center gap-4">
                            {links.social.map((s) => (
                                <a
                                    key={s.name}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-xl bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all active:scale-90"
                                    title={s.name}
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Tools Column */}
                    <div className="space-y-6">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Ferramentas</h4>
                        <ul className="space-y-3">
                            {links.ferramentas.map((l) => (
                                <li key={l.name}>
                                    <Link href={l.href} className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                                        {l.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Column */}
                    <div className="space-y-6">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Recursos</h4>
                        <ul className="space-y-3">
                            {links.recursos.map((l) => (
                                <li key={l.name}>
                                    <Link href={l.href} className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                                        {l.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter / Contact Column */}
                    <div className="space-y-6">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Contato</h4>
                        <div className="premium-card p-6 bg-primary/5 border-primary/10 space-y-4">
                            <p className="text-xs font-bold leading-relaxed text-muted-foreground">
                                Tem alguma sugestão ou encontrou um bug? Adoramos receber feedback.
                            </p>
                            <a
                                href="mailto:contact@colorstrap.com"
                                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-primary-hover transition-colors"
                            >
                                <Mail className="h-3.5 w-3.5" />
                                Diga um Olá
                                <ExternalLink className="h-3 w-3 opacity-50" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.3em]">
                        &copy; {currentYear} ColorStrap Studio &bull; Todos os direitos reservados
                    </div>
                    <div className="flex items-center gap-6">
                        <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] flex items-center gap-2">
                            Made with <Heart className="h-3 w-3 text-secondary animate-pulse fill-secondary" /> by LuisT
                        </p>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                        <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.3em]">
                            v2.1.0-STABLE
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
