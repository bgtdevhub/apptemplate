import React, { Component } from 'react';
import './index.css';
import esriLoader, { setDefaultOptions } from 'esri-loader';

import SearchWidget from '../SearchWidget/SearchWidget';
import ZoomWidget from '../Zoom';

// setDefaultOptions({ version: '4.9' })

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      view: null,
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

    const [OAuthInfo, esriId, MapView, WebMap, ScaleBar, LayerListViewModel, Legend, WMTSLayer, Basemap] = await esriLoader.loadModules(
      [
        "esri/identity/OAuthInfo",
        "esri/identity/IdentityManager",
        "esri/views/MapView",
        "esri/WebMap",
        "esri/widgets/ScaleBar",
        "esri/widgets/LayerList/LayerListViewModel",
        "esri/widgets/Legend",
        "esri/layers/WMTSLayer",
        "esri/Basemap"
      ]
    );

    console.log(base, base.config.portalUrl) 
    // var info = new OAuthInfo({
    //   appId: base.config.oauthappid,
    //   portalUrl: base.config.portalUrl,
    //   popup: true
    // });
    // // override the default behavior of force redirecting to /home/signin.html in scenarios where app is hosted alongside ArcGIS Enterprise or on *.arcgis.com
    // esriId.useSignInPage = false;
    // esriId.registerOAuthInfos([info]);

    // check to see if a user signed in during a previous visit
    // esriId.checkSignInStatus(info.portalUrl + "/sharing").then(
    //   function (credential) {
    //     snagUserInfo(credential);
    //   }
    // );

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
        id: base.config.webmap,
        portal: base.portal
      }
    });

    const view = new MapView({
      container: "viewDiv",
      map: map,
      scale: 4518427,
      center: [145.11890095422424, -36.733030896553814],
      ui: {
        components: ['attribution']
      }
    });

    await view.when();

    if (base.config.disableScroll) {
      view.on("mouse-wheel", function(event) {
        // disable mouse wheel scroll zooming on the view
        event.stopPropagation();
      });
    }

    view.map.basemap = defaultBasemap;

    const scaleBar = new ScaleBar({
      view: view,
      unit: 'metric'
    });

    view.ui.add(scaleBar, {
      position: "bottom-left"
    });
      
    const layerListViewModel = await new LayerListViewModel({
      view: view
    });

    if (layerListViewModel.operationalItems.items.length) {
      new Legend({
        view: view
      }, "legendDiv");

      this.setState({
        haveLayers: true
      })
    }

    // change the attribution text
    const poweredBy = document.getElementsByClassName("esri-attribution__powered-by");

    poweredBy[0].innerHTML = '';

    const disclaimerDiv = document.createElement('DIV');
    disclaimerDiv.classList.add("disclaimer-div");
    disclaimerDiv.innerHTML = `<div class="disclaimer-text">
      Vicmap Basemap Services &copy; 2018 State Government of Victoria</div>
      <div class='vertical-line'>&nbsp;|&nbsp;</div>
      <a href="https://www2.delwp.vic.gov.au/copyright/" target="_blank" style="color:#4BABFA;">Copyright and Disclaimer</a>
    </div>`
    poweredBy[0].appendChild(disclaimerDiv);

    poweredBy[0].style.opacity = 1;
    
    this.setState({
      view,
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
            view={this.state.view}
            layerListViewModel={this.state.layerListViewModel}
            basemaps={this.state.basemaps}
            selectedDefaultBasemap={this.state.selectedDefaultBasemap}
            showLocateMe={this.state.showLocateMe}
          />
          <ZoomWidget view={this.state.view} />
        </div>
        <div id="legendDiv" className={legendDivClass}>
        </div>
      </div>
    );
  }
}

export default App;
