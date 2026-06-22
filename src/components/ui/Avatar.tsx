import { User } from 'lucide-react'

type AvatarProps = {
  src?: string | null
  name?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-lg',
}

export default function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name || ''}
        className={`${sizes[size]} rounded-full object-cover ${className}`}
      />
    )
  }

  const initials = name
    ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : null

  return (
    <div className={`${sizes[size]} rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold ${className}`}>
      {initials || <User size={size === 'lg' ? 24 : size === 'md' ? 18 : 14} />}
    </div>
  )
}
