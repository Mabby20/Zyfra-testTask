import React, {FC} from "react";
import {useDispatch, useSelector} from "react-redux";
import moment from 'moment'
import getModalComponent from "../../modals";
import useCustomNotification from "../../hooks/useCustomNotification.tsx";
import {
  actions as modalsActions,
  selectors as modalsSelectors,
  useGetEmployeesQuery,
  useDeleteEmployeeMutation
} from "../../../store";
import {Table, Space, Popconfirm} from 'antd';
import {ColumnsType} from "antd/es/table";
import {IEmployeeDb} from '@/types/emloyee.types.ts'
import {IDepartmentDb} from "@/types/department.types.ts";
import {IAppDispatch} from "@/store";
import {EGender} from "./employeeTypes.ts";


interface EmployeeTableProps {
  focusedDepartment: IDepartmentDb | null;
}

interface IEmployeeTable {
  key: number;
  fullName: string;
  birthDate: Date;
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
      birthDate: moment(item.birthDate).format('DD.MM.YYYY'),
      gender: getGender(item.gender),
      position: item.position,
      hasDriverLicense: item.hasDriverLicense === 1 ? 'есть' : 'нет',
    }
  }) as IEmployeeTable[];
};

const EmployeeTable: FC<EmployeeTableProps> = ({focusedDepartment}) => {
  const dispatch = useDispatch<IAppDispatch>();
  const {openNotification, contextHolder} = useCustomNotification();

  const {data: employees, isLoading}: { data: IEmployeeDb[], isLoading: boolean } = useGetEmployeesQuery();

  const [deleteEmployee] = useDeleteEmployeeMutation();

  const currentEmployees: IEmployeeDb[] | null = isLoading ? null : employees.filter((employee) => employee.departmentId === focusedDepartment?.id);

  const tableData: IEmployeeTable[] | undefined = currentEmployees ? generateTableData(currentEmployees) : undefined;

  const modalInfo = useSelector(modalsSelectors.selectTypeModal);

  const typeModal = modalInfo.isEmployee ? modalInfo.type : null;
  const handleDeleteClick = async (key: number) => {
    const response = await deleteEmployee(key);
    if (response.data) {
      openNotification('success', 'Удаление прошло успешно');
    } else {
      openNotification('error', 'Что-то сломалось');
    }
  };

  const handleChangeClick = (key: number) => {
    dispatch(modalsActions.open({
      type: 'changingEmployee',
      isEmployee: true,
      targetId: key,
    }))
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
      render: (_: any, record: IEmployeeTable) => {

        return (
          <Space size="middle">
            <Popconfirm title="Подтвердите удаление" onConfirm={() => handleDeleteClick(record.key)}>
              <a>Удалить</a>
            </Popconfirm>
            <a onClick={() => handleChangeClick(record.key)}>Изменить</a>
          </Space>
        )
      }
    }
  ];

  return (
    <>
      {contextHolder}
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={{pageSize: 10}}
      />
      {getModalComponent(typeModal, {openNotification})}
    </>
  )
};

export default EmployeeTable;

