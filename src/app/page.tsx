"use client"

import PaletteGenerator from "@/components/PaletteGenerator"
import ColorConverter from "@/components/ColorConverter"
import GradientGenerator from "@/components/GradientGenerator"
import ContrastChecker from "@/components/ContrastChecker"
import ColorSchemeGenerator from "@/components/ColorSchemeGenerator"
import VisionSimulator from "@/components/VisionSimulator"
import ColorTheory from "@/components/ColorTheory"
import { motion, useScroll, useSpring } from "framer-motion"

export default function Home() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })


  return (
    <main className="layout-container min-h-screen pt-32 pb-24 grid-bg">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-indigo-500 to-secondary z-[60] origin-left"
        style={{ scaleX }}
      />
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto mb-32 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.3em] mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Exploração de Cores 2.1
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] text-balance">
            Domine as Cores com <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-500 to-secondary animate-gradient-x">
              Precisão Extrema
            </span>
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto font-medium leading-relaxed text-balance">
            A suíte definitiva de ferramentas para designers e desenvolvedores.
            Crie, converta e valide cores com padrões internacionais de acessibilidade.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a href="#palettes" className="px-8 py-4 rounded-2xl bg-primary text-white font-bold shadow-xl shadow-primary/25 hover:bg-primary-hover hover:scale-105 transition-all">
              Começar Agora
            </a>
            <a href="#color-theory" className="px-8 py-4 rounded-2xl bg-card border border-card-border font-bold hover:bg-muted transition-all">
              Aprender Teoria
            </a>
          </div>
        </motion.div>
      </section>

      {/* Palette Section */}
      <motion.section
        id="palettes"
        className="relative mb-32 scroll-mt-32"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "circOut" }}
      >
        <div className="space-y-2 text-center max-w-2xl mx-auto mb-12">
          <span className="section-label mx-auto">Palette Studio</span>
          <h2 className="text-4xl font-black tracking-tight">Gerador de Paletas</h2>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full -z-10" />
          <PaletteGenerator />
        </div>
      </motion.section>

      {/* Tools Grid */}
      <motion.section
        id="tools"
        className="space-y-16 scroll-mt-32 mb-40"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "circOut" }}
      >
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <span className="section-label mx-auto">Dev Tools</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">Ferramentas de Engenharia</h2>
          <p className="text-muted-foreground font-medium text-balance md:text-lg">Otimize seu workflow com utilitários precisos de conversão e geração de esquemas equilibrados.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          <div className="flex flex-col h-full"><ColorConverter /></div>
          <div className="flex flex-col h-full"><ColorSchemeGenerator /></div>
          <div className="flex flex-col h-full"><GradientGenerator /></div>
          <div className="flex flex-col h-full"><ContrastChecker /></div>
        </div>
      </motion.section>

      {/* Accessibility Section */}
      <motion.section
        id="accessibility"
        className="space-y-12 scroll-mt-32 mb-32"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "circOut" }}
      >
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <span className="section-label mx-auto">A11y Standards</span>
          <h2 className="text-4xl font-black tracking-tight">Acessibilidade & Inclusão</h2>
          <p className="text-muted-foreground font-medium text-balance">Simule diferentes tipos de visão e garanta que sua interface seja acessível para todos.</p>
        </div>
        <VisionSimulator />
      </motion.section>

      <motion.section
        id="color-theory"
        className="space-y-12 scroll-mt-32 mb-32"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "circOut" }}
      >
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <span className="section-label mx-auto">Color Science</span>
          <h2 className="text-4xl font-black tracking-tight">Teoria & Psicologia</h2>
          <p className="text-muted-foreground font-medium text-balance">Entenda a ciência por trás das cores e como elas influenciam o comportamento humano.</p>
        </div>
        <ColorTheory />
      </motion.section>
    </main>
  )
}
