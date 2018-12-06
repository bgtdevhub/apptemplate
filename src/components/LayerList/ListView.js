import React, { Component } from 'react';
import './ListView.css';

class ListView extends Component {

  constructor(props) {
    super(props);
    this.listViewRef = React.createRef();

    this.onOff = null;
  }

  componentDidUpdate() {
    if (this.props.layerListViewModel) {

      if (!this.onOff) {
        this.onOff = new Array(this.props.layerListViewModel.operationalItems.items.length).fill(1);
      }
    }
  }

  showHideLayer(e, layer, index) {
    e.stopPropagation();

    const target = document.getElementById(layer.title);
    const classList = [...target.firstChild.classList];
    
    const isCurrentlyVisible = classList.includes("esri-icon-visible");

    if (isCurrentlyVisible) {
      layer.visible = false;
      target.firstChild.classList.remove("esri-icon-visible");
      target.firstChild.classList.add("esri-icon-non-visible");
      this.onOff[index] = 0;
    } else {
      layer.visible = true;
      target.firstChild.classList.remove("esri-icon-non-visible");
      target.firstChild.classList.add("esri-icon-visible");
      this.onOff[index] = 1;
    }
  }

  render() {

    const onOffIcon = ["esri-icon-non-visible toggle-icon", "esri-icon-visible toggle-icon"];

    return (
      this.props.show && <div className="list-view" ref={this.listViewRef}>
      {
        this.props.layerListViewModel && this.props.layerListViewModel.operationalItems.items.map((layer, index) => {
          return (
            <div key={index}>
              <div className="layer-div" id={layer.title} onClick={(e) => this.showHideLayer(e, layer, index)}>
                <i className={onOffIcon[this.onOff[index]]}></i>
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