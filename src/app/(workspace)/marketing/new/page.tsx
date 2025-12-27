'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateMarketingPost } from '@/hooks/useMarketing'

export default function NewMarketingPostPage() {
  const router = useRouter()
  const createPost = useCreateMarketingPost()

  // Form state
  const [platforms, setPlatforms] = useState<string[]>(['instagram'])
  const [postType, setPostType] = useState('single')
  const [mediaUrl, setMediaUrl] = useState<string>('')
  const [caption, setCaption] = useState('Excited to announce our new summer collection launching next week! ☀️ #SummerVibes #NewArrivals')
  const [campaign, setCampaign] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [firstComment, setFirstComment] = useState('')
  const [scheduleType, setScheduleType] = useState('now')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('10:00')
  const [requiresApproval, setRequiresApproval] = useState(true)
  const [approvers, setApprovers] = useState<string[]>(['sarah'])
  const [previewPlatform, setPreviewPlatform] = useState('instagram')

  const handlePlatformToggle = (platform: string) => {
    setPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const handleClose = () => {
    router.back()
  }

  const handleSaveDraft = async () => {
    try {
      await createPost.mutateAsync({
        title: caption.substring(0, 100) || 'Untitled Post',
        caption,
        status: 'draft',
        platforms,
        media_url: mediaUrl,
        scheduled_date: scheduleType === 'later' ? scheduleDate : undefined,
        scheduled_time: scheduleType === 'later' ? scheduleTime : undefined,
        approval_required: requiresApproval,
      })
      router.push('/marketing')
    } catch (error) {
      console.error('Error saving draft:', error)
      alert('Failed to save draft. Please try again.')
    }
  }

  const handleSubmit = async () => {
    if (platforms.length === 0) {
      alert('Please select at least one platform')
      return
    }

    try {
      await createPost.mutateAsync({
        title: caption.substring(0, 100) || 'Untitled Post',
        caption,
        status: requiresApproval ? 'pending_review' : scheduleType === 'later' ? 'scheduled' : 'published',
        platforms,
        media_url: mediaUrl,
        scheduled_date: scheduleType === 'later' ? scheduleDate : undefined,
        scheduled_time: scheduleType === 'later' ? scheduleTime : undefined,
        approval_required: requiresApproval,
      })
      router.push('/marketing')
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post. Please try again.')
    }
  }

  const captionLength = caption.length
  const maxLength = 2200

  return (
    <>
      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"></div>

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[1200px] h-[90vh] bg-white dark:bg-[#232e1a] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#e2e8f0] dark:border-[#34402b]">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0] dark:border-[#34402b] shrink-0">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Create Social Media Post
            </h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Main Content (2 Columns) */}
          <div className="flex flex-1 overflow-hidden">
            
            {/* LEFT COLUMN: Form Inputs */}
            <div className="w-full lg:w-7/12 overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-8">
              
              {/* Platforms */}
              <section>
                <label className="block text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">
                  Platforms <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: 'instagram', icon: 'photo_camera', label: 'Instagram' },
                    { id: 'linkedin', icon: 'work', label: 'LinkedIn' },
                    { id: 'twitter', icon: 'raven', label: 'Twitter/X' },
                    { id: 'facebook', icon: 'public', label: 'Facebook' },
                  ].map((platform) => (
                    <label
                      key={platform.id}
                      className={`group relative flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-2 transition-all ${
                        platforms.includes(platform.id)
                          ? 'border-primary bg-primary/10 text-green-800 dark:text-green-300'
                          : 'border-[#e2e8f0] dark:border-[#34402b] bg-[#f7f8f6] dark:bg-[#182210] hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={platforms.includes(platform.id)}
                        onChange={() => handlePlatformToggle(platform.id)}
                      />
                      <span className="material-symbols-outlined text-[20px]">{platform.icon}</span>
                      <span className="text-sm font-medium">{platform.label}</span>
                    </label>
                  ))}
                </div>
              </section>

              {/* Post Type */}
              <section>
                <label className="block text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">
                  Post Type
                </label>
                <div className="flex w-full rounded-xl bg-[#f7f8f6] dark:bg-[#182210] p-1">
                  {['single', 'carousel', 'video', 'story'].map((type) => (
                    <label key={type} className="flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name="post_type"
                        value={type}
                        className="sr-only peer"
                        checked={postType === type}
                        onChange={(e) => setPostType(e.target.value)}
                      />
                      <div className="flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-all peer-checked:bg-white dark:peer-checked:bg-slate-700 peer-checked:text-slate-900 dark:peer-checked:text-white peer-checked:shadow-sm text-slate-500 dark:text-slate-400">
                        {type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1')} Post
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              {/* Media Upload */}
              <section>
                <label className="block text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">
                  Media Upload
                </label>
                <div
                  className="border-2 border-dashed border-[#e2e8f0] dark:border-[#34402b] rounded-xl p-8 flex flex-col items-center justify-center text-center bg-[#f7f8f6]/50 dark:bg-[#182210]/50 hover:bg-[#f7f8f6] dark:hover:bg-[#182210] transition-colors cursor-pointer group"
                  onClick={() => {
                    // TODO: Implement file upload
                    alert('File upload coming soon')
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">cloud_upload</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    SVG, PNG, JPG or GIF (max. 800x400px)
                  </p>
                  <p className="text-xs text-primary mt-2 font-medium">
                    Recommended size: 1080x1080px (1:1)
                  </p>
                </div>

                {/* Uploaded File Preview */}
                {mediaUrl && (
                  <div className="mt-4 flex items-center gap-3 p-3 bg-[#f7f8f6] dark:bg-[#182210] rounded-lg border border-[#e2e8f0] dark:border-[#34402b]">
                    <img
                      className="w-12 h-12 rounded-md object-cover"
                      src={mediaUrl}
                      alt="Uploaded media"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-slate-900 dark:text-white">
                        {mediaUrl.split('/').pop()}
                      </p>
                      <p className="text-xs text-slate-500">Uploaded</p>
                    </div>
                    <button
                      onClick={() => setMediaUrl('')}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                )}
              </section>

              {/* Caption */}
              <section>
                <div className="flex justify-between items-end mb-3">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Caption
                  </label>
                  <span className="text-xs text-slate-500">
                    {captionLength} / {maxLength}
                  </span>
                </div>
                <div className="relative border border-[#e2e8f0] dark:border-[#34402b] rounded-xl bg-[#f7f8f6] dark:bg-[#182210] focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-1 dark:focus-within:ring-offset-[#232e1a] transition-all">
                  {/* Toolbar */}
                  <div className="flex items-center gap-1 p-2 border-b border-[#e2e8f0] dark:border-[#34402b]">
                    <button className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300" title="Bold">
                      <span className="material-symbols-outlined text-[18px]">format_bold</span>
                    </button>
                    <button className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300" title="Italic">
                      <span className="material-symbols-outlined text-[18px]">format_italic</span>
                    </button>
                    <button className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300" title="Underline">
                      <span className="material-symbols-outlined text-[18px]">format_underlined</span>
                    </button>
                    <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                    <button className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300" title="Emoji">
                      <span className="material-symbols-outlined text-[18px]">sentiment_satisfied</span>
                    </button>
                    <button className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300" title="Hashtag">
                      #
                    </button>
                    <button className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300" title="Mention">
                      @
                    </button>
                    <button className="ml-auto flex items-center gap-1 p-1.5 rounded bg-primary/20 text-green-900 dark:text-green-100 text-xs font-medium px-2">
                      <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                      Generate AI
                    </button>
                  </div>
                  <textarea
                    className="w-full bg-transparent border-none p-3 focus:ring-0 text-sm resize-y text-slate-900 dark:text-white"
                    placeholder="Write your caption here..."
                    rows={5}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    maxLength={maxLength}
                  />
                </div>
              </section>

              {/* Mentions & Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    Campaign
                  </label>
                  <select
                    className="w-full rounded-lg border-[#e2e8f0] dark:border-[#34402b] bg-[#f7f8f6] dark:bg-[#182210] text-sm focus:border-primary focus:ring-primary text-slate-900 dark:text-white"
                    value={campaign}
                    onChange={(e) => setCampaign(e.target.value)}
                  >
                    <option value="">Select campaign...</option>
                    <option value="summer-2024">Summer Launch 2024</option>
                    <option value="brand-awareness-q2">Brand Awareness Q2</option>
                    <option value="employee-spotlight">Employee Spotlight</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    Internal Tags
                  </label>
                  <input
                    className="w-full rounded-lg border-[#e2e8f0] dark:border-[#34402b] bg-[#f7f8f6] dark:bg-[#182210] text-sm focus:border-primary focus:ring-primary text-slate-900 dark:text-white"
                    placeholder="Type and press enter..."
                    type="text"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        setTags([...tags, e.currentTarget.value])
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                </div>
              </div>

              {/* First Comment */}
              <section>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  First Comment <span className="text-xs font-normal text-slate-500">(Optional)</span>
                </label>
                <textarea
                  className="w-full rounded-lg border-[#e2e8f0] dark:border-[#34402b] bg-[#f7f8f6] dark:bg-[#182210] text-sm focus:border-primary focus:ring-primary text-slate-900 dark:text-white"
                  placeholder="Add hashtags or links here..."
                  rows={2}
                  value={firstComment}
                  onChange={(e) => setFirstComment(e.target.value)}
                />
              </section>

              {/* Scheduling */}
              <section className="bg-[#f7f8f6] dark:bg-[#182210] p-4 rounded-xl border border-[#e2e8f0] dark:border-[#34402b]">
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="schedule_type"
                      className="text-primary focus:ring-primary"
                      checked={scheduleType === 'now'}
                      onChange={() => setScheduleType('now')}
                    />
                    <span className="text-sm font-medium">Post Now</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="schedule_type"
                      className="text-primary focus:ring-primary"
                      checked={scheduleType === 'later'}
                      onChange={() => setScheduleType('later')}
                    />
                    <span className="text-sm font-medium">Schedule for Later</span>
                  </label>
                </div>
                {scheduleType === 'later' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1 block">Date</label>
                      <input
                        className="w-full rounded-lg border-[#e2e8f0] dark:border-[#34402b] bg-white dark:bg-slate-800 text-sm focus:border-primary focus:ring-primary text-slate-900 dark:text-white"
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <label className="text-xs font-medium text-slate-500 mb-1 block">Time</label>
                        <span className="text-[10px] flex items-center gap-1 text-green-700 dark:text-green-300 bg-primary/20 px-1.5 rounded-full">
                          <span className="material-symbols-outlined text-[10px]">insights</span>
                          Best: 10:00 AM
                        </span>
                      </div>
                      <input
                        className="w-full rounded-lg border-[#e2e8f0] dark:border-[#34402b] bg-white dark:bg-slate-800 text-sm focus:border-primary focus:ring-primary text-slate-900 dark:text-white"
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </section>

              {/* Approval Workflow */}
              <section className="flex items-center justify-between p-4 bg-[#f7f8f6] dark:bg-[#182210] rounded-xl border border-[#e2e8f0] dark:border-[#34402b]">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Requires Approval?
                  </h4>
                  <p className="text-xs text-slate-500">Send to team lead before publishing</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center cursor-pointer relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={requiresApproval}
                      onChange={(e) => setRequiresApproval(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>
              </section>

              {requiresApproval && (
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    Approvers
                  </label>
                  <div className="flex flex-wrap gap-2 p-2 border border-[#e2e8f0] dark:border-[#34402b] rounded-lg bg-[#f7f8f6] dark:bg-[#182210] min-h-[42px]">
                    {approvers.map((approver) => (
                      <div key={approver} className="flex items-center gap-1 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-xs font-medium">
                        <div className="w-4 h-4 rounded-full bg-primary/20"></div>
                        Sarah Jenkins
                        <button
                          onClick={() => setApprovers(approvers.filter(a => a !== approver))}
                          className="hover:text-red-500"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </div>
                    ))}
                    <button
                      className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
                      onClick={() => setApprovers([...approvers, 'new'])}
                    >
                      <span className="material-symbols-outlined text-[14px]">add</span>
                      Add
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: Preview */}
            <div className="hidden lg:flex w-5/12 bg-slate-50 dark:bg-[#0f160a] border-l border-[#e2e8f0] dark:border-[#34402b] flex-col">
              
              {/* Preview Tabs */}
              <div className="flex items-center justify-center p-4 border-b border-[#e2e8f0] dark:border-[#34402b] bg-white dark:bg-[#232e1a]">
                <div className="flex gap-1 bg-[#f7f8f6] dark:bg-[#182210] p-1 rounded-lg">
                  {['instagram', 'linkedin', 'twitter'].map((platform) => (
                    <button
                      key={platform}
                      onClick={() => setPreviewPlatform(platform)}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                        previewPlatform === platform
                          ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                          : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone Mockup Container */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-slate-100 dark:from-[#131b0d] dark:via-[#0f160a] dark:to-[#0f160a]">
                
                {/* Phone Frame */}
                <div className="w-[340px] bg-white dark:bg-black rounded-[2rem] shadow-2xl border-[6px] border-slate-900 overflow-hidden relative">
                  
                  {/* Dynamic Island / Notch Area */}
                  <div className="h-7 w-full bg-slate-900 absolute top-0 left-0 z-20 flex justify-center">
                    <div className="h-4 w-24 bg-black rounded-b-xl"></div>
                  </div>

                  {/* Instagram UI Header */}
                  <div className="mt-8 px-4 py-2 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full border border-gray-200 bg-primary/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-900">K</span>
                      </div>
                      <span className="text-xs font-semibold dark:text-white">Konsensi_HQ</span>
                    </div>
                    <span className="material-symbols-outlined text-[18px] dark:text-white">more_horiz</span>
                  </div>

                  {/* Content Image */}
                  <div className="w-full aspect-square bg-slate-100 relative group overflow-hidden">
                    {mediaUrl ? (
                      <img className="w-full h-full object-cover" src={mediaUrl} alt="Post preview" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-blue-200">
                        <span className="material-symbols-outlined text-4xl text-slate-400">image</span>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-[10px]">person</span>
                      2
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="px-3 py-2 flex items-center justify-between">
                    <div className="flex gap-3">
                      <span className="material-symbols-outlined text-[22px] dark:text-white">favorite</span>
                      <span className="material-symbols-outlined text-[22px] dark:text-white">chat_bubble</span>
                      <span className="material-symbols-outlined text-[22px] dark:text-white">send</span>
                    </div>
                    <span className="material-symbols-outlined text-[22px] dark:text-white">bookmark</span>
                  </div>

                  {/* Caption & Comments */}
                  <div className="px-3 pb-6 text-xs space-y-1">
                    <p className="font-semibold dark:text-white">1,204 likes</p>
                    <p className="dark:text-slate-200">
                      <span className="font-semibold mr-1 dark:text-white">Konsensi_HQ</span>
                      {caption || 'Your caption will appear here...'}
                    </p>
                    <p className="text-slate-400 text-[10px] uppercase mt-1">2 hours ago</p>
                  </div>

                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#e2e8f0] dark:border-[#34402b] bg-white dark:bg-[#232e1a] shrink-0 z-10">
            <button
              onClick={handleClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveDraft}
                disabled={createPost.isPending}
                className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save as Draft
              </button>
              <button
                onClick={handleSubmit}
                disabled={createPost.isPending || platforms.length === 0}
                className="px-5 py-2.5 text-sm font-bold text-black bg-primary rounded-lg hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit for Approval
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

