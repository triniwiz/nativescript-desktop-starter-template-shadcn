import * as React from 'react';
import { cn } from '@/lib/utils';

/** MasonKit's <scroll>, styled like shadcn's ScrollArea (native scrollbars). */
function ScrollArea({ className, ...props }: React.ComponentProps<'div'>) {
  return <scroll className={cn('relative', className)} {...(props as any)} />;
}

export { ScrollArea };
