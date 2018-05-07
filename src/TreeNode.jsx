import PropTypes from 'prop-types'
import React, { Component } from 'react'
import TreeNodeMixin from './TreeNodeMixin'
import noop from 'lodash/utility/noop'

/**
 * Individual nodes in tree hierarchy, nested under a single <TreeMenu/> node
 *
 *
 * @type {TreeNode}
 */
export default class TreeNode extends Component {
  static propTypes = {
    stateful: PropTypes.bool,
    checkbox: PropTypes.bool,
    collapsible : PropTypes.bool,
    collapsed : PropTypes.bool,
    expandIconClass: PropTypes.string,
    collapseIconClass: PropTypes.string,
    checked: PropTypes.bool,
    label: PropTypes.string.isRequired,
    classNamePrefix: PropTypes.string,
    onClick: PropTypes.func,
    onCheckChange: PropTypes.func,
    onSelectChange: PropTypes.func,
    onCollapseChange: PropTypes.func,
    labelFilter: PropTypes.func,
    labelFactory: PropTypes.func,
    checkboxFactory: PropTypes.func
  };

  static defautProps = {
    stateful: false,
    collapsible: true,
    collapsed: false,
    checkbox : false,
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
  };

  state = {}

  componentWillReceiveProps (nextProps) {
    const mutations = {}

    if (!this._isStateful()) return

    if (this.props.checked !== nextProps.checked) {
      mutations.checked = nextProps.checked
    }

    this.setState(mutations)
  }
  
  _getCollapseNode = () => {
    const {
      collapsible,
      children,
      expandIconClass,
      collapseIconClass
    } = this.props
    
    let collapseNode = null

    if (collapsible) {
      let collapseClassName = this._getRootCssClass() + '-collapse-toggle '
      let collapseToggleHandler = this._handleCollapseChange

      if (!children || children.length === 0) {
        collapseToggleHandler = noop
        collapseClassName += 'collapse-spacer'
      } else {
        collapseClassName += (this._isCollapsed() ? expandIconClass : collapseIconClass)
      }
      collapseNode = <span onClick={collapseToggleHandler} className={collapseClassName}></span>
    }

    return collapseNode
  }

  _getRootCssClass = () => {
    return this.props.classNamePrefix + '-node'
  }

  _getChildrenNode = () => {
    const {
      children
    } = this.props

    if (this._isCollapsed()) return null

    if (this._isStateful()) {
      return (
        <div className={this._getRootCssClass() + '-children'}>
          {
            React.Children.map(props.children, (child) => {
              return React.cloneElement(child, {
                key: child.key,
                ref: child.ref,
                checked : this.state.checked
              })
            })
          }
        </div>
      )
    } 

    return (
      <div className={this._getRootCssClass() + '-children'}>
        {children}
      </div>
    )
  }

  _getLabelNode = () => {
    const {
      classNamePrefix,
      label,
      labelFilter,
      labelFactory
    } = this.props

    let labelClassName = classNamePrefix + '-node-label'

    if (this._isSelected()) {
      labelClassName += ' selected'
    }

    let displayLabel = labelFilter ? labelFilter(displayLabel) : label

    return labelFactory(labelClassName, displayLabel, this._getLineage())
  }

  _getCheckboxNode = () => {
    const {
      checkbox,
      checkboxFactory,
      classNamePrefix
    } = this.props

    if (!checkbox) {
      return null
    }

    return checkboxFactory(classNamePrefix + '-node-checkbox', this._isChecked(), this._getLineage())
  }

  _isStateful = () => {
    return this.props.stateful
  }

  _isChecked = () => {
    if (this._isStateful() && typeof this.state.checked !== 'undefined') {
      return this.state.checked
    }

    return this.props.checked
  }

  _isSelected = () => {
    if (this._isStateful() && typeof this.state.selected !== 'undefined') {
      return this.state.selected
    }

    return this.props.selected
  }

  _isCollapsed = () => {
    const {
      collapsible,
      collapsed
    } = this.props

    const {
      collapsed: isCollapsed
    } = this.state

    if (this._isStateful() && typeof isCollapsed !== 'undefined') {
      return isCollapsed
    }

    if (!collapsible) {
      return false
    }

    return collapsed
  }

  _handleClick = () => {
    const {
      checkbox,
      onSelectChange,
      onClick
    } = this.props

    if (checkbox) {
      return this._handleCheckChange()
    } else if (onSelectChange) {
      return this._handleSelectChange()
    }

    onClick(this._getLineage())
  }

  _toggleNodeStateIfStateful = (field) => {
    if (this._isStateful()) {
      var newValue = !this.props[field]
      if (typeof this.state[field] !== 'undefined') {
        {
        }

        newValue = !this.state[field]
      }
      var mutation = {}
      mutation[field] = newValue
      console.log(mutation)
      this.setState(mutation)
    }
  }

  _handleCheckChange = () => {
    this._toggleNodeStateIfStateful('checked')
    this.props.onCheckChange(this._getLineage())
  }

  _handleSelectChange = () => {
    this._toggleNodeStateIfStateful('selected')
    this.props.onSelectChange(this._getLineage())
  }

  _handleCollapseChange = () => {
    this._toggleNodeStateIfStateful('collapsed')
    this.props.onCollapseChange(this._getLineage())
  }

  _getLineage = () => {
    return this.props.ancestor.concat(this.props.id)
  }

  render () {
    return (
      <div className={this._getRootCssClass()}>
        {this._getCollapseNode()}
        <span onClick={this._handleClick}>
          {this._getCheckboxNode()}
          {this._getLabelNode()}
        </span>
        {this._getChildrenNode()}
      </div>
    )
  }
}
