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
            cursor: pointer;
          }
          
          .icon img {
            cursor: pointer;
          }
        `}</style>
        <div class='icon-inner'>
          <img
            onClick={this.act} 
            class='icon-image'
            src={src}
            alt={this.title()}
          />
          <div class='icon-text' onClick={this.act}>
            {this.title()}
          </div>
        </div>
      </div>
    );
  }

}

class ListIcon extends NodeRenderer {

  render() {
    const src = '/api/thumb/' + this.spath();
    return (
      <div class='listicon'>
        <style jsx>{`
          .listicon {
            margin: 10px;
            padding: 0px;
            flex-basis: min-content;
            word-wrap: break-word;
            height: 48px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          
          .listicon-inner {
            display: flex;
            flex-direction: row;
            justify-content: center;
            flex-basis: min-content;
            cursor: pointer;    
          }
                   
          .listicon-text {
            color: #495575;
            flex-grow: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 0px 5px 0px 5px;
          }
          
          .listicon-spacing {
            flex-grow: 1;
          }
          
          .listicon-stats {
            color: #49557580;
            flex-grow: 0;
            font-family: mono;
            font-size: 9pt;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .listicon-image-inner {
            width: auto;
            height: auto;
          }
          
          .listicon-image-x {
            width: 48px;
            height: 48px;
            flex-grow: 0;
            display: flex;
            flex-direction: row;
            justify-content: center;
          }
          
          .listicon-image-y {
            width: auto;
            height: auto;
            flex-grow: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          
          .listicon-inner img {
            max-width: 48px;
            max-height: 48px;
            display: block;
          }
        `}</style>
        <div onClick={this.act} class='listicon-inner'>
          <div class='listicon-image-x'>
            <div class='listicon-image-y'>
              <img
                src={src}
                alt={this.title()}
              />
            </div>
          </div>
          <div class='listicon-text'>
            <span>
              {this.title()}
            </span>
          </div>
          <div class='listicon-spacing'>
            
          </div>
          <div class='listicon-stats'>
            {this.mimetype}
          </div>
        </div>
      </div>
    );
  }

}

export {Icon, ListIcon}
