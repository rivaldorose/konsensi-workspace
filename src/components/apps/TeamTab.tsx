'use client'

import { useAppTeam } from '@/hooks/useApps'

interface TeamTabProps {
  appId: string
}

export function TeamTab({ appId }: TeamTabProps) {
  const { data: teamMembers = [], isLoading } = useAppTeam(appId)

  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'owner':
        return {
          label: 'Owner',
          className: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800'
        }
      case 'admin':
        return {
          label: 'Admin',
          className: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800'
        }
      default:
        return {
          label: 'Member',
          className: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900/40 dark:text-slate-300 dark:border-slate-800'
        }
    }
  }

  return (
    <div className="space-y-6">
      {/* Team Members Grid */}
      <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-gray-200 dark:border-white/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#131b0d] dark:text-white">Team Members</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-[#60d60b] text-[#131b0d] rounded-lg font-bold text-sm transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
            </svg>
            Add Member
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-gray-400">Loading team members...</div>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-12">
            <div className="size-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-2">No team members yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Add team members to collaborate on this app</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => {
              const roleConfig = getRoleConfig(member.role)
              const user = member.user
              
              return (
                <div
                  key={member.id}
                  className="p-4 border border-gray-200 dark:border-white/10 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3 mb-3">
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.full_name}
                        className="size-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#131b0d] dark:text-white truncate">
                        {user?.full_name || 'Unknown User'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {user?.email || 'No email'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded text-xs font-semibold border ${roleConfig.className}`}>
                      {roleConfig.label}
                    </span>
                    <div className="flex gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-primary transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Permissions Table */}
      <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-gray-200 dark:border-white/10 p-6">
        <h3 className="text-lg font-bold text-[#131b0d] dark:text-white mb-4">Permissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Permission</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Owner</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Admin</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Member</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {[
                { name: 'View App', owner: true, admin: true, member: true },
                { name: 'Edit App', owner: true, admin: true, member: false },
                { name: 'Delete App', owner: true, admin: false, member: false },
                { name: 'Manage Team', owner: true, admin: true, member: false },
                { name: 'View Analytics', owner: true, admin: true, member: true }
              ].map((permission, index) => (
                <tr key={index}>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{permission.name}</td>
                  <td className="py-3 px-4 text-center">
                    {permission.owner ? (
                      <svg className="w-5 h-5 text-primary inline-block" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-300 inline-block" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                      </svg>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {permission.admin ? (
                      <svg className="w-5 h-5 text-primary inline-block" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-300 inline-block" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                      </svg>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {permission.member ? (
                      <svg className="w-5 h-5 text-primary inline-block" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-300 inline-block" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                      </svg>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

