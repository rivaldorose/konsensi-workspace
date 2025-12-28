'use client'

import type { App } from '@/types'

interface DetailsTabProps {
  app: App
}

export function DetailsTab({ app }: DetailsTabProps) {
  const techStack = app.tech_stack || {}

  return (
    <div className="space-y-6">
      {/* Tech Stack */}
      <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-gray-200 dark:border-white/10 p-6">
        <h3 className="text-lg font-bold text-[#131b0d] dark:text-white mb-4">Tech Stack</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techStack.frontend && techStack.frontend.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Frontend</h4>
              <div className="flex flex-wrap gap-2">
                {techStack.frontend.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
          {techStack.backend && techStack.backend.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Backend</h4>
              <div className="flex flex-wrap gap-2">
                {techStack.backend.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
          {techStack.hosting && techStack.hosting.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Hosting</h4>
              <div className="flex flex-wrap gap-2">
                {techStack.hosting.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
          {techStack.integrations && techStack.integrations.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Integrations</h4>
              <div className="flex flex-wrap gap-2">
                {techStack.integrations.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        {(!techStack.frontend || techStack.frontend.length === 0) &&
         (!techStack.backend || techStack.backend.length === 0) &&
         (!techStack.hosting || techStack.hosting.length === 0) &&
         (!techStack.integrations || techStack.integrations.length === 0) && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No tech stack information available</p>
        )}
      </div>

      {/* Repository Info */}
      {app.github_url && (
        <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-gray-200 dark:border-white/10 p-6">
          <h3 className="text-lg font-bold text-[#131b0d] dark:text-white mb-4">Repository</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              <a
                href={app.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                {app.github_url}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Environment URLs */}
      <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-gray-200 dark:border-white/10 p-6">
        <h3 className="text-lg font-bold text-[#131b0d] dark:text-white mb-4">Environments</h3>
        <div className="space-y-3">
          {app.production_url && (
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="size-2 rounded-full bg-green-500"></span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Production</span>
              <a
                href={app.production_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-primary hover:underline text-sm"
              >
                {app.production_url}
              </a>
            </div>
          )}
          {app.staging_url && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="size-2 rounded-full bg-blue-500"></span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Staging</span>
              <a
                href={app.staging_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-primary hover:underline text-sm"
              >
                {app.staging_url}
              </a>
            </div>
          )}
          {app.development_url && (
            <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span className="size-2 rounded-full bg-yellow-500"></span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Development</span>
              <a
                href={app.development_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-primary hover:underline text-sm"
              >
                {app.development_url}
              </a>
            </div>
          )}
          {!app.production_url && !app.staging_url && !app.development_url && (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No environment URLs configured</p>
          )}
        </div>
      </div>
    </div>
  )
}

