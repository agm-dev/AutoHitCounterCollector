export function timeAgo(dateString: string | null) {
  if (!dateString) return "Sin datos"

  const date = new Date(dateString).getTime()
  const now = Date.now()
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60) return `${diff}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}