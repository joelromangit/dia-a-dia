// Force update: skip waiting and claim all clients immediately
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Clear any old caches
      caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key))))
    ])
  )
})

let alarmTimeout = null

self.addEventListener('message', (event) => {
  const { type, goalMs, startTime } = event.data

  if (type === 'START_SLEEP_ALARM') {
    if (alarmTimeout) clearTimeout(alarmTimeout)

    const alreadyElapsed = Date.now() - startTime
    const remaining = goalMs - alreadyElapsed

    if (remaining <= 0) {
      showAlarm()
    } else {
      alarmTimeout = setTimeout(() => showAlarm(), remaining)
    }
  }

  if (type === 'CANCEL_SLEEP_ALARM') {
    if (alarmTimeout) clearTimeout(alarmTimeout)
    alarmTimeout = null
  }
})

function showAlarm() {
  self.registration.showNotification('Grindset - Objetivo cumplido', {
    body: 'Has alcanzado tu objetivo de sueno. Quieres parar el crono?',
    icon: '/favicon.svg',
    tag: 'sleep-alarm',
    requireInteraction: true,
    actions: [
      { action: 'wake', title: 'Despertar' },
      { action: 'dismiss', title: 'Seguir durmiendo' }
    ]
  })
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'wake') {
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
        // Update localStorage to signal the app to stop
        // We can't access localStorage from SW, so we post a message to all clients
        for (const client of clients) {
          client.postMessage({ type: 'WAKE_UP' })
        }
        // Focus or open the app
        if (clients.length > 0) {
          clients[0].focus()
        } else {
          self.clients.openWindow('/sleep')
        }
      })
    )
  }
})
