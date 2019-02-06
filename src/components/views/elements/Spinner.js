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

const React = require('react');

module.exports = React.createClass({
    displayName: 'Spinner',

    render: function() {
        // You might get the lucky spinner.
        const lucky = Math.floor(Math.random() * 10000);
        let w = this.props.w || 32;
        let h = this.props.h || 32;
        if (lucky) {
            w = w * 2;
            h = h * 2;
        }
        const imgClass = this.props.imgClassName || "";
        const src = require(`../../../../res/img/spinner${lucky ? "_lucky" : ""}.gif`);
        return (
            <div className="mx_Spinner">
                <img src={src} width={w} height={h} className={imgClass} />
            </div>
        )
    },
});
