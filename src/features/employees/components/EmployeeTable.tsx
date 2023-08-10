import { FC, useState } from 'react';
import find from 'lodash/find';
import * as dayjs from 'dayjs';
import { useGetEmployeesQuery, useDeleteEmployeeMutation } from '@/store';

import EmployeeModal from '@/features/modals/EmployeeModal.tsx';
import { Table, Space, Popconfirm } from 'antd';

import { ColumnsType } from 'antd/es/table';
import { IEmployeeDb, EGender } from '@/types/employee.types.ts';
import { IDepartmentDb } from '@/types/department.types.ts';
import { NotificationType } from '@/features/hooks/useCustomNotification';

interface IEmployeeTable {
  key: number;
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: string;
  gender: string;
  position: string;
  hasDriverLicense: string;
}

const generateTableData = (rawData: IEmployeeDb[]): IEmployeeTable[] => {
  const getGender = (gender: number): string => {
    switch (gender) {
      case EGender.male:
        return 'мужской';
      case EGender.female:
        return 'женский';
      default:
        throw new Error('неизвестный пол');
    }
  };

  return rawData.map((item) => {
    return {
      key: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      middleName: item.middleName,
      birthDate: dayjs(item.birthDate).format('YYYY.MM.DD'),
      gender: getGender(item.gender),
      position: item.position,
      hasDriverLicense: item.hasDriverLicense === 1 ? 'есть' : 'нет',
    };
  }) as IEmployeeTable[];
};

interface EmployeeTableProps {
  focusedDepartment: IDepartmentDb | null;
  openNotification: (type: NotificationType, description: string) => void;
}

const EmployeeTable: FC<EmployeeTableProps> = ({
  focusedDepartment,
  openNotification,
}) => {
  const [isOpened, setIsOpened] = useState(false);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );

  const { data: employees } = useGetEmployeesQuery();

  const [deleteEmployee] = useDeleteEmployeeMutation();

  const currentEmployees: IEmployeeDb[] | null = !employees
    ? null
    : employees.filter(
        (employee) => employee.departmentId === focusedDepartment?.id
      );

  const editableEmployee =
    currentEmployees && selectedEmployeeId
      ? find(currentEmployees, ['id', selectedEmployeeId])
      : null;

  const tableData: IEmployeeTable[] | undefined = currentEmployees
    ? generateTableData(currentEmployees)
    : undefined;

  const handleDeleteClick = async (key: number) => {
    try {
      await deleteEmployee(key).unwrap();
      openNotification('success', 'Удаление прошло успешно');
    } catch (error) {
      console.error('error', error);
      openNotification('error', 'Удаление не удалось');
    }
  };

  const handleChangeClick = (key: number) => {
    setSelectedEmployeeId(key);
    setIsOpened(true);
  };

  const onClose = () => {
    setSelectedEmployeeId(null);
    setIsOpened(false);
  };

  const columns: ColumnsType<IEmployeeTable> = [
    {
      title: 'Имя',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Отчество',
      dataIndex: 'middleName',
      key: 'middleName',
    },
    {
      title: 'Фамилия',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Дата рождения',
      dataIndex: 'birthDate',
      key: 'birthDate',
    },
    {
      title: 'Пол',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Должность',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Водительские права',
      dataIndex: 'hasDriverLicense',
      key: 'hasDriverLicense',
    },
    {
      title: '',
      key: 'action',
      render: (_, record: IEmployeeTable) => {
        return (
          <Space size="middle">
            <Popconfirm
              title="Подтвердите удаление"
              onConfirm={() => handleDeleteClick(record.key)}
            >
              <a>Удалить</a>
            </Popconfirm>
            <a onClick={() => handleChangeClick(record.key)}>Изменить</a>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={{ pageSize: 10 }}
      />
      {isOpened && (
        <EmployeeModal
          isOpened={isOpened}
          onClose={onClose}
          openNotification={openNotification}
          editableEmployee={editableEmployee}
        />
      )}
    </>
  );
};

export default EmployeeTable;
