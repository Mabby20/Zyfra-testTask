import React, {FC} from "react";
import {useDispatch, useSelector} from 'react-redux';
import useCustomNotification from "../../hooks/useCustomNotification.tsx";
import getModalComponent from "../../modals";
import {PlusOutlined, CloseCircleOutlined} from "@ant-design/icons";
import {Button, Popconfirm, Space} from 'antd';
import {
  actions as modalsActions,
  selectors as modalsSelectors,
  useDeleteDepartmentMutation
} from '../../../store';
import {IDepartmentDb} from "@/types/department.types.ts";
import {IAppDispatch} from '@/store'

interface DepartmentToolbarProps {
  focusedDepartment: IDepartmentDb | null;
  setFocusedDepartment: (department: IDepartmentDb | null) => void;
  hasChildren: boolean;
}

const DepartmentToolbar: FC<DepartmentToolbarProps> = ({focusedDepartment, setFocusedDepartment, hasChildren}) => {
  const dispatch = useDispatch<IAppDispatch>();
  const {openNotification, contextHolder} = useCustomNotification();

  const typeModal = useSelector(modalsSelectors.selectTypeModal);
  const type: string | null = typeModal.isEmployee ? null : typeModal.type;

  const [deleteDepartment] = useDeleteDepartmentMutation();
  const handleAddClick = () => {
    dispatch(modalsActions.open({
      type: 'addingDepartment',
      isEmployee: false,
      targetId: focusedDepartment?.id || null,
    }))
  };

  const handleChangeClick = () => {
    if (!focusedDepartment) {
      return;
    }

    dispatch(modalsActions.open({
      type: 'changingDepartment',
      isEmployee: false,
      targetId: focusedDepartment.id
    }))
  };

  const handleDeleteClick = async () => {
    if (!focusedDepartment) {
      return;
    }

    const response = await deleteDepartment(focusedDepartment.id);
    if (response.data) {
      openNotification('success', 'Удаление прошло успешно');
    } else {
      openNotification('error', 'Ошибка удаления');
    }
    setFocusedDepartment(null);
  };

  return (
    <>
      {contextHolder}
      <Space
        size="middle"
        style={{margin: '20px 0', minWidth: '100%'}}
      >
        <Button
          icon={<PlusOutlined/>}
          type="primary"
          primary="true"
          ghost
          onClick={handleAddClick}
        >
          Добавить
        </Button>
        <Button
          type="primary"
          primary="true"
          ghost
          onClick={handleChangeClick}
          disabled={!focusedDepartment}
        >
          Изменить
        </Button>
        <Popconfirm title="Подтвердите удаление" onConfirm={handleDeleteClick}>
          <Button
            icon={<CloseCircleOutlined/>}
            type="primary"
            danger="true"
            ghost
            disabled={!focusedDepartment || hasChildren}
          >
            Удалить
          </Button>
        </Popconfirm>
      </Space>
      {getModalComponent(type, {openNotification})}
    </>
  )
};

export default DepartmentToolbar;
