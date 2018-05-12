'use strict';

import React from 'react';
import {render} from 'react-dom';
import OneTspApp from '../components/one-tsp-app';

import '../../../resources/bootstrap.min.css';

const container = document.getElementById('app');
const temp = document.createElement('div');
render(<OneTspApp/>, temp);
container.parentElement.replaceChild(temp.firstElementChild, container);
