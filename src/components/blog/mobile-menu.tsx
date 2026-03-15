"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { BlogSidebarContent } from "./blog-sidebar-content"
import { ThemeToggle } from "@/components/blog/ThemeToggle"

interface Tag {
  name: string
  count: number
}

interface TocItem {
  id: string
  title: string
  level: number
}

interface MobileMenuProps {
  tocItems: TocItem[]
  tags: Tag[]
  selectedTags?: string[]
}

export function MobileMenu({ tocItems, tags, selectedTags = [] }: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">メニューを開く</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[400px] overflow-y-auto flex flex-col">
        <SheetHeader>
          <SheetTitle>メニュー</SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex-1 overflow-y-auto">
          <BlogSidebarContent tocItems={tocItems} tags={tags} selectedTags={selectedTags} onLinkClick={() => setOpen(false)} />
        </div>
        <div className="py-4 border-t border-border mt-auto">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">テーマ</span>
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
