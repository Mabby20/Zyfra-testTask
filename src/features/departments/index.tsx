import { useState, FC } from 'react';
import { useGetDepartmentsQuery } from '@/store';

import { Spin } from 'antd';
import DepartmentTree from './components/DepartmentTree.tsx';
import DepartmentToolbar from './components/DepartmentToolbar.tsx';

import { IDepartmentDb } from '@/types/department.types.ts';

interface DepartmentProps {
  focusedDepartment: IDepartmentDb | null;
  setFocusedDepartment: (department: IDepartmentDb | null) => void;
}
const Departments: FC<DepartmentProps> = ({
  focusedDepartment,
  setFocusedDepartment,
}) => {
  const { data: departments, isLoading } = useGetDepartmentsQuery();
  const [hasChildren, setHasChildren] = useState(true);

  return (
    <>
      <DepartmentToolbar
        focusedDepartment={focusedDepartment}
        setFocusedDepartment={setFocusedDepartment}
        hasChildren={hasChildren}
      />
      {isLoading && <Spin />}
      {departments && (
        <DepartmentTree
          departments={departments}
          setFocusedDepartment={setFocusedDepartment}
          setHasChildren={setHasChildren}
        />
      )}
    </>
  );
};

export default Departments;
