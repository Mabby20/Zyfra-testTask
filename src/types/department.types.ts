export interface IDepartmentDb {
  id: number;
  name: string;
  description: string | null;
  parentId: number | null;
}
