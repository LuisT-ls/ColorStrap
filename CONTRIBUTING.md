# Contribuindo para o ColorStrap

Obrigado pelo seu interesse em contribuir com o ColorStrap! Este documento fornece diretrizes para ajudar no processo de contribuição.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Posso Contribuir?](#como-posso-contribuir)
  - [Reportando Bugs](#reportando-bugs)
  - [Sugerindo Melhorias](#sugerindo-melhorias)
  - [Primeiro Código](#primeiro-código)
  - [Pull Requests](#pull-requests)
- [Diretrizes de Estilo](#diretrizes-de-estilo)
  - [HTML](#html)
  - [CSS](#css)
  - [JavaScript](#javascript)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Ambiente de Desenvolvimento](#ambiente-de-desenvolvimento)

## Código de Conduta

Este projeto e todos os participantes estão sujeitos ao nosso [Código de Conduta](CODE_OF_CONDUCT.md). Ao participar, espera-se que você respeite este código.

## Como Posso Contribuir?

### Reportando Bugs

Esta seção orienta você através do envio de um relatório de bug. Seguir estas diretrizes ajuda os mantenedores e a comunidade a entender seu relatório.

#### Antes de Submeter um Relatório de Bug

- **Verifique a seção de [Issues](https://github.com/LuisT-ls/ColorStrap/issues)** para ver se o problema já foi reportado. Se já existir e a issue estiver aberta, adicione um comentário à issue existente em vez de abrir uma nova.
- **Verifique se você pode reproduzir o problema** em diferentes navegadores e dispositivos para determinar se é específico de um navegador/dispositivo.

#### Como Submeter um Bom Relatório de Bug

Bugs são rastreados como [issues do GitHub](https://github.com/LuisT-ls/ColorStrap/issues). Crie uma issue e forneça as seguintes informações:

- **Use um título claro e descritivo** para identificar o problema.
- **Descreva os passos exatos que reproduzem o problema** com o máximo de detalhes possível.
- **Forneça exemplos específicos para demonstrar os passos**. Se possível, inclua links para arquivos ou projetos GitHub, ou snippets copiáveis que podem ser usados no exemplo.
- **Descreva o comportamento observado após seguir os passos** e aponte qual é exatamente o problema com esse comportamento.
- **Explique qual comportamento você esperava ver** e por quê.
- **Inclua capturas de tela e gifs animados** que mostram você seguindo os passos e demonstram claramente o problema.
- **Se o problema não foi desencadeado por uma ação específica**, descreva o que estava fazendo antes do problema acontecer.

### Sugerindo Melhorias

Esta seção orienta você através do envio de uma sugestão de melhoria, incluindo recursos completamente novos e pequenas melhorias nas funcionalidades existentes.

#### Antes de Submeter uma Sugestão de Melhoria

- **Verifique a seção de [Issues](https://github.com/LuisT-ls/ColorStrap/issues)** para ver se a melhoria já foi sugerida. Se já existir, adicione um comentário à issue existente em vez de abrir uma nova.
- **Verifique a lista de recursos planejados** no [README](README.md#roadmap) para ver se a funcionalidade já está planejada.

#### Como Submeter uma Boa Sugestão de Melhoria

Sugestões de melhoria são rastreadas como [issues do GitHub](https://github.com/LuisT-ls/ColorStrap/issues). Crie uma issue e forneça as seguintes informações:

- **Use um título claro e descritivo** para a issue para identificar a sugestão.
- **Forneça uma descrição passo a passo da melhoria sugerida** com o máximo de detalhes possível.
- **Forneça exemplos específicos para demonstrar os passos** ou aponte para projetos semelhantes onde essa melhoria existe.
- **Descreva o comportamento atual** e **explique qual comportamento você esperava ver** e por quê.
- **Inclua capturas de tela ou mockups** para ajudar a explicar sua sugestão.
- **Explique por que esta melhoria seria útil** para a maioria dos usuários do ColorStrap.
- **Liste alguns outros aplicativos ou ferramentas onde esta melhoria existe**, se aplicável.

### Primeiro Código

Não sabe por onde começar? Você pode começar olhando para issues marcadas com as tags:

- `beginner` - issues que requerem apenas algumas linhas de código e um teste ou dois.
- `help-wanted` - issues que precisam de mais atenção e podem ser um pouco mais complexas.

### Pull Requests

- Preencha o template de pull request.
- Não inclua números de issues no título do PR.
- Inclua capturas de tela e gifs animados no seu PR, se aplicável.
- Documente novos códigos com comentários para guiar outros contribuidores.
- Termine todos seus arquivos com uma nova linha.
- Evite código dependente de plataforma.

## Diretrizes de Estilo

### HTML

- Use HTML5.
- Use tags semânticas.
- Garantia de acessibilidade (ARIA, atributos alt, etc).
- Utilize indentação de 2 espaços.

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>Exemplo</title>
  </head>
  <body>
    <header role="banner">
      <nav aria-label="Navegação principal">
        <!-- Conteúdo do navegador -->
      </nav>
    </header>
    <main role="main">
      <!-- Conteúdo principal -->
    </main>
  </body>
</html>
```

### CSS

- Siga a metodologia BEM (Block Element Modifier).
- Use variáveis CSS para cores, espaçamento e outras propriedades reutilizáveis.
- Mantenha a especificidade baixa.
- Utilize indentação de 2 espaços.

```css
/* Exemplo de BEM e variáveis CSS */
.card {
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
}

.card__title {
  color: var(--text-primary);
  font-size: var(--font-size-lg);
}

.card__button--primary {
  background-color: var(--primary);
  color: white;
}
```

### JavaScript

- Use ES6+ sempre que possível.
- Utilize módulos para organizar o código.
- Prefira funções nomeadas em vez de anônimas para melhor depuração.
- Evite variáveis globais.
- Use const e let em vez de var.
- Utilize indentação de 2 espaços.

```javascript
// Exemplo de módulo ES6
const ColorUtils = {
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
          result[3],
          16
        )})`
      : null
  },

  isValidHex(hex) {
    return /^#?([a-f\d]{3}|[a-f\d]{6})$/i.test(hex)
  }
}

export default ColorUtils
```

## Estrutura do Projeto

Familiarize-se com a estrutura de diretórios do projeto:

```
.
├── ./assets
│   ├── ./assets/css         # Arquivos CSS organizados por funcionalidade
│   │   ├── ./assets/css/abstracts
│   │   ├── ./assets/css/base
│   │   ├── ./assets/css/components
│   │   ├── ./assets/css/layout
│   │   ├── ./assets/css/themes
│   │   └── ./assets/css/tools
│   ├── ./assets/img         # Imagens e recursos visuais
│   └── ./assets/js          # JavaScript organizado em módulos
│       ├── ./assets/js/modules
│       ├── ./assets/js/services
│       └── ./assets/js/utils
├── ./index.html             # Página principal
├── ./LICENSE                # Informações de licença
├── ./pages                  # Páginas adicionais
└── ./README.md              # Documentação
```

## Ambiente de Desenvolvimento

ColorStrap é desenvolvido como um projeto front-end estático, o que significa que você não precisa de um ambiente de desenvolvimento complexo para começar. No entanto, recomendamos o seguinte:

1. Um editor de código moderno como [VS Code](https://code.visualstudio.com/) com extensões para HTML, CSS e JavaScript.
2. Um servidor local para desenvolvimento. Você pode usar:
   - Extensão Live Server no VS Code
   - Python: `python -m http.server`
   - Node.js: `npx serve`
3. Git para controle de versão

### Dicas para testes

- Teste sua implementação em vários navegadores (Chrome, Firefox, Safari, Edge)
- Teste em diferentes tamanhos de tela para garantir responsividade
- Verifique a acessibilidade usando ferramentas como Lighthouse ou axe

---

Agradecemos novamente por contribuir com o ColorStrap! Suas contribuições fazem deste projeto uma ferramenta melhor para todos.
