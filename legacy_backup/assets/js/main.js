// ============= UTILITÁRIOS =============
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

// ============= ALTERNADOR DE TEMA =============
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

// ============= GERADOR DE PALETAS =============
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

      // Adiciona cores intermediárias se necessário
      if (count > 3) {
        const scale1 = chroma
          .scale([baseColor, chroma(baseColor).set('hsl.h', '+120')])
          .mode('lch')
        const scale2 = chroma
          .scale([
            chroma(baseColor).set('hsl.h', '+120'),
            chroma(baseColor).set('hsl.h', '+240')
          ])
          .mode('lch')
        const scale3 = chroma
          .scale([chroma(baseColor).set('hsl.h', '+240'), baseColor])
          .mode('lch')

        const extraColors = []
        const extraPerSegment = Math.floor((count - 3) / 3) + 1

        for (let i = 1; i < extraPerSegment; i++) {
          extraColors.push(scale1(i / extraPerSegment))
          extraColors.push(scale2(i / extraPerSegment))
          extraColors.push(scale3(i / extraPerSegment))
        }

        colors = [...colors, ...extraColors].slice(0, count)
      }
      break
    case 'tetradic':
      colors = [
        baseColor,
        chroma(baseColor).set('hsl.h', '+90'),
        chroma(baseColor).set('hsl.h', '+180'),
        chroma(baseColor).set('hsl.h', '+270')
      ]

      // Adiciona cores intermediárias se necessário
      if (count > 4) {
        const extraColors = []
        for (let i = 1; i < count - 3; i++) {
          const angle = ((i * 360) / (count - 3)) % 360
          extraColors.push(chroma(baseColor).set('hsl.h', `+${angle}`))
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

// ============= PALETAS SALVAS =============
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

// ============= CONVERSOR DE CORES - IMPLEMENTAÇÃO MELHORADA =============
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

  // Função avançada para analisar e validar cores em vários formatos
  function parseColor(colorStr) {
    // Remove espaços e converte para minúsculas
    colorStr = colorStr.trim().toLowerCase()

    // Verifica se é um formato hexadecimal válido
    if (/^#?([0-9a-f]{3}|[0-9a-f]{6})$/.test(colorStr)) {
      // Garante que tenha o # no início
      if (!colorStr.startsWith('#')) {
        colorStr = '#' + colorStr
      }
      // Converte formato curto (#rgb) para longo (#rrggbb)
      if (colorStr.length === 4) {
        colorStr =
          '#' +
          colorStr[1] +
          colorStr[1] +
          colorStr[2] +
          colorStr[2] +
          colorStr[3] +
          colorStr[3]
      }
      return colorStr
    }

    // Verifica se é um formato RGB válido
    const rgbMatch = colorStr.match(
      /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/
    )
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1])
      const g = parseInt(rgbMatch[2])
      const b = parseInt(rgbMatch[3])
      if (r <= 255 && g <= 255 && b <= 255) {
        return `rgb(${r}, ${g}, ${b})`
      }
    }

    // Verifica se é um formato HSL válido
    const hslMatch = colorStr.match(
      /^hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/
    )
    if (hslMatch) {
      const h = parseInt(hslMatch[1]) % 360
      const s = parseInt(hslMatch[2])
      const l = parseInt(hslMatch[3])
      if (s <= 100 && l <= 100) {
        return `hsl(${h}, ${s}%, ${l}%)`
      }
    }

    // Verifica se é um nome de cor válido
    const tempDiv = document.createElement('div')
    tempDiv.style.color = colorStr
    if (tempDiv.style.color) {
      return colorStr
    }

    return null // Retorna null se a cor não for válida
  }

  // Função melhorada para converter RGB para HEX
  function rgbToHex(rgb) {
    const rgbMatch = rgb.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/)
    if (!rgbMatch) return null

    const r = parseInt(rgbMatch[1])
    const g = parseInt(rgbMatch[2])
    const b = parseInt(rgbMatch[3])

    return `#${r.toString(16).padStart(2, '0')}${g
      .toString(16)
      .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase()
  }

  // Função melhorada para converter HEX para RGB
  function hexToRgb(hex) {
    hex = hex.replace(/^#/, '')

    // Converte formato curto (#rgb) para longo (#rrggbb)
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }

    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)

    return `rgb(${r}, ${g}, ${b})`
  }

  // Função melhorada para converter RGB para HSL
  function rgbToHsl(rgb) {
    const rgbMatch = rgb.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/)
    if (!rgbMatch) return null

    let r = parseInt(rgbMatch[1]) / 255
    let g = parseInt(rgbMatch[2]) / 255
    let b = parseInt(rgbMatch[3]) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const diff = max - min
    const add = max + min

    let h,
      s,
      l = add / 2

    if (max === min) {
      h = 0
    } else if (max === r) {
      h = ((60 * (g - b)) / diff + 360) % 360
    } else if (max === g) {
      h = (60 * (b - r)) / diff + 120
    } else {
      h = (60 * (r - g)) / diff + 240
    }

    if (diff === 0) {
      s = 0
    } else if (l <= 0.5) {
      s = diff / add
    } else {
      s = diff / (2 - add)
    }

    return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(
      l * 100
    )}%)`
  }

  // Função para converter HSL para RGB
  function hslToRgb(hsl) {
    const hslMatch = hsl.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/)
    if (!hslMatch) return null

    const h = parseInt(hslMatch[1]) / 360
    const s = parseInt(hslMatch[2]) / 100
    const l = parseInt(hslMatch[3]) / 100

    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q

      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(
      b * 255
    )})`
  }

  // Função para atualizar as exibições de cor
  function updateColorOutputs(colorValue) {
    let hex, rgb, hsl

    // Primeiro, normaliza a entrada para garantir que é uma cor válida
    const parsedColor = parseColor(colorValue)
    if (!parsedColor) {
      console.error('Cor inválida:', colorValue)
      return
    }

    // Determina o formato da cor e converte para os outros formatos
    if (parsedColor.startsWith('#')) {
      hex = parsedColor.toUpperCase()
      rgb = hexToRgb(hex)
      hsl = rgbToHsl(rgb)
    } else if (parsedColor.startsWith('rgb')) {
      rgb = parsedColor
      hex = rgbToHex(rgb).toUpperCase()
      hsl = rgbToHsl(rgb)
    } else if (parsedColor.startsWith('hsl')) {
      hsl = parsedColor
      rgb = hslToRgb(hsl)
      hex = rgbToHex(rgb).toUpperCase()
    } else {
      // Para nomes de cores, obtenha o valor RGB computado
      const tempDiv = document.createElement('div')
      tempDiv.style.color = parsedColor
      document.body.appendChild(tempDiv)
      const computedColor = getComputedStyle(tempDiv).color
      document.body.removeChild(tempDiv)

      rgb = computedColor
      hex = rgbToHex(rgb).toUpperCase()
      hsl = rgbToHsl(rgb)
    }

    // Atualiza as exibições
    hexOutput.textContent = hex
    rgbOutput.textContent = rgb
    hslOutput.textContent = hsl

    // Atualiza as amostras de cores
    colorSample.style.backgroundColor = hex
    rgbSample.style.backgroundColor = rgb
    hslSample.style.backgroundColor = hsl

    // Atualiza o círculo principal e o input de cor
    mainColorCircle.style.backgroundColor = hex
    colorPicker.value = hex
    colorInputText.value = colorValue
  }

  // Event Listeners
  colorPicker.addEventListener('input', e => {
    updateColorOutputs(e.target.value)
  })

  colorInputText.addEventListener('input', e => {
    const inputColor = e.target.value.trim()
    const parsedColor = parseColor(inputColor)

    if (parsedColor) {
      mainColorCircle.style.backgroundColor = parsedColor
    }
  })

  colorInputText.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const inputColor = e.target.value.trim()
      const parsedColor = parseColor(inputColor)

      if (parsedColor) {
        updateColorOutputs(parsedColor)
      } else {
        // Feedback visual para cor inválida
        e.target.classList.add('is-invalid')
        setTimeout(() => {
          e.target.classList.remove('is-invalid')
        }, 1000)
      }
    }
  })

  colorRefreshBtn.addEventListener('click', () => {
    colorInputText.value = ''
    colorInputText.focus()
    updateColorOutputs('#FFFFFF')
  })

  randomColorBtn.addEventListener('click', () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')}`
    updateColorOutputs(randomColor)
  })

  // Configurar botões de cópia
  document.querySelectorAll('.color-copy-btn').forEach(btn => {
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

  // Inicializar com branco
  updateColorOutputs('#FFFFFF')
})

// ============= ESQUEMAS DE CORES - IMPLEMENTAÇÃO MELHORADA =============
document.addEventListener('DOMContentLoaded', () => {
  const baseColor = document.getElementById('baseColor')
  const schemeType = document.getElementById('schemeType')
  const schemeOutput = document.getElementById('schemeOutput')

  // Função para gerar esquemas de cores
  function generateColorScheme() {
    const color = baseColor.value
    const scheme = schemeType.value
    const colors = []

    // Criar objeto de cor usando chroma.js
    const baseChroma = chroma(color)
    const baseHSL = baseChroma.hsl()
    const hue = baseHSL[0] || 0 // Hue
    const saturation = baseHSL[1] || 0.75 // Saturation
    const lightness = baseHSL[2] || 0.5 // Lightness

    switch (scheme) {
      case 'monochromatic':
        // Gera 5 tons da mesma cor variando luminosidade
        colors.push(
          chroma.hsl(hue, saturation, Math.min(lightness + 0.4, 0.9)).hex(),
          chroma.hsl(hue, saturation, Math.min(lightness + 0.2, 0.75)).hex(),
          color,
          chroma
            .hsl(
              hue,
              Math.min(saturation + 0.1, 1),
              Math.max(lightness - 0.2, 0.25)
            )
            .hex(),
          chroma
            .hsl(
              hue,
              Math.min(saturation + 0.2, 1),
              Math.max(lightness - 0.4, 0.1)
            )
            .hex()
        )
        break

      case 'analogous':
        // Cores adjacentes na roda de cores (±30° e ±60°)
        colors.push(
          chroma.hsl((hue - 60 + 360) % 360, saturation, lightness).hex(),
          chroma.hsl((hue - 30 + 360) % 360, saturation, lightness).hex(),
          color,
          chroma.hsl((hue + 30) % 360, saturation, lightness).hex(),
          chroma.hsl((hue + 60) % 360, saturation, lightness).hex()
        )
        break

      case 'complementary':
        // Cor complementar (oposta) e tons intermediários
        const complement = (hue + 180) % 360
        colors.push(
          chroma.hsl(hue, saturation, Math.min(lightness + 0.2, 0.9)).hex(),
          color,
          chroma.hsl(hue, Math.max(saturation - 0.3, 0.2), lightness).hex(),
          chroma
            .hsl(complement, Math.max(saturation - 0.3, 0.2), lightness)
            .hex(),
          chroma
            .hsl(complement, saturation, Math.min(lightness + 0.2, 0.9))
            .hex()
        )
        break

      case 'splitComplementary':
        // Complementar dividido (±30° da cor complementar)
        const complementAngle = (hue + 180) % 360
        colors.push(
          color,
          chroma.hsl(hue, saturation, Math.min(lightness + 0.25, 0.9)).hex(),
          chroma
            .hsl((complementAngle - 30 + 360) % 360, saturation, lightness)
            .hex(),
          chroma.hsl((complementAngle + 30) % 360, saturation, lightness).hex(),
          chroma
            .hsl(complementAngle, saturation, Math.min(lightness + 0.25, 0.9))
            .hex()
        )
        break

      case 'triadic':
        // Cores triádicas (espaçadas em 120°)
        colors.push(
          color,
          chroma.hsl((hue + 120) % 360, saturation, lightness).hex(),
          chroma.hsl((hue + 240) % 360, saturation, lightness).hex(),
          chroma
            .hsl((hue + 120) % 360, saturation, Math.min(lightness + 0.2, 0.9))
            .hex(),
          chroma
            .hsl((hue + 240) % 360, saturation, Math.min(lightness + 0.2, 0.9))
            .hex()
        )
        break

      case 'tetradic':
        // Cores tetrádicas (retangular, espaçadas em 60° e 120°)
        colors.push(
          color,
          chroma.hsl((hue + 60) % 360, saturation, lightness).hex(),
          chroma.hsl((hue + 180) % 360, saturation, lightness).hex(),
          chroma.hsl((hue + 240) % 360, saturation, lightness).hex(),
          chroma.hsl((hue + 300) % 360, saturation, lightness).hex()
        )
        break

      default:
        colors.push(color)
        break
    }

    renderColorScheme(colors)
  }

  // Função para renderizar o esquema de cores
  function renderColorScheme(colors) {
    schemeOutput.innerHTML = ''

    colors.forEach(color => {
      const colorBlock = document.createElement('div')
      colorBlock.className = 'color-block'
      colorBlock.style.backgroundColor = color
      colorBlock.title = color.toUpperCase()

      // Adicionar código da cor
      const colorCode = document.createElement('div')
      colorCode.className = 'color-code'
      colorCode.textContent = color.toUpperCase()
      colorBlock.appendChild(colorCode)

      // Adicionar botão de cópia
      const copyButton = document.createElement('button')
      copyButton.className = 'color-copy-btn'
      copyButton.innerHTML = '<i class="fas fa-copy"></i>'
      copyButton.addEventListener('click', e => {
        e.stopPropagation()
        navigator.clipboard
          .writeText(color)
          .then(() => {
            copyButton.innerHTML = '<i class="fas fa-check"></i>'
            setTimeout(() => {
              copyButton.innerHTML = '<i class="fas fa-copy"></i>'
            }, 1000)
          })
          .catch(err => console.error('Erro ao copiar: ', err))
      })
      colorBlock.appendChild(copyButton)

      schemeOutput.appendChild(colorBlock)
    })
  }

  // Event listeners
  baseColor.addEventListener('input', generateColorScheme)
  schemeType.addEventListener('change', generateColorScheme)

  // Adicionar CSS necessário
  const style = document.createElement('style')
  style.textContent = `
    .color-scheme-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 10px;
      margin-top: 15px;
    }
    
    .color-block {
      position: relative;
      height: 60px;
      border-radius: 5px;
      cursor: pointer;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      transition: transform 0.2s;
    }
    
    .color-block:hover {
      transform: scale(1.05);
    }
    
    .color-code {
      background: rgba(0, 0, 0, 0.5);
      color: white;
      font-size: 12px;
      padding: 3px 6px;
      border-radius: 3px;
      margin-bottom: 5px;
      opacity: 0;
      transition: opacity 0.2s;
    }
    
    .color-block:hover .color-code {
      opacity: 1;
    }
    
    .color-copy-btn {
      position: absolute;
      top: 5px;
      right: 5px;
      background: rgba(255, 255, 255, 0.7);
      border: none;
      border-radius: 3px;
      width: 24px;
      height: 24px;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s;
    }
    
    .color-block:hover .color-copy-btn {
      opacity: 1;
    }
    
    .color-copy-btn:hover {
      background: rgba(255, 255, 255, 0.9);
    }
      `
  document.head.appendChild(style)

  // Inicializar o esquema de cores
  generateColorScheme()
})

// ============= RODA DE CORES INTERATIVA - IMPLEMENTAÇÃO APRIMORADA =============
document.addEventListener('DOMContentLoaded', () => {
  const colorWheel = document.getElementById('colorWheel')
  if (!colorWheel) return // Verifica se o elemento existe

  const ctx = colorWheel.getContext('2d')

  // Definições de constantes
  const width = colorWheel.width
  const height = colorWheel.height
  const centerX = width / 2
  const centerY = height / 2
  const wheelRadius = Math.min(centerX, centerY) * 0.8
  const innerRadius = wheelRadius * 0.15 // Raio interno para o anel da roda de cores

  // Estado da roda de cores
  let selectedHue = 0
  let selectedSaturation = 100
  let selectedLightness = 50
  let activeHarmonies = []
  let isDragging = false

  // Botões de harmonias
  const complementaryBtn = document.getElementById('showComplementary')
  const triadicBtn = document.getElementById('showTriadic')
  const tetradicBtn = document.getElementById('showTetradic')
  const analogousBtn = document.getElementById('showAnalogous')

  // Função para desenhar a roda de cores em anel
  function drawColorWheel() {
    ctx.clearRect(0, 0, width, height)

    // Desenha o anel da roda de cores
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = ((angle - 1) * Math.PI) / 180
      const endAngle = ((angle + 1) * Math.PI) / 180

      const gradientInner = ctx.createLinearGradient(
        centerX + innerRadius * Math.cos(startAngle),
        centerY + innerRadius * Math.sin(startAngle),
        centerX + wheelRadius * Math.cos(startAngle),
        centerY + wheelRadius * Math.sin(startAngle)
      )

      // Cria um gradiente da borda interna até a externa
      gradientInner.addColorStop(0, `hsl(${angle}, 50%, 50%)`)
      gradientInner.addColorStop(0.5, `hsl(${angle}, 100%, 50%)`)
      gradientInner.addColorStop(1, `hsl(${angle}, 100%, 35%)`)

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, wheelRadius, startAngle, endAngle)
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true)
      ctx.closePath()

      ctx.fillStyle = gradientInner
      ctx.fill()
    }

    // Desenha o círculo interno com a cor selecionada
    ctx.beginPath()
    ctx.arc(centerX, centerY, innerRadius * 0.9, 0, Math.PI * 2)
    ctx.fillStyle = `hsl(${selectedHue}, ${selectedSaturation}%, ${selectedLightness}%)`
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.lineWidth = 2
    ctx.stroke()

    // Desenha o marcador da cor selecionada na roda
    drawSelectionMarker()

    // Desenha marcadores de harmonia se ativos
    if (activeHarmonies.length > 0) {
      drawHarmonyMarkers()
    }

    // Atualiza as visualizações de harmonia
    updateHarmonyExamples()
  }

  // Função para desenhar o marcador da cor selecionada
  function drawSelectionMarker() {
    const radians = (selectedHue * Math.PI) / 180
    const markerX = centerX + wheelRadius * 0.88 * Math.cos(radians)
    const markerY = centerY + wheelRadius * 0.88 * Math.sin(radians)

    // Desenha um círculo de seleção
    ctx.beginPath()
    ctx.arc(markerX, markerY, wheelRadius * 0.06, 0, Math.PI * 2)
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.fillStyle = `hsl(${selectedHue}, 100%, 50%)`
    ctx.fill()
  }

  // Função para desenhar marcadores de harmonias
  function drawHarmonyMarkers() {
    const harmonies = calculateHarmonies()

    harmonies.forEach(hue => {
      const radians = (hue * Math.PI) / 180
      const markerX = centerX + wheelRadius * 0.88 * Math.cos(radians)
      const markerY = centerY + wheelRadius * 0.88 * Math.sin(radians)

      ctx.beginPath()
      ctx.arc(markerX, markerY, wheelRadius * 0.04, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`
      ctx.fill()
    })
  }

  // Função para calcular harmonias com base no matiz selecionado
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
      harmonies.push((selectedHue + 30) % 360)
      harmonies.push((selectedHue - 30 + 360) % 360)
    }

    return harmonies
  }

  // Função para atualizar os exemplos de harmonia
  function updateHarmonyExamples() {
    // Cor base para as harmonias
    const baseColor = `hsl(${selectedHue}, 80%, 50%)`

    // Complementares
    const complementColor = `hsl(${(selectedHue + 180) % 360}, 80%, 50%)`
    updateHarmonyExample('complementaryExample', [baseColor, complementColor])

    // Split Complementares
    const splitComplement1 = `hsl(${(selectedHue + 150) % 360}, 80%, 50%)`
    const splitComplement2 = `hsl(${(selectedHue + 210) % 360}, 80%, 50%)`
    updateHarmonyExample('splitComplementaryExample', [
      baseColor,
      splitComplement1,
      splitComplement2
    ])

    // Análogas
    const analogous1 = `hsl(${(selectedHue - 30 + 360) % 360}, 80%, 50%)`
    const analogous2 = `hsl(${(selectedHue + 30) % 360}, 80%, 50%)`
    updateHarmonyExample('analogousExample', [
      analogous1,
      baseColor,
      analogous2
    ])

    // Triádicas
    const triadic1 = `hsl(${(selectedHue + 120) % 360}, 80%, 50%)`
    const triadic2 = `hsl(${(selectedHue + 240) % 360}, 80%, 50%)`
    updateHarmonyExample('triadicExample', [baseColor, triadic1, triadic2])

    // Tetrádicas
    const tetradic1 = `hsl(${(selectedHue + 90) % 360}, 80%, 50%)`
    const tetradic2 = `hsl(${(selectedHue + 180) % 360}, 80%, 50%)`
    const tetradic3 = `hsl(${(selectedHue + 270) % 360}, 80%, 50%)`
    updateHarmonyExample('tetradicExample', [
      baseColor,
      tetradic1,
      tetradic2,
      tetradic3
    ])

    // Monocromáticas
    const mono1 = `hsl(${selectedHue}, 80%, 30%)`
    const mono2 = `hsl(${selectedHue}, 80%, 40%)`
    const mono3 = `hsl(${selectedHue}, 80%, 50%)`
    const mono4 = `hsl(${selectedHue}, 80%, 60%)`
    const mono5 = `hsl(${selectedHue}, 80%, 70%)`
    updateHarmonyExample('monadicExample', [mono1, mono2, mono3, mono4, mono5])
  }

  // Função para atualizar exemplos visuais de harmonias
  function updateHarmonyExample(elementId, colors) {
    const container = document.getElementById(elementId)
    if (!container) return

    container.innerHTML = ''

    colors.forEach(color => {
      const colorBlock = document.createElement('div')
      colorBlock.style.backgroundColor = color
      colorBlock.style.width = '40px'
      colorBlock.style.height = '40px'
      colorBlock.style.margin = '0 5px'
      colorBlock.style.display = 'inline-block'
      colorBlock.style.borderRadius = '4px'
      colorBlock.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)'
      colorBlock.title = color
      container.appendChild(colorBlock)
    })
  }

  // Função para lidar com eventos de mouse na roda de cores
  function handleMouseEvent(e) {
    const rect = colorWheel.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Calcula a distância do centro
    const dx = mouseX - centerX
    const dy = mouseY - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)

    // Verifica se o clique foi na região do anel da roda de cores
    if (distance >= innerRadius && distance <= wheelRadius) {
      // Calcula o ângulo a partir do centro (em graus)
      let angle = (Math.atan2(dy, dx) * 180) / Math.PI
      // Normaliza para 0-360
      angle = (angle + 360) % 360

      // Atualiza o matiz selecionado
      selectedHue = Math.round(angle)

      // Redesenha a roda de cores
      drawColorWheel()
    }
  }

  // Função para alternar os modos de harmonia
  function toggleHarmony(harmony) {
    const index = activeHarmonies.indexOf(harmony)

    // Limpa seleções anteriores
    activeHarmonies = []

    // Reseta todos os botões
    if (complementaryBtn && triadicBtn && tetradicBtn && analogousBtn) {
      ;[complementaryBtn, triadicBtn, tetradicBtn, analogousBtn].forEach(
        btn => {
          btn.classList.remove('active')
          btn.classList.remove('btn-primary')
          btn.classList.add('btn-outline-primary')
        }
      )

      // Se o botão não estava ativo, ativa-o
      if (index === -1) {
        activeHarmonies.push(harmony)

        // Destaca o botão ativo
        switch (harmony) {
          case 'complementary':
            complementaryBtn.classList.add('active', 'btn-primary')
            complementaryBtn.classList.remove('btn-outline-primary')
            break
          case 'triadic':
            triadicBtn.classList.add('active', 'btn-primary')
            triadicBtn.classList.remove('btn-outline-primary')
            break
          case 'tetradic':
            tetradicBtn.classList.add('active', 'btn-primary')
            tetradicBtn.classList.remove('btn-outline-primary')
            break
          case 'analogous':
            analogousBtn.classList.add('active', 'btn-primary')
            analogousBtn.classList.remove('btn-outline-primary')
            break
        }
      }
    }

    // Redesenha a roda de cores
    drawColorWheel()
  }

  // Adiciona event listeners
  if (colorWheel) {
    colorWheel.addEventListener('mousedown', e => {
      isDragging = true
      handleMouseEvent(e)
    })

    colorWheel.addEventListener('mousemove', e => {
      if (isDragging) {
        handleMouseEvent(e)
      }
    })

    document.addEventListener('mouseup', () => {
      isDragging = false
    })

    // Event listeners para botões de harmonia
    if (complementaryBtn) {
      complementaryBtn.addEventListener('click', () =>
        toggleHarmony('complementary')
      )
    }
    if (triadicBtn) {
      triadicBtn.addEventListener('click', () => toggleHarmony('triadic'))
    }
    if (tetradicBtn) {
      tetradicBtn.addEventListener('click', () => toggleHarmony('tetradic'))
    }
    if (analogousBtn) {
      analogousBtn.addEventListener('click', () => toggleHarmony('analogous'))
    }

    // Inicializa a roda de cores
    drawColorWheel()
  }
})

// ============= GERADOR DE GRADIENTES =============
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
  if (output) {
    output.textContent = `${gradientAngle.value}°`
  }
}

// Função atualizada para gerar o gradiente
const updateGradient = () => {
  if (!gradientPreview || !gradientCode) return

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
if (addGradientColor && gradientColorContainer) {
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
}

// Adiciona event listener específico para a mudança do ângulo via scroll
if (gradientAngle) {
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
}

// ============= VERIFICADOR DE CONTRASTE =============
const foregroundColor = document.getElementById('foregroundColor')
const backgroundColor = document.getElementById('backgroundColor')
const contrastPreview = document.getElementById('contrastPreview')
const contrastRatio = document.getElementById('contrastRatio')
const wcagAA = document.getElementById('wcagAA')
const wcagAAA = document.getElementById('wcagAAA')

const updateContrastChecker = () => {
  if (
    !foregroundColor ||
    !backgroundColor ||
    !contrastPreview ||
    !contrastRatio ||
    !wcagAA ||
    !wcagAAA
  )
    return

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

// ============= SIMULADOR DE DALTONISMO =============
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

// ============= INICIALIZAÇÃO E EVENT LISTENERS =============
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme()

  if (paletteContainer) {
    generatePalette()
    renderSavedPalettes()
  }

  updateGradient()
  updateAngleOutput()
  updateContrastChecker()

  // Inicializa botões de cópia
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-clipboard-target')
      const text = document.querySelector(targetId).textContent
      copyToClipboard(text)
    })
  })

  // Inicializa contador de cores
  const colorCountOutput = document.querySelector('output[for="colorCount"]')
  if (colorCount && colorCountOutput) {
    colorCount.addEventListener('input', e => {
      colorCountOutput.textContent = `${e.target.value} cores`
    })
  }
})

// Event listeners para ferramentas
if (savePaletteBtn) {
  savePaletteBtn.addEventListener('click', savePalette)
}

if (generatePaletteBtn && colorMode && colorCount) {
  generatePaletteBtn.addEventListener('click', generatePalette)
  colorMode.addEventListener('change', generatePalette)
  colorCount.addEventListener('input', generatePalette)
}

// Event listeners para gerador de gradientes
if (gradientType && gradientAngle && gradientColor1 && gradientColor2) {
  ;[gradientType, gradientAngle, gradientColor1, gradientColor2].forEach(el => {
    el.addEventListener('input', updateGradient)
  })
}

// Event listeners para verificador de contraste
if (foregroundColor && backgroundColor) {
  ;[foregroundColor, backgroundColor].forEach(el => {
    el.addEventListener('input', updateContrastChecker)
  })
}

// Event listener para simulador de daltonismo
if (testImage && originalImage && simulatedImage && visionType) {
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
}

// Event listener para o botão de voltar ao topo
const backToTop = document.getElementById('backToTop')
if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.classList.add('visible')
    } else {
      backToTop.classList.remove('visible')
    }
  })

  backToTop.addEventListener('click', e => {
    e.preventDefault()
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  })

  // Adiciona efeito hover no ícone
  backToTop.addEventListener('mouseenter', () => {
    backToTop.querySelector('i').style.transform = 'translateY(-2px)'
  })

  backToTop.addEventListener('mouseleave', () => {
    backToTop.querySelector('i').style.transform = 'translateY(0)'
  })
}

// Adiciona acessibilidade de teclado para os blocos de cores
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('keypress', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        swatch.click()
      }
    })
  })
})
