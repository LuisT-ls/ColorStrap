// Utility Functions
const getRandomColor = () => {
  return chroma.random().hex()
}

const copyToClipboard = text => {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copiado para a área de transferência!')
  })
}

const showToast = message => {
  const toast = document.createElement('div')
  toast.className = 'toast show position-fixed bottom-0 end-0 m-3'
  toast.setAttribute('role', 'alert')
  toast.innerHTML = `
    <div class="toast-body bg-success text-white rounded">
      ${message}
    </div>
  `
  document.body.appendChild(toast)
  setTimeout(() => toast.remove(), 3000)
}

// Theme Switcher
const themeSwitcher = document.getElementById('themeSwitcher')
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')

const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme)
    updateThemeIcon(savedTheme)
  } else if (prefersDarkScheme.matches) {
    document.body.setAttribute('data-theme', 'dark')
    updateThemeIcon('dark')
  }
}

const updateThemeIcon = theme => {
  const icon = themeSwitcher.querySelector('i')
  icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'
}

themeSwitcher.addEventListener('click', () => {
  const currentTheme = document.body.getAttribute('data-theme')
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
  document.body.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
  updateThemeIcon(newTheme)
})

// Color Palette Generator
const paletteContainer = document.getElementById('palette-container')
const generatePaletteBtn = document.getElementById('generatePalette')
const colorMode = document.getElementById('colorMode')
const colorCount = document.getElementById('colorCount')

const generatePalette = () => {
  const baseColor = getRandomColor()
  const count = parseInt(colorCount.value)
  let colors = []

  switch (colorMode.value) {
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
    case 'triadic':
      colors = [
        baseColor,
        chroma(baseColor).set('hsl.h', '+120'),
        chroma(baseColor).set('hsl.h', '+240')
      ]
      break
    case 'tetradic':
      colors = [
        baseColor,
        chroma(baseColor).set('hsl.h', '+90'),
        chroma(baseColor).set('hsl.h', '+180'),
        chroma(baseColor).set('hsl.h', '+270')
      ]
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

  renderPalette(colors)
}

const renderPalette = colors => {
  paletteContainer.innerHTML = colors
    .map(
      color => `
    <div class="color-swatch" 
         style="background-color: ${color}"
         onclick="copyToClipboard('${color}')"
         title="${color}"
         role="button"
         tabindex="0">
    </div>
  `
    )
    .join('')
}

// Paletas Salvas
const savePaletteBtn = document.getElementById('savePalette')
let savedPalettes = JSON.parse(localStorage.getItem('savedPalettes')) || []

const savePalette = () => {
  // Coleta as cores atuais da paleta
  const colors = Array.from(paletteContainer.children).map(
    swatch => swatch.style.backgroundColor
  )

  // Cria um objeto com as informações da paleta
  const palette = {
    id: Date.now(),
    colors: colors,
    date: new Date().toLocaleDateString('pt-BR'),
    mode: colorMode.value
  }

  // Adiciona a nova paleta ao array
  savedPalettes.unshift(palette)

  // Mantém apenas as últimas 20 paletas
  if (savedPalettes.length > 20) {
    savedPalettes = savedPalettes.slice(0, 20)
  }

  // Salva no localStorage
  localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes))

  // Mostra confirmação
  showToast('Paleta salva com sucesso!')

  // Renderiza a seção de paletas salvas
  renderSavedPalettes()
}

const renderSavedPalettes = () => {
  // Verifica se já existe a seção de paletas salvas
  let savedSection = document.querySelector('.saved-palettes')

  // Se não existe, cria a seção
  if (!savedSection) {
    savedSection = document.createElement('div')
    savedSection.className = 'saved-palettes mt-4'

    const title = document.createElement('h3')
    title.className = 'h5 mb-3'
    title.textContent = 'Paletas Salvas'

    savedSection.appendChild(title)
    paletteContainer.parentElement.appendChild(savedSection)
  }

  // Limpa o conteúdo atual
  const contentDiv =
    savedSection.querySelector('.saved-palettes-content') ||
    document.createElement('div')
  contentDiv.className = 'saved-palettes-content'
  contentDiv.innerHTML = ''

  // Se não há paletas salvas
  if (savedPalettes.length === 0) {
    contentDiv.innerHTML =
      '<p class="text-muted">Nenhuma paleta salva ainda.</p>'
  } else {
    // Renderiza cada paleta salva
    savedPalettes.forEach(palette => {
      const paletteElement = document.createElement('div')
      paletteElement.className = 'saved-palette-item card mb-2'

      const colorsDiv = document.createElement('div')
      colorsDiv.className = 'd-flex'
      colorsDiv.style.height = '40px'

      palette.colors.forEach(color => {
        const colorDiv = document.createElement('div')
        colorDiv.className = 'flex-grow-1'
        colorDiv.style.backgroundColor = color
        colorDiv.title = color
        colorDiv.addEventListener('click', () => copyToClipboard(color))
        colorsDiv.appendChild(colorDiv)
      })

      const infoDiv = document.createElement('div')
      infoDiv.className =
        'card-body p-2 d-flex justify-content-between align-items-center'

      const dateSpan = document.createElement('small')
      dateSpan.className = 'text-muted'
      dateSpan.textContent = `Salva em ${palette.date}`

      const deleteBtn = document.createElement('button')
      deleteBtn.className = 'btn btn-sm btn-outline-danger'
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>'
      deleteBtn.addEventListener('click', e => {
        e.stopPropagation()
        deletePalette(palette.id)
      })

      infoDiv.appendChild(dateSpan)
      infoDiv.appendChild(deleteBtn)

      paletteElement.appendChild(colorsDiv)
      paletteElement.appendChild(infoDiv)

      // Adiciona funcionalidade de restaurar a paleta ao clicar
      paletteElement.addEventListener('click', () => {
        restorePalette(palette)
      })

      contentDiv.appendChild(paletteElement)
    })
  }

  savedSection.appendChild(contentDiv)
}

const deletePalette = id => {
  savedPalettes = savedPalettes.filter(palette => palette.id !== id)
  localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes))
  renderSavedPalettes()
  showToast('Paleta removida!')
}

const restorePalette = palette => {
  // Restaura o modo da paleta
  colorMode.value = palette.mode

  // Renderiza as cores
  renderPalette(palette.colors)

  showToast('Paleta restaurada!')
}

// Color Converter
const inputColor = document.getElementById('inputColor')
const hexOutput = document.getElementById('hexOutput')
const rgbOutput = document.getElementById('rgbOutput')
const hslOutput = document.getElementById('hslOutput')

const updateColorOutputs = color => {
  const chromaColor = chroma(color)
  hexOutput.textContent = chromaColor.hex()
  rgbOutput.textContent = chromaColor.css()
  hslOutput.textContent = chromaColor.css('hsl')
}

inputColor.addEventListener('input', e => updateColorOutputs(e.target.value))

// Gradient Generator
const gradientPreview = document.getElementById('gradientPreview')
const gradientCode = document.getElementById('gradientCode')
const gradientType = document.getElementById('gradientType')
const gradientAngle = document.getElementById('gradientAngle')
const gradientColor1 = document.getElementById('gradientColor1')
const gradientColor2 = document.getElementById('gradientColor2')
const addGradientColor = document.getElementById('addGradientColor')
const gradientColorContainer = document.querySelector('.d-flex.gap-2.mb-2')

let gradientColors = [gradientColor1, gradientColor2]

// Função para criar novo input de cor
const createColorInput = () => {
  const input = document.createElement('input')
  input.type = 'color'
  input.className = 'form-control form-control-color'
  input.value = getRandomColor()
  return input
}

// Função para atualizar o output do ângulo
const updateAngleOutput = () => {
  const output = document.querySelector('output[for="gradientAngle"]')
  output.textContent = `${gradientAngle.value}°`
}

// Função atualizada para gerar o gradiente
const updateGradient = () => {
  const angle = gradientAngle.value
  const colors = gradientColors.map(input => input.value).join(', ')
  let gradient = ''

  switch (gradientType.value) {
    case 'linear':
      gradient = `linear-gradient(${angle}deg, ${colors})`
      break
    case 'radial':
      gradient = `radial-gradient(circle, ${colors})`
      break
    case 'conic':
      gradient = `conic-gradient(from ${angle}deg, ${colors})`
      break
  }

  gradientPreview.style.background = gradient
  gradientCode.textContent = gradient
  updateAngleOutput()
}

// Event listener para adicionar nova cor
addGradientColor.addEventListener('click', () => {
  const newColorInput = createColorInput()

  // Insere o novo input antes do botão de adicionar
  gradientColorContainer.insertBefore(newColorInput, addGradientColor)

  // Adiciona o novo input ao array de cores
  gradientColors.push(newColorInput)

  // Adiciona event listener para o novo input
  newColorInput.addEventListener('input', updateGradient)

  // Atualiza o gradiente
  updateGradient()
})

// Adiciona event listener específico para a mudança do ângulo via scroll
gradientAngle.addEventListener('wheel', e => {
  e.preventDefault() // Previne o scroll da página

  // Determina a direção do scroll
  const direction = e.deltaY > 0 ? -1 : 1

  // Atualiza o valor do ângulo
  const currentValue = parseInt(gradientAngle.value)
  const newValue = Math.max(0, Math.min(360, currentValue + direction * 5))

  gradientAngle.value = newValue
  updateGradient()
})

// Contrast Checker
const foregroundColor = document.getElementById('foregroundColor')
const backgroundColor = document.getElementById('backgroundColor')
const contrastPreview = document.getElementById('contrastPreview')
const contrastRatio = document.getElementById('contrastRatio')
const wcagAA = document.getElementById('wcagAA')
const wcagAAA = document.getElementById('wcagAAA')

const updateContrastChecker = () => {
  const fg = foregroundColor.value
  const bg = backgroundColor.value
  const ratio = chroma.contrast(fg, bg)

  contrastPreview.style.color = fg
  contrastPreview.style.backgroundColor = bg
  contrastRatio.textContent = ratio.toFixed(2) + ':1'

  // WCAG 2.1 Level AA
  wcagAA.textContent = ratio >= 4.5 ? 'Aprovado' : 'Reprovado'
  wcagAA.className = `badge ${ratio >= 4.5 ? 'bg-success' : 'bg-danger'}`

  // WCAG 2.1 Level AAA
  wcagAAA.textContent = ratio >= 7 ? 'Aprovado' : 'Reprovado'
  wcagAAA.className = `badge ${ratio >= 7 ? 'bg-success' : 'bg-danger'}`
}

// Color Wheel
const colorWheel = document.getElementById('colorWheel')
const ctx = colorWheel.getContext('2d')

const drawColorWheel = () => {
  const centerX = colorWheel.width / 2
  const centerY = colorWheel.height / 2
  const radius = Math.min(centerX, centerY) - 10

  for (let angle = 0; angle < 360; angle++) {
    const startAngle = ((angle - 2) * Math.PI) / 180
    const endAngle = ((angle + 2) * Math.PI) / 180

    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.closePath()

    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      radius
    )

    const color = chroma.hsl(angle, 1, 0.5)
    gradient.addColorStop(0, 'white')
    gradient.addColorStop(0.5, color.hex())
    gradient.addColorStop(1, 'black')

    ctx.fillStyle = gradient
    ctx.fill()
  }
}

// Color Vision Simulator
const testImage = document.getElementById('testImage')
const originalImage = document.getElementById('originalImage')
const simulatedImage = document.getElementById('simulatedImage')
const visionType = document.getElementById('visionType')

const simulateColorVision = (imageData, type) => {
  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    let simulated
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
    }

    data[i] = simulated[0]
    data[i + 1] = simulated[1]
    data[i + 2] = simulated[2]
  }
  return imageData
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme()
  generatePalette()
  drawColorWheel()
  updateContrastChecker()
  updateGradient()
  renderSavedPalettes()
  updateAngleOutput()

  // Initialize copy buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-clipboard-target')
      const text = document.querySelector(targetId).textContent
      copyToClipboard(text)
    })
  })

  // Initialize color count output
  const colorCountOutput = document.querySelector('output[for="colorCount"]')
  colorCount.addEventListener('input', e => {
    colorCountOutput.textContent = `${e.target.value} cores`
  })
})

savePaletteBtn.addEventListener('click', savePalette)

// Event listeners for color tools
generatePaletteBtn.addEventListener('click', generatePalette)
colorMode.addEventListener('change', generatePalette)
colorCount.addEventListener('input', generatePalette)

// Event listeners for gradient generator
;[gradientType, gradientAngle, ...gradientColors].forEach(el => {
  el.addEventListener('input', updateGradient)
})

// Event listeners for contrast checker
;[foregroundColor, backgroundColor].forEach(el => {
  el.addEventListener('input', updateContrastChecker)
})

// Event listener for color vision simulator
testImage.addEventListener('change', e => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = event => {
      const img = new Image()
      img.onload = () => {
        originalImage.width = img.width
        originalImage.height = img.height
        simulatedImage.width = img.width
        simulatedImage.height = img.height

        const origCtx = originalImage.getContext('2d')
        const simCtx = simulatedImage.getContext('2d')

        origCtx.drawImage(img, 0, 0)
        simCtx.drawImage(img, 0, 0)

        const imageData = simCtx.getImageData(0, 0, img.width, img.height)
        const simulatedData = simulateColorVision(imageData, visionType.value)
        simCtx.putImageData(simulatedData, 0, 0)
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }
})

visionType.addEventListener('change', () => {
  if (testImage.files[0]) {
    const event = new Event('change')
    testImage.dispatchEvent(event)
  }
})

// Keyboard Accessibility
document.querySelectorAll('.color-swatch').forEach(swatch => {
  swatch.addEventListener('keypress', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      swatch.click()
    }
  })
})
