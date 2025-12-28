import { Card } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Welcome Section */}
      <section className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-secondary tracking-tight">
            Hey, Alex! 👋
          </h2>
          <p className="text-text-muted mt-2 font-medium">
            Here&apos;s what&apos;s happening in your workspace today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center h-10 px-4 bg-white border border-gray-200 shadow-sm rounded-lg hover:bg-gray-50 transition-colors text-text-main font-bold text-sm">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
            </svg>
            <span>Oct 24, 2023</span>
          </button>
          <button className="flex items-center justify-center size-10 bg-white border border-gray-200 shadow-sm rounded-lg hover:bg-gray-50 transition-colors relative">
            <svg className="w-5 h-5 text-text-main" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Apps Overview */}
        <Card className="bg-card-light rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-full group hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" />
              </svg>
              +12%
            </span>
          </div>
          <div>
            <p className="text-text-muted text-sm font-semibold uppercase tracking-wide">Apps Overview</p>
            <h3 className="text-2xl font-extrabold text-secondary mt-1">12 Active</h3>
          </div>
        </Card>

        {/* Team Status */}
        <Card className="bg-card-light rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-full group hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary/20 text-secondary-light rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.076 13.308-5.076 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.24 0 1 1 0 01-1.415-1.415 5 5 0 017.07 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" />
              </svg>
            </div>
            <span className="text-secondary text-sm font-bold bg-gray-100 px-2 py-1 rounded-md">3/5 Online</span>
          </div>
          <div>
            <p className="text-text-muted text-sm font-semibold uppercase tracking-wide mb-2">Team Status</p>
            <div className="flex items-center -space-x-2">
              <div className="relative hover:z-10 transition-transform hover:scale-110">
                <div 
                  className="size-8 rounded-full border-2 border-white bg-cover bg-center"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDfqo9fuwRYS9tMEw1ptmicGBOzGmpkxmfy28jAZVivJS3E2lYUrpuV6F1kFpby0a_Ci8wuvpI3EbwowVDAM5IhpUkgNCNDbRddfO2-TgKN8uIV_AL2GzIt1l2eMzDvVzjMhGsNDoB7sXRMyt3xvwIX7CHp5OrvL4HVbdIe4_WUDmBiju-OuS9kwvSegdyQu72eyCebvTQH0ZulNHqWcUDWFUxI3AWdw5N2G3e9wIdfSocpQ2MsRbP-fN-TrytV69BXRk7_F8W2Pta7")' }}
                ></div>
                <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-green-400"></span>
              </div>
              <div className="relative hover:z-10 transition-transform hover:scale-110">
                <div 
                  className="size-8 rounded-full border-2 border-white bg-cover bg-center"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBaP9_i-jCRATbv_oEwTVBycaPTdqIw794Au3mgWs7MaL4oyJkTpxeKEJSj_rhiIujR2yaQ-G6Y0Nc9Lyb12XK3gVrIl_txzGIsQ0NeiZyiiIeVS9Bw9EGMzRTWiMtXc6VCJAhtxLBtVHC6VYNT4gBUY-QIhQWU7PeI-rOgynyxQTgpBEZsw9EXWSFpebS6AQ29ZV3JnNK0MqUZMPa54_T2NV_jOCIwIof8jJjq2dXGY8-WbhHWVoQ8We2t1Tc9Oo1F7Yo5bp8sUSTZ")' }}
                ></div>
                <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-green-400"></span>
              </div>
              <div className="relative hover:z-10 transition-transform hover:scale-110">
                <div 
                  className="size-8 rounded-full border-2 border-white bg-cover bg-center"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBrppcrXQHOTCBI9BWh5BNgA7nA8gBvcqm4NyZXtGzlwlj_MV9_BJM7qvS4uyowhg6DKssSmSnSPAdTc8cMH39tB26fudUCG1BovGver-DoJNfLatsykHi01gDir7pCzFIoTPpKOwGYhcLb3tSJD4T19fqEcLNptrpiessw-AzweB5r4pLF0g4iEECiizyfOiUZ6imdiITMJNUP-oGhTVzfnMPaeRpwIgP2wmUFnSZYOyxWvi63KhKN2SkGZvxivOzZb-hTJSyDfl0Y")' }}
                ></div>
                <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-gray-300"></span>
              </div>
              <div className="flex items-center justify-center size-8 rounded-full border-2 border-white bg-gray-100 text-[10px] font-bold text-gray-500 hover:bg-gray-200 cursor-pointer">
                +2
              </div>
            </div>
          </div>
        </Card>

        {/* Partners */}
        <Card className="bg-card-light rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-full group hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <button className="text-xs font-bold text-primary-dark hover:text-secondary hover:underline">View</button>
          </div>
          <div>
            <p className="text-text-muted text-sm font-semibold uppercase tracking-wide">Partners</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-extrabold text-secondary">8</h3>
              <p className="text-xs text-text-muted font-medium">Active projects</p>
            </div>
          </div>
        </Card>

        {/* Goals Progress */}
        <Card className="bg-card-light rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-full group hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-gray-500">Q4</span>
          </div>
          <div>
            <div className="flex justify-between items-end mb-1">
              <p className="text-text-muted text-sm font-semibold uppercase tracking-wide">Goals Progress</p>
              <span className="text-sm font-bold text-secondary">75%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </Card>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Priorities & To Do */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Prioriteiten Deze Week */}
          <Card className="bg-card-light rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-dark" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                Priorities This Week
              </h3>
              <div className="flex gap-2">
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-600">Week 43</span>
                <button className="text-sm font-semibold text-primary-dark hover:text-secondary transition-colors">Manage</button>
              </div>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {/* Completed Task */}
              <label className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 hover:border-primary/30 cursor-pointer transition-all group shadow-sm">
                <div className="mt-1 relative flex items-center justify-center">
                  <input 
                    checked 
                    className="peer appearance-none h-6 w-6 border-2 border-gray-300 rounded-md checked:bg-primary checked:border-primary focus:ring-primary transition-colors cursor-pointer" 
                    type="checkbox"
                    readOnly
                  />
                  <svg className="absolute w-4 h-4 text-secondary opacity-0 peer-checked:opacity-100 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-gray-400 line-through group-hover:text-gray-500">Finalize Client Proposal</span>
                    <span className="text-[10px] uppercase font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">Completed</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">Review with Sarah before sending.</p>
                </div>
              </label>

              {/* High Priority Task */}
              <label className="flex items-start gap-4 p-4 rounded-xl border border-l-4 border-l-orange-400 border-gray-100 hover:bg-gray-50 cursor-pointer transition-all group shadow-sm bg-white">
                <div className="mt-1 relative flex items-center justify-center">
                  <input 
                    className="peer appearance-none h-6 w-6 border-2 border-gray-300 rounded-md checked:bg-primary checked:border-primary focus:ring-primary transition-colors cursor-pointer" 
                    type="checkbox"
                  />
                  <svg className="absolute w-4 h-4 text-secondary opacity-0 peer-checked:opacity-100 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-secondary group-hover:text-secondary-light">Review Monthly Budget</span>
                    <span className="text-[10px] uppercase font-bold text-orange-700 bg-orange-100 px-2 py-1 rounded-full">High Priority</span>
                  </div>
                  <p className="text-sm text-text-muted mt-1">Analyze Q3 spending and adjust for Q4.</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                      </svg>
                      <span>Due tomorrow</span>
                    </div>
                    <div className="flex -space-x-2">
                      <img alt="User" className="w-6 h-6 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8E5FueIrJ0MTi4tRlgfat3Xfl8VvXl3Hvbyd0CHc-IBJSgXhF-QXTHa5lU95eCfZzvu7T7MxVllK8f8lFhx1j1ugE9SCg4mLVNK4bDOE-LA1GRy9lGFccZBaOxs7FS0_yAjN0v0xnKiz0U0dtjfq_rbOu0QH5tGATxomLo5Zh8Qmt-PbNghe8ksMEpIN5Wnv-Jdod7toE-kEYiSicERAUDtuZAKMKzL-Oyn4vVAvMHA55cr48bDTU3Vb6XAJsf0oM9-jRAkDlK0kM" />
                      <img alt="User" className="w-6 h-6 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKUaa4P43K0NIvAmy1Qj3S-P3WgppmNYpv4I66irfkyP23bhmVuAjoM_hm0nX8cdXOHcZvtTbUuKal33z2AsTJO9J9mk5g63NT2kjoAh4nob92_7IOZkSYWljEnS4y9-DpRAw3jgyAVt5IRTg4wkE9yUkS_GW_fHVenjNl4ezHbhXMhXRW86J_OOLAeh1-lWlm9cjj3g_Xn_k_WiteL_5QMtrOj6XSZjaCQZiVed7FLDk_gaWQVrMucs8qPVQlXU4h5PCBJ8IRUkCW" />
                    </div>
                  </div>
                </div>
              </label>

              {/* Medium Priority Task */}
              <label className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-all group shadow-sm">
                <div className="mt-1 relative flex items-center justify-center">
                  <input 
                    className="peer appearance-none h-6 w-6 border-2 border-gray-300 rounded-md checked:bg-primary checked:border-primary focus:ring-primary transition-colors cursor-pointer" 
                    type="checkbox"
                  />
                  <svg className="absolute w-4 h-4 text-secondary opacity-0 peer-checked:opacity-100 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-secondary group-hover:text-secondary-light">Prepare Team Sync Deck</span>
                    <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-full">Medium</span>
                  </div>
                  <p className="text-sm text-text-muted mt-1">Include updates on the new CRM integration.</p>
                </div>
              </label>

              <button className="mt-2 w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm font-bold text-gray-500 hover:text-secondary hover:border-secondary hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
                Add New Priority
              </button>
            </div>
          </Card>

          {/* To Do Today */}
          <Card className="bg-card-light rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-dark" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                </svg>
                To Do Today
              </h3>
              <span className="text-sm font-medium text-gray-500">3 tasks remaining</span>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                  <button className="text-gray-400 hover:text-primary-dark transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" />
                    </svg>
                  </button>
                  <span className="text-sm font-medium text-secondary flex-1">Call with Vendor regarding API access</span>
                  <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded border border-gray-200">2:00 PM</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                  <button className="text-gray-400 hover:text-primary-dark transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" />
                    </svg>
                  </button>
                  <span className="text-sm font-medium text-secondary flex-1">Approve vacation requests</span>
                  <div className="flex items-center">
                    <span className="size-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-[10px] font-bold">HR</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                  <button className="text-gray-400 hover:text-primary-dark transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" />
                    </svg>
                  </button>
                  <span className="text-sm font-medium text-secondary flex-1">Update license keys for dev team</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Recent Activity & Upcoming */}
        <section className="lg:col-span-1 flex flex-col gap-6">
          {/* Recent Activity */}
          <Card className="bg-card-light rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-base font-bold text-secondary flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-dark" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                </svg>
                Recent Activity
              </h3>
              <button className="text-xs font-semibold text-gray-400 hover:text-secondary transition-colors">View all</button>
            </div>
            <div className="p-5 flex-1">
              <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                <div className="relative group">
                  <div className="absolute -left-[21px] bg-card-light p-1">
                    <div className="size-2.5 rounded-full bg-primary ring-4 ring-white group-hover:ring-gray-50 transition-all"></div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs font-bold text-secondary leading-tight">
                      Sarah uploaded <span className="text-primary-dark cursor-pointer hover:underline">Q3_Report.pdf</span>
                    </p>
                    <span className="text-[10px] font-medium text-gray-400">10:00 AM • Financial Review</span>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute -left-[21px] bg-card-light p-1">
                    <div className="size-2.5 rounded-full bg-blue-400 ring-4 ring-white group-hover:ring-gray-50 transition-all"></div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs font-bold text-secondary leading-tight">
                      Mike completed <span className="text-secondary-light">Homepage Hero</span>
                    </p>
                    <span className="text-[10px] font-medium text-gray-400">09:30 AM • Website Redesign</span>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute -left-[21px] bg-card-light p-1">
                    <div className="size-2.5 rounded-full bg-gray-300 ring-4 ring-white group-hover:ring-gray-50 transition-all"></div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs font-bold text-secondary leading-tight">
                      New lead: <span className="font-bold">Emma</span> assigned
                    </p>
                    <span className="text-[10px] font-medium text-gray-400">Yesterday • CRM System</span>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute -left-[21px] bg-card-light p-1">
                    <div className="size-2.5 rounded-full bg-orange-300 ring-4 ring-white group-hover:ring-gray-50 transition-all"></div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs font-bold text-secondary leading-tight">Team meeting: Q4 Strategy</p>
                    <span className="text-[10px] font-medium text-gray-400">Oct 22 • Calendar</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-auto border-t border-gray-100 p-5 bg-gray-50 rounded-b-xl">
              <p className="text-xs font-bold text-text-muted uppercase mb-3">Quick Actions</p>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm transition-all text-secondary">
                  <svg className="w-6 h-6 mb-1 text-primary-dark" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span className="text-[10px] font-bold">New Project</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm transition-all text-secondary">
                  <svg className="w-6 h-6 mb-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  <span className="text-[10px] font-bold">Invite Member</span>
                </button>
              </div>
            </div>
          </Card>

          {/* Upcoming Event */}
          <div className="bg-secondary rounded-xl p-5 shadow-sm text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"></path>
              </svg>
            </div>
            <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">Upcoming</p>
            <h4 className="text-lg font-bold mb-3">Weekly Team Sync</h4>
            <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
              </svg>
              <span>Friday, 10:00 AM</span>
            </div>
            <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors">View Calendar</button>
          </div>
        </section>
      </div>
    </div>
  )
}
