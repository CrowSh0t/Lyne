import { useRef, useState } from "react"

export interface PhotoSlotValue {
    file: File | null
    url: string | null // якщо картинка вставлена через URL (а не файл)
}

export default function PhotoButton({
    index,
    size,
    imgSrc,
    onImagesChange,
}: {
    index: number
    size: 'xlarge' | 'large' | 'small'
    imgSrc: string | string[]
    onImagesChange?: (values: PhotoSlotValue[]) => void
}) {
    const slotsCount = Array.isArray(imgSrc) ? Math.max(imgSrc.length, 1) : 1

    const [previews, setPreviews] = useState<(string | null)[]>(Array(slotsCount).fill(null))
    const [images, setImages] = useState<(File | null)[]>(Array(slotsCount).fill(null))
    const [urls, setUrls] = useState<(string | null)[]>(Array(slotsCount).fill(null))
    const [showUrlInput, setShowUrlInput] = useState<number | null>(null)
    const [urlValue, setUrlValue] = useState('')

    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

    const getIconSrc = (idx: number) => Array.isArray(imgSrc) ? (imgSrc[idx] ?? imgSrc[0] ?? '') : imgSrc

    const notifyParent = (newImages: (File | null)[], newUrls: (string | null)[]) => {
        onImagesChange?.(
            newImages.map((file, i) => ({ file, url: newUrls[i] }))
        )
    }

    const handleImageChange = (idx: number, file: File | null) => {
        if (!file) return

        const newImages = [...images]
        newImages[idx] = file
        setImages(newImages)

        const newUrls = [...urls]
        newUrls[idx] = null
        setUrls(newUrls)

        const newPreviews = [...previews]
        newPreviews[idx] = URL.createObjectURL(file)
        setPreviews(newPreviews)

        notifyParent(newImages, newUrls)
    }

    const handleUrlSubmit = (idx: number) => {
        if (!urlValue.trim()) return
        const trimmed = urlValue.trim()

        const newImages = [...images]
        newImages[idx] = null
        setImages(newImages)

        const newUrls = [...urls]
        newUrls[idx] = trimmed
        setUrls(newUrls)

        const newPreviews = [...previews]
        newPreviews[idx] = trimmed
        setPreviews(newPreviews)

        setUrlValue('')
        setShowUrlInput(null)
        notifyParent(newImages, newUrls)
    }

    const handleImageClick = (idx: number) => {
        fileInputRefs.current[idx]?.click()
    }

    return (
        <div className="flex flex-row flex-wrap gap-4">
            {previews.map((preview, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                    <input
                        type="file"
                        accept="image/*"
                        ref={el => { fileInputRefs.current[idx] = el }}
                        className="hidden"
                        onChange={e => handleImageChange(idx, e.target.files?.[0] ?? null)}
                    />
                    <button
                        type="button"
                        onClick={() => handleImageClick(idx)}
                        className={`border border-gray-200 outline-none rounded-lg overflow-hidden relative flex items-center justify-center bg-gray-50
                        ${size === 'xlarge' ? 'w-[520px]-[400px]' : size === 'large' ? 'w-[520px] h-[260px]' : 'w-[130px] h-[130px]'}`}
                        style={preview
                            ? { backgroundImage: `url(${preview})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                            : {}
                        }
                    >
                        {!preview && (
                            <img
                                src={getIconSrc(idx)}
                                alt=""
                                width={size === 'xlarge' ? 96 : size === 'large' ? 64 : 40}
                                height={size === 'xlarge' ? 96 : size === 'large' ? 64 : 40}
                            />
                        )}
                    </button>

                    {idx === 0 && (
                        showUrlInput === idx ? (
                            <div className="flex flex-row gap-2">
                                <input
                                    type="text"
                                    placeholder="Paste image URL..."
                                    value={urlValue}
                                    onChange={(e) => setUrlValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit(idx)}
                                    className="flex-1 bg-gray-100 border-none outline-none px-3 py-2 rounded text-sm"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => handleUrlSubmit(idx)}
                                    className="px-3 py-2 bg-black text-white text-sm rounded"
                                >
                                    OK
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowUrlInput(idx)}
                                className="text-sm text-gray-400 underline text-left"
                            >
                                Or paste image URL
                            </button>
                        )
                    )}
                </div>
            ))}
        </div>
    )
}