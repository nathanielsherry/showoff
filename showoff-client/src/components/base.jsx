import React from 'react';

class NodeRenderer extends React.Component {
  /*
   * props:
   *  - app: App class
   *  - node: Struct for node in document graph
   */

  constructor(props) {
    super(props);
    this.activator = this.activate.bind(this)
  }

  get app() {
    return this.props.app;
  }

  get node() {
    return this.props.node;
  }

  path() {
    return this.node.path;
  }
  
  spath() {
    return this.path().join('/');
  }
  
  parents() {
    return this.node.parents;
  }
  
  title() {
    return this.node.title;
  }
  
  type() {
    return this.node.type;
  }

  activate() {
    return this.app.node = this.node;
  }
  
}

export {NodeRenderer}
