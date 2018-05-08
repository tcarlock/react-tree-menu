import React from 'react'
import _noop from 'lodash/utility/noop'

export default {
  stateful: false,
  collapsible: true,
  collapsed: false,
  checkbox : false,
  classNamePrefix: 'tree-view',
  onClick: (lineage) => {
    console.log('Tree Node clicked: ' + lineage.join(' > '))
  },
  onCheckChange: (lineage) => {
    console.log('Tree Node indicating a checkbox check state should change: ' + lineage.join(' > '))
  },
  onCollapseChange: (lineage) => {
    console.log('Tree Node indicating collapse state should change: ' + lineage.join(' > '))
  },
  checked : false,
  expandIconClass: '',
  collapseIconClass: '',
  labelFactory: (labelClassName, displayLabel) => {
    return <label className={labelClassName}>{displayLabel}</label>
  },
  checkboxFactory: (className, isChecked) => {
    return (
      <input
        className={className}
        type='checkbox'
        checked={isChecked}
        onChange={noop}
      />
    )
  }
}
