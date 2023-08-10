import { useEffect, useState, FC } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import {
  useGetDepartmentsQuery,
  useUpdateDepartmentMutation,
  useAddDepartmentMutation,
} from '@/store';
import { NotificationType } from '../hooks/useCustomNotification.js';
import { IDepartmentDb } from '@/types/department.types.ts';

const rootDepartment: IDepartmentDb = {
  id: 0,
  name: 'Корневое подразделение',
  description: '',
  parentId: null,
};

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

interface DepartmentModalProps {
  typeModal: string;
  isOpened: boolean;
  onClose: () => void;
  openNotification: (type: NotificationType, description: string) => void;
  focusedDepartment: IDepartmentDb | null;
}

const DepartmentModal: FC<DepartmentModalProps> = ({
  typeModal,
  isOpened,
  onClose,
  openNotification,
  focusedDepartment,
}) => {
  const isChangingDepartmentModal = typeModal === 'changingDepartment';

  const okText = isChangingDepartmentModal ? 'Изменить' : 'Добавить';

  const [isValid, setIsValid] = useState(true);

  const { data: departments, isSuccess: isSuccessGetDepartments } =
    useGetDepartmentsQuery();

  const [updateDepartment] = useUpdateDepartmentMutation();
  const [addDepartment] = useAddDepartmentMutation();

  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  const getInitialValues = (): IDepartmentForm | undefined => {
    if (focusedDepartment && isChangingDepartmentModal) {
      return {
        name: focusedDepartment.name,
        description: focusedDepartment.description,
        parentId: focusedDepartment.parentId,
      };
    }
    if (typeModal === 'addingDepartment') {
      return;
    }
  };

  const initialValues: IDepartmentForm | undefined = getInitialValues();

  const recursiveFilter = (
    allDepartments: IDepartmentDb[],
    focusedDepartmentId: number
  ) => {
    let filteredDepartments: IDepartmentDb[] = allDepartments.filter(
      (department) => department.id !== focusedDepartmentId
    );

    const removeChildrenDepartments = (parentDepartmentId: number) => {
      filteredDepartments.forEach((department) => {
        if (department.parentId === parentDepartmentId) {
          filteredDepartments = filteredDepartments.filter(
            (dep) => dep.id !== department.id
          );
          removeChildrenDepartments(department.id);
        }
      });
    };

    removeChildrenDepartments(focusedDepartmentId);

    if (focusedDepartment && focusedDepartment.parentId !== null) {
      filteredDepartments.push(rootDepartment);
    }

    return filteredDepartments;
  };

  const onCreate = async (values: IBody) => {
    if (isChangingDepartmentModal && focusedDepartment) {
      try {
        await updateDepartment({ id: focusedDepartment.id, ...values });
        openNotification('success', 'Успешно изменено');
      } catch (err) {
        console.log(err);
        openNotification('error', 'Изменить не удалось');
      }
    }
    if (!isChangingDepartmentModal) {
      try {
        await addDepartment({
          ...values,
          parentId: focusedDepartment?.id || null,
        });
        openNotification('success', 'Успешно добавлено');
      } catch (error) {
        console.log(error);
        openNotification('error', 'Не добавлено');
      }
    }

    onClose();
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
    form.validateFields({ validateOnly: true }).then(
      () => {
        setIsValid(true);
      },
      () => {
        setIsValid(false);
      }
    );
  }, [values, form]);

  return (
    <Modal
      open={isOpened}
      title="Карточка подразделения"
      onCancel={onClose}
      cancelText="Закрыть"
      onOk={handleSubmitClick}
      okText={okText}
      okButtonProps={{
        disabled: !isValid,
      }}
    >
      {isSuccessGetDepartments && (
        <Form
          form={form}
          autoComplete="off"
          layout="vertical"
          initialValues={initialValues}
        >
          <Form.Item
            name="name"
            label="Наименование подразделения"
            rules={[
              {
                required: true,
                message: 'Наименование подразделения - обязательно',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Описание подразделения"
            rules={[
              {
                required: true,
                message: 'Описание подразделения - обязательно',
              },
            ]}
          >
            <Input type="textarea" />
          </Form.Item>

          {isChangingDepartmentModal && focusedDepartment && (
            <Form.Item name="parentId" label="Расположение">
              <Select>
                {recursiveFilter(departments, focusedDepartment.id).map(
                  (dep) => (
                    <Select.Option key={dep.id} value={dep.id}>
                      {dep.name}
                    </Select.Option>
                  )
                )}
              </Select>
            </Form.Item>
          )}
        </Form>
      )}
    </Modal>
  );
};

export default DepartmentModal;
