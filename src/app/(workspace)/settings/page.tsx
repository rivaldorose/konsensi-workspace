'use client'

import { useState, useEffect } from 'react'
import { useCurrentUser, useUsers, useUpdateUser } from '@/hooks/useUsers'

export default function SettingsPage() {
  const { data: currentUser } = useCurrentUser()
  const { data: allUsers } = useUsers()

  const [activeTab, setActiveTab] = useState('profile')
  const [profileData, setProfileData] = useState({
    full_name: currentUser?.full_name || '',
    email: currentUser?.email || '',
    job_title: '',
    phone: '',
    timezone: 'Pacific Time (US & Canada)',
    language: 'English (United States)',
  })

  const [theme, setTheme] = useState('light')
  const [accentColor, setAccentColor] = useState('#65da0b')
  const [density, setDensity] = useState('normal')

  // Update form when user data loads
  useEffect(() => {
    if (currentUser) {
      setProfileData((prev) => ({
        ...prev,
        full_name: currentUser.full_name || '',
        email: currentUser.email || '',
      }))
    }
  }, [currentUser])

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'team', label: 'Team' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'appearance', label: 'Appearance' },
  ]

  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  // Scroll spy to update active tab based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = tabs.map(tab => ({
        id: tab.id,
        element: document.getElementById(tab.id)
      }))

      const scrollPosition = window.scrollY + 200 // offset for navbar + tabs

      for (const section of sections) {
        if (section.element) {
          const offsetTop = section.element.offsetTop
          const offsetBottom = offsetTop + section.element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveTab(section.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const updateUserMutation = useUpdateUser()

  const handleSaveProfile = async () => {
    if (!currentUser || updateUserMutation.isPending) return
    
    try {
      await updateUserMutation.mutateAsync({
        id: currentUser.id,
        full_name: profileData.full_name,
        email: profileData.email,
      })
      // Success message - you can replace this with a toast notification
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('Failed to update profile. Please try again.')
    }
  }

  return (
    <div className="flex-1 pt-16">
      {/* Settings Header */}
      <div className="bg-white dark:bg-[#1f2b15] border-b border-gray-200 dark:border-white/5 px-8 py-6">
        <h1 className="text-3xl font-bold text-[#131d0c] dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your workspace preferences and settings
        </p>
      </div>

      {/* Sticky Tabs Navigation */}
      <div className="sticky top-16 z-40 bg-white dark:bg-[#1f2b15] border-b border-gray-200 dark:border-white/5 px-8">
        <nav className="flex gap-6 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-[#131d0c] dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Scrollable Content */}
      <div className="px-8 py-8 space-y-12 scroll-smooth">
        {/* Profile Section */}
        <section id="profile" className="scroll-mt-32">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-bold text-[#131c0d] dark:text-white">Profile Settings</h2>
              <p className="text-[#6d9c49]">Manage your personal details and account preferences.</p>
            </div>

            {/* Avatar Row */}
            <div className="flex items-center gap-6 p-6 bg-surface-light dark:bg-surface-dark rounded-xl border border-[#ecf4e7] dark:border-[#2a3820] shadow-sm">
              <div className="relative group">
                {currentUser?.avatar_url ? (
                  <div
                    className="size-20 rounded-full bg-cover bg-center border-2 border-white dark:border-[#2a3820] shadow-sm"
                    style={{ backgroundImage: `url("${currentUser.avatar_url}")` }}
                  />
                ) : (
                  <div className="size-20 rounded-full bg-primary/20 flex items-center justify-center border-2 border-white dark:border-[#2a3820] shadow-sm">
                    <span className="text-2xl font-bold text-primary">
                      {currentUser?.full_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <svg className="w-4.5 h-4.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-bold text-[#131c0d] dark:text-white">Profile Photo</h3>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-background-light dark:bg-background-dark hover:bg-[#ecf4e7] dark:hover:bg-[#2a3820] border border-[#ecf4e7] dark:border-[#2a3820] rounded-lg text-sm font-bold text-[#131c0d] dark:text-white transition-colors">
                    Upload new
                  </button>
                  <button className="px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg text-sm font-medium transition-colors">
                    Remove
                  </button>
                </div>
                <p className="text-xs text-[#6d9c49] mt-1">JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-[#131c0d] dark:text-white">Full Name</span>
                <input
                  className="w-full h-11 px-4 rounded-lg border-[#ecf4e7] dark:border-[#2a3820] bg-surface-light dark:bg-surface-dark text-[#131c0d] dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-[#6d9c49]"
                  type="text"
                  value={profileData.full_name}
                  onChange={(e) => handleProfileChange('full_name', e.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-[#131c0d] dark:text-white">Email Address</span>
                <input
                  className="w-full h-11 px-4 rounded-lg border-[#ecf4e7] dark:border-[#2a3820] bg-surface-light dark:bg-surface-dark text-[#131c0d] dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-[#6d9c49]"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-[#131c0d] dark:text-white">Job Title</span>
                <input
                  className="w-full h-11 px-4 rounded-lg border-[#ecf4e7] dark:border-[#2a3820] bg-surface-light dark:bg-surface-dark text-[#131c0d] dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-[#6d9c49]"
                  type="text"
                  value={profileData.job_title}
                  onChange={(e) => handleProfileChange('job_title', e.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-[#131c0d] dark:text-white">Phone Number</span>
                <input
                  className="w-full h-11 px-4 rounded-lg border-[#ecf4e7] dark:border-[#2a3820] bg-surface-light dark:bg-surface-dark text-[#131c0d] dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-[#6d9c49]"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-[#131c0d] dark:text-white">Time Zone</span>
                <div className="relative">
                  <select
                    className="w-full h-11 pl-4 pr-10 rounded-lg border-[#ecf4e7] dark:border-[#2a3820] bg-surface-light dark:bg-surface-dark text-[#131c0d] dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                    value={profileData.timezone}
                    onChange={(e) => handleProfileChange('timezone', e.target.value)}
                  >
                    <option>Pacific Time (US &amp; Canada)</option>
                    <option>Eastern Time (US &amp; Canada)</option>
                    <option>GMT (London)</option>
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6d9c49] pointer-events-none"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    />
                  </svg>
                </div>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-[#131c0d] dark:text-white">Language</span>
                <div className="relative">
                  <select
                    className="w-full h-11 pl-4 pr-10 rounded-lg border-[#ecf4e7] dark:border-[#2a3820] bg-surface-light dark:bg-surface-dark text-[#131c0d] dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                    value={profileData.language}
                    onChange={(e) => handleProfileChange('language', e.target.value)}
                  >
                    <option>English (United States)</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6d9c49] pointer-events-none"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    />
                  </svg>
                </div>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#ecf4e7] dark:border-[#2a3820] mt-2">
              <button className="px-6 py-2.5 rounded-lg text-sm font-bold text-[#131c0d] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={updateUserMutation.isPending || !currentUser}
                className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-md shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="scroll-mt-32">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-[#131c0d] dark:text-white">Team Management</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-surface-light dark:bg-surface-dark border border-[#ecf4e7] dark:border-[#2a3820] rounded-lg text-sm font-bold shadow-sm hover:shadow-md transition-shadow">
                  <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                  </svg>
                  Invite Member
                </button>
              </div>
              <p className="text-[#6d9c49]">Manage team members and permissions.</p>
            </div>

            {/* Active Members List */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#ecf4e7] dark:border-[#2a3820] overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-[#ecf4e7] dark:border-[#2a3820] bg-background-light/50 dark:bg-white/5">
                <h3 className="text-sm font-bold text-[#131c0d] dark:text-white uppercase tracking-wider">
                  Active Members
                </h3>
              </div>

              {allUsers?.slice(0, 2).map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border-b border-[#ecf4e7] dark:border-[#2a3820] hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors last:border-b-0"
                >
                  <div className="flex items-center gap-4">
                    {user.avatar_url ? (
                      <div
                        className="size-10 rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url("${user.avatar_url}")` }}
                      />
                    ) : (
                      <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          {user.full_name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-[#131c0d] dark:text-white">
                        {user.full_name}
                        {index === 0 && ' (You)'}
                      </p>
                      <p className="text-xs text-[#6d9c49]">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        index === 0
                          ? 'bg-primary/20 text-green-800 dark:text-green-300'
                          : 'bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {index === 0 ? 'Admin' : 'Member'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`size-2 rounded-full ${index === 0 ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                      ></div>
                      <span className="text-xs font-medium text-[#6d9c49]">
                        {index === 0 ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    <button className="size-8 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[#6d9c49]">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pending Invitations */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#ecf4e7] dark:border-[#2a3820] overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-[#ecf4e7] dark:border-[#2a3820] bg-background-light/50 dark:bg-white/5">
                <h3 className="text-sm font-bold text-[#131c0d] dark:text-white uppercase tracking-wider">
                  Pending Invitations
                </h3>
              </div>
              <div className="flex flex-wrap md:flex-nowrap items-center justify-between p-4 gap-4">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#131c0d] dark:text-white">alex.rivers@example.com</p>
                    <p className="text-xs text-[#6d9c49]">Sent 2 days ago</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs font-bold text-[#131c0d] dark:text-white border border-[#ecf4e7] dark:border-[#2a3820] rounded-lg hover:bg-background-light dark:hover:bg-white/5 transition-colors">
                    Resend
                  </button>
                  <button className="px-3 py-1.5 text-xs font-bold text-red-500 border border-transparent hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors">
                    Revoke
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Integrations Section */}
        <section id="integrations" className="scroll-mt-32">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold text-[#131c0d] dark:text-white">Integrations</h2>
              <p className="text-[#6d9c49]">Connect your favorite tools to Konsensi.</p>
            </div>

            {/* Connected */}
            <h3 className="text-sm font-bold text-[#131c0d] dark:text-white mt-2">Connected Apps</h3>
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#ecf4e7] dark:border-[#2a3820] p-1">
              {/* Slack */}
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="size-10 flex items-center justify-center rounded-lg bg-white shadow-sm border border-gray-100">
                    <div className="size-6 bg-purple-500 rounded"></div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#131c0d] dark:text-white">Slack</p>
                    <p className="text-xs text-[#6d9c49]">Connected to #general</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-xs font-bold text-[#6d9c49] hover:text-[#131c0d] dark:hover:text-white transition-colors">
                    Configure
                  </button>
                  <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer shadow-inner">
                    <div className="absolute right-1 top-1 size-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
              </div>
              <div className="h-px bg-[#ecf4e7] dark:bg-[#2a3820] mx-4"></div>
              {/* Google */}
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="size-10 flex items-center justify-center rounded-lg bg-white shadow-sm border border-gray-100">
                    <div className="size-6 bg-blue-500 rounded"></div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#131c0d] dark:text-white">Google Calendar</p>
                    <p className="text-xs text-[#6d9c49]">Syncing events</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-xs font-bold text-[#6d9c49] hover:text-[#131c0d] dark:hover:text-white transition-colors">
                    Configure
                  </button>
                  <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer shadow-inner">
                    <div className="absolute right-1 top-1 size-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Available */}
            <h3 className="text-sm font-bold text-[#131c0d] dark:text-white mt-2">Available Integrations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* GitHub */}
              <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-[#ecf4e7] dark:border-[#2a3820] hover:shadow-md transition-shadow flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="size-10 flex items-center justify-center rounded-lg bg-white shadow-sm border border-gray-100">
                    <div className="size-6 bg-gray-800 rounded"></div>
                  </div>
                  <button className="px-3 py-1.5 bg-background-light dark:bg-white/10 rounded-lg text-xs font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors text-[#131c0d] dark:text-white">
                    Add
                  </button>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#131c0d] dark:text-white">GitHub</h4>
                  <p className="text-xs text-[#6d9c49] mt-1 line-clamp-2">
                    Link pull requests to your tasks and automate status updates.
                  </p>
                </div>
              </div>

              {/* Figma */}
              <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-[#ecf4e7] dark:border-[#2a3820] hover:shadow-md transition-shadow flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="size-10 flex items-center justify-center rounded-lg bg-white shadow-sm border border-gray-100">
                    <div className="size-6 bg-purple-600 rounded"></div>
                  </div>
                  <button className="px-3 py-1.5 bg-background-light dark:bg-white/10 rounded-lg text-xs font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors text-[#131c0d] dark:text-white">
                    Add
                  </button>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#131c0d] dark:text-white">Figma</h4>
                  <p className="text-xs text-[#6d9c49] mt-1 line-clamp-2">
                    Embed design files and get comments directly in the workspace.
                  </p>
                </div>
              </div>

              {/* Trello */}
              <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-[#ecf4e7] dark:border-[#2a3820] hover:shadow-md transition-shadow flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="size-10 flex items-center justify-center rounded-lg bg-white shadow-sm border border-gray-100">
                    <div className="size-6 bg-blue-400 rounded"></div>
                  </div>
                  <button className="px-3 py-1.5 bg-background-light dark:bg-white/10 rounded-lg text-xs font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors text-[#131c0d] dark:text-white">
                    Add
                  </button>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#131c0d] dark:text-white">Trello</h4>
                  <p className="text-xs text-[#6d9c49] mt-1 line-clamp-2">Import cards and sync boards two-way.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Appearance Section */}
        <section id="appearance" className="scroll-mt-32">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <h2 className="text-2xl font-bold text-[#131c0d] dark:text-white">Appearance</h2>
                <button className="text-sm font-bold text-[#6d9c49] hover:text-primary transition-colors">
                  Reset to Defaults
                </button>
              </div>
              <p className="text-[#6d9c49]">Customize your interface experience.</p>
            </div>

            {/* Theme Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="cursor-pointer group">
                <input
                  className="peer hidden"
                  name="theme"
                  type="radio"
                  value="light"
                  checked={theme === 'light'}
                  onChange={(e) => setTheme(e.target.value)}
                />
                <div className="aspect-video bg-gray-100 rounded-lg border-2 border-transparent peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary/20 flex flex-col items-center justify-center gap-2 group-hover:bg-gray-200 transition-all relative overflow-hidden">
                  <div className="w-3/4 h-3/4 bg-white shadow-sm rounded flex flex-col p-2 gap-2">
                    <div className="w-full h-2 bg-gray-200 rounded-sm"></div>
                    <div className="flex gap-2">
                      <div className="w-1/4 h-12 bg-gray-100 rounded-sm"></div>
                      <div className="w-3/4 h-12 bg-gray-50 rounded-sm"></div>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm font-bold mt-2 text-[#131c0d] dark:text-white">Light</p>
              </label>

              <label className="cursor-pointer group">
                <input
                  className="peer hidden"
                  name="theme"
                  type="radio"
                  value="dark"
                  checked={theme === 'dark'}
                  onChange={(e) => setTheme(e.target.value)}
                />
                <div className="aspect-video bg-gray-900 rounded-lg border-2 border-transparent peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary/20 flex flex-col items-center justify-center gap-2 group-hover:bg-gray-800 transition-all relative overflow-hidden">
                  <div className="w-3/4 h-3/4 bg-gray-800 shadow-sm rounded flex flex-col p-2 gap-2">
                    <div className="w-full h-2 bg-gray-700 rounded-sm"></div>
                    <div className="flex gap-2">
                      <div className="w-1/4 h-12 bg-gray-700 rounded-sm"></div>
                      <div className="w-3/4 h-12 bg-gray-600 rounded-sm"></div>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm font-bold mt-2 text-[#131c0d] dark:text-white">Dark</p>
              </label>

              <label className="cursor-pointer group">
                <input
                  className="peer hidden"
                  name="theme"
                  type="radio"
                  value="auto"
                  checked={theme === 'auto'}
                  onChange={(e) => setTheme(e.target.value)}
                />
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-900 rounded-lg border-2 border-transparent peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary/20 flex flex-col items-center justify-center gap-2 transition-all relative overflow-hidden">
                  <div className="w-3/4 h-3/4 bg-white/10 backdrop-blur-sm shadow-sm rounded flex items-center justify-center border border-white/20">
                    <svg className="w-12 h-12 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                    </svg>
                  </div>
                </div>
                <p className="text-center text-sm font-bold mt-2 text-[#131c0d] dark:text-white">Auto</p>
              </label>
            </div>

            {/* Accent Color */}
            <div className="flex flex-col gap-3 mt-2">
              <span className="text-sm font-bold text-[#131c0d] dark:text-white">Accent Color</span>
              <div className="flex gap-4">
                {[
                  { color: '#65da0b', isSelected: accentColor === '#65da0b' },
                  { color: '#3b82f6', isSelected: false },
                  { color: '#a855f7', isSelected: false },
                  { color: '#f97316', isSelected: false },
                ].map((item) => (
                  <button
                    key={item.color}
                    onClick={() => setAccentColor(item.color)}
                    className={`size-8 rounded-full transition-all ${
                      item.isSelected
                        ? 'ring-2 ring-offset-2 ring-primary ring-offset-background-light dark:ring-offset-background-dark'
                        : 'hover:ring-2 hover:ring-offset-2 hover:ring-offset-background-light dark:hover:ring-offset-background-dark'
                    }`}
                    style={{ backgroundColor: item.color }}
                  ></button>
                ))}
              </div>
            </div>

            {/* Density */}
            <div className="flex flex-col gap-3 mt-2">
              <span className="text-sm font-bold text-[#131c0d] dark:text-white">Density</span>
              <div className="flex p-1 bg-surface-light dark:bg-surface-dark border border-[#ecf4e7] dark:border-[#2a3820] rounded-lg w-fit">
                {['Comfortable', 'Normal', 'Compact'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDensity(d.toLowerCase())}
                    className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                      density === d.toLowerCase()
                        ? 'font-bold bg-background-light dark:bg-white/10 shadow-sm text-[#131c0d] dark:text-white'
                        : 'font-medium hover:bg-black/5 dark:hover:bg-white/10 text-[#6d9c49]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
