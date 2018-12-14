import React, { Component } from 'react';
import esriLoader from 'esri-loader';
import './index.css';

class LocateWidget extends Component {

  locateMe = async (event) => {
    await this.vm.locate();    
  }

  async componentDidUpdate() {

    if (this.props.view) {
      const [LocateViewModel] = await esriLoader.loadModules([
        'esri/widgets/Locate/LocateViewModel'
      ]);

      this.vm = new LocateViewModel({
        view: this.props.view,
        scale: 5000
      });

    }
  }

  render() {
    const locateMeClass = this.props.showLocateMe ? "locateWidget" : "locateWidget hidden";
    const locateFontClasses = ['esri-icon-locate locateButtonFont'];

    return (
      <div className={locateMeClass} onClick={this.locateMe}>
        <i className={locateFontClasses}></i>
      </div>
    )
  }   
}

export default LocateWidget;