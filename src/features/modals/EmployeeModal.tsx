import { FC, useState, useEffect } from 'react';
import {
  useUpdateEmployeeMutation,
  useAddEmployeeMutation,
  useGetDepartmentsQuery,
} from '@/store';

import * as dayjs from 'dayjs';
import 'dayjs/locale/ru.js';
import locale from 'antd/es/date-picker/locale/ru_RU';

import {
  Form,
  Input,
  Modal,
  DatePicker,
  Radio,
  Switch,
  Col,
  Row,
  Select,
} from 'antd';

import { NotificationType } from '@/features/hooks/useCustomNotification.tsx';
import { IDepartmentDb } from '@/types/department.types';
import { IEmployeeDb, EGender } from '@/types/employee.types';

interface IEmployeeForm {
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: dayjs.Dayjs;
  gender: EGender;
  position: string;
  hasDriverLicense: boolean;
  departmentId: number;
}

interface IPartialEmployeeForm {
  birthDate: dayjs.Dayjs;
  departmentId: number | null;
}

const getInitialValuesForForm = (
  editableEmployee?: IEmployeeDb | null,
  focusedDepartment?: IDepartmentDb | null
): IEmployeeForm | IPartialEmployeeForm => {
  if (!editableEmployee) {
    return {
      birthDate: dayjs(),
      departmentId: focusedDepartment?.id || null,
    };
  } else {
    return {
      firstName: editableEmployee.firstName,
      lastName: editableEmployee.lastName,
      middleName: editableEmployee.middleName,
      birthDate: dayjs(editableEmployee.birthDate),
      gender: editableEmployee.gender,
      position: editableEmployee.position,
      hasDriverLicense: editableEmployee.hasDriverLicense === 1,
      departmentId: editableEmployee.departmentId,
    };
  }
};

interface EmployeeModalProps {
  isOpened: boolean;
  onClose: () => void;
  openNotification: (type: NotificationType, description: string) => void;
  editableEmployee?: IEmployeeDb | null;
  focusedDepartment?: IDepartmentDb | null;
}

const EmployeeModal: FC<EmployeeModalProps> = ({
  isOpened,
  onClose,
  openNotification,
  editableEmployee,
  focusedDepartment,
}) => {
  const [isValid, setIsValid] = useState(true);

  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  const { data: departments, isSuccess: isSuccessGetDepartments } =
    useGetDepartmentsQuery();

  const initValues = getInitialValuesForForm(
    editableEmployee,
    focusedDepartment
  );

  const [updateEmployee] = useUpdateEmployeeMutation();
  const [addEmployee] = useAddEmployeeMutation();

  const okText = editableEmployee ? 'Изменить' : 'Добавить';

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        setIsValid(true);
      },
      () => {
        setIsValid(false);
      }
    );
  }, [values, form]);

  const onCreate = async (values: IEmployeeForm) => {
    const body: Omit<IEmployeeDb, 'id'> = {
      firstName: values.firstName,
      lastName: values.lastName,
      middleName: values.middleName,
      birthDate: values.birthDate.toString(),
      gender: values.gender ? EGender.male : EGender.female,
      position: values.position,
      hasDriverLicense: values.hasDriverLicense ? 1 : 0,
      departmentId: values.departmentId,
    };

    if (editableEmployee) {
      try {
        await updateEmployee({ id: editableEmployee.id, ...body });
        openNotification('success', 'Карточка работника изменена');
      } catch (error) {
        console.log(error);
        openNotification('error', 'Изменения не увенчались успехом');
      }
    } else {
      try {
        await addEmployee(body);
        openNotification('success', 'Успешно добавлено');
      } catch (error) {
        console.log(error);
        openNotification('error', 'Не добавлено');
      }
    }
    onClose();
  };

  const handleSubmitClick = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        onCreate(values);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      open={isOpened}
      title="Карточка работника"
      onCancel={onClose}
      cancelText="Отменить"
      onOk={handleSubmitClick}
      okText={okText}
      okButtonProps={{ disabled: !isValid }}
    >
      {isSuccessGetDepartments && (
        <Form
          form={form}
          autoComplete="off"
          layout="vertical"
          initialValues={initValues}
        >
          <Row>
            <Col span={8}>
              <Form.Item
                name="firstName"
                label="Имя"
                wrapperCol={{ span: 22 }}
                rules={[{ required: true, message: 'Имя - обязательно' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="lastName"
                label="Фамилия"
                wrapperCol={{ span: 22 }}
                rules={[{ required: true, message: 'Фамилия - обязательно' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="middleName"
                label="Отчество"
                wrapperCol={{ span: 22 }}
                rules={[{ required: true, message: 'Отчество - обязательно' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                name="birthDate"
                label="Дата рождения"
                rules={[
                  { required: true, message: 'Дата рождения - обязательно' },
                ]}
                labelCol={{ span: 16, offset: 6 }}
                wrapperCol={{ offset: 3 }}
              >
                <DatePicker locale={locale} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="Пол"
                rules={[{ required: true, message: 'Пол - обязательно' }]}
                labelCol={{ span: 16, offset: 11 }}
                wrapperCol={{ offset: 3 }}
              >
                <Radio.Group>
                  <Radio.Button value={EGender.male}>Мужской</Radio.Button>
                  <Radio.Button value={EGender.female}>Женский</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="position"
            label="Должность"
            rules={[{ required: true, message: 'Должность - обязательно' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="departmentId"
            label="Отдел"
            rules={[{ required: true, message: 'Выбрать отдел - обязательно' }]}
          >
            <Select>
              {departments.map((dep) => (
                <Select.Option key={dep.id} value={dep.id}>
                  {dep.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Наличие прав"
            name="hasDriverLicense"
            valuePropName="checked"
          >
            <Switch
              checked={form.getFieldValue('hasDriverLicense')}
              onChange={(checked) => {
                form.setFieldsValue({ hasDriverLicense: checked });
              }}
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default EmployeeModal;
