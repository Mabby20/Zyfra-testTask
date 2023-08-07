import {useEffect, useState, FC} from 'react'
import {useDispatch, useSelector} from "react-redux";
import isFunction from 'lodash/isFunction';
import {Form, Input, Modal, Select} from "antd";
import {
  actions as modalsActions, IAppDispatch,
  useGetDepartmentsQuery,
  useUpdateDepartmentMutation,
  useGetDepartmentByIdQuery
} from "../../store";
import {NotificationType} from "../hooks/useCustomNotification.tsx";
import * as dayjs from "dayjs";
import {IDepartmentDb} from "@/types/department.types.ts";


const rootDepartment: { name: string, id: number | null } = {
  name: 'сделать Root',
  id: null,
};

interface ChangeDepartmentProps {
  openNotification: (type: NotificationType, description: string) => void;
}

interface IDepartmentForm {
  name: string;
  description: string | null;
  parentId: number | null;
}

interface IBody {
  name: string;
  description: string;
  parentId: number | null;
}

interface IGetDepartment {
  data: IDepartmentDb;
  isSuccess: boolean;
}

interface IGetDepartments {
  data: IDepartmentDb[];
  isSuccess: boolean;
}

interface IDepartmentForSelect {
  id: number | null
  name: string;
}

const ChangeDepartment: FC<ChangeDepartmentProps> = ({openNotification}) => {
  const dispatch = useDispatch<IAppDispatch>();
  const [updateDepartment] = useUpdateDepartmentMutation();

  const {isOpened, targetId}: { isOpened: true, target: number | null } = useSelector((state) => state.modals);
  const {
    data: editableDepartment,
    isSuccess: isSuccessGetDepartment
  }: IGetDepartment = useGetDepartmentByIdQuery(targetId);
  const {data: departments, isSuccess: isSuccessGetDepartments}: IGetDepartments = useGetDepartmentsQuery();
  const [isValid, setIsValid] = useState(true);

  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  console.log('editableDepartment find', editableDepartment)

  const getInitialValues = (): IDepartmentForm | undefined => {
    if (isSuccessGetDepartment) {
      return {
        name: editableDepartment.name,
        description: editableDepartment.description,
        parentId: editableDepartment.parentId,
      }
    }
    return;
  };

  const initialValues: IDepartmentForm | undefined = getInitialValues();

  const recursiveFilter = (departments: IDepartmentDb[], targetId) => {

    let filteredDepartments:IDepartmentDb[] = departments.filter(department => department.id !== targetId);

    const removeChildren = (currentTargetId) => {
      filteredDepartments.forEach(fDep => {
        if (fDep.parentId === currentTargetId) {
          filteredDepartments = filteredDepartments.filter(f => f.id !== fDep.id);
          removeChildren(fDep.id);
        }
      });
    }

    removeChildren(targetId);

    return filteredDepartments;
  }

  const filteredDepartments: IDepartmentForSelect[] = recursiveFilter(departments, targetId).map((department): IDepartmentForSelect => department);

  if (isSuccessGetDepartment && editableDepartment.parentId !== null) {
    filteredDepartments.push(rootDepartment);
  }

  const handleCancel = () => {
    dispatch(modalsActions.close());
  };

  const onCreate = async (values: IBody) => {
    const response = await updateDepartment({id: targetId, ...values});
    if (isFunction(openNotification)) {
      if (response.data) {
        openNotification('success', 'Успешно изменено');
      } else {
        openNotification('error', 'Изменить не удалось');
      }
    }
    dispatch(modalsActions.close());
  };
  const handleSubmitClick = async () => {
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
      title="Редактирование подразделения"
      name="changeDepartmentFormInModal"
      onCancel={handleCancel}
      cancelText="Закрыть"
      onOk={handleSubmitClick}
      okText="Изменить"
      okButtonProps={{
        disabled: !isValid
      }}
    >
      {isSuccessGetDepartments && isSuccessGetDepartment && <Form
          form={form}
          autoComplete="off"
          layout="vertical"
          initialValues={initialValues}
      >
          <Form.Item
              name="name"
              label="Наименование подразделения"
              rules={[{required: true, message: 'Наименование подразделения - обязательно'}]}
          >
              <Input/>
          </Form.Item>

          <Form.Item
              name="description"
              label="Описание подразделения"
              rules={[{required: true, message: 'Описание подразделения - обязательно'}]}
          >
              <Input type="textarea"/>
          </Form.Item>

          <Form.Item
              name="parentId"
              label="Расположение"
          >
              <Select>
                {filteredDepartments
                  .map(dep => (
                    <Select.Option key={dep.id} value={dep.id}>
                      {dep.name}
                    </Select.Option>
                  ))}
              </Select>
          </Form.Item>
      </Form>}
    </Modal>
  )
};

export default ChangeDepartment;
