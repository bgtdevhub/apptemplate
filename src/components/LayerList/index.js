import React, { Component } from 'react';
import './index.css';
import ListView from './ListView';

class LayerListWidget extends Component {

  render() {
    return (
      <div className="layerListWidget">
        <i className="esri-icon-layers layers" onClick={this.props.toggle}></i>
        
        <ListView
          layerListViewModel={this.props.layerListViewModel}
          show={this.props.show}
          view={this.props.view}
          basemaps={this.props.basemaps}
          selectedDefaultBasemap={this.props.selectedDefaultBasemap}
        />
      </div>
    )
  }   
}

export default LayerListWidget;