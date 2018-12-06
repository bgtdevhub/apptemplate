import React, { Component } from 'react';
import './index.css';
import ListView from './ListView';

class LayerListWidget extends Component {

  render() {
    return (
      <div className="layerListWidget" onClick={this.props.toggle}>
        <i className="esri-icon-layers layers"></i>
        
        <ListView layerListViewModel={this.props.layerListViewModel} show={this.props.show}/>
      </div>
    )
  }   
}

export default LayerListWidget;