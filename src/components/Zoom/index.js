import React, { Component } from 'react';
import esriLoader from 'esri-loader';
import './index.css';

class ZoomWidget extends Component {

  zoomIn = async (event) => {
    await this.vm.zoomIn();    
  }

  zoomOut = async (event) => {
    await this.vm.zoomOut();    
  }

  async componentDidUpdate() {
    if (this.props.view) {
      const [ZoomViewModel] = await esriLoader.loadModules([
        'esri/widgets/Zoom/ZoomViewModel'
      ]);

      this.vm = new ZoomViewModel({
        view: this.props.view
      });
    }
  }

  render() {
    return (
      <div className="zoomWidget">
        <i className="esri-icon-plus zoom-label" onClick={this.zoomIn}></i>
        <div className="separator">&nbsp;</div>
        <i className="esri-icon-minus zoom-label" onClick={this.zoomOut}></i>
      </div>
    )
  }   
}

export default ZoomWidget;