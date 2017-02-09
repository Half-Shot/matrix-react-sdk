/*
Copyright 2015, 2016 OpenMarket Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

import React from 'react';
import Leaflet from 'leaflet';
import sdk from '../../../index';
import UserSettingsStore from '../../../UserSettingsStore';


const ZOOM_WORLD = 5; /** Zoom level for the selector */
const ZOOM_STREET = 15; /** Zoom level for a given location */

module.exports = React.createClass({
    displayName: 'MLocationBody',

    propTypes: {
        /* the MatrixEvent to show */
        mxEvent: React.PropTypes.object.isRequired,

        /* called when the image has loaded */
        onWidgetLoad: React.PropTypes.func.isRequired,
    },

    getInitialState: function() {
        return {
            leafletMap: null,
            url: null,
            body: null,
            mapEnabled: false,
        };
    },

    renderMap: function() {
        const zoom = ZOOM_STREET;
        if (this.state.leafletMap !== null) {
            return;
        }
        const leafletMap = new Leaflet.Map(this.refs.map);
        leafletMap.addLayer(
            new Leaflet.TileLayer(
                'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                {
                    minZoom: ZOOM_WORLD,
                    maxZoom: ZOOM_STREET,
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                }
            )
        );
        leafletMap.setView(this.state.coords, zoom);
        Leaflet.Icon.Default.prototype.options.imagePath = "/img/";
        leafletMap.addControl(new Leaflet.Marker(this.state.coords, {
            title: this.state.body,
            icon: new Leaflet.Icon.Default(),
        }));
        this.setState({leafletMap});
    },

    componentDidMount: function() {
        this.setState({mapEnabled: UserSettingsStore.isFeatureEnabled('inline_maps')});
        const content = this.props.mxEvent.getContent();
        if (content.geo_uri && content.body) {
            // Build URL
            const parts = content.geo_uri.substr("geo:".length).split(',');
            const coords = new Leaflet.LatLng(
                parseFloat(parts[0]),
                parseFloat(parts[1])
            );
            const uri = `https://www.openstreetmap.org/#map=${ZOOM_STREET}/${parts[0]}/${parts[1]}`;
            this.setState({uri, coords, body: content.body});
        } else {
            this.setState({error: "Missing required fields."});
        }
    },

    componentDidUpdate: function(prevProps, prevState) {
        if (this.state.mapEnabled || prevState.mapEnabled === false) {
            this.renderMap();
        }
    },

    render: function() {
        let map = null;
        if (this.state.mapEnabled) {
            map = (<div ref="map" className="mx_LocationBody_map"></div>);
        }

        if (!this.state.error) {
            return (
                <span className="mx_MLocationBody">
                <span>{this.state.body}</span>
                {map}
                <a target="_blank" href={this.state.uri} className="mx_MLocationBody">
                Click to view location on OpenStreetMap.org
                </a>
                </span>
            );
        } else {
            return (
                <span className="mx_MLocationBody">
                Could not display location: {this.state.error}
                </span>
            );
        }
    },
});
