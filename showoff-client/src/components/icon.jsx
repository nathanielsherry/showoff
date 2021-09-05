import {NodeRenderer} from './base';

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

export {Icon}
