import React, { Component } from 'react';
import './ListView.css';

class ListView extends Component {

  constructor(props) {
    super(props);
    this.listViewRef = React.createRef();
    this.basemapSwitcherRef = React.createRef();

    this.overlaysOnOff = null;
    this.basemapOnOff = null;
  }

  componentDidUpdate() {
    if (this.props.layerListViewModel) {

      // initialization only
      if (!this.overlaysOnOff) {
        this.overlaysOnOff = new Array(this.props.layerListViewModel.operationalItems.items.length).fill(1);
        if (this.props.selectedDefaultBasemap === "cartographic") {
          this.basemapOnOff = [1, 0, 0];
        } else if (this.props.selectedDefaultBasemap === "aerial") {
          this.basemapOnOff = [0, 1, 0];
        } else {
          this.basemapOnOff = [0, 0, 1];
        }
      }
    }
  }

  showHideLayer(e, layer, index, isFromCheckbox) {

    const target = document.getElementById(layer.title);
    
    const isCurrentlyVisible = target.firstChild.checked;

    if (isCurrentlyVisible) {
      layer.visible = false;
      target.firstChild.checked = false;
      this.overlaysOnOff[index] = 0;
    } else {
      layer.visible = true;
      target.firstChild.checked = true;
      this.overlaysOnOff[index] = 1;
    }
  }

  switchBasemap(e, basemap) {

    const children = Array.prototype.slice.call(this.basemapSwitcherRef.current.children);

    children.forEach(child => {
      child.classList.remove("bold");
    })

    e.target.classList.add("bold");

    if (basemap === "cartographic") {
      this.props.view.map.basemap = this.props.basemaps[0];
      this.basemapOnOff = [1, 0, 0];
    } else if (basemap === "aerial") {
      this.props.view.map.basemap = this.props.basemaps[1];
      this.basemapOnOff = [0, 1, 0];
    } else {
      this.props.view.map.basemap = this.props.basemaps[2];
      this.basemapOnOff = [0, 0, 1];
    }
  }

  render() {

    const basemapClass = ["basemap-label", "basemap-label bold"];

    return (
      this.props.show && <div className="list-view" ref={this.listViewRef}>
      <div className="layer-section-label">BASEMAP</div>
      <div className="basemap-switcher" ref={this.basemapSwitcherRef}>
        <div className={basemapClass[this.basemapOnOff[0]]} onClick={(e) => this.switchBasemap(e, "cartographic")}>Vicmap Basemap - Cartographic</div>
        <div className={basemapClass[this.basemapOnOff[1]]} onClick={(e) => this.switchBasemap(e, "aerial")}>Vicmap Basemap - Aerial</div>
        <div className={basemapClass[this.basemapOnOff[2]]} onClick={(e) => this.switchBasemap(e, "overlay")}>Vicmap Basemap - Overlay</div>
      </div>
      {
        this.props.layerListViewModel && this.props.layerListViewModel.operationalItems.items.length ?
        <div className="layer-section-label">OVERLAYS</div> : <div></div>
      }
      {
        this.props.layerListViewModel && this.props.layerListViewModel.operationalItems.items.map((layer, index) => {
          return (
            <div key={index}>
              <div className="layer-div" id={layer.title} onClick={(e) => this.showHideLayer(e, layer, index)}>
                <input type="checkbox" defaultChecked={this.overlaysOnOff[index]} onClick={(e) => this.showHideLayer(e, layer, index, "isFromCheckbox")}/>
                <div className="layer-title">{layer.title}</div>
              </div>
            </div>
          )
        })
      }
      </div>
    )
  }
};

export default ListView;