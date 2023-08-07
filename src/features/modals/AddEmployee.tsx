import {useEffect, useState, FC} from "react";
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru.js';
import locale from 'antd/es/date-picker/locale/ru_RU';
import {EGender} from "../employees/components/employeeTypes.ts";
import {actions as modalsActions, IAppDispatch, useAddEmployeeMutation, useGetDepartmentsQuery} from "../../store";
import {Col, DatePicker, Form, Input, Radio, Row, Select, Switch, Modal} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {IEmployeeDb} from "@/types/emloyee.types.ts";
import {IDepartmentDb} from "@/types/department.types.ts";
import {NotificationType} from "@/features/hooks/useCustomNotification.tsx";

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

interface AddEmployeeProps {
  openNotification: (type: NotificationType, description: string) => void;
}

const AddEmployee: FC<AddEmployeeProps> = ({openNotification}) => {
  const dispatch = useDispatch<IAppDispatch>();
  const [isValid, setIsValid] = useState(true);
  const {isOpened, targetId}: { isOpened: boolean, targetId: number | null } = useSelector((state) => state.modals);
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const [addEmployee] = useAddEmployeeMutation();
  const {data: departments, isSuccess: isSuccessGetDepartments}: {
    data: IDepartmentDb[],
    isLoading: boolean
  } = useGetDepartmentsQuery();

  const initialValues = {
    birthDate: dayjs(),
    departmentId: targetId,
  }

  const handleCancel = () => {
    dispatch(modalsActions.close())
  };

  const onCreate = async (values: IEmployeeForm) => {
    const body: Partial<IEmployeeDb> = {
      firstName: values.firstName,
      lastName: values.lastName,
      middleName: values.middleName,
      birthDate: values.birthDate.toString(),
      gender: values.gender ? EGender.male : EGender.female,
      position: values.position,
      hasDriverLicense: values.hasDriverLicense ? 1 : 0,
      departmentId: values.departmentId,
    };

    const response = await addEmployee(body);
    if (response.data) {
      openNotification('success', 'Успешно добавлено');
    } else {
      openNotification('error', 'Не добавлено');
    }
    dispatch(modalsActions.close());
  }

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

  useEffect(() => {
    form.validateFields({validateOnly: true}).then(
      () => {
        setIsValid(true);
      },
      () => {
        setIsValid(false);
      },
    );
  }, [values]);

  return (
    <Modal
      open={isOpened}
      title="Карточка работника"
      name="changeEmployeeFormInModal"
      onCancel={handleCancel}
      cancelText="Отменить"
      onOk={handleSubmitClick}
      okText="Добавить"
      okButtonProps={{
        disabled: !isValid
      }}
    >
      {isSuccessGetDepartments &&
          <Form
              form={form}
              autoComplete="off"
              layout="vertical"
              initialValues={initialValues}
          >
              <Row>
                  <Col span={8}>
                      <Form.Item
                          name="firstName"
                          label="Имя"
                          wrapperCol={{span: 22}}
                          rules={[{required: true, message: 'Имя - обязательно'}]}
                      >
                          <Input/>
                      </Form.Item>
                  </Col>
                  <Col span={8}>
                      <Form.Item
                          name="lastName"
                          label="Фамилия"
                          wrapperCol={{span: 22}}
                          rules={[{required: true, message: 'Фамилия - обязательно'}]}
                      >
                          <Input/>
                      </Form.Item>
                  </Col>
                  <Col span={8}>
                      <Form.Item
                          name="middleName"
                          label="Отчество"
                          wrapperCol={{span: 22}}
                          rules={[{required: true, message: 'Отчество - обязательно'}]}
                      >
                          <Input/>
                      </Form.Item>
                  </Col>
              </Row>
              <Row>
                  <Col span={12}>
                      <Form.Item
                          name="birthDate"
                          label="Дата рождения"
                          labelCol={{span: 16, offset: 6}}
                          wrapperCol={{offset: 3}}
                      >
                          <DatePicker locale={locale}/>
                      </Form.Item>
                  </Col>
                  <Col span={12}>
                      <Form.Item
                          name="gender"
                          label="Пол"
                          labelCol={{span: 16, offset: 11}}
                          wrapperCol={{offset: 3}}
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
                  rules={[{required: true, message: 'Должность - обязательно'}]}
              >
                  <Input/>
              </Form.Item>
              <Form.Item
                  name="departmentId"
                  label="Отдел"
              >
                  <Select>
                    {departments
                      .map(dep => (
                        <Select.Option key={dep.id} value={dep.id}>
                          {dep.name}
                        </Select.Option>
                      ))}
                  </Select>
              </Form.Item>
              <Form.Item label="Наличие прав" name="hasDriverLicense" valuePropName="checked">
                  <Switch
                      checked={form.getFieldValue('hasDriverLicense')}
                      onChange={(checked) => {
                        form.setFieldsValue({hasDriverLicense: checked});
                      }}
                  />
              </Form.Item>
          </Form>
      }
    </Modal>
  )
};

export default AddEmployee;
