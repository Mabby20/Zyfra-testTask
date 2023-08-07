import {useEffect, useState, FC} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {Modal, Form, Input} from 'antd';
import {actions as modalsActions, useAddDepartmentMutation} from '../../store';
import {NotificationType} from "@/features/hooks/useCustomNotification.tsx";
import {IAppDispatch} from '@/store'

interface IValues {
  name: string;
  description: string;
}

interface IBody {
  name: string;
  description: string;
  parentId: number | null;
  createdAt: string;
}

interface AddDepartmentProps {
  openNotification: (type: NotificationType, description: string) => void;
}

const AddDepartment: FC<AddDepartmentProps> = ({openNotification}) => {
  const dispatch = useDispatch<IAppDispatch>();
  const [isValid, setIsValid] = useState(true);

  const {isOpened, targetId}: { isOpened: boolean, targetId: number | null } = useSelector((state) => state.modals);
  const [addDepartment] = useAddDepartmentMutation();

  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  const handleCancel = () => {
    dispatch(modalsActions.close());
  }

  const onCreate = async (values: IValues) => {
    const body: IBody = {
      ...values,
      parentId: targetId,
      createdAt: new Date().toISOString(),
    }

    const response = await addDepartment(body);
    if (response.data) {
      openNotification('success', 'Успешно добавлено');
    } else {
      openNotification('error', 'Не добавлено');
    }
    dispatch(modalsActions.close());
  }
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
      title="Подразделение"
      name="addDepartmentFormInModal"
      okText="Создать"
      cancelText="Закрыть"
      onOk={handleSubmitClick}
      okButtonProps={{
        disabled: !isValid
      }}
      onCancel={handleCancel}
    >
      <Form form={form} autoComplete="off" layout="vertical">
        <Form.Item name="name" label="Наименование подразделения"
                   rules={[{required: true, message: 'Наименование подразделения - обязательно'}]}>
          <Input/>
        </Form.Item>

        <Form.Item name="description" label="Описание подразделения"
                   rules={[{required: true, message: 'Описание подразделения - обязательно'}]}>
          <Input type="textarea"/>
        </Form.Item>
      </Form>
    </Modal>
  )
};

export default AddDepartment;
