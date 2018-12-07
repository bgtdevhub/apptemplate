import React, { Component } from 'react';
import esriLoader from 'esri-loader';
import './SearchWidget.css';

import SearchButton from './SearchButton';
import SearchInput from './SearchInput';
import SearchSuggestions from './SearchSuggestions';
import LocateWidget from '../Locate';
import LayerListWidget from '../LayerList';

class SearchWidget extends Component {
  
  state = {
    vmLocality: null,
    vmAddress: null,
    searchSuggestionVisible: false,
    vmAddressSuggestions: [],
    vmLocalitySuggestions: [],
    searchTerm: '',
    showLayerList: false
  }

  async componentDidMount() {
    const [SearchViewModel, Locator] = await esriLoader.loadModules([
      'esri/widgets/Search/SearchViewModel', 'esri/tasks/Locator'
    ]);

    this.setState({
      vmAddress: new SearchViewModel({
        sources: [{
          locator: new Locator({ url: "http://mapshare.maps.vic.gov.au/geo/arcgis/rest/services/Geocoder/VMAddressEZIAdd/GeocodeServer" }),
          singleLineFieldName: "Single Line Input",
          outFields: ["*"]
        }],
        includeDefaultSources: false
      }),
      vmLocality: new SearchViewModel({
        sources: [{
          locator: new Locator({ url: "http://mapshare.maps.vic.gov.au/geo/arcgis/rest/services/Geocoder/VMLocality/GeocodeServer" }),
          singleLineFieldName: "Single Line Input",
          outFields: ["*"]
        }],
        includeDefaultSources: false
      })
    });

    this.state.vmAddress.watch('suggestions', (results) => {
      const [vmAddressSuggestions] = [results[0].results];
      if (vmAddressSuggestions.length) {
        this.setState({
          vmAddressSuggestions
        });
      }
    });

    this.state.vmLocality.watch('suggestions', (results) => {
      const [vmLocalitySuggestions] = [results[0].results];
      if (vmLocalitySuggestions.length) {
        this.setState({
          vmLocalitySuggestions
        });
      }
    });

    this.state.vmAddress.watch('selectedResult', (result) => {
      const longitude = result.extent.center.longitude;
      const latitude = result.extent.center.latitude;
      this.props.mapView.goTo([longitude, latitude]);
      this.props.mapView.focus();
    });

    this.state.vmLocality.watch('selectedResult', (result) => {
      const longitude = result.extent.center.longitude;
      const latitude = result.extent.center.latitude;
      this.props.mapView.goTo([longitude, latitude]);
      this.props.mapView.focus();
    });
  }

  showSuggestion(searchTerm) {
    if (searchTerm) {
      this.setState({
        searchSuggestionVisible: true,
        searchTerm: searchTerm,
        showLayerList: false
      });

      const myState = {...this.state}; // to get around the state mutation warning
      myState.vmAddress.suggest(searchTerm);
      myState.vmLocality.suggest(searchTerm);

    } else {
      this.setState({
        searchTerm: '',
        vmAddressSuggestions: [],
        vmLocalitySuggestions: [],
        searchSuggestionVisible: false,
        showLayerList: false
      });
    }
  }

  doSearch(searchTerm, type) {
    this.setState({
      searchTerm,
      searchSuggestionVisible: false,
      vmAddressSuggestions: [],
      vmLocalitySuggestions: [],
      showLayerList: false
    });

    if (type === 'address') {
      this.state.vmAddress.search(searchTerm);
    } else {
      this.state.vmLocality.search(searchTerm);
    }
  }

  toggleLayerList() {
    this.setState({
      showLayerList: !this.state.showLayerList,
      searchSuggestionVisible: false
    })
  }

  render() {
    return (
      <div className="searchWidget">
        <LayerListWidget
          layerListViewModel={this.props.layerListViewModel}
          show={this.state.showLayerList}
          toggle={this.toggleLayerList.bind(this)}
          mapView={this.props.mapView}
        />
        
        <SearchInput
          showSuggestion={this.showSuggestion.bind(this)}
          searchTerm={this.state.searchTerm}
        />

        <SearchButton />

        <SearchSuggestions
          visible={this.state.searchSuggestionVisible}
          searchTerm={this.state.searchTerm}
          vmAddressSuggestions={this.state.vmAddressSuggestions}
          vmLocalitySuggestions={this.state.vmLocalitySuggestions}
          doSearch={this.doSearch.bind(this)}
        />

        <LocateWidget mapView={this.props.mapView} />
      </div>
    )
  }   
}

export default SearchWidget;