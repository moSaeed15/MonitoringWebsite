## Table of contents

- [Table of contents](#table-of-contents)
- [Some comments](#some-comments)
  - [The challenge](#the-challenge)
  - [Video](#video)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
- [Author](#author)

## Some comments
The alert is very simple due to the project requirments but could have been done cleaner with a popup 
The ardunio graph will plot only ones for testing purposes and because some circuit needs to be connected for it to show sensor data.

### The challenge

Users should be able to:

- Load precorded data and for that data program calculates magnitue phase amplitude and duration
- Plot and show realtime signal from arduino
- Calculate mean and range of sample and show X-bar chart and range chart.

### Video

https://user-images.githubusercontent.com/67608414/217344769-fae6e9d2-ca46-4457-82cb-a50905f9fda4.mp4

## My process

Wrote the html code and then styled the website using simple css and then added my charts using chart.js after reading the files in my javascript.
Used flask and python to calculate the fft to get some analytics such as magnitude frequency phase and amplitude and then showed them in my html.
Finally read the arduino data from the serial terimanal and used threading to read in realtime and used socketIO to send the data so I can read it in my javascript and plot and update with every new reading.

### Built with

- Semantic HTML5 markup
- CSS
- Flexbox
- Python
- Flask

## Author

- Website - [Mohammed El saeed Kamel](https://github.com/moSaeed15)
- Twitter - [@Mohsaeed\_](https://twitter.com/Mohsaeed_)
  -Linkedin - [Mohammed Saeed](https://www.linkedin.com/in/mohammed-saeed-b3507214b/)
