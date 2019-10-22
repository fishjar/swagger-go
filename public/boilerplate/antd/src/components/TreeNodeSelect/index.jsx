import React, { useState, forwardRef } from 'react';
import { Tree } from 'antd';
const { TreeNode } = Tree;

function TreeNodeSelect({ value = [], isObject, listData = [], onChange }, ref) {
  const handleCheck = e => {
    if (onChange) {
      if (isObject) {
        onChange(e.checked.map(id => listData.find(item => item.id === id)));
      } else {
        onChange(e.checked);
      }
    }
  };

  const buildTree = (list, pid) =>
    list
      .filter(item => item.parentId === pid)
      .map(item => (
        <TreeNode title={item.name} key={item.id}>
          {buildTree(list, item.id)}
        </TreeNode>
      ));

  return (
    <Tree
      defaultExpandAll
      checkStrictly
      checkable
      selectable={false}
      onCheck={handleCheck}
      defaultCheckedKeys={isObject ? value.map(item => item.id) : value}
      ref={ref}
    >
      {buildTree(listData, null)}
    </Tree>
  );
}

// https://ant.design/components/form-cn/#components-form-demo-customized-form-controls
// https://reactjs.org/docs/forwarding-refs.html
export default forwardRef(TreeNodeSelect);
