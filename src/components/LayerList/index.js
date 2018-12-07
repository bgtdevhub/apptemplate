import React, { Component } from 'react';
import './index.css';
import ListView from './ListView';

class LayerListWidget extends Component {

  render() {
    return (
      <div className="layerListWidget">
        <i className="esri-icon-layers layers" onClick={this.props.toggle}></i>
        
        <ListView layerListViewModel={this.props.layerListViewModel} show={this.props.show} mapView={this.props.mapView} />
      </div>
    )
  }   
}

export default LayerListWidget;