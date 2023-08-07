import {FC} from 'react';
import {useDispatch} from "react-redux";
import {actions as modalsActions} from "../../../store";
import {PlusOutlined} from '@ant-design/icons';
import {Button, Space} from "antd";
import {IDepartmentDb} from "@/types/department.types.ts";
import {IAppDispatch} from "@/store";

interface EmployeeToolbarProps {
  focusedDepartment: IDepartmentDb | null;
}

const EmployeeToolbar: FC<EmployeeToolbarProps> = ({focusedDepartment}) => {
  const dispatch = useDispatch<IAppDispatch>();
  const handleAddClick = () => {
    dispatch(modalsActions.open({
      type: 'addingEmployee',
      isEmployee: true,
      targetId: focusedDepartment?.id || null
    }))
  };


  return (
    <Space style={{margin: '20px 0', minWidth: '100%'}}>
      <Button
        icon={<PlusOutlined/>}
        type="primary"
        primary="true"
        ghost
        className={'buttonStyle'}
        onClick={handleAddClick}
      >
        Добавить работника
      </Button>
    </Space>
  )
};

export default EmployeeToolbar;
