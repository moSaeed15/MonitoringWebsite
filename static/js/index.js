// import { Chart } from 'chart.js/auto';
// import { C } from 'chart.js/dist/chunks/helpers.core';

const signal1Chart = document.querySelector('#signal--1');

const signal2Chart = document.querySelector('#signal--2');

const xbarChart = document.querySelector('#Xbar');

const rangeChart = document.querySelector('#rangeChart');

const uploadConfirm = document.getElementById('uploadconfirm1');
const uploadFile = document.getElementById('uploadfile1');
const attributeBox = document.querySelector('.attributes__box--1 ');
const attributeBox2 = document.querySelector('.attributes__box--2 ');

const uploadConfirmOxygen = document.getElementById('uploadconfirm2');
const uploadFileOxygen = document.getElementById('uploadfile2');
const time = [];
const magnitude = [];
const time2 = [];
const magnitude2 = [];

const realTimeSignal = document
  .getElementById('arduniosignal')
  .getContext('2d');
// console.log(testData);

i = 0;

uploadConfirm.addEventListener('click', function (e) {
  // e.preventDefault();
  Papa.parse(document.getElementById('uploadfile1').files[0], {
    download: true,
    header: false,
    skipEmptyLines: true,
    complete: function (results) {
      // console.log(results.data.slice(0, 10000));
      resultArray = results.data.slice(0, 2000).flat();
      // console.log(resultArray);
      resultArray.map((res, i) => {
        if (i % 2 == 0) {
          const newElement = res;
          time.push(newElement);
        }
      });
      resultArray.map((res, i) => {
        if (i % 2 == 1) {
          const newElement = res;
          magnitude.push(newElement);
        }
      });

      j = 0;
      Xbar = [];

      for (let i = 0; i < magnitude.length; i += 10) {
        sample = magnitude.slice(i, 10 * (j + 1));
        Xbar[j] =
          sample.reduce((a, b) => Number(a) + Number(b), 0) / sample.length;
        j++;
      }

      j = 0;
      rangeValues = [];

      for (let i = 0; i < magnitude.length; i += 10) {
        let sample = magnitude.slice(i, 10 * (j + 1));
        sample = sample.map(s => Number(s));
        rangeValues[j] = Math.max(...sample) - Math.min(...sample);
        j++;
      }

      // Control limits
      averageXbar = Xbar.reduce((a, b) => a + b, 0) / Xbar.length;
      averageRangebar =
        rangeValues.reduce((a, b) => a + b, 0) / rangeValues.length;

      upperControlLimitXbar = averageXbar + 0.308 * averageRangebar;
      lowerControlLimitXbar = averageXbar - 0.308 * averageRangebar;

      upperControlLimitRangebar = averageRangebar * 1.777;
      lowerControlLimitRangebar = averageRangebar * 0.223;

      XbarRangeChartLabels = [...Array(200).keys()];

      const data = {
        labels: time,
        datasets: [
          {
            label: 'My First Dataset',
            data: magnitude,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      };

      const config = {
        type: 'line',
        data: data,
      };

      const myChart = new Chart(signal1Chart, config);
      attributeBox.style.display = 'block';

      // Canvas rendering Xbar

      const options = {
        plugins: {
          autocolors: false,
          annotation: {
            annotations: {
              line1: {
                type: 'line',
                yMin: lowerControlLimitXbar,
                yMax: upperControlLimitXbar,
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 2,
              },
            },
          },
        },
      };

      const dataXbar = {
        labels: XbarRangeChartLabels,
        datasets: [
          {
            label: 'My First Dataset',
            data: Xbar,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      };

      const configXbar = {
        type: 'line',
        data: dataXbar,
        options,
      };

      const xbarChartCanvas = new Chart(xbarChart, configXbar);
      XbarControl = false;
      Xbar.forEach(element => {
        if (
          element > upperControlLimitXbar ||
          element < lowerControlLimitXbar
        ) {
          XbarControl = true;
        }
      });

      setTimeout(() => {
        if (XbarControl) {
          alert('Signal mean exceeds control limits');
        }
      }, 10000);

      // Canvas Rendering Range

      const dataRangeChart = {
        labels: XbarRangeChartLabels,
        datasets: [
          {
            label: 'My First Dataset',
            data: rangeValues,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      };

      const configRangeChart = {
        type: 'line',
        data: dataRangeChart,
      };

      const RangeChartCanvas = new Chart(rangeChart, configRangeChart);

      rangeChartControl = false;
      rangeValues.forEach(element => {
        if (
          element > upperControlLimitRangebar ||
          element < lowerControlLimitRangebar
        ) {
          rangeChartControl = true;
        }
      });

      setTimeout(() => {
        if (rangeChartControl) {
          alert('Signal Range exceeds control limits');
        }
      }, 10000);
    },
  });
});

uploadConfirmOxygen.addEventListener('click', function (e) {
  // e.preventDefault();
  Papa.parse(document.getElementById('uploadfile2').files[0], {
    download: true,
    header: false,
    skipEmptyLines: true,
    complete: function (results) {
      // console.log(results.data.slice(0, 10000));
      resultArray = results.data.slice(0, 2000).flat();
      // console.log(resultArray);
      resultArray.map((res, i) => {
        if (i % 2 == 0) {
          const newElement = res;
          time2.push(newElement);
        }
      });
      resultArray.map((res, i) => {
        if (i % 2 == 1) {
          const newElement = res;
          magnitude2.push(newElement);
        }
      });

      const data = {
        labels: time2,
        datasets: [
          {
            label: 'My First Dataset',
            data: magnitude2,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      };

      const config = {
        type: 'line',
        data: data,
      };

      const myChart2 = new Chart(signal2Chart, config);
      attributeBox2.style.display = 'block';
    },
  });
});

// X-bar Range chart

////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
// Arduino Signal Chart

const myChart3 = new Chart(realTimeSignal, {
  type: 'line',
  data: {
    datasets: [{ label: 'Temperature' }],
  },
  options: {
    borderWidth: 3,
    borderColor: ['rgba(255, 99, 132, 1)'],
  },
});

function addData(label, data) {
  myChart3.data.labels.push(label);
  myChart3.data.datasets.forEach(dataset => {
    dataset.data.push(data);
  });
  myChart3.update();
}

function removeFirstData() {
  myChart3.data.labels.splice(0, 1);
  myChart3.data.datasets.forEach(dataset => {
    dataset.data.shift();
  });
}

const MAX_DATA_COUNT = 100;
//connect to the socket server.
// var socket = io.connect('http://127.0.0.1:5000/');
var socket = io.connect();

//receive details from server
socket.on('updateSensorData', function (msg) {
  // console.log('Received sensorData :: ' + msg.date + ' :: ' + msg.value);

  // Show only MAX_DATA_COUNT data
  if (myChart3.data.labels.length > MAX_DATA_COUNT) {
    removeFirstData();
  }
  addData(msg.date, msg.value);
});
