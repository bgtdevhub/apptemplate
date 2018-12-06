import React, { Component } from 'react';
import './index.css';
import esriLoader from 'esri-loader';

import SearchWidget from '../SearchWidget/SearchWidget';
import ZoomWidget from '../Zoom';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      mapView: null,
      layerListViewModel: null
    }
  }

  async componentDidMount() {
    const [ApplicationBase, applicationConfig, applicationSettings] = await esriLoader.loadModules([
      "ApplicationBase/ApplicationBase",
      'dojo/text!./ApplicationBase/config/application.json',
      'dojo/text!./ApplicationBase/config/applicationBase.json'
    ]);

    const base = await new ApplicationBase({
      config: applicationConfig,
      settings: applicationSettings      
    }).load();

    // base.config.search = true; // testing purpose
    // await this.setState({
    //   showSearch: base.config.search
    // })

    const [MapView, WebMap, ScaleBar, LayerListViewModel, Legend] = await esriLoader.loadModules(
      ["esri/views/MapView", "esri/WebMap", "esri/widgets/ScaleBar", "esri/widgets/LayerList/LayerListViewModel", "esri/widgets/Legend"]);

    const webmap = new WebMap({
      portalItem: {
        id: '655fca18c8604b2daed8c41f2c2ea4bc'
      }
    });

    const mapView = new MapView({
      container: "viewDiv",
      map: webmap,
      ui: {
        components: ['attribution']
      }
    });

    await mapView.when();

    const scaleBar = new ScaleBar({
      view: mapView,
      unit: 'metric'
    });

    mapView.ui.add(scaleBar, {
      position: "bottom-left"
    });
      
    const layerListViewModel = await new LayerListViewModel({
      view: mapView
    });

    new Legend({
      view: mapView
    }, "legendDiv");
    
    this.setState({
      mapView,
      layerListViewModel
    })
  }

  render() {
    return (
      <div>
        <div id="viewDiv" className="viewDiv">
          <SearchWidget mapView={this.state.mapView} layerListViewModel={this.state.layerListViewModel} />
          <ZoomWidget mapView={this.state.mapView} />
        </div>
        <div id="legendDiv" className="legendDiv">
        </div>
      </div>
    );
  }
}

export default App;
