import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlogNavigationProps {
  previousPost?: {
    title: string;
    href: string;
  };
  nextPost?: {
    title: string;
    href: string;
  };
}

export function BlogNavigation({
  previousPost,
  nextPost,
}: BlogNavigationProps) {
  return (
    <nav className="flex flex-col sm:flex-row sm:items-stretch sm:justify-between gap-4 mt-12 pt-8 border-t border-border">
      {previousPost ? (
        <Button
          variant="outline"
          asChild
          className="flex-1 h-auto py-4 px-4 justify-start gap-3 whitespace-normal"
        >
          <a href={previousPost.href}>
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted flex-shrink-0">
              <ChevronLeft className="h-4 w-4" />
            </span>
            <span className="text-left min-w-0 flex-1">
              <span className="block text-xs text-muted-foreground mb-1">前の記事</span>
              <span className="block text-sm font-medium line-clamp-2">
                {previousPost.title}
              </span>
            </span>
          </a>
        </Button>
      ) : (
        <div className="hidden sm:block sm:flex-1" />
      )}

      {nextPost ? (
        <Button
          variant="outline"
          asChild
          className="flex-1 h-auto py-4 px-4 justify-start sm:justify-end gap-3 whitespace-normal sm:flex-row-reverse"
        >
          <a href={nextPost.href}>
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted flex-shrink-0">
              <ChevronRight className="h-4 w-4" />
            </span>
            <span className="text-left sm:text-right min-w-0 flex-1">
              <span className="block text-xs text-muted-foreground mb-1">次の記事</span>
              <span className="block text-sm font-medium line-clamp-2">
                {nextPost.title}
              </span>
            </span>
          </a>
        </Button>
      ) : (
        <div className="hidden sm:block sm:flex-1" />
      )}
    </nav>
  );
}
