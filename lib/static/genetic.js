/* eslint-disable no-use-before-define */
'use strict';

require('../../resources/bootstrap.min.css');
require('../../resources/slider/rangeslider.css');

const $ = require('jquery');
require('../../resources/slider/rangeslider.min');

const TspGenetic = require('../genetic');
const TourManager = require('../genetic/tour/tour-manager');
const SelectionFactory = require('../genetic/selection-factory');
const CrossoverFactory = require('../genetic/crossover-factory');
const MutationFactory = require('../genetic/mutation-factory');
const GraphDrawer = require('./graph');
const utils = require('./utils');

$(function() {
    const graphDrawer = new GraphDrawer($('#canvas')[0]);
    let points;
    let tsp;
    let loopId;

    initPlugins();
    setupListeners();

    function initPlugins() {
        $('input[type="range"]').rangeslider({
            polyfill: false,
            onSlide: function(pos, value) {
                let id = this.$element.attr('id') + '-hint';
                $('#' + id).text(value);
            }
        });
    }

    function setupListeners() {
        //CONTROLS
        const startButton = $('#start');

        const onStart = () => {
            if (!tsp) {
                init();
            }

            start();

            startButton.val('Stop');
            startButton.off('click', onStart);
            startButton.click(onStop);
            $('#stat').show();
        };

        const onStop = () => {
            stop();

            startButton.val('Continue');
            startButton.off('click');
            startButton.click(onStart);
        };

        const onReset = () => {
            onStop();
            reset();

            onChoosePoints();
            startButton.val('Start');
            graphDrawer.drawPoints(points);
            $('#stat').hide();
        };

        startButton.click(onStart);
        $('#reset').click(onReset);

        //STATISTICS
        $('#stat').hide();

        //POINTS
        const onChoosePoints = () => {
            if (!loopId) {
                let size = $($('[name=\'points\']:checked')).val();
                if (!points || points.length !== size) {
                    points = generatePoints(size);
                    graphDrawer.drawPoints(points);
                }
            }
        };

        $('[name=\'points\']').click(onChoosePoints);
        onChoosePoints();
    }

    function init() {
        let matrix = utils.convertToDistMatrix(points);
        let tourManager = new TourManager(matrix);
        tsp = new TspGenetic(tourManager, getOptions());
        setSelection();
        setCrossover();
        setMutation();
    }

    function reset() {
        tsp = null;
        loopId = null;

        //remove cache
        delete getAverageDist.aver;
        delete getAverageDist.time;
        delete getChanges.best;
        delete getChanges.count;
        delete getNoChange.best;
        delete getNoChange.iter;
        delete getSameToursCount.time;
        delete getSameToursCount.count;
    }

    function getOptions() {
        let elitism = $('#elitism').is(':checked');
        let populationSize = +$('#population').val();
        let mutationRate = +$('#mutation_rate').val();

        return {
            elitism: elitism,
            populationSize: populationSize,
            mutationRate: mutationRate
        };
    }

    function setSelection() {
        const name = $('#selection').find(':selected').val();
        tsp.setSelection(SelectionFactory.create(name));
    }

    function setCrossover() {
        const name = $('#crossover').find(':selected').val();
        tsp.setCrossover(CrossoverFactory.create(name));
    }

    function setMutation() {
        const name = $('#mutation').find(':selected').val();
        tsp.setMutation(MutationFactory.create(name));
    }

    function start() {
        let bestTour = null;

        (function next() {
            tsp.evolve();
            const tour = tsp.getBestTour();

            if (bestTour !== tour) { //optimize drawing
                bestTour = tour;
                graphDrawer.drawPath(points, tour.getPath());
            }

            printStatistics();

            loopId = setTimeout(next, 0);
        })();
    }

    function printStatistics() {
        $('#stat-iter').text(tsp.iteration());
        $('#stat-dist').text(utils.printNumber(tsp.getBestTour().getDistance()));
        $('#stat-aver_dist').text(utils.printNumber(getAverageDist()));
        $('#stat-change_count').text(getChanges());
        $('#stat-no_change').text(getNoChange());
        $('#stat-same_path').text(getSameToursCount());
    }

    function getAverageDist() {
        if (getAverageDist.time && performance.now() - getAverageDist.time < 100) {
            return getAverageDist.aver; //return every 100 ms
        }

        const population = tsp.getPopulation();
        let sum = 0;
        for (let i = 0; i < population.size; i++) {
            sum += population.getTour(i).getDistance();
        }

        const aver = sum / population.size;
        getAverageDist.aver = aver;
        getAverageDist.time = performance.now();
        return aver;
    }

    function getChanges() {
        if (!getChanges.best) {
            getChanges.best = tsp.getBestTour();
            getChanges.count = 1;
            return 1;
        }

        if (getChanges.best !== tsp.getBestTour()) {
            getChanges.best = tsp.getBestTour();
            getChanges.count++;
        }
        return getChanges.count;
    }

    function getNoChange() {
        if (!getNoChange.best || getNoChange.best !== tsp.getBestTour()) {
            getNoChange.best = tsp.getBestTour();
            getNoChange.iter = tsp.iteration();
            return 0;
        }

        return tsp.iteration() - getNoChange.iter;
    }

    function getSameToursCount() {
        if (getSameToursCount.time && performance.now() - getSameToursCount.time < 100) {
            return getSameToursCount.count; //return every 100 ms
        }

        const population = tsp.getPopulation();
        const set = new Set();

        for (let i = 0; i < population.size; i++) {
            let tour = population.getTour(i);
            set.add(tour.toString());
        }

        const same = population.size - set.size;
        getSameToursCount.count = same;
        getSameToursCount.time = performance.now();
        return same;
    }

    function stop() {
        clearTimeout(loopId);
    }

    function generatePoints(n) {
        const canvas = $('#canvas')[0];
        const width = canvas.width;
        const height = canvas.height;
        return utils.generatePoints(n, 5, width - 5, 5, height - 5);
    }
});
