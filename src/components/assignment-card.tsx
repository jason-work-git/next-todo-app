'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Assignment, Task } from '@prisma/client';
import { UserIcon } from 'lucide-react';
import { Check, X, MoreHorizontal } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format, isToday, isYesterday } from 'date-fns';

const formatDate = (date: Date) => {
  if (isToday(date)) {
    return format(date, 'h:mm a');
  }
  if (isYesterday(date)) {
    return `Yesterday, ${format(date, 'h:mm a')}`;
  }
  return format(date, 'MMM d, h:mm a');
};

interface Info {
  assignmentId: Assignment['id'];
  timeSent: Date;
  taskInfo: Pick<Task, 'title' | 'description'>;
  owner: {
    name: string;
    email: string;
  };
  accepted: boolean | null;
}

interface Props {
  info: Info;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

export function AssignmentCard({ info, onAccept, onDecline }: Props) {
  const { accepted, owner, timeSent, taskInfo, assignmentId } = info;
  const { title, description } = taskInfo;

  const hasReacted = accepted !== null;

  const accept = () => onAccept(assignmentId);
  const decline = () => onDecline(assignmentId);

  return (
    <Card className="w-full min-w-60">
      <CardContent className="p-4">
        <CardTitle
          className="text-lg font-semibold text-foreground mb-1 truncate"
          title={title}
        >
          {title}
        </CardTitle>
        {description && (
          <CardDescription
            className="text-sm text-muted-foreground mb-2 line-clamp-2"
            title={description}
          >
            {description}
          </CardDescription>
        )}
        <div className="flex gap-2 flex-wrap justify-between items-center text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <UserIcon />
            <span className="flex flex-col gap-1">
              {owner.name}
              <br />
              {owner.email}
            </span>
          </div>
          <span>{formatDate(timeSent)}</span>
        </div>
        <div className="flex justify-between items-center">
          {hasReacted ? (
            <>
              <span
                className={`text-sm font-medium ${accepted ? 'text-green-500' : 'text-destructive'}`}
              >
                {info.accepted === true ? 'Accepted' : 'Declined'}
              </span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={accept}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Accept
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={decline}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Decline
                  </Button>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <div className="flex flex-wrap justify-end w-full gap-2">
              <Button
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={decline}
              >
                <X className="w-3 h-3" />
                Decline
              </Button>
              <Button className="flex-1 sm:flex-none" onClick={accept}>
                <Check className="w-3 h-3" />
                Accept
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
