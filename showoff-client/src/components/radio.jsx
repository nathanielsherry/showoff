import React from 'react';
import {Renderer} from './base';

class RadioButton extends Renderer {

  get option() {
    return this.props.option;
  }
  
  get current() {
    return this.props.current;
  }
  
  get active() {
    return this.option.value === this.current.value;
  }
  
  choose(mode) {
    return ((mode) => {
      this.setState({});
      this.act(mode);
    });
  }

  render() {
    console.log(this.option);
    console.log(this.active);
    return (
      <div class='radiobutton'>
        <style jsx>{`
          .radiobutton {
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin: 2px;
            padding: 0px;
            flex-basis: min-content;
            word-wrap: break-word;
          }
          
          .radiobutton-inner {
            padding: 3px;
            border-radius: 5px;
         
          }
          
          .radiobutton-inner-active {
            background: #FFFBF340;
            padding: 3px;
            border-radius: 5px;
            box-shadow: 0px 1px 5px -2px #00000080;
            border: 1px solid #ffffff20;          
          }
          
          .radiobutton img {
            display: block;
          }
        `}</style>
        <div class={this.active ? 'radiobutton-inner-active' : 'radiobutton-inner'}>
          <img 
            onClick={() => {
              this.act(this.option);
            }} 
            src={this.option.url}
            alt={this.option.title}
          />
        </div>
      </div>
    );
  }

}


class RadioStrip extends Renderer {

  renderRadio(option) {
    console.log(option)
    return (
      <RadioButton 
        option={option}
        action={(o) => this.act(o)}
        current={this.props.current}
      />
    );
  }

  render() {
    const radiobuttons = this.props.options.map((o) => this.renderRadio(o));
    
    return (
      <div class='floating-control'>
        <div class='radio-strip unselectable'>
          <style jsx>{`
            .radio-strip {
              display: flex;
              flex-direction: row;
              flex-grow: 0;
              flex-shrink: 0;
              align-items: center;
              justify-content: center;
              padding: 2px;
            }
          `}</style>
          { radiobuttons }
        </div>
      </div>
    );
  }

}

export {RadioStrip}
