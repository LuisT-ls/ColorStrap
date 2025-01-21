// Utility functions
const colorUtils = {
  // Generate random color in hex format
  randomColor: () =>
    '#' +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0'),

  // Convert hex to RGB
  hexToRgb: hex => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null
  },

  // Convert RGB to hex
  rgbToHex: (r, g, b) =>
    '#' +
    [r, g, b]
      .map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join(''),

  // Calculate contrast ratio between two colors
  calculateContrast: (color1, color2) => {
    const getLuminance = (r, g, b) => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
    }

    const c1 = colorUtils.hexToRgb(color1)
    const c2 = colorUtils.hexToRgb(color2)

    const l1 = getLuminance(c1.r, c1.g, c1.b)
    const l2 = getLuminance(c2.r, c2.g, c2.b)

    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
    return ratio.toFixed(2)
  }
}

// Palette Generator
class PaletteGenerator {
  constructor() {
    this.container = document.getElementById('palette-container')
    this.generatorContainer = document.getElementById('palette-generator')
    this.currentPalette = []
    this.init()
  }

  init() {
    this.setupGeneratorControls()
    this.generatePalette()
    this.setupKeyboardShortcuts()
  }

  setupGeneratorControls() {
    const controls = `
      <div class="card">
        <div class="card-body">
          <h3 class="card-title">Gerador de Paletas</h3>
          <div class="mb-3">
            <label class="form-label">Número de Cores</label>
            <input type="number" class="form-control" id="colorCount" value="5" min="2" max="10">
          </div>
          <button class="btn btn-primary" id="generatePalette">
            <i class="fas fa-sync-alt"></i> Gerar Nova Paleta
          </button>
          <button class="btn btn-secondary mt-2" id="savePalette">
            <i class="fas fa-save"></i> Salvar Paleta
          </button>
        </div>
      </div>
    `

    this.generatorContainer.innerHTML = controls

    document
      .getElementById('generatePalette')
      .addEventListener('click', () => this.generatePalette())
    document
      .getElementById('savePalette')
      .addEventListener('click', () => this.savePalette())
  }

  generatePalette() {
    const count = parseInt(document.getElementById('colorCount').value)
    this.currentPalette = Array(count)
      .fill()
      .map(() => colorUtils.randomColor())
    this.renderPalette()
  }

  renderPalette() {
    const paletteHtml = this.currentPalette
      .map(
        color => `
      <div class="color-swatch" style="background-color: ${color}">
        <span class="color-hex">${color}</span>
        <button class="copy-color" data-color="${color}">
          <i class="fas fa-copy"></i>
        </button>
      </div>
    `
      )
      .join('')

    this.container.innerHTML = paletteHtml

    // Add click handlers for copying colors
    this.container.querySelectorAll('.copy-color').forEach(btn => {
      btn.addEventListener('click', e => {
        const color = e.currentTarget.dataset.color
        navigator.clipboard.writeText(color)
        this.showToast('Cor copiada!')
      })
    })
  }

  savePalette() {
    const savedPalettes = JSON.parse(
      localStorage.getItem('savedPalettes') || '[]'
    )
    savedPalettes.push(this.currentPalette)
    localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes))
    this.showToast('Paleta salva com sucesso!')
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', e => {
      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'g':
            e.preventDefault()
            this.generatePalette()
            break
          case 's':
            e.preventDefault()
            this.savePalette()
            break
        }
      }
    })
  }

  showToast(message) {
    const toast = document.createElement('div')
    toast.className = 'toast show'
    toast.innerHTML = `<div class="toast-body">${message}</div>`
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 3000)
  }
}

// Color Converter Tool
class ColorConverter {
  constructor() {
    this.container = document.getElementById('color-converter')
    this.init()
  }

  init() {
    const converterHtml = `
      <div class="tool-card">
        <h3>Conversor de Cores</h3>
        <div class="mb-3">
          <label class="form-label">Cor (HEX)</label>
          <input type="text" class="form-control" id="hexInput" placeholder="#000000">
        </div>
        <div class="mb-3">
          <label class="form-label">RGB</label>
          <input type="text" class="form-control" id="rgbOutput" readonly>
        </div>
        <div class="color-preview" id="colorPreview"></div>
      </div>
    `

    this.container.innerHTML = converterHtml

    document.getElementById('hexInput').addEventListener('input', e => {
      const hex = e.target.value
      if (/^#[0-9A-F]{6}$/i.test(hex)) {
        const rgb = colorUtils.hexToRgb(hex)
        document.getElementById(
          'rgbOutput'
        ).value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
        document.getElementById('colorPreview').style.backgroundColor = hex
      }
    })
  }
}

// Gradient Generator
class GradientGenerator {
  constructor() {
    this.container = document.querySelector(
      '#gradient-generator .gradient-controls'
    )
    this.init()
  }

  init() {
    const controls = `
      <div class="mb-3">
        <label class="form-label">Cor Inicial</label>
        <input type="color" class="form-control form-control-color" id="gradientStart">
      </div>
      <div class="mb-3">
        <label class="form-label">Cor Final</label>
        <input type="color" class="form-control form-control-color" id="gradientEnd">
      </div>
      <div class="mb-3">
        <label class="form-label">Direção</label>
        <select class="form-select" id="gradientDirection">
          <option value="to right">Horizontal</option>
          <option value="to bottom">Vertical</option>
          <option value="to bottom right">Diagonal</option>
        </select>
      </div>
      <div class="gradient-preview" id="gradientPreview"></div>
      <button class="btn btn-primary mt-3" id="copyGradient">
        <i class="fas fa-copy"></i> Copiar CSS
      </button>
    `

    this.container.innerHTML = controls

    this.setupEventListeners()
    this.updateGradient()
  }

  setupEventListeners() {
    ;['gradientStart', 'gradientEnd', 'gradientDirection'].forEach(id => {
      document
        .getElementById(id)
        .addEventListener('change', () => this.updateGradient())
    })

    document.getElementById('copyGradient').addEventListener('click', () => {
      const css = this.getGradientCSS()
      navigator.clipboard.writeText(css)
      this.showToast('CSS copiado!')
    })
  }

  updateGradient() {
    const start = document.getElementById('gradientStart').value
    const end = document.getElementById('gradientEnd').value
    const direction = document.getElementById('gradientDirection').value

    const preview = document.getElementById('gradientPreview')
    preview.style.background = `linear-gradient(${direction}, ${start}, ${end})`
  }

  getGradientCSS() {
    const start = document.getElementById('gradientStart').value
    const end = document.getElementById('gradientEnd').value
    const direction = document.getElementById('gradientDirection').value

    return `background: linear-gradient(${direction}, ${start}, ${end});`
  }

  showToast(message) {
    const toast = document.createElement('div')
    toast.className = 'toast show'
    toast.innerHTML = `<div class="toast-body">${message}</div>`
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 3000)
  }
}

// Color Extractor
class ColorExtractor {
  constructor() {
    this.container = document.querySelector(
      '#color-extractor .extractor-controls'
    )
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.colors = []
    this.init()
  }

  init() {
    const controls = `
      <div class="mb-3">
        <label class="form-label">Carregar Imagem</label>
        <input type="file" class="form-control" id="imageInput" accept="image/*">
      </div>
      <div class="mb-3">
        <label class="form-label">Número de Cores</label>
        <input type="number" class="form-control" id="colorCount" value="5" min="2" max="10">
      </div>
      <div class="image-preview-container mb-3" style="display: none;">
        <img id="imagePreview" class="img-fluid rounded" alt="Preview">
      </div>
      <div id="extractedColors" class="extracted-colors-grid"></div>
      <button class="btn btn-primary mt-3" id="extractColors" style="display: none;">
        <i class="fas fa-eye-dropper"></i> Extrair Cores
      </button>
      <button class="btn btn-secondary mt-3" id="savePalette" style="display: none;">
        <i class="fas fa-save"></i> Salvar como Paleta
      </button>
    `

    this.container.innerHTML = controls
    this.setupEventListeners()
  }

  setupEventListeners() {
    const imageInput = document.getElementById('imageInput')
    const extractButton = document.getElementById('extractColors')
    const saveButton = document.getElementById('savePalette')

    imageInput.addEventListener('change', e => this.handleImageUpload(e))
    extractButton.addEventListener('click', () => this.extractColors())
    saveButton.addEventListener('click', () => this.savePalette())
  }

  handleImageUpload(event) {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()

      reader.onload = e => {
        const img = document.getElementById('imagePreview')
        img.src = e.target.result
        img.onload = () => {
          document.querySelector('.image-preview-container').style.display =
            'block'
          document.getElementById('extractColors').style.display = 'block'
        }
      }

      reader.readAsDataURL(file)
    }
  }

  extractColors() {
    const img = document.getElementById('imagePreview')
    const colorCount = parseInt(document.getElementById('colorCount').value)

    // Set canvas size to match image
    this.canvas.width = img.naturalWidth
    this.canvas.height = img.naturalHeight

    // Draw image to canvas
    this.ctx.drawImage(img, 0, 0)

    // Get image data
    const imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    ).data

    // Create color map to count occurrences
    const colorMap = new Map()

    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i]
      const g = imageData[i + 1]
      const b = imageData[i + 2]

      // Convert to hex
      const hex = colorUtils.rgbToHex(r, g, b)

      // Increment count in map
      colorMap.set(hex, (colorMap.get(hex) || 0) + 1)
    }

    // Sort colors by frequency and get top N
    this.colors = Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, colorCount)
      .map(entry => entry[0])

    this.renderExtractedColors()
  }

  renderExtractedColors() {
    const container = document.getElementById('extractedColors')
    const colorsHtml = this.colors
      .map(
        color => `
      <div class="extracted-color">
        <div class="color-swatch" style="background-color: ${color}">
          <span class="color-hex">${color}</span>
          <button class="copy-color" data-color="${color}">
            <i class="fas fa-copy"></i>
          </button>
        </div>
      </div>
    `
      )
      .join('')

    container.innerHTML = colorsHtml
    document.getElementById('savePalette').style.display = 'block'

    // Add click handlers for copying colors
    container.querySelectorAll('.copy-color').forEach(btn => {
      btn.addEventListener('click', e => {
        const color = e.currentTarget.dataset.color
        navigator.clipboard.writeText(color)
        this.showToast('Cor copiada!')
      })
    })
  }

  savePalette() {
    const savedPalettes = JSON.parse(
      localStorage.getItem('savedPalettes') || '[]'
    )
    savedPalettes.push(this.colors)
    localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes))
    this.showToast('Paleta salva com sucesso!')
  }

  showToast(message) {
    const toast = document.createElement('div')
    toast.className = 'toast show'
    toast.innerHTML = `<div class="toast-body">${message}</div>`
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 3000)
  }
}

// Accessibility Analyzer
class AccessibilityAnalyzer {
  constructor() {
    this.container = document.getElementById('accessibility-analyzer')
    this.init()
  }

  init() {
    const analyzerHtml = `
      <div class="tool-card">
        <h3>Analisador de Contraste</h3>
        <div class="mb-3">
          <label class="form-label">Cor do Texto</label>
          <input type="color" class="form-control form-control-color" id="textColor" value="#000000">
        </div>
        <div class="mb-3">
          <label class="form-label">Cor do Fundo</label>
          <input type="color" class="form-control form-control-color" id="backgroundColor" value="#FFFFFF">
        </div>
        <div class="contrast-preview" id="contrastPreview">
          <span>Exemplo de Texto</span>
        </div>
        <div class="contrast-ratio mt-3" id="contrastRatio"></div>
        <div class="wcag-results mt-3" id="wcagResults"></div>
      </div>
    `

    this.container.innerHTML = analyzerHtml
    this.setupEventListeners()
    this.updateContrast()
  }

  setupEventListeners() {
    ;['textColor', 'backgroundColor'].forEach(id => {
      document
        .getElementById(id)
        .addEventListener('input', () => this.updateContrast())
    })
  }

  updateContrast() {
    const textColor = document.getElementById('textColor').value
    const bgColor = document.getElementById('backgroundColor').value
    const preview = document.getElementById('contrastPreview')
    const ratio = colorUtils.calculateContrast(textColor, bgColor)

    preview.style.color = textColor
    preview.style.backgroundColor = bgColor

    document.getElementById('contrastRatio').innerHTML = `
      <strong>Taxa de Contraste:</strong> ${ratio}:1
    `

    const wcagResults = document.getElementById('wcagResults')
    wcagResults.innerHTML = `
      <div class="wcag-level ${ratio >= 4.5 ? 'pass' : 'fail'}">
        <strong>AA Normal:</strong> ${ratio >= 4.5 ? 'Aprovado' : 'Reprovado'}
      </div>
      <div class="wcag-level ${ratio >= 7 ? 'pass' : 'fail'}">
        <strong>AAA Normal:</strong> ${ratio >= 7 ? 'Aprovado' : 'Reprovado'}
      </div>
      <div class="wcag-level ${ratio >= 3 ? 'pass' : 'fail'}">
        <strong>AA Grande:</strong> ${ratio >= 3 ? 'Aprovado' : 'Reprovado'}
      </div>
    `
  }
}

// Initialize all tools when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PaletteGenerator()
  new ColorConverter()
  new GradientGenerator()
  new AccessibilityAnalyzer()
  new ColorExtractor()

  // Setup dark mode toggle
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key.toLowerCase() === 'd') {
      e.preventDefault()
      document.body.classList.toggle('dark-mode')
    }
  })
})
