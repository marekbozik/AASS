
export interface User {
    Id: number;
    FirstName: string;
    LastName: string;
    Email: string;
    PasswordHash: string;
    IsTeacher: boolean;
}

interface TreeNode<T> {
    data: T;
    children?: TreeNode<T>[];
    expanded?: boolean;
}
  
  interface FSEntry {
    name: string;
    size: string;
    kind: string;
    items?: number;
}
