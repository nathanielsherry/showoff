import React from 'react';
import './App.css';
import './Gallery.css';
import {NodeRenderer} from './components/base';
import {CrumbStrip} from './components/crumb';
import {GalleryImage, GalleryLinks} from './components/gallery';

class GalleryView extends NodeRenderer {
  renderDoc() {
    return (
      <GalleryImage
        app={this.app}
        node={this.node}
      />
    );
  }
  
  renderLinks() {
    return (
      <GalleryLinks
        app={this.app}
        node={this.node}
      />
    );
  }
  
  render() {
    if (this.type() === 'collection') {
      return this.renderLinks();
    } else {
      return this.renderDoc();
    }
  }
}


class App extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      node: null,
    };
  }

  componentDidMount() {
    this.path = '/';
  }

  set node(node) {
    if (node.deep) {
      this.setState({node: node});
    } else {
      this.path = node.path.join('/');
    }
  }
  
  get node() {
    return this.state.node;
  }
  
  set path(spath) {
    console.log('Navigating to path: ' + spath);
    fetch('/api/list/' + spath)
      .then((r) => r.json())
      .then((node) => {
        console.log('Received node for new path:');
        console.log(node)
        this.setState({node: node});
      });
  }

  render() {
    if (! this.node ){ return ''; }
    
    const node = this.node;
    return (
      <div className="App">
        <div class='headerbar'>
          <CrumbStrip
            app={this} 
            node={node}
          />
        </div>
        <GalleryView
          app={this} 
          node={node}
        />
 
      </div>
    );
  }
}

  
export default App;
