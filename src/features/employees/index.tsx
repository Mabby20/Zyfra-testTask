import {FC} from 'react';
import EmployeeToolbar from './components/EmployeeToolbar.tsx'
import EmployeeTable from './components/EmployeeTable.tsx'
import {IDepartmentDb} from "@/types/department.types.ts";

interface EmployeesProps {
  focusedDepartment: IDepartmentDb | null;
}

const Employees: FC<EmployeesProps> = ({focusedDepartment}) => {

  return (
    <>
      <EmployeeToolbar
        focusedDepartment={focusedDepartment}
      />
      <EmployeeTable
        focusedDepartment={focusedDepartment}
      />
    </>
  )
};

export default Employees;
