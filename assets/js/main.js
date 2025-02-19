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

document.addEventListener('DOMContentLoaded', () => {
  const colorPicker = document.getElementById('inputColor')
  const colorInputText = document.getElementById('colorInputText')
  const colorRefreshBtn = document.getElementById('colorRefreshBtn')
  const randomColorBtn = document.getElementById('randomColorBtn')

  const hexOutput = document.getElementById('hexOutput')
  const rgbOutput = document.getElementById('rgbOutput')
  const hslOutput = document.getElementById('hslOutput')

  const colorSample = document.getElementById('colorSample')
  const rgbSample = document.getElementById('rgbSample')
  const hslSample = document.getElementById('hslSample')

  // Círculo principal para mostrar a cor selecionada
  const mainColorCircle = document.querySelector(
    '.color-input-group .color-picker-wrapper'
  )

  // Convert color formats
  function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
          result[3],
          16
        )})`
      : null
  }

  function rgbToHsl(rgb) {
    const [r, g, b] = rgb.match(/\d+/g).map(Number)
    const rr = r / 255
    const gg = g / 255
    const bb = b / 255
    const max = Math.max(rr, gg, bb)
    const min = Math.min(rr, gg, bb)
    let h,
      s,
      l = (max + min) / 2

    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      h =
        max === rr
          ? (gg - bb) / d + (gg < bb ? 6 : 0)
          : max === gg
          ? (bb - rr) / d + 2
          : (rr - gg) / d + 4
      h /= 6
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(
      l * 100
    )}%)`
  }

  // Função para validar e normalizar cor
  function validateColor(color) {
    const tempDiv = document.createElement('div')
    tempDiv.style.color = color

    try {
      const computedColor = getComputedStyle(tempDiv).color
      return computedColor !== 'rgb(0, 0, 0)'
    } catch {
      return false
    }
  }

  // Função para converter para HEX
  function colorToHex(color) {
    const tempDiv = document.createElement('div')
    tempDiv.style.color = color

    const computedColor = getComputedStyle(tempDiv).color
    const rgbMatch = computedColor.match(/\d+/g)

    if (rgbMatch) {
      return (
        '#' +
        rgbMatch
          .map(x => {
            const hex = parseInt(x).toString(16)
            return hex.length === 1 ? '0' + hex : hex
          })
          .join('')
      )
    }

    return null
  }

  // Update color outputs
  function updateColorOutputs(color) {
    const hex = color.startsWith('#') ? color : colorToHex(color)
    const rgb = hexToRgb(hex)
    const hsl = rgbToHsl(rgb)

    if (hex && rgb && hsl) {
      hexOutput.textContent = hex
      rgbOutput.textContent = rgb
      hslOutput.textContent = hsl

      colorSample.style.backgroundColor = hex
      rgbSample.style.backgroundColor = rgb
      hslSample.style.backgroundColor = hsl

      // Atualiza a cor do círculo principal
      mainColorCircle.style.backgroundColor = hex
      colorPicker.value = hex
      colorInputText.value = hex
    }
  }

  // Color picker change event
  colorPicker.addEventListener('input', e => {
    const color = e.target.value
    updateColorOutputs(color)
  })

  // Color text input - validação em tempo real
  colorInputText.addEventListener('input', e => {
    const inputColor = e.target.value.trim()

    if (validateColor(inputColor)) {
      mainColorCircle.style.backgroundColor = inputColor
    }
  })

  // Ao pressionar Enter
  colorInputText.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const inputColor = e.target.value.trim()

      if (validateColor(inputColor)) {
        updateColorOutputs(inputColor)
      } else {
        // Feedback visual para cor inválida
        e.target.classList.add('is-invalid')
        setTimeout(() => {
          e.target.classList.remove('is-invalid')
        }, 1000)
      }
    }
  })

  // Refresh color input
  colorRefreshBtn.addEventListener('click', () => {
    colorInputText.value = ''
    colorInputText.focus()

    // Reseta para branco
    updateColorOutputs('#FFFFFF')
  })

  // Generate random color
  randomColorBtn.addEventListener('click', () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')}`
    updateColorOutputs(randomColor)
  })

  // Copy functionality
  const copyButtons = document.querySelectorAll('.color-copy-btn')
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-clipboard-target')
      const textToCopy = document.querySelector(targetId).textContent

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          btn.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i>'
          setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-copy" aria-hidden="true"></i>'
          }, 1000)
        })
        .catch(err => {
          console.error('Falha ao copiar texto: ', err)
        })
    })
  })

  // Inicializa com branco
  updateColorOutputs('#FFFFFF')
})

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

// Configuration
const centerX = colorWheel.width / 2
const centerY = colorWheel.height / 2
const radius = Math.min(centerX, centerY) - 30
let selectedHue = 0
let activeHarmonies = []

// Draw the color wheel
function drawColorWheel() {
  ctx.clearRect(0, 0, colorWheel.width, colorWheel.height)

  // Draw the color wheel segments
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

    const color = `hsl(${angle}, 100%, 50%)`
    gradient.addColorStop(0.2, 'white')
    gradient.addColorStop(0.7, color)
    gradient.addColorStop(1, 'black')

    ctx.fillStyle = gradient
    ctx.fill()
  }

  // Draw selection marker
  drawSelectionMarker()

  // Draw harmony markers if active
  if (activeHarmonies.length > 0) {
    drawHarmonyMarkers()
  }
}

// Função para criar blocos de cores em uma div
function addColorBlocks(elementId, colors) {
  const container = document.getElementById(elementId)

  // Limpa qualquer conteúdo anterior
  container.innerHTML = ''

  // Cria blocos de cores para cada cor
  colors.forEach(color => {
    const block = document.createElement('div')
    block.style.width = '50px'
    block.style.height = '50px'
    block.style.backgroundColor = color
    block.style.margin = '5px'
    block.style.display = 'inline-block'
    block.title = color // Mostra o código da cor ao passar o mouse
    container.appendChild(block)
  })
}

// Exemplos de harmonias de cores
const colorExamples = {
  complementaryExample: ['#FF0000', '#00FF00'], // Vermelho e verde
  splitComplementaryExample: ['#FF0000', '#FFFF00', '#00FFFF'], // Vermelho, amarelo e ciano
  analogousExample: ['#FF0000', '#FF7F00', '#FFFF00'], // Vermelho, laranja e amarelo
  triadicExample: ['#FF0000', '#00FF00', '#0000FF'], // Vermelho, verde e azul
  tetradicExample: ['#FF0000', '#00FF00', '#FFFF00', '#0000FF'], // Vermelho, verde, amarelo e azul
  monadicExample: ['#FF0000', '#FF4D4D', '#FF9999', '#FFCCCC'] // Tons de vermelho
}

// Adiciona os exemplos a cada div correspondente
for (const [id, colors] of Object.entries(colorExamples)) {
  addColorBlocks(id, colors)
}

// Draw the selection marker
function drawSelectionMarker() {
  const angle = (selectedHue * Math.PI) / 180
  const x = centerX + Math.cos(angle) * radius
  const y = centerY + Math.sin(angle) * radius

  ctx.beginPath()
  ctx.arc(x, y, 10, 0, Math.PI * 2)
  ctx.strokeStyle = 'white'
  ctx.lineWidth = 3
  ctx.stroke()
  ctx.fillStyle = `hsl(${selectedHue}, 100%, 50%)`
  ctx.fill()
}

// Draw harmony markers
function drawHarmonyMarkers() {
  const harmonies = calculateHarmonies()
  harmonies.forEach(hue => {
    const angle = (hue * Math.PI) / 180
    const x = centerX + Math.cos(angle) * radius
    const y = centerY + Math.sin(angle) * radius

    ctx.beginPath()
    ctx.arc(x, y, 8, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`
    ctx.fill()
  })
}

// Calculate harmony angles based on selected hue
function calculateHarmonies() {
  const harmonies = []

  if (activeHarmonies.includes('complementary')) {
    harmonies.push((selectedHue + 180) % 360)
  }

  if (activeHarmonies.includes('triadic')) {
    harmonies.push((selectedHue + 120) % 360)
    harmonies.push((selectedHue + 240) % 360)
  }

  if (activeHarmonies.includes('tetradic')) {
    harmonies.push((selectedHue + 90) % 360)
    harmonies.push((selectedHue + 180) % 360)
    harmonies.push((selectedHue + 270) % 360)
  }

  if (activeHarmonies.includes('analogous')) {
    harmonies.push((selectedHue + 30 + 360) % 360)
    harmonies.push((selectedHue - 30 + 360) % 360)
  }

  return harmonies
}

// Handle mouse events
function handleMouseEvent(e) {
  const rect = colorWheel.getBoundingClientRect()
  const x = e.clientX - rect.left - centerX
  const y = e.clientY - rect.top - centerY

  // Calculate angle from center
  let angle = (Math.atan2(y, x) * 180) / Math.PI
  angle = (angle + 360) % 360

  // Calculate distance from center
  const distance = Math.sqrt(x * x + y * y)

  // Only update if click is within the wheel radius
  if (distance <= radius) {
    selectedHue = Math.round(angle)
    drawColorWheel()
  }
}

// Initialize event listeners
colorWheel.addEventListener('mousedown', handleMouseEvent)
colorWheel.addEventListener('mousemove', e => {
  if (e.buttons === 1) {
    // Only update if mouse button is pressed
    handleMouseEvent(e)
  }
})

// Handle harmony buttons
document
  .getElementById('showComplementary')
  .addEventListener('click', function () {
    toggleHarmony('complementary')
  })

document.getElementById('showTriadic').addEventListener('click', function () {
  toggleHarmony('triadic')
})

document.getElementById('showTetradic').addEventListener('click', function () {
  toggleHarmony('tetradic')
})

document.getElementById('showAnalogous').addEventListener('click', function () {
  toggleHarmony('analogous')
})

function toggleHarmony(harmony) {
  const index = activeHarmonies.indexOf(harmony)
  if (index === -1) {
    activeHarmonies = [harmony] // Only show one harmony at a time
  } else {
    activeHarmonies = []
  }
  drawColorWheel()
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

// Back to top button functionality
const backToTop = document.getElementById('backToTop')

// Show/hide button based on scroll position
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTop.classList.add('visible')
  } else {
    backToTop.classList.remove('visible')
  }
})

// Smooth scroll to top
backToTop.addEventListener('click', e => {
  e.preventDefault()
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
})

// Add hover effect to button icon
backToTop.addEventListener('mouseenter', () => {
  backToTop.querySelector('i').style.transform = 'translateY(-2px)'
})

backToTop.addEventListener('mouseleave', () => {
  backToTop.querySelector('i').style.transform = 'translateY(0)'
})
