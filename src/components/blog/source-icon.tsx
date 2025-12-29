import { SiZenn, SiQiita, SiNotion } from "react-icons/si"
import { cn } from "@/lib/utils"

interface SourceIconProps {
  source?: string
  className?: string
  size?: number
}

export function SourceIcon({ source, className, size = 16 }: SourceIconProps) {
  const iconClassName = cn("flex-shrink-0", className)

  switch (source?.toLowerCase()) {
    case 'zenn':
      return <SiZenn className={iconClassName} size={size} />
    case 'qiita':
      return <SiQiita className={iconClassName} size={size} />
    case 'notion':
      return <SiNotion className={iconClassName} size={size} />
    default:
      return null
  }
}

