// Nome do cache
const CACHE_NAME = 'colorstrap-v1'

// Arquivos locais que serão armazenados em cache durante a instalação
const CACHE_ASSETS = [
  './',
  './index.html',
  './assets/css/main.css',
  './assets/js/main.js',
  './assets/img/favicon/favicon.ico',
  './assets/img/favicon/apple-touch-icon.png',
  './assets/img/favicon/favicon-16x16.png',
  './assets/img/favicon/favicon-32x32.png',
  './pages/privacy-policy.html',
  './pages/terms-of-service.html'
]

// Evento de instalação
self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto')
        return cache.addAll(CACHE_ASSETS).then(() => {
          return Promise.allSettled([
            cache.add(
              'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
            ),
            cache.add(
              'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'
            ),
            cache.add(
              'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
            ),
            cache.add(
              'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
            ),
            cache.add(
              'https://cdnjs.cloudflare.com/ajax/libs/chroma-js/2.4.2/chroma.min.js'
            )
          ])
        })
      })
      .catch(error => {
        console.error('Falha na instalação do cache:', error)
      })
      .then(() => self.skipWaiting())
  )
})

// Evento de ativação (limpa caches antigos)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .map(cacheName => {
              if (cacheName !== CACHE_NAME) {
                console.log('Removendo cache antigo:', cacheName)
                return caches.delete(cacheName)
              }
              return null // Evitar entradas undefined no array
            })
            .filter(Boolean) // Remove entradas nulas do array
        )
      })
      .then(() => {
        console.log('Service Worker ativado, reivindicando clientes')
        return self.clients.claim()
      })
      .catch(error => {
        console.error('Erro durante ativação do Service Worker:', error)
      })
  )
})

// Estratégia de cache: Cache First, falling back to Network
self.addEventListener('fetch', event => {
  // Ignorar requisições de API, extensões do navegador ou chamadas não-GET
  if (
    event.request.url.includes('/api/') ||
    event.request.method !== 'GET' ||
    event.request.url.startsWith('chrome-extension://') ||
    event.request.url.includes('extension') ||
    // Ignorar recursos que podem causar problemas de CORS
    event.request.url.includes('fonts.googleapis.com') ||
    event.request.url.includes('fonts.gstatic.com')
  ) {
    return
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      // Retorna do cache se encontrado
      if (response) {
        return response
      }

      // Caso contrário, faz a requisição para a rede
      return fetch(event.request)
        .then(networkResponse => {
          // Se a resposta for válida, armazena no cache para uso futuro
          if (networkResponse && networkResponse.status === 200) {
            // Só armazena em cache recursos do mesmo domínio ou CDNs específicos
            if (
              networkResponse.type === 'basic' ||
              event.request.url.includes('cdn.jsdelivr.net') ||
              event.request.url.includes('cdnjs.cloudflare.com')
            ) {
              const responseToCache = networkResponse.clone()
              caches
                .open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache)
                })
                .catch(err => console.log('Erro ao armazenar no cache:', err))
            }
          }

          return networkResponse
        })
        .catch(error => {
          console.log('Falha ao recuperar o recurso:', error)

          // Para recursos específicos como imagens ou fontes, retornar fallback
          if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
            return caches.match('./assets/img/favicon/favicon-32x32.png')
          }

          // Retorna uma resposta de erro se nada mais funcionar
          return new Response('Recurso não disponível offline', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          })
        })
    })
  )
})

// Evento de sincronização em segundo plano
self.addEventListener('sync', event => {
  if (event.tag === 'save-palette') {
    event.waitUntil(savePendingPalettes())
  }
})

// Função para salvar paletas pendentes quando a conexão for restaurada
async function savePendingPalettes() {
  // Implementação para sincronizar paletas salvas offline com o servidor
  // Será usada quando você integrar algum backend
  console.log('Sincronizando paletas pendentes')
}

// Evento para notificações push
self.addEventListener('push', event => {
  const data = event.data.json()

  const options = {
    body: data.body || 'Nova atualização disponível!',
    icon: '/assets/img/favicon/android-chrome-192x192.png',
    badge: '/assets/img/favicon/favicon-32x32.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'ColorStrap', options)
  )
})

// Evento de clique na notificação
self.addEventListener('notificationclick', event => {
  event.notification.close()
  event.waitUntil(clients.openWindow(event.notification.data.url))
})
