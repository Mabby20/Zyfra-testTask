import React, {useState, FC} from 'react';
import {Button, Modal, Form, Input, Spin} from 'antd';
import DepartmentTree from './components/DepartmentTree.tsx'
import DepartmentToolbar from './components/DepartmentToolbar.tsx'
import {useGetDepartmentsQuery} from "@/store";
import {IDepartmentDb} from '@/types/department.types.ts'
import departments from "@/features/departments/index.tsx";


//нужно ли тут описывать пропсы?
// чем должно являться departments? поидее это тот те данные которые приходят с бэка - поэтому нужен интерфес, приходящих данных с бэка
interface DepartmentProps {
  focusedDepartment: IDepartmentDb | null;
  setFocusedDepartment: (department: IDepartmentDb | null) => void;
}
const Departments: FC<DepartmentProps> = ({focusedDepartment, setFocusedDepartment}) => {
  const {data: departments, isLoading, isError}: {data: IDepartmentDb[], isLoading: boolean, isError: boolean} = useGetDepartmentsQuery();
  const [hasChildren, setHasChildren] = useState(true);

  return (
    <>
      <DepartmentToolbar
        focusedDepartment={focusedDepartment}
        setFocusedDepartment={setFocusedDepartment}
        hasChildren={hasChildren}
      />
      {isLoading && <Spin/>}
      {!isLoading && !isError &&
          <DepartmentTree
              departments={departments}
              setFocusedDepartment={setFocusedDepartment}
              setHasChildren={setHasChildren}
          />}
    </>
  )
}

export default Departments;
