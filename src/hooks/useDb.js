import { useState, useEffect, useCallback } from 'react'
import { isSupabaseConfigured } from '../lib/supabase'

export function useDb(fetchFn, mockData) {
  const hasDb = isSupabaseConfigured()
  const initialData = hasDb ? (Array.isArray(mockData) ? [] : mockData) : mockData
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(hasDb)
  const [error, setError] = useState(null)
  const [isRemote, setIsRemote] = useState(false)

  const load = useCallback(async () => {
    if (!hasDb) return
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFn()
      if (result !== null) {
        setData(result)
        setIsRemote(true)
      } else {
        setData(mockData)
        setError('Failed to load data from server')
      }
    } catch (e) {
      console.warn('DB fetch failed, using mock data:', e)
      setData(mockData)
      setError(e.message || 'Unexpected error loading data')
    }
    setLoading(false)
  }, [fetchFn, hasDb, mockData])

  useEffect(() => { load() }, [load])

  return [data, setData, { loading, error, isRemote, reload: load }]
}
