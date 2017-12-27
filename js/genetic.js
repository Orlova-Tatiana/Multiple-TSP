Number.prototype.print = function (precision = 3) {
    let s = this.toString();
    let point = s.indexOf(".");
    let integer = point == -1 ? s : s.substring(0, point);

    if (precision == 0)
        return integer;

    let fracture = point == -1 ? "" : s.substr(point + 1, Math.min(precision, s.length - point - 1));
    s = integer + "." + fracture;
    let zeroes = "0".repeat(precision - fracture.length);
    return s + zeroes;
};

$(function () {

    let graphDrawer = new GraphDrawer($("#canvas")[0]);
    let points;
    let tsp;
    let loopId;

    setupListeners();

    function setupListeners() {
        //CONTROLS
        let startButton = $("#start");

        let onStart = function () {
            if (!tsp) {
                init();
            }

            start();

            startButton.val("Stop");
            startButton.off("click", onStart);
            startButton.click(onStop);
            $("#stat").show();
        };

        let onStop = function () {
            stop();

            startButton.val("Continue");
            startButton.off("click");
            startButton.click(onStart);
        };

        let onReset = function () {
            onStop();
            reset();

            onChoosePoints();
            startButton.val("Start");
            graphDrawer.drawPoints(points);
            $("#stat").hide();
        };

        startButton.click(onStart);
        $("#reset").click(onReset);

        //STATISTICS
        $("#stat").hide();

        //POINTS
        let onChoosePoints = function () {
            if (!loopId) {
                let size = $($("[name='points']:checked")).val();
                if (!points || points.length != size) {
                    points = generatePoints(size);
                    graphDrawer.drawPoints(points);
                }
            }
        };

        $("[name='points']").click(onChoosePoints);
        onChoosePoints();
    }

    function init() {
        let matrix = MatrixConverter.toDistMatrix(points);
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
        let elitism = $("#elitism").is(":checked");
        let populationSize = +$("#population").val();
        let mutationRate = +$("#mutation_rate").val();

        return {
            elitism: elitism,
            populationSize: populationSize,
            mutationRate: mutationRate
        };
    }

    function setSelection() {
        let name = $("#selection").find(":selected").val();
        switch (name) {
            case "tournament":
                tsp.setSelection(new TournamentSelectionStrategy());
                break;
            case "roulette":
                tsp.setSelection(new RouletteSelectionStrategy());
                break;
            default:
                throw "Selection is not chosen";
        }
    }

    function setCrossover() {
        let name = $("#crossover").find(":selected").val();
        switch (name) {
            case "segment":
                tsp.setCrossover(new SegmentCrossoverStrategy());
                break;
            case "random_half":
                tsp.setCrossover(new RandomHalfCrossoverStrategy());
                break;
            case "prev_next":
                tsp.setCrossover(new NextPrevCrossoverStrategy());
                break;
            default:
                throw "Crossover is not chosen";
        }
    }

    function setMutation() {
        let name = $("#mutation").find(":selected").val();
        switch (name) {
            case "fisher":
                tsp.setMutation(new FisherYatesMutationStrategy());
                break;
            case "reverse":
                tsp.setMutation(new ReverseMutation());
                break;
            case "segment":
                tsp.setMutation(new SegmentMutation());
                break;
            default:
                throw "Mutation is not chosen";
        }
    }

    function start() {
        let bestTour = null;

        (function next() {
            tsp.evolve();
            let tour = tsp.getBestTour();

            if (bestTour !== tour) { //optimize drawing
                bestTour = tour;
                graphDrawer.drawPath(points, tour.getPath());
            }

            printStatistics();

            loopId = setTimeout(next, 0);
        })();
    }

    function printStatistics() {
        $("#stat-iter").text(tsp.iteration());
        $("#stat-dist").text(tsp.getBestTour().getDistance().print());
        $("#stat-aver_dist").text(getAverageDist().print());
        $("#stat-change_count").text(getChanges());
        $("#stat-no_change").text(getNoChange());
        $("#stat-same_path").text(getSameToursCount());
    }

    function getAverageDist() {
        if (getAverageDist.time && performance.now() - getAverageDist.time < 100) {
            return getAverageDist.aver; //return every 100 ms
        }

        let population = tsp.getPopulation();
        let sum = 0;
        for (let i = 0; i < population.size; i++)
            sum += population.getTour(i).getDistance();

        let aver = sum / population.size;
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

        let population = tsp.getPopulation();
        let set = new Set();

        for (let i = 0; i < population.size; i++) {
            let tour = population.getTour(i);
            set.add(tour.toString());
        }

        let same = population.size - set.size;
        getSameToursCount.count = same;
        getSameToursCount.time = performance.now();
        return same;
    }

    function stop() {
        clearTimeout(loopId);
    }

    function generatePoints(n) {
        let canvas = $("#canvas")[0];
        let width = canvas.width;
        let height = canvas.height;
        return PointsGenerator.generate(n, 5, width - 5, 5, height - 5);
    }

});

function GraphDrawer(canvas) {
    let context = canvas.getContext("2d");

    function drawPoints(points) {
        context.fillStyle = "black";

        for (let point of points) {
            drawPoint(point.x, point.y);
        }
    }

    function drawPoint(x, y) {
        context.beginPath();
        context.arc(x, y, 3, 0, 2 * Math.PI, false);
        context.fillStyle = 'black';
        context.fill();
        context.closePath();
    }

    function drawPath(points) {
        context.strokeStyle = "red";
        context.lineWidth = 1;

        context.beginPath();
        let last = points[points.length - 1];
        context.moveTo(last.x, last.y);
        for (let point of points) {
            context.lineTo(point.x, point.y);
        }
        context.stroke();
    }

    function rearrangePath(points, path) {
        let newPoints = new Array(path.length);
        for (let i = 0; i < path.length; i++) {
            newPoints[i] = points[path[i]];
        }
        return newPoints;
    }

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    //API
    this.drawPoints = function (points) {
        clear();
        drawPoints(points);
    };

    this.drawPath = function (points, path) {
        clear();
        drawPoints(points);
        drawPath(rearrangePath(points, path));
    };

    this.clear = clear;
}