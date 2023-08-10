import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { baseUrl, sliceApiPath } from '@/routes';

import { IDepartmentDb } from '@/types/department.types.ts';
import { IEmployeeDb } from '@/types/employee.types.ts';

export const sliceApi = createApi({
  reducerPath: 'sliceApi',
  tagTypes: ['Departments', 'Employees'],
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
  }),
  endpoints: (build) => ({
    
    //endpoints for departments
    getDepartments: build.query<IDepartmentDb[], void>({
      query: () => sliceApiPath.departmentsPath,
      providesTags: ['Departments'],
    }),
    getDepartmentById: build.query<IDepartmentDb, number>({
      query: (id) => `${sliceApiPath.departmentsPath}/${id}`,
      providesTags: ['Departments'],
    }),
    addDepartment: build.mutation<IDepartmentDb, Omit<IDepartmentDb, 'id'>>({
      query: (department) => ({
        url: sliceApiPath.departmentsPath,
        method: 'POST',
        body: department,
      }),
      invalidatesTags: ['Departments'],
    }),
    updateDepartment: build.mutation<IDepartmentDb, Partial<IDepartmentDb>>({
      query: ({ id, ...patch }) => ({
        url: `${sliceApiPath.departmentsPath}/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Departments'],
    }),
    deleteDepartment: build.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `${sliceApiPath.departmentsPath}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Departments'],
    }),

    //endpoints for employees
    getEmployees: build.query<IEmployeeDb[], void>({
      query: () => sliceApiPath.EmployeesPath,
      providesTags: ['Employees'],
    }),

    getEmployeeById: build.query<IEmployeeDb, number>({
      query: (id) => `${sliceApiPath.EmployeesPath}/${id}`,
      providesTags: ['Employees'],
    }),

    addEmployee: build.mutation<IEmployeeDb, Omit<IEmployeeDb, 'id'>>({
      query: (employee) => ({
        url: sliceApiPath.EmployeesPath,
        method: 'POST',
        body: employee,
      }),
      invalidatesTags: ['Employees'],
    }),

    updateEmployee: build.mutation<IEmployeeDb, Partial<IEmployeeDb>>({
      query: ({ id, ...patch }) => ({
        url: `${sliceApiPath.EmployeesPath}/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Employees'],
    }),

    deleteEmployee: build.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `${sliceApiPath.EmployeesPath}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Employees'],
    }),
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
