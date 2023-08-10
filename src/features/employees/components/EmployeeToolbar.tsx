import { FC, useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import EmployeeModal from '@/features/modals/EmployeeModal';

import { IDepartmentDb } from '@/types/department.types.ts';
import { NotificationType } from '@/features/hooks/useCustomNotification';

interface EmployeeToolbarProps {
  focusedDepartment: IDepartmentDb | null;
  openNotification: (type: NotificationType, description: string) => void;
}

const EmployeeToolbar: FC<EmployeeToolbarProps> = ({
  focusedDepartment,
  openNotification,
}) => {
  const [isOpened, setIsOpened] = useState(false);

  const handleAddClick = () => {
    setIsOpened(true);
  };

  const onClose = () => {
    setIsOpened(false);
  };

  return (
    <>
      <Space style={{ margin: '20px 0', minWidth: '100%' }}>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          ghost
          className={'buttonStyle'}
          onClick={handleAddClick}
        >
          Добавить работника
        </Button>
      </Space>
      {isOpened && (
        <EmployeeModal
          isOpened={isOpened}
          onClose={onClose}
          openNotification={openNotification}
          focusedDepartment={focusedDepartment}
        />
      )}
    </>
  );
};

export default EmployeeToolbar;
