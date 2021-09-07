import React from 'react';
import './App.css';
import './Gallery.css';
import {Renderer, NodeRenderer} from './components/base';
import {CrumbStrip} from './components/crumb';
import {GalleryImage, GalleryIconGrid, GalleryListing} from './components/gallery';
import {RadioStrip} from './components/radio';

class GalleryView extends NodeRenderer {
  renderDoc() {
    return (
      <GalleryImage
        app={this.app}
        node={this.node}
      />
    );
  }
  
  renderIcons() {
    return (
      <GalleryIconGrid
        app={this.app}
        node={this.node}
      />
    );
  }
  
  renderList() {
    return (
      <GalleryListing
        app={this.app}
        node={this.node}
      />
    );
  }
  
  render() {
    if (this.type() === 'collection') {
      if (this.app.viewmode.value === 'icons') {
      	return this.renderIcons();
      } else if (this.app.viewmode.value === 'list') {
        return this.renderList();
      } else {
        console.log("Unknown view mode:");
        console.log(this.app.viewmode);
        return this.renderIcons();
      }
    } else {
      return this.renderDoc();
    }
  }
}

class GalleryViewControls extends Renderer {

  render() {
    return (
      <div id='gallery-view-controls'>
        <style jsx>{`
          #gallery-view-controls {
            position: absolute;
            left: 0px;
            top: 0px;
            padding: 2px;
          }
        `}
        </style>
        <RadioStrip
          app={this.app}
          action={(mode) => {this.app.viewmode = mode}}
          options={this.app.viewmodes}
          current={this.app.viewmode}
          size='24'
        />
      </div>
    );
  }
}

class App extends React.Component {

  viewmodes = [{
    title: 'Icons',
    value: 'icons',
    url: '/icons/gallery-view-icons.png',
  },{
    title: 'List',
    value: 'list',
    url: '/icons/gallery-view-list.png',
  }];

  constructor (props) {
    super(props);
    this.state = {
      node: null,
      viewmode: this.viewmodes[0],
    };
  }

  componentDidMount() {
    this.path = '/';
  }
  
  updateState(values) {
    const newState = Object.assign({}, this.state, values)
    this.setState(newState);
  }
  
  get viewmode() {
    return this.state.viewmode;
  }
  
  set viewmode(mode) {
    if (! this.viewmodes.includes(mode) ) {
      console.log("Invalid view mode " + mode);
    } else {
      this.updateState({viewmode: mode})
    }
  }

  set node(node) {
    if (node.deep) {
      this.updateState({node: node});
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
        this.updateState({node: node});
      });
  }

  render() {
    if (! this.node ){ return ''; }
    
    const node = this.node;
    return (
      <div className="App">
        <div class='headerbar'>
          <GalleryViewControls
            app={this}
          />
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
