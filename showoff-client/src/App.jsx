import React from 'react';
import './App.css';
import './Gallery.css';
import {NodeRenderer} from './components/base';
import {Icon} from './components/icon';
import {Crumb, CrumbStrip} from './components/crumb';

class GalleryImage extends NodeRenderer {

  render() {
    const src = '/api/image/' + this.spath();
    return (
      <div id='gallery'>
        <img class='gallery-image' src={src} alt={this.title()}/>
      </div>
    );
  }

}

class GalleryLinks extends NodeRenderer {

  renderIcon(link) {
    return (
      <Icon
        app={this.app}
        node={link}
      />
    );
  }

  render() {
    const collections = this.node.links.map((l) => this.renderIcon(l));
    const documents = this.node.documents.map((l) => this.renderIcon(l));
    return (
      <div id='gallery' class='gallery-links'>
        {collections}
        {documents}
      </div>
    );
  }

}

class GalleryView extends NodeRenderer {
  renderDoc() {
    return (
      <div id='gallery-outer'>
        <GalleryImage
          app={this.app}
          node={this.node}
        />
      </div>
    );
  }
  
  renderLinks() {
    return (
      <div id='gallery-outer'>
        <GalleryLinks
          app={this.app}
          node={this.node}
        />
      </div>
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
      
        <CrumbStrip
          app={this} 
          node={node}
        />
      
        <GalleryView
          app={this} 
          node={node}
        />
 
      </div>
    );
  }
}

  
export default App;
