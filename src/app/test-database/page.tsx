'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestDatabasePage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [tables, setTables] = useState<string[]>([])

  useEffect(() => {
    async function testDatabase() {
      try {
        const supabase = createClient()
        
        // Test of de users tabel bestaat en bereikbaar is
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('count', { count: 'exact', head: true })
        
        if (usersError) {
          setStatus('error')
          setMessage(`❌ Error bij users tabel: ${usersError.message}`)
          return
        }

        // Test apps tabel
        const { error: appsError } = await supabase
          .from('apps')
          .select('count', { count: 'exact', head: true })
        
        if (appsError) {
          setStatus('error')
          setMessage(`❌ Error bij apps tabel: ${appsError.message}`)
          return
        }

        // Test partners tabel
        const { error: partnersError } = await supabase
          .from('partners')
          .select('count', { count: 'exact', head: true })
        
        if (partnersError) {
          setStatus('error')
          setMessage(`❌ Error bij partners tabel: ${partnersError.message}`)
          return
        }

        // Test events tabel
        const { error: eventsError } = await supabase
          .from('events')
          .select('count', { count: 'exact', head: true })
        
        if (eventsError) {
          setStatus('error')
          setMessage(`❌ Error bij events tabel: ${eventsError.message}`)
          return
        }

        // Test goals tabel
        const { error: goalsError } = await supabase
          .from('goals')
          .select('count', { count: 'exact', head: true })
        
        if (goalsError) {
          setStatus('error')
          setMessage(`❌ Error bij goals tabel: ${goalsError.message}`)
          return
        }

        setStatus('success')
        setMessage('✅ Alle tabellen zijn succesvol aangemaakt en bereikbaar!')
        setTables(['users', 'apps', 'partners', 'events', 'goals'])
      } catch (err) {
        setStatus('error')
        setMessage(`❌ Fout: ${err instanceof Error ? err.message : 'Onbekende fout'}`)
      }
    }

    testDatabase()
  }, [])

  return (
    <div className="min-h-screen bg-grey-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-secondary-500 mb-4">
          Database Schema Test
        </h1>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-grey-600 mb-2">Status:</p>
            <div className={`p-4 rounded-md ${
              status === 'loading' ? 'bg-grey-100' :
              status === 'success' ? 'bg-success/10 text-success' :
              'bg-error/10 text-error'
            }`}>
              {status === 'loading' && '⏳ Database testen...'}
              {status === 'success' && message}
              {status === 'error' && message}
            </div>
          </div>

          {tables.length > 0 && (
            <div>
              <p className="text-sm text-grey-600 mb-2">Aangemaakte Tabellen:</p>
              <div className="grid grid-cols-2 gap-2">
                {tables.map((table) => (
                  <div key={table} className="bg-grey-100 p-3 rounded-md text-sm font-mono">
                    ✓ {table}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-grey-200 space-y-2">
            <p className="text-sm text-grey-600">
              <strong>Volgende stappen:</strong>
            </p>
            <ul className="text-sm text-grey-600 list-disc list-inside space-y-1">
              <li>Maak een account aan via Supabase Auth</li>
              <li>Test de database connectie via deze pagina</li>
              <li>Begin met het bouwen van features</li>
            </ul>
          </div>

          <div className="pt-4 border-t border-grey-200">
            <a 
              href="/" 
              className="block text-center text-primary-500 hover:text-primary-900 underline"
            >
              Terug naar Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

