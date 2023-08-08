export enum EGender {
  female = 0,
  male = 1,
}

export interface IEmployeeDb {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: string;
  gender: number;
  position: string;
  hasDriverLicense: number;
  departmentId: number;
}
