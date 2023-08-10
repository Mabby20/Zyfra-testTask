import { FC } from 'react';
import useCustomNotification from '../hooks/useCustomNotification.tsx';

import EmployeeToolbar from './components/EmployeeToolbar.tsx';
import EmployeeTable from './components/EmployeeTable.tsx';

import { IDepartmentDb } from '@/types/department.types.ts';

interface EmployeesProps {
  focusedDepartment: IDepartmentDb | null;
}

const Employees: FC<EmployeesProps> = ({ focusedDepartment }) => {
  const { openNotification, contextHolder } = useCustomNotification();

  return (
    <>
      {contextHolder}
      <EmployeeToolbar
        focusedDepartment={focusedDepartment}
        openNotification={openNotification}
      />
      <EmployeeTable
        focusedDepartment={focusedDepartment}
        openNotification={openNotification}
      />
    </>
  );
};

export default Employees;
