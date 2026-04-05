export async function sendWhatsAppNotification(message) {
  const phone = import.meta.env.VITE_CALLMEBOT_PHONE
  const apikey = import.meta.env.VITE_CALLMEBOT_APIKEY
  if (!phone || !apikey) {
    console.warn('CallMeBot not configured: missing VITE_CALLMEBOT_PHONE or VITE_CALLMEBOT_APIKEY')
    return false
  }

  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(apikey)}`

  try {
    const res = await fetch(url)
    return res.ok
  } catch (err) {
    console.error('WhatsApp notification failed:', err)
    return false
  }
}

export async function sendStudentWhatsApp(message) {
  const phone = import.meta.env.VITE_STUDENT_CALLMEBOT_PHONE
  const apikey = import.meta.env.VITE_STUDENT_CALLMEBOT_APIKEY
  if (!phone || !apikey) {
    console.warn('Student CallMeBot not configured')
    return false
  }

  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(apikey)}`

  try {
    const res = await fetch(url)
    return res.ok
  } catch (err) {
    console.error('Student WhatsApp notification failed:', err)
    return false
  }
}
