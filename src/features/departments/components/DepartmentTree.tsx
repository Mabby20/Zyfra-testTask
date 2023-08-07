import React, {FC} from "react";
import {useGenerateTree} from './useGenerateTree';
import find from 'lodash/find';
import {Tree} from 'antd';
import type {DirectoryTreeProps, DataNode} from 'antd/es/tree'
import {IDepartmentDb} from "@/types/department.types.ts";

interface DepartmentTreeProps {
  focusedDepartment: IDepartmentDb | null;
  setFocusedDepartment: (department: IDepartmentDb | null) => void;
  setHasChildren: (hasChildren: boolean) => void;
}

const DepartmentTree: FC<DepartmentTreeProps> = ({departments, setFocusedDepartment, setHasChildren}) => {
  const handleFocusedDepartment: DirectoryTreeProps['onSelect'] = (keys, info) => {
    const focusedDepartmentId: number | null = keys.length ? keys[0] : null;
    const focusedDepartment: IDepartmentDb = find(departments, ['id', focusedDepartmentId]) || null;
    const hasChildren: boolean = !!info.node.children?.length;
    console.log('hasChildren', hasChildren);
    setFocusedDepartment(focusedDepartment);
    setHasChildren(hasChildren)
  }


  const treeData: DataNode[] = useGenerateTree(departments);

  return <Tree
    rootStyle={{
      background: '#f9f9f9',
      border: '1px solid #e4e4e4',
    }}
    treeData={treeData}
    onSelect={handleFocusedDepartment}
    defaultExpandAll
    showLine
  />;
};

export default DepartmentTree;

