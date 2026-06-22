'use client'

import { useState, useCallback } from 'react'
import { Upload, X, ImageIcon } from 'lucide-react'
import { validateImageFile, MAX_IMAGES_PER_LISTING } from '@/lib/utils/upload'

type ImageUploaderProps = {
  listingId: string
  existingImages?: { id: string; imageUrl: string }[]
  onUploadComplete?: () => void
}

export default function ImageUploader({ listingId, existingImages = [], onUploadComplete }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState(existingImages)

  const remaining = MAX_IMAGES_PER_LISTING - images.length

  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setError('')

    const fileArray = Array.from(files).slice(0, remaining)
    for (const file of fileArray) {
      const v = validateImageFile(file)
      if (!v.valid) { setError(v.error!); return }
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('listingId', listingId)
      fileArray.forEach(f => formData.append('images', f))

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) { setError(data.error); return }

      setImages(prev => [...prev, ...data.images])
      onUploadComplete?.()
    } catch {
      setError('Greška pri uploadu slika.')
    } finally {
      setUploading(false)
    }
  }, [listingId, remaining, onUploadComplete])

  const handleDelete = async (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId))
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Slike ({images.length}/{MAX_IMAGES_PER_LISTING})
      </label>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
              <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleDelete(img.id)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {remaining > 0 && (
        <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
          uploading ? 'border-primary-400 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}>
          {uploading ? (
            <div className="flex items-center gap-2 text-primary-600">
              <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">Otpremanje...</span>
            </div>
          ) : (
            <>
              <Upload size={24} className="text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-600">Dodajte slike</span>
              <span className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — maks. 5MB — još {remaining}</span>
            </>
          )}
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={uploading}
            onChange={(e) => handleUpload(e.target.files)}
          />
        </label>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
