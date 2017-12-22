$(function () {

    let graphDrawer = new GraphDrawer($("#canvas")[0]);
    let points;
    let tsp;
    let loopId;

    setupListeners();

    function setupListeners() {
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

            startButton.val("Start");
            graphDrawer.clear();
            $("#stat").hide();
        };

        startButton.click(onStart);
        $("#reset").click(onReset);

        $("#stat").hide();
    }

    function init(size) {
        reset();

        points = generatePoints(size);
        let matrix = MatrixConverter.toDistMatrix(points);
        let tourManager = new TourManager(matrix);
        tsp = new TspGenetic(tourManager);
        setSelection();
        setCrossover();
        tsp.setMutation(new FisherYatesMutationStrategy(0.015));
    }

    function reset() {
        points = null;
        tsp = null;
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
            default:
                throw "Crossover is not chosen";
        }
    }

    function start() {
        loopId = setTimeout(function next() {
            tsp.evolve();
            let tour = tsp.getBestTour();
            graphDrawer.draw(rearrangePath(points, tour.getPath()));
            loopId = setTimeout(next, 0);

            $("#stat-iter").text(tsp.iteration());
            $("#stat-dist").text(tour.getDistance());
        }, 0);
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

    function rearrangePath(points, index) {
        let newPoints = new Array(index.length);
        for (let i = 0; i < index.length; i++) {
            newPoints[i] = points[index[i]];
        }
        return newPoints;
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

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    //API
    this.draw = function (points) {
        clear();
        drawPoints(points);
        drawPath(points);
    };

    this.clear = clear;
}