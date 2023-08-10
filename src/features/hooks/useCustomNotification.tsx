import { notification } from 'antd';

export type NotificationType = 'success' | 'error';
const useCustomNotification = () => {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (
    type: NotificationType,
    description: string
  ): void => {
    switch (type) {
      case 'success':
        api[type]({
          message: 'Успех!',
          description,
          placement: 'topRight',
        });
        break;
      case 'error':
        api[type]({
          message: 'Ошибка!',
          description,
          placement: 'topRight',
        });
        break;
      default:
        throw new Error('неизвестный тип');
    }
  };

  return { openNotification, contextHolder };
};

export default useCustomNotification;
