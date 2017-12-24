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
                let size = $("[name='points']:checked").val();
                init(size);
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
            startButton.off("click", onStop);
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

    function init(size) {
        reset();

        let matrix = MatrixConverter.toDistMatrix(points);
        let tourManager = new TourManager(matrix);
        tsp = new TspGenetic(tourManager, getOptions());
        setSelection();
        setCrossover();
        setMutation();
    }

    function reset() {
        tsp = null;
    }

    function getOptions() {
        let elitism = $("#elitism").is(":checked");
        let populationSize = +$("#population").val();

        return {
            elitism: elitism,
            populationSize: populationSize
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
            case "no":
                tsp.setMutation(new NoMutationStrategy());
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
        loopId = setTimeout(function next() {
            tsp.evolve();
            let tour = tsp.getBestTour();
            graphDrawer.drawPath(points, tour.getPath());
            loopId = setTimeout(next, 0);

            printStatistics();
        }, 0);
    }

    function printStatistics() {
        $("#stat-iter").text(tsp.iteration());
        $("#stat-dist").text(tsp.getBestTour().getDistance().round(3));
        $("#stat-aver-dist").text(getAverageDist().round(3));
    }

    function getAverageDist() {
        if ((tsp.iteration() - 1) % 10 != 0)
            return getAverageDist.aver; //cache

        let population = tsp.getPopulation();
        let sum = 0;
        for (let i = 0; i < population.size; i++)
            sum += population.getTour(i).getDistance();

        let aver = sum / population.size;
        getAverageDist.aver = aver;
        return aver;
    }

    function stop() {
        clearTimeout(loopId);
        loopId = null;
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