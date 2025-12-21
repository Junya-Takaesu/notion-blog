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
    <nav className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-12 pt-8 border-t border-border">
      {previousPost ? (
        <Button
          variant="ghost"
          asChild
          className="flex-1 justify-start h-auto py-4 w-full sm:w-auto min-w-0"
        >
          <a
            href={previousPost.href}
            className="flex items-start gap-2 min-w-0"
          >
            <ChevronLeft className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="text-left min-w-0 flex-1">
              <div className="text-xs text-muted-foreground mb-1">前の記事</div>
              <div className="text-sm font-medium whitespace-normal">
                {previousPost.title}
              </div>
            </div>
          </a>
        </Button>
      ) : (
        <div className="hidden sm:block sm:flex-1" />
      )}

      {nextPost ? (
        <Button
          variant="ghost"
          asChild
          className="flex-1 justify-start sm:justify-end h-auto py-4 w-full sm:w-auto min-w-0"
        >
          <a href={nextPost.href} className="flex items-start gap-2 min-w-0">
            <div className="text-left sm:text-right min-w-0 flex-1">
              <div className="text-xs text-muted-foreground mb-1">次の記事</div>
              <div className="text-sm font-medium whitespace-normal">
                {nextPost.title}
              </div>
            </div>
            <ChevronRight className="h-5 w-5 mt-0.5 flex-shrink-0 sm:hidden" />
            <ChevronRight className="hidden sm:block h-5 w-5 mt-0.5 flex-shrink-0" />
          </a>
        </Button>
      ) : (
        <div className="hidden sm:block sm:flex-1" />
      )}
    </nav>
  );
}
