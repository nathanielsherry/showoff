import {NodeRenderer} from './base';


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

export {Crumb, CrumbStrip}
