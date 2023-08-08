import {FC} from 'react';
import {NotificationType} from "@/features/hooks/useCustomNotification.tsx";
import {IEmployeeDb} from "@/types/employee.types"

//нужно получать айди(выбранное подразделение) по которому будем искать работников
//сделать запрос который будет приводить сразу работников, без всяких фильтраций. фильтровать будует сам json-server


interface EmployeeModalProps {
    typeModal: string;
    isOpened: boolean;
    setIsOpened: (arg: boolean) => void;
    openNotification: (type: NotificationType, description: string) => void;
    editableEmployee: IEmployeeDb | null
}

const EmployeeModal: FC<EmployeeModalProps> = ({typeModal, isOpened, setIsOpened, openNotification, editableEmployee}) => {
    

    return (

    )
};
