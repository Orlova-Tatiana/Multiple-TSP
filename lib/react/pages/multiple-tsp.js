'use strict';

import React from 'react';
import {render} from 'react-dom';
import MultipleTspApp from '../components/multiple-tsp-app';

import '../../../resources/bootstrap.min.css';

const container = document.getElementById('app');
const temp = document.createElement('div');
render(<MultipleTspApp/>, temp);
container.parentElement.replaceChild(temp.firstElementChild, container);
