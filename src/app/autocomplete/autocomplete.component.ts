import { Component, OnDestroy, OnInit} from '@angular/core';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Observable, Subject, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';

export interface FavTable {
  id: number;
  image: string;
  city: string;
  state: string;
}

@Component({
  selector: 'autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent implements OnDestroy, OnInit {
 /* showWeatherCard:boolean = false;
  showDetailedReport:boolean = false;
  city = "LOS Angeles";
  timezone = "America/Los Angeles";
  humidity = "0.73";
  temperature = "89.3"
  summary = "Clear throughout the day.";
  sealsrc = "https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png";
  pressure = "0.73";
  visibility = "0.73";
  cloudcover = "0.73";
  windspeed = "0.73";
  ozone = "0.73";

  detail1 = "Pecipitation : 0";
  detail2 = "Chance of Rain : 0 %";
  detail3 = "Wind Speed : 3.15 mph";
  detail4 = "Humidity : 45 %";
  detail5 = "Visibility : 8.99 miles";
  city_detail = "LOS Angeles";
  summary_detail = "America/Los Angeles";
  date_detail = "22/98/1000";
  temperature_detail = "89.3"


  showPressureChart = false;
  showHumidityChart = false;
  showOzoneChart = false;
  showVisibilityChart = false;
  showTempChart = true;
  showWindSpeedChart = false;
  showModalDivision = false;

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{ scaleLabel: { display: true, labelString: 'Fahrenheit'}}],
      xAxes: [{ scaleLabel: { display: true, labelString: 'Time difference from current hour' }}]
    } 
  };

  public barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType = 'bar';
  public barChartData = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'temperature', backgroundColor:"rgba(165,208, 238)", "fill":false},
  ];
  barChartLegend = true;


  barChartOptions_range = { scaleShowVerticalLines: false, responsive: true, 
    scales: { yAxes: [{ scaleLabel: { display: true, labelString: 'Days'}}], xAxes: [{ scaleLabel: { display: true, labelString: 'Temperature in Fahrenheit' }}] },
    title: {
      display: true,
      text: 'Weekly Weather',
      fontSize: 40,
      fontWeight: 500

		},toolTips: {
			content: "{x} </br> Min: {y[0]}, Max: {y[1]}"
    },
    };    

  barChartLabels_range = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  barChartData_range = [ { data: [
    [ 17,33],  
    [ 18,35],
    [ 18,32],
    [ 18,32],
    [ 20,35],
    [ 20,38],
    [ 21,32]
  ], label: 'Day wise temperature range', 
    "fill":false, backgroundColor: 'rgba(165,208, 238)',
    borderColor: 'rgba(165,208, 238)',
    hoverBackgroundColor: 'rgba(165,208, 238)',
    hoverBorderColor: 'rgba(165,208, 238)'}];
  
  showModal: boolean;
  isInputDisable = null;

  elements: any = [
    { image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Seal_of_California.svg/2000px-Seal_of_California.svg.png", city: 'Los Angeles',  state: 'H' },
    { image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Seal_of_California.svg/2000px-Seal_of_California.svg.png", city: 'Los Angeles',  state: 'He'},
    { image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Seal_of_California.svg/2000px-Seal_of_California.svg.png", city: 'Los Angeles',  state: 'Li'},
    { image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Seal_of_California.svg/2000px-Seal_of_California.svg.png", city: 'Los Angeles',  state: 'Be'},
    { image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Seal_of_California.svg/2000px-Seal_of_California.svg.png", city: 'Los Angeles',  state: 'B' },
    { image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Seal_of_California.svg/2000px-Seal_of_California.svg.png", city: 'Los Angeles',  state: 'C' },
    { image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Seal_of_California.svg/2000px-Seal_of_California.svg.png", city: 'Los Angeles',  state: 'N' },
    { image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Seal_of_California.svg/2000px-Seal_of_California.svg.png", city: 'Los Angeles',  state: 'O' },
    { image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Seal_of_California.svg/2000px-Seal_of_California.svg.png", city: 'Los Angeles',  state: 'F' },
    { image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Seal_of_California.svg/2000px-Seal_of_California.svg.png", city: 'Los Angeles',  state: 'Ne'},
  ];

  headElements = ['#', 'Image', 'City', 'State', 'Wish List'];
  
  streetCtrl = new FormControl();
  cityCtrl = new FormControl();*/

  constructor() {
  }

  ngOnDestroy() {
    
  }


  ngOnInit() {
    
    }

 /* public onChange(value): void {  // event will give you full breif of action
    this.showTempChart = false;
    this.showVisibilityChart = false;
    this.showPressureChart = false;
    this.showOzoneChart = false;
    this.showWindSpeedChart = false;
    this.showHumidityChart = false;
    switch(value)
    {
      case "temperature":
            this.showTempChart = true;
            break;
      case "pressure":
            this.showPressureChart = true;
            break;
      case "humidity":
            this.showHumidityChart = true;
            break;
      case "ozone":
            this.showOzoneChart = true;
            break;
      case "visibility":
          this.showVisibilityChart = true;
          break;
      case "windspeed":
          this.showWindSpeedChart = true;
          break;
    }
  }

  gg()
  {
    this.showModal = true;
  }

  show() {
    this.showModal = true;
  }

  deleteRow(id){
    this.elements.splice(id, 1);
  }
  
  loadCity(id){
    alert(this.elements[id].city);
  }

  onSubmit(){
    alert("Hello !!!");
  }*/
}