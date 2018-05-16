'use strict';

import React from 'react';
import PropTypes from 'prop-types';

export default class Header extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired
    };

    render() {
        return (
            <h2 className="text-center mt-2 mb-4">
                {this.props.title}
            </h2>
        );
    }
}
