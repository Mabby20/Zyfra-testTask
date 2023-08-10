import { FC, useState } from 'react';
import useCustomNotification from '../../hooks/useCustomNotification.tsx';
import { useDeleteDepartmentMutation } from '@/store';

import DepartmentModal from '@/features/modals/DepartmentModal';
import { PlusOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space } from 'antd';

import { IDepartmentDb } from '@/types/department.types.ts';

interface DepartmentToolbarProps {
  focusedDepartment: IDepartmentDb | null;
  setFocusedDepartment: (department: IDepartmentDb | null) => void;
  hasChildren: boolean;
}

const DepartmentToolbar: FC<DepartmentToolbarProps> = ({
  focusedDepartment,
  setFocusedDepartment,
  hasChildren,
}) => {
  const [isOpened, setIsOpened] = useState(false);

  const [typeModal, setTypeModal] = useState('');

  const { openNotification, contextHolder } = useCustomNotification();

  const [deleteDepartment] = useDeleteDepartmentMutation();

  const onClose = () => {
    setIsOpened(false);
    setTypeModal('');
  };

  const handleAddClick = () => {
    setIsOpened(true);
    setTypeModal('addingDepartment');
  };

  const handleChangeClick = () => {
    if (!focusedDepartment) {
      return;
    }
    setIsOpened(true);
    setTypeModal('changingDepartment');
  };

  const handleDeleteClick = async () => {
    if (!focusedDepartment) {
      return;
    }

    try {
      await deleteDepartment(focusedDepartment.id);
      openNotification('success', 'Удаление прошло успешно');
    } catch (error) {
      console.log(error);
      openNotification('error', 'Ошибка удаления');
    }
    setFocusedDepartment(null);
  };

  return (
    <>
      {contextHolder}
      <Space size="middle" style={{ margin: '20px 0', minWidth: '100%' }}>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          ghost
          onClick={handleAddClick}
        >
          Добавить
        </Button>
        <Button
          type="primary"
          ghost
          onClick={handleChangeClick}
          disabled={!focusedDepartment}
        >
          Изменить
        </Button>
        <Popconfirm title="Подтвердите удаление" onConfirm={handleDeleteClick}>
          <Button
            icon={<CloseCircleOutlined />}
            type="primary"
            danger
            ghost
            disabled={!focusedDepartment || hasChildren}
          >
            Удалить
          </Button>
        </Popconfirm>
      </Space>
      {isOpened && (
        <DepartmentModal
          typeModal={typeModal}
          isOpened={isOpened}
          onClose={onClose}
          openNotification={openNotification}
          focusedDepartment={focusedDepartment}
        />
      )}
    </>
  );
};

export default DepartmentToolbar;
