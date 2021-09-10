import React from 'react';

class Renderer extends React.Component {
  /*
   * props:
   *  - app: App class
   *  - action: Function for component's default action, any signature 
   */

  get app() {
    return this.props.app;
  }

  constructor(props) {
    super(props);
    this._action_function = this.props.action;
  }
  
  get act() {
    if (this._action_function == null) {
      console.log('Component has no default action');
      return () => {};
    }
    return this._action_function;
  }

}

class NodeRenderer extends Renderer {
  /*
   * props:
   *  - app: App class
   *  - node: Struct for node in document graph
   */

  get act() {
    return () => {this.app.node = this.node};
  }

  get node() {
    return this.props.node;
  }
  
  get cursor() {
    return this.node.cursor;
  }

  path() {
    return this.node.path;
  }
  
  spath() {
    return this.path().join('/');
  }
  
  makepath(infix) {
    return this.app.prefix + '/' + infix + '/' + this.spath();
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
  
  get filesize() {
    return 'size' in this.node ? this.node.size : null;
  }
  
  get times() {
    return 'times' in this.node ? this.node.times : null;
  }

  get mimetype() {
    return 'mimetype' in this.node ? this.node.mimetype : null;
  }
  
}

export {Renderer, NodeRenderer}
