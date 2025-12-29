import { MobileMenu } from "./mobile-menu"
import { getBlogTags } from "@/actions/blog"

interface MobileMenuDataProps {
  selectedTags: string[]
  tocItems?: { id: string; title: string; level: number }[]
}

export async function MobileMenuData({ selectedTags, tocItems = [] }: MobileMenuDataProps) {
  const tags = await getBlogTags()

  return (
    <MobileMenu
      tocItems={tocItems}
      tags={tags}
      selectedTags={selectedTags}
    />
  )
}
