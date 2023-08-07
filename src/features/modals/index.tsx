import AddDepartment from './AddDepartment.tsx';
import ChangeDepartment from './ChangeDepartment.tsx';
import AddEmployee from './AddEmployee.tsx';
import ChangeEmployee from './ChangeEmployee.tsx';

const modals = {
  addingDepartment: AddDepartment,
  changingDepartment: ChangeDepartment,
  addingEmployee: AddEmployee,
  changingEmployee: ChangeEmployee,
};

const getModal = (modalType) => modals[modalType];

const getModalComponent = (modalType: string | null, modelProps) => {

  if (modalType === null) {
    return null;
  }

  const Component = getModal(modalType);

  return <Component {...modelProps} />;
};

export default getModalComponent;
