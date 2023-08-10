import { useMemo } from 'react';

import { IDepartmentDb } from '@/types/department.types.ts';
import type { DataNode } from 'antd/es/tree';

export const useGenerateTree = (data: IDepartmentDb[]): DataNode[] => {
  return useMemo(() => {
    const buildNode = (department: IDepartmentDb) => {
      const { id, name } = department;
      const children = data.reduce<DataNode[]>((acc, node) => {
        if (node.parentId === id) {
          acc.push(buildNode(node));
        }
        return acc;
      }, []);

      return {
        key: id,
        title: name,
        ...(children.length && { children }),
      };
    };

    return data.filter((node) => !node.parentId).map(buildNode);
  }, [data]);
};
