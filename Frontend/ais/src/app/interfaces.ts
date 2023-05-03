
export interface User {
    Id: number;
    FirstName: string;
    LastName: string;
    Email: string;
    PasswordHash: string;
    IsTeacher: boolean;
}

export interface TreeNode<T> {
    data: T;
    children?: TreeNode<T>[];
    expanded?: boolean;
}
  
  export interface FSEntry {
    name: string;
    size: string;
    kind: string;
    items?: number;
}

export interface ResponseCamunda {
    id: string;
    links?: any[];
    definitionId?: string;
    businessKey?: string;
    caseInstanceId?: string;
    ended?: boolean;
    suspended?: boolean;
    tenantId?: string;
  }

export interface FSEntrySubjects {
    subjectName: string;
    subjectCode: string;
    teacher: string;
}

export interface FSEntryGrades {
    subject: string;
    grade: number;
    description: string;
    teacher: string;
    date: string;
    isFinal: boolean;
  }

export interface DecodedToken {
  user: string;
}