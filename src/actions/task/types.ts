export type AddTaskParams = {
  title: string;
  description?: string;
};

export type UpdateTaskParams = {
  id: string;
  title: string;
  description?: string;
};

export type DeleteTaskParams = {
  id: string;
};

export type ToggleTaskParams = {
  id: string;
};
