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
      layerListViewModel: null,
      basemaps: [],
      selectedDefaultBasemap: 'cartographic',
      haveLayers: false
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

    const [MapView, WebMap, ScaleBar, LayerListViewModel, Legend, WMTSLayer, Basemap] = await esriLoader.loadModules(
      [
        "esri/views/MapView",
        "esri/WebMap",
        "esri/widgets/ScaleBar",
        "esri/widgets/LayerList/LayerListViewModel",
        "esri/widgets/Legend",
        "esri/layers/WMTSLayer",
        "esri/Basemap"
      ]
    );

    const wmtsCartoDELWP = new WMTSLayer(base.config.cartoBasemap);

    const wmtsAerialDELWP = new WMTSLayer(base.config.aerialBasemap);

    const wmtsOverlayDELWP = new WMTSLayer(base.config.overlayBasemap);

    const cartoBasemap = new Basemap({
      baseLayers: [wmtsCartoDELWP]
    });

    const aerialBasemap = new Basemap({
      baseLayers: [wmtsAerialDELWP]
    });

    const overlayBasemap = new Basemap({
      baseLayers: [wmtsAerialDELWP, wmtsOverlayDELWP]
    });

    this.setState({
      basemaps: [cartoBasemap, aerialBasemap, overlayBasemap],
      selectedDefaultBasemap: base.config.defaultBasemap || "cartographic"
    })

    let defaultBasemap = cartoBasemap;

    if (base.config.defaultBasemap === "aerial") {
      defaultBasemap = aerialBasemap;
    } else if (base.config.defaultBasemap === "overlay") {
      defaultBasemap = overlayBasemap;
    }

    const map = await new WebMap({
      portalItem: {
        id: base.results.webMapItems[0].value.id
      }
    });

    const mapView = new MapView({
      container: "viewDiv",
      map: map,
      scale: 4518427,
      center: [145.11890095422424, -36.733030896553814],
      ui: {
        components: ['attribution']
      }
    });

    await mapView.when();

    if (base.config.disableScroll) {
      mapView.on("mouse-wheel", function(event) {
        // disable mouse wheel scroll zooming on the view
        event.stopPropagation();
      });
    }

    mapView.map.basemap = defaultBasemap;

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

    if (layerListViewModel.operationalItems.items.length) {
      new Legend({
        view: mapView
      }, "legendDiv");

      this.setState({
        haveLayers: true
      })
    }

    // change the attribution text
    const poweredBy = document.getElementsByClassName("esri-attribution__powered-by");

    poweredBy[0].innerHTML = '';

    const disclaimerDiv = document.createElement('DIV');
    disclaimerDiv.innerHTML = `<div>
      Vicmap Basemap Services &copy; 2018 State Government of Victoria |
      <a href="https://www2.delwp.vic.gov.au/copyright/" target="_blank" style="color:#4BABFA;">Copyright and Disclaimer</a>
    </div>`
    poweredBy[0].appendChild(disclaimerDiv);

    poweredBy[0].style.opacity = 1;
    
    this.setState({
      mapView,
      layerListViewModel,
      showLocateMe: base.config.showLocateMe
    })
  }

  render() {

    const legendDivClass = this.state.haveLayers ? "legendDiv" : "";

    return (
      <div>
        <div id="viewDiv" className="viewDiv">
          <SearchWidget
            mapView={this.state.mapView}
            layerListViewModel={this.state.layerListViewModel}
            basemaps={this.state.basemaps}
            selectedDefaultBasemap={this.state.selectedDefaultBasemap}
            showLocateMe={this.state.showLocateMe}
          />
          <ZoomWidget mapView={this.state.mapView} />
        </div>
        <div id="legendDiv" className={legendDivClass}>
        </div>
      </div>
    );
  }
}

export default App;
