import PropTypes from 'prop-types'
import React, { Component } from 'react'
import TreeNode from './TreeNode.jsx'
import TreeNodeMixin from './TreeNodeMixin'
import nodeDefaultProps from './nodeDefaultProps'
import _clone from 'lodash/lang/clone'
import _omit from 'lodash/object/omit'
import _sortBy from 'lodash/collection/sortBy'
import invariant from 'invariant'
import _map from 'lodash/collection/map'

/**
 * The root component for a tree view. Can have one or many <TreeNode/> children
 *
 * @type {TreeMenu}
 */
export default class TreeMenu extends Component {
  static propTypes = {
    stateful: PropTypes.bool,
    classNamePrefix: PropTypes.string,
    identifier: PropTypes.string,
    onTreeNodeClick: PropTypes.func,
    onTreeNodeCheckChange: PropTypes.func,
    onTreeNodeSelectChange: PropTypes.func,
    collapsible: PropTypes.bool,
    expandIconClass: PropTypes.string,
    collapseIconClass: PropTypes.string,
    data: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object
    ]),
    labelFilter: PropTypes.func,
    labelFactory: PropTypes.func,
    checkboxFactory: PropTypes.func,
    sort: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.function
    ])
  };

  static defautProps = {
    classNamePrefix: 'tree-view',
    stateful: false
  };

  render () {
    const { classNamePrefix } = this.props

    return (
      <div className={classNamePrefix}>
        {this._getTreeNodes()}
      </div>
    )
  }

  /**
   * Gets data from declarative TreeMenu nodes
   *
   * @param children
   * @returns {*}
   * @private
   */
  _getDataFromChildren = (children) => {
    const iterableChildren = Array.isArray(children) ? children : [children]

    return iterableChildren.map((child) => {
      const data = _clone(_omit(child.props, 'children'))

      if (child.props.children) {
        data.children = this._getDataFromChildren(child.props.children)
      }

      return data
    })
  }

  /**
   * Get TreeNode instances for render()
   *
   * @returns {*}
   * @private
   */
  _getTreeNodes = () => {
    const treeMenuProps = this.props
    let treeData

    invariant(
      !treeMenuProps.children || !treeMenuProps.data,
      'Either children or data props are expected in TreeMenu, but not both'
    )

    if (treeMenuProps.children) {
      treeData = this._getDataFromChildren(treeMenuProps.children)
    } else {
      treeData = treeMenuProps.data
    }

    const thisComponent = this

    function dataToNodes(data, ancestor = []) {
      const isRootNode = !ancestor
      const nodes = _map(data, (dataForNode, i) => {
        const nodeProps = _omit(dataForNode, ['children', 'onClick', 'onCheckChange'])
        let children = []

        nodeProps.label = nodeProps.label || i

        if (dataForNode.children) {
          children = dataToNodes(dataForNode.children, ancestor.concat(TreeNodeMixin.getNodeId(treeMenuProps, nodeProps, i)))
        }

        const newElement = React.createElement(
          TreeNode,
          Object.assign(
            nodeProps,
            TreeNodeMixin.getTreeNodeProps(treeMenuProps, nodeProps, ancestor, isRootNode, i),
            nodeDefaultProps
          ),
          children
        )

        return newElement
      })

      const { sort } = thisComponent.props

      if (sort) {
        const sorter = typeof sort === 'boolean' ? (node) => { node.props.label } : sort
        return _sortBy(nodes, sorter)
      }

      return nodes
    }

    if (treeData) {
      return dataToNodes(treeData)
    }
  }
}
