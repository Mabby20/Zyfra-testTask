import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IDepartmentDb} from "@/types/department.types.ts";

export interface IModalState {
  typeModal: string | null,
  isOpened: boolean,
  isEmployee: boolean,
  targetId: number | null,
}

interface OpenPayload {
  type: string;
  targetId: number | null,
  isEmployee: boolean;
}

const initialState: IModalState = {
  typeModal: null,
  isOpened: false,
  isEmployee: false,
  targetId: null,
};

const modalSlice  = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    open: (state: IModalState, { payload }: PayloadAction<OpenPayload>) => {
      state.typeModal = payload.type;
      state.isOpened = true;
      state.isEmployee = payload.isEmployee;
      state.targetId = payload.targetId;
    },
    close: (state: IModalState) => {
      state.typeModal = null;
      state.isOpened = false;
      state.isEmployee = false;
      state.targetId = null;
    },
  },
});
const { actions } = modalSlice;

const selectors = {
  selectTypeModal: (state): Partial<IModalState> => ({type: state.modals.typeModal, isEmployee: state.modals.isEmployee}),
};

export { actions, selectors };
export default modalSlice.reducer;
