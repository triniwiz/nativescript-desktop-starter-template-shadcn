import * as React from 'react';
import { cn } from '@/lib/utils';

/** The platform's own activity indicator; color it with text-* classes. */
function Spinner({ className, ...props }: React.ComponentProps<'div'>) {
  return <activityindicator busy className={cn('size-4 text-foreground', className)} {...props} />;
}

export { Spinner };
