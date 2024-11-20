'use client';

import { getTasks } from '@/actions/task/controller';
import { AddTaskButton } from '@/components/add-task-button';
import { TaskCard } from '@/components/task-card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SortOptions, getSortedTasks } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { ArrowDownUp } from 'lucide-react';
import { useState } from 'react';

const SortSelect = ({
  value,
  onValueChange,
}: {
  value: SortOptions;
  onValueChange: (value: SortOptions) => void;
}) => {
  return (
    <Select
      value={value}
      onValueChange={(val) => onValueChange(val as SortOptions)}
    >
      <SelectTrigger
        showArrow={false}
        className="justify-center w-full sm:w-auto"
      >
        <ArrowDownUp className="mr-2 h-4 w-4" />
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort By</SelectLabel>
          {Object.values(SortOptions).map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default function AllPage() {
  const [sort, setSort] = useState<SortOptions>(SortOptions.CREATED_ASC);

  const { data, isLoading } = useQuery({
    queryFn: getTasks,
    queryKey: ['tasks'],
  });

  const tasks = getSortedTasks(data || [], sort);

  return (
    <>
      <header className="mb-4">
        <h1 className="text-xl font-semibold text-center">All tasks</h1>
      </header>

      <div className="mb-4">
        <SortSelect value={sort} onValueChange={setSort} />
      </div>

      {tasks.length === 0 && (
        <div className="text-center font-medium flex items-center justify-center h-full">
          You don&apos;t have any tasks yet. Try adding a new task.
        </div>
      )}

      <div className="flex-grow overflow-y-auto space-y-2 p-px pb-4">
        {isLoading && <div>Loading...</div>}

        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        <AddTaskButton
          className="fixed bottom-20 right-8 h-10"
          defaultDueDate={new Date()}
        />
      </div>
    </>
  );
}
