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

export {Icon}
