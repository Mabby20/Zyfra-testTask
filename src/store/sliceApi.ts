import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {IDepartmentDb} from "../types/department.types.ts";
import {IEmployeeDb} from "../types/emloyee.types.ts";

export const sliceApi = createApi({
  reducerPath: 'sliceApi',
  tagTypes: ['Departments', 'Employees'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001/',
  }),
  endpoints: (build) => ({

    //endpoints for departments
    getDepartments: build.query<IDepartmentDb[], void>({
      query: () => '/departments',
      providesTags: result => ['Departments'],
    }),
    getDepartmentById: build.query<IDepartmentDb, number>({
      query: (id) => `/departments/${id}`,
      providesTags: ['Departments'],
    }),
    addDepartment: build.mutation<IDepartmentDb, Omit<IDepartmentDb, 'id'>>({
      query: (department) => ({
        url: '/departments',
        method: 'POST',
        body: department
      }),
      invalidatesTags: ['Departments'],
    }),
    updateDepartment: build.mutation<IDepartmentDb, Partial<IDepartmentDb>>({
      query: ({id, ...patch}) => ({
        url: `/departments/${id}`,
        method: 'PATCH',
        body: patch
      }),
      invalidatesTags: ['Departments'],
    }),
    deleteDepartment: build.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/departments/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Departments'],
    }),

    //endpoints for employees
    getEmployees: build.query<IEmployeeDb[], void>({
      query: () => '/employees',
      providesTags: ['Employees']
    }),

    getEmployeeById: build.query<IEmployeeDb, number>({
      query: (id) => `/employees/${id}`,
      providesTags: ['Employees']
    }),

    addEmployee: build.mutation<IEmployeeDb, Omit<IEmployeeDb, 'id'>>({
      query: (employee) => ({
        url: '/employees',
        method: 'POST',
        body: employee
      }),
      invalidatesTags: ['Employees'],
    }),

    updateEmployee: build.mutation<IEmployeeDb, Partial<IEmployeeDb>>({
      query: ({id, ...patch}) => ({
        url: `/employees/${id}`,
        method: 'PATCH',
        body: patch
      }),
      invalidatesTags: ['Employees'],
    }),

    deleteEmployee: build.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/employees/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Employees'],
    })
  }),
});
export const {
  useGetDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useAddDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,

  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useAddEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = sliceApi;
