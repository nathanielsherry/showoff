import React from 'react';
import './App.css';
import './Gallery.css';

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

class Crumb extends NodeRenderer {

  render() {
    var title = this.node.title;
    if (this.path().length === 0) {
      title="Gallery";
    }
    console.log(title);
    return (
      <div class='crumb'>
        <a href='#' onClick={this.activator}>
          {title}
        </a>
      </div>
    );
  }

}

class CrumbStrip extends NodeRenderer {

  renderCrumb(node) {
    console.log(node)
    return (
      <Crumb 
        app={this.app}
        node={node}
      />
    );
  }

  render() {
    const parent_crumbs = this.parents().map((p) => this.renderCrumb(p));
    const this_crumb = this.renderCrumb(this.node);
    
    return (
      <div class='floating-control'>
        <div id='crumb-strip'>
          { parent_crumbs }
          { this_crumb }
        </div>
      </div>
    );
  }

}



class Icon extends NodeRenderer {

  render() {
    const src = '/api/thumb/' + this.spath();
    return (
      <div class='icon'>
        <div class='icon-inner'>
          <img 
            class='icon-image'
            onClick={this.activator} 
            src={src}
            alt={this.title()}
          /><br/>
          <span class='icon-text'>
            {this.title()}
          </span>
        </div>
      </div>
    );
  }

}

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
