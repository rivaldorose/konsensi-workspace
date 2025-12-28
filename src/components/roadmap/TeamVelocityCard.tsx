'use client'

export function TeamVelocityCard() {
  // Mock data - in real app, this would come from sprint/velocity data
  const velocityData = [8, 11, 9, 14, 13, 17]
  const maxVelocity = Math.max(...velocityData)
  const latestVelocity = velocityData[velocityData.length - 1]
  const trend = '+12%' // Calculate from previous data

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#dae8ce] dark:border-[#334025] p-5 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-[#131c0d] dark:text-white text-sm">Team Velocity</h3>
        <div className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" />
          </svg>
          {trend}
        </div>
      </div>

      <p className="text-2xl font-black text-[#131c0d] dark:text-white mb-4">
        {latestVelocity} <span className="text-sm font-medium text-gray-500">pts / sprint</span>
      </p>

      <div className="flex items-end gap-1 h-16">
        {velocityData.map((value, idx) => {
          const height = (value / maxVelocity) * 100
          const opacity = ((idx + 1) / velocityData.length) * 0.8 + 0.2
          return (
            <div
              key={idx}
              className="flex-1 bg-primary rounded-t"
              style={{
                height: `${height}%`,
                opacity: opacity,
              }}
            ></div>
          )
        })}
      </div>
    </div>
  )
}
