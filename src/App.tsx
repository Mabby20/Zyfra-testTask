import React, {useState, FC} from 'react'
import {Layout} from 'antd';
import Departments from './features/departments';
import Employees from './features/employees';
import {IDepartmentDb} from '@/types/department.types.ts'
import './App.css';

const {Sider, Content} = Layout;

const App: FC = () => {
  const [focusedDepartment, setFocusedDepartment] = useState<IDepartmentDb | null>(null);
  console.log('focusedDepartment', focusedDepartment)
  return (
    <Layout
      style={{
        background: '#f5f5f5'
      }}
    >
      <Sider
        width={400}
        style={{
          padding: '24px',
          height: '100vh',
          overflowY: 'auto',
          textAlign: 'center',
          background: '#f0f2f5',
        }}
      >
        <Departments
          focusedDepartment={focusedDepartment}
          setFocusedDepartment={setFocusedDepartment}
        />
      </Sider>
      <Content
        style={{
          padding: '24px',
          height: '100vh',
          overflowY: 'auto',
          background: '#fff',
        }}
      >
        <Employees
          focusedDepartment={focusedDepartment}
        />
      </Content>
    </Layout>
  )
};
export default App;
