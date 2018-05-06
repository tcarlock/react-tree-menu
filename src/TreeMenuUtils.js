export default {

  /**
   * //TODO: use immutable API here..this function mutates!
   *
   * @param lineage
   * @param prevState
   * @param mutatedProperty
   * @param identifier optional
   * @returns {*}
   */
  getNewTreeState: (lineage, prevState, mutatedProperty, identifier) => {
    function setPropState(node, value) {
      node[mutatedProperty] = value
      const { children } = node
      if (children) {
        node.children.forEach((childNode, ci) => {
          setPropState(childNode, value)
        })
      }
    }

    function getUpdatedTreeState(state) {
      const id = lineage.shift()

      state = state || prevState
      state.forEach((node, i) => {
        const nodeId = identifier ? state[i][identifier] : i

        if (nodeId === id) {
          if (!lineage.length) {
            setPropState(state[i], !state[i][mutatedProperty])
          } else {
            state[i].children = getUpdatedTreeState(state[i].children)
          }
        }
      })

      return state
    }

    return getUpdatedTreeState()
  }
}
