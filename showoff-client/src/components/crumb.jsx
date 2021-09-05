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
        <style jsx>{`
          .crumb {
            padding: 0px 5px;
          }
          
          .crumb::before {
            content: '»';
            color: #495575;
          }
          
          .crumb a {
            text-decoration: none;
            color: #495575;
            padding: 0px 5px 0px 5px;
          }
        `}</style>
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
          <style jsx>{`
            #crumb-strip {
              display: flex;
              flex-grow: 0;
              flex-shrink: 0;
              align-items: center;
              justify-content: center;
              background: url('bg.png'), #C6B791;
              border: 0px solid #774F38;
              box-shadow: inset 0px 0.5px 5px 0px #00000050;
              border-radius: 100px;
              margin: 10px 10px 0px 10px;
              padding: 5px;
              min-width: 600px;
              min-height: 32px;
            }
          `}</style>
          { parent_crumbs }
          { this_crumb }
        </div>
      </div>
    );
  }

}

export {Crumb, CrumbStrip}
