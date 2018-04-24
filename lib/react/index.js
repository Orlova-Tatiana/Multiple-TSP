'use strict';

import React from 'react';
import {render} from 'react-dom';
import App from './components/app';

import '../../resources/bootstrap.min.css';

const container = document.getElementById('app');
const temp = document.createElement('div');
render(<App/>, temp);
container.parentElement.replaceChild(temp.firstElementChild, container);
