export interface TaskInterface {
  id: number;
  title: string;
  completed: boolean;
}

export interface FetchedTaskInterface {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}
