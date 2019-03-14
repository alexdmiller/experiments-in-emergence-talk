var MAX_ITERATIONS = 100;
var CHART_MARGIN = 50;

function model(x, r) {
  return r * x * (1 - x);
};

function App(model) {
  this.model = model;
  this.params = { r: 1, startX: 0.5 }
  //this.tableView = new TableView(this.model, this.params);
  this.timeSeriesView = new TimeSeriesView(this.model, this.params);
  this.bifrucationView = new BifrucationView(this.model, this.params);
  this.update();
}

App.prototype.update = function() {
  this.params.startX = document.getElementById("start-value-slider").value / 1000;
  this.params.r = document.getElementById("growth-factor-slider").value / 1000;

  document.querySelector("#start-value-control span").innerHTML = this.params.startX;
  document.querySelector("#growth-factor-control span").innerHTML = (4 * Math.pow(this.params.r, 1/4)).toPrecision(4);

  //this.tableView.update();
  this.timeSeriesView.update();
  this.bifrucationView.update();

  window.requestAnimationFrame(this.update.bind(this));
};

function TableView(model, params) {
  this.model = model;
  this.params = params;
  this.element = document.getElementById("table-view");
  this.element.innerHTML = "table view";
};

TableView.prototype.update = function() {
  var table = document.createElement("table");
  var x = this.params.startX;
  var r = 4 * Math.pow(this.params.r, 1/4);
  for (var i = 0; i < MAX_ITERATIONS; i++) {
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    td.innerHTML = x.toPrecision(2);
    tr.appendChild(td);
    table.appendChild(tr);

    x = this.model(x, r);
  }

  this.element.innerHTML = "";
  this.element.appendChild(table);
};

function TimeSeriesView(model, params) {
  this.model = model;
  this.params = params;
  this.view = document.getElementById("time-series-view");
  this.canvas = this.view.getElementsByTagName("canvas")[0];
  this.context = this.canvas.getContext("2d");

  this.canvas.width = this.view.offsetWidth;
  this.canvas.height =
    (window.innerHeight - document.getElementById("controls").offsetHeight) / 2;

  this.canvas.style.top = document.getElementById("controls").offsetHeight + 'px';

};

TimeSeriesView.prototype.update = function() {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.context.strokeStyle = "#999999";
  this.context.lineWidth = 2;

  this.context.save();
  var chartWidth = this.canvas.width - CHART_MARGIN * 2;
  var chartHeight = this.canvas.height - CHART_MARGIN * 2;
  this.context.translate(CHART_MARGIN, CHART_MARGIN);

  this.context.strokeStyle = "#ffffff";

  this.context.beginPath();
  this.context.moveTo(0, 0);
  this.context.lineTo(0, chartHeight);
  this.context.lineTo(chartWidth, chartHeight);
  this.context.stroke();

  this.context.beginPath();
  var x = this.params.startX;
  var r = 4 * Math.pow(this.params.r, 1/4);
  this.context.moveTo(
    0,
    chartHeight - x * chartHeight);
  for (var i = 1; i < MAX_ITERATIONS; i++) {
    x = this.model(x, r);
    this.context.lineTo(
      i / MAX_ITERATIONS * chartWidth,
      chartHeight - x * chartHeight);
  }
  this.context.stroke();

  this.context.fillStyle = "#ffffff";
  
  this.context.textAlign = "center"; 

  this.context.font = '30px "courier new"';
  this.context.fillText("Population over time", chartWidth / 2, -20);

  this.context.font = '20px "courier new"';
  this.context.fillText("Generation",
    chartWidth / 2, chartHeight + 30);

  this.context.font = '15px "courier new"';
  this.context.fillText("0",
      0, chartHeight + 30);
  this.context.fillText(MAX_ITERATIONS,
      chartWidth, chartHeight + 30);

  this.context.save();
  // this.context.translate(-20, chartHeight / 2);
  this.context.rotate(-Math.PI / 2);
  this.context.font = '20px "courier new"';
  this.context.fillText("Population", -chartHeight/2, -20);

  this.context.font = '15px "courier new"';
  this.context.fillText("0", -chartHeight, -20);
  this.context.fillText("1", 0, -20);
  this.context.restore();

  this.context.restore();
};

function BifrucationView(model, params) {
  this.model = model;
  this.params = params;
  this.view = document.getElementById("bifrucation-view");
  this.canvas = document.getElementById("bifrucation-canvas");
  this.lineCanvas = document.getElementById("growth-factor-line");
  this.context = this.canvas.getContext("2d");

  this.canvas.style.top = (
      (window.innerHeight - document.getElementById("controls").offsetHeight) / 2
      + document.getElementById("controls").offsetHeight) + 'px';
  this.canvas.width = this.view.offsetWidth;
  this.canvas.height =
    (window.innerHeight - document.getElementById("controls").offsetHeight) / 2;

  this.lineCanvas.style.top = this.canvas.style.top;
  this.lineCanvas.width = this.canvas.width;
  this.lineCanvas.height = this.canvas.height;
  this.lineContext = this.lineCanvas.getContext("2d");

  this.context.save();
  var chartWidth = this.canvas.width - CHART_MARGIN * 2;
  var chartHeight = this.canvas.height - CHART_MARGIN * 2;
  this.context.translate(CHART_MARGIN, CHART_MARGIN);

  this.context.strokeStyle = "#ffffff";
  this.context.lineWidth = 2;
  this.context.beginPath();
  this.context.moveTo(0, 0);
  this.context.lineTo(0, chartHeight);
  this.context.lineTo(chartWidth, chartHeight);
  this.context.stroke();

  this.context.fillStyle = "#ffffff";
  for (var r = 0; r < chartWidth; r++) {
    var x = this.params.startX;
    for (var i = 1; i < MAX_ITERATIONS; i++) {
      x = this.model(x, Math.pow(r / chartWidth, 1/4) * 4);
      if (i > 50) {
        this.context.fillRect(r, x * chartHeight, 1,1);
      }
    }
  }

  this.context.fillStyle = "#ffffff";
  
  this.context.textAlign = "center"; 

  this.context.font = '30px "courier new"';
  this.context.fillText("Bifrucation diagram", chartWidth / 2, -20);

  this.context.font = '20px "courier new"';
  this.context.fillText("Growth factor",
    chartWidth / 2, chartHeight + 30);

  this.context.font = '15px "courier new"';
  this.context.fillText("0",
      0, chartHeight + 30);
  this.context.fillText("4",
      chartWidth, chartHeight + 30);

  this.context.save();
  // this.context.translate(-20, chartHeight / 2);
  this.context.rotate(-Math.PI / 2);
  this.context.font = '20px "courier new"';
  this.context.fillText("Population", -chartHeight/2, -20);

  this.context.font = '15px "courier new"';
  this.context.fillText("0", -chartHeight, -20);
  this.context.fillText("1", 0, -20);
  this.context.restore();

  this.context.restore();

  var mouseDown = false;
  var that = this;

  this.canvas.addEventListener('mousedown', function(event) {
    mouseDown = true;
  }, false);

  this.canvas.addEventListener('mousemove', function(event) {
    if (mouseDown) {
      var mx = (event.clientX - CHART_MARGIN) / chartWidth;
      document.getElementById("growth-factor-slider").value = mx * 1000;
    }
  }, false);


  this.canvas.addEventListener('mouseup', function(event) {
    mouseDown = false;
  }, false);

}

BifrucationView.prototype.update = function() {
  this.lineContext.clearRect(0, 0, this.lineCanvas.width, this.lineCanvas.height);

  this.lineContext.save();
  var chartWidth = this.lineCanvas.width - CHART_MARGIN * 2;
  var chartHeight = this.lineCanvas.height - CHART_MARGIN * 2;
  this.lineContext.translate(CHART_MARGIN, CHART_MARGIN);

  this.lineContext.strokeStyle = "#FF0000";
  this.lineContext.lineWidth = 2;
  this.lineContext.beginPath();

  var x = this.params.r * chartWidth;

  this.lineContext.lineWidth = 3; 
  this.lineContext.moveTo(x, 0);
  this.lineContext.lineTo(x, chartHeight);
  this.lineContext.stroke();

  this.lineContext.restore();
};


var app = new App(model);
