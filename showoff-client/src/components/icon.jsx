import {NodeRenderer} from './base';

class Icon extends NodeRenderer {

  render() {
    const src = '/api/thumb/' + this.spath();
    return (
      <div class='icon'>
        <style jsx>{`
          .icon {
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin: 10px;
            padding: 0px;
            flex-basis: min-content;
            word-wrap: break-word;
          }
          
          .icon-inner {
          
          }
          
          .icon-image {
            background: #FFFBF3;
            border: 5px solid #FFFBF3;
            border-radius: 5px;
            box-shadow: 0px 1px 5px -2px #00000080;
          }
          
          .icon-text {
            color: #495575;
          }
          
          .icon img {
          
          }
        `}</style>
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

class ListIcon extends NodeRenderer {

  render() {
    const src = '/api/thumb/' + this.spath();
    return (
      <div class='icon'>
        <style jsx>{`
          .icon {
            margin: 10px;
            padding: 0px;
            flex-basis: min-content;
            word-wrap: break-word;
          }
          
          .icon-inner {
            display: flex;
            flex-direction: row;
            justify-content: center;          
          }
          
          .icon-image {
            width: 32px;
            height: 32px;
            flex-grow: 0;
          }
          
          .icon-text {
            color: #495575;
            flex-grow: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 0px 5px 0px 5px;
          }
          
          .icon-spacing {
            flex-grow: 1;
          }
          
          .icon-stats {
            color: #495575;
            flex-grow: 0;
          }
          
          .icon img {
          
          }
        `}</style>
        <div class='icon-inner'>
          <img 
            class='icon-image'
            onClick={this.activator} 
            src={src}
            alt={this.title()}
          /><br/>
          <div class='icon-text'>
            <span>
              {this.title()}
            </span>
          </div>
          <div class='icon-spacing'>
            
          </div>
          <div class='icon-stats'>
            
          </div>
        </div>
      </div>
    );
  }

}

export {Icon, ListIcon}
