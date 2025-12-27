'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestSupabasePage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient()
        
        // Test de verbinding door een simpele query te doen
        const { data, error } = await supabase.from('_prisma_migrations').select('*').limit(1)
        
        if (error) {
          // Dit is normaal als de tabel niet bestaat, maar het betekent wel dat we verbonden zijn
          if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
            setStatus('success')
            setMessage('✅ Supabase verbinding werkt! (Tabel bestaat niet, maar connectie is OK)')
          } else {
            setStatus('error')
            setMessage(`❌ Error: ${error.message}`)
          }
        } else {
          setStatus('success')
          setMessage('✅ Supabase verbinding werkt perfect!')
        }
      } catch (err) {
        setStatus('error')
        setMessage(`❌ Fout: ${err instanceof Error ? err.message : 'Onbekende fout'}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-grey-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-secondary-500 mb-4">
          Supabase Verbinding Test
        </h1>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-grey-600 mb-2">Status:</p>
            <div className={`p-4 rounded-md ${
              status === 'loading' ? 'bg-grey-100' :
              status === 'success' ? 'bg-success/10 text-success' :
              'bg-error/10 text-error'
            }`}>
              {status === 'loading' && '⏳ Verbinden...'}
              {status === 'success' && message}
              {status === 'error' && message}
            </div>
          </div>

          <div>
            <p className="text-sm text-grey-600 mb-2">Configuratie:</p>
            <div className="text-xs bg-grey-100 p-3 rounded-md font-mono">
              <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Geconfigureerd' : '❌ Niet geconfigureerd'}</p>
              <p>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Geconfigureerd' : '❌ Niet geconfigureerd'}</p>
            </div>
          </div>

          <a 
            href="/" 
            className="block text-center text-primary-500 hover:text-primary-900 underline"
          >
            Terug naar Home
          </a>
        </div>
      </div>
    </div>
  )
}

