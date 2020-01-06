import { Component, OnInit, EventEmitter, OnDestroy} from '@angular/core';
import {FormControl} from '@angular/forms';
import { Observable,Subscription } from 'rxjs';
import { startWith, map  } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as CanvasJS from './canvasjs.min';



@Component({
  selector: 'location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})

export class LocationComponent implements OnInit, OnDestroy {
  locationChange: EventEmitter<string> = new EventEmitter<string>();
  cityCntrl = new FormControl();
  filteredOptions: Observable<string[]>;
  private valueChangesSub: Subscription;
  private requestSub: Subscription;
  private currLocation: Subscription;
  private fetchLocation: Subscription;
  private fetchStateSeal: Subscription;
  private fetchWeatherCardDetails: Subscription;
  private fetchPerDayDetail: Subscription;
  private userInputTimeout: number;

  submitted = false;
  streetCtrl = new FormControl();
  stateCtrl = new FormControl();
  checked:boolean;

  // Weather Card values
  showthecontent:boolean;
  city = "";
  timezone = "";
  humidity = "";
  temperature = ""
  summary = "";
  sealsrc = "";
  pressure = "";
  visibility = "";
  cloudcover = "";
  windspeed = "";
  ozone = "";


  //Graph details
  public barChartType = 'bar';
  public barChartLegend = true;

  showPressureChart;;
  showHumidityChart;;
  showOzoneChart;;
  showVisibilityChart;;
  showTempChart = true;
  showWindSpeedChart;;
  
  public barChartOptions_temp = {};
  public barChartLabels = [];
  public barChartData_temp= [];

  public barChartOptions_pressure = {};
  public barChartData_pressure = [];

  public barChartOptions_humidity = {};
  public barChartData_humidity = [];

  public barChartOptions_ozone = {};
  public barChartData_ozone = [];

  public barChartOptions_visibility = {};
  public barChartData_visibility = [];

  public barChartOptions_windspeed = {};
  public barChartData_windspeed = [];

  public arr_time = [];
  public arr_range = [[]];

  showModal: boolean;

  detail1 = "";
  detail2 = "";
  detail3 = "";
  detail4 = "";
  detail5 = "";
  city_detail = "";
  temperature_detail = ""
  summary_detail = "";
  weather_png = "";
  date_detail = "";

  notfav:boolean;
  isfav:boolean;
  elements: any = [];
  
  arr_details = [];
  headElements = [];

  tweethref = "";
  showprogress;
  status = "0%";


  isresult:boolean;
  isfavActive:boolean;
  isCurrentTab:boolean;
  isHourlyTab:boolean; 
  isWeeklyTab:boolean;

  stateSelect:string = "";
  street_v:string ="";
  city_v: string = "";
  cSelect:string;
  err:string;
  showerror:boolean;
  isSubmitDisabled:boolean;
  isSearchDisabled:boolean;
  isInputDisable:any;
  
  /*
  Error Fields
  */
  city_err:string = "";
  street_err:string = "";
  state_error:string = "";
  showOnload:boolean;

  isnotsubmitted = true;

  constructor(private http: HttpClient) {  
    this.valueChangesSub = this.cityCntrl.valueChanges.subscribe((value) => {   
      if (this.userInputTimeout) {
        window.clearTimeout(this.userInputTimeout);
      }  
      if (!value) {    
        this.filteredOptions = null;
        return;
      }
      this.userInputTimeout = window.setTimeout(() => {
        this.generateSuggestions(value.trim());
      }, 100);
    });
  }

  ngOnDestroy() {
    this.valueChangesSub.unsubscribe();
  }

  ngOnInit() {
    this.showOnload = false;
    this.isCurrentTab = true;
    this.isresult = true;
    this.cSelect = "temperature";
    this.isSearchDisabled = true;

    for (var i = 0; i < localStorage.length; i++){
       var v_s = localStorage.getItem(localStorage.key(i)).split(",");
       var new_entry = { image: v_s[0], city: v_s[1],  state: v_s[2] };
       this.elements.push(new_entry);
    }     
  }

  checkifvalidString(a, b, c)
  {
    let aLength = a.replace(/\s/g, '').length;
    let bLength = b.replace(/\s/g, '').length;
    let cLength = c.replace(/\s/g, '').length;
    if(aLength && bLength && cLength)
      return true;
    return false;
  }

  enableSubmitButton(a, b, c)
  {
      if(this.checkifvalidString(a, b, c))
      {
        this.isSearchDisabled = null;
        this.city_err = "";
        this.state_error = "";
        this.street_err = "";
      }
      else
      {
        this.isSearchDisabled = true;
      }
  }

  private generateSuggestions(text: string) {
    const url = 'http://localhost:3000/cities/' + encodeURI(text);
    if (this.requestSub) {
      this.requestSub.unsubscribe();
    }

    this.requestSub = this.http.get(url).subscribe((data: string) => {
      try
      {
        var obj = JSON.parse(data);
        var suggested_cities: string[] = [];
        
        var length = obj.predictions.length >5 ? 5 : obj.predictions.length;
        for(var i = 0; i < length; i++)
        {
          var str = obj.predictions[i].structured_formatting.main_text;
          
            suggested_cities[i] = str;
        }
  
        this.filteredOptions = this.cityCntrl.valueChanges.pipe(startWith(''), map(value => suggested_cities));
      }catch(err)
      {
        this.err = "Error while fetching autocomplete cities.Please manually type the city.";
        this.showerror = true;
      }

    }, err => {
        this.err = "Error in fetching autocomplete cities";
        this.showerror = true;
    });
  }

  OnStreetFocus(en_st)
  {
    let aLength = en_st.replace(/\s/g, '').length;
    if(!aLength)
    {
      this.street_err = "Please enter a street.";
    }
    else
    {
      this.street_err = "";
    }
  }

  OnCityFocus(en_ct)
  {
    let aLength = en_ct.replace(/\s/g, '').length;
    if(!aLength)
    {
      this.city_err =  "Please enter a city.";
    }
    else
    {
      this.city_err = "";
    }  
  }

  OnStateFocus(en_state)
  {
    let aLength = en_state.replace(/\s/g, '').length;
    if(!aLength)
    {
      this.state_error = "Please enter a state.";
    }
    else
    {
      this.state_error = "";
    }
  }

  private getCurrentLocation(){
    try
    {
      var url = "http://localhost:3000/currlocation";
      if (this.currLocation) {
        this.currLocation.unsubscribe();
      }
  
      this.currLocation = this.http.get(url).subscribe((data: string) => {
        this.status = "20%";
        var obj = JSON.parse(data);
        if(obj.status == "success")
        {
          let latitude: string = obj.lat;
          let longitude: string = obj.lon;
          let city: string = obj.city;
          let state: string = obj.region;
          let arr_data: string[] = [latitude, longitude, city, state];
          this.display_WeatherCard(arr_data);
        }
        else{
          this.err = "Error in fetching current location";
          this.showerror = true;
          this.status = "0%";
          this.showprogress = false;
        }
      }, err => {
        this.displayError("Error in fetching current location");
      });
    }
    catch(err)
    {
      this.displayError("Error in fetching current location");
    }
  }

  private displayError(msg)
  {
    this.showprogress = false;
    this.status = "0%";
    this.err = msg;
    this.showerror = true; 
  }

  private display_WeatherCard(arr_data: string[]){
    try{
      this.arr_details[0] = arr_data[0];
      this.arr_details[1] = arr_data[1];
      this.arr_details[2] = arr_data[2];
      this.arr_details[3] = arr_data[3];
  
      var query = arr_data[0] + "/" + arr_data[1];
      var url = "http://localhost:3000/weather/" + query;
      
      if (this.fetchWeatherCardDetails) {
        this.fetchWeatherCardDetails.unsubscribe();
      }
      this.fetchWeatherCardDetails = this.http.get(url).subscribe((data: string) => {
        try {
          this.status = "40%";
          var obj = JSON.parse(data);
          this.city = arr_data[2];
          this.timezone = obj.hasOwnProperty('timezone') ? obj.timezone : "";
          if(obj.hasOwnProperty('currently'))
          {
              this.temperature = obj.currently.hasOwnProperty('temperature') ? parseInt(obj.currently.temperature).toString() : "";
              this.summary = obj.currently.hasOwnProperty('summary') ? obj.currently.summary.toString() : "";
              this.humidity = obj.currently.hasOwnProperty('humidity') ? (Math.round(obj.currently.humidity * 100) / 100).toString(): "";
              this.pressure = obj.currently.hasOwnProperty('pressure') ? (Math.round(obj.currently.pressure * 100) / 100).toString(): "";
              this.windspeed = obj.currently.hasOwnProperty('windSpeed') ? (Math.round(obj.currently.windSpeed * 100) / 100).toString() : "";
              this.visibility = obj.currently.hasOwnProperty('visibility') ? (Math.round(obj.currently.visibility*100)/100).toString() : "";
              this.cloudcover = obj.currently.hasOwnProperty('cloudCover') ? (Math.round(obj.currently.cloudCover * 100)/100).toString() : "";
              this.ozone = obj.currently.hasOwnProperty('ozone') ? (Math.round(obj.currently.ozone * 100 ) / 100).toString() : "";
            
              var length = obj.hourly.data.length > 24 ? 24 : obj.hourly.data.length;
              var temp_array = [];
              let pressure_array = [];
              let humidity_array = [];
              let ozone_array = [];
              let visibility_array = [];
              let windspeed_array = [];
              var arr_time_bar = [];
              for(var i = 0; i < length; i++)
              {
                  temp_array[i] = obj.hourly.data[i].hasOwnProperty('temperature') ? Math.round(obj.hourly.data[i].temperature) : 0;
                  pressure_array[i] = obj.hourly.data[i].hasOwnProperty('pressure') ? Math.round(obj.hourly.data[i].pressure) : 0;
                  humidity_array[i] = obj.hourly.data[i].hasOwnProperty('humidity') ? Math.round(obj.hourly.data[i].humidity * 100) : 0;
                  ozone_array[i] = obj.hourly.data[i].hasOwnProperty('ozone') ? Math.round(obj.hourly.data[i].ozone) : 0;
                  visibility_array[i] = obj.hourly.data[i].hasOwnProperty('visibility') ? Math.round(obj.hourly.data[i].visibility) : 0;
                  windspeed_array[i] = obj.hourly.data[i].hasOwnProperty('windSpeed') ? Math.round(obj.hourly.data[i].windSpeed) : 0;
                  arr_time_bar[i] = i;
              }

              this.updatetwittertext(arr_data[2], this.temperature,  this.summary);
              this.barChartOptions_temp = { legend: { onClick: function(event, legendItem) {}},scaleShowVerticalLines: false, responsive: true, scales: {yAxes: [{ticks: { min: Math.min.apply(this, temp_array)-3, max: Math.max.apply(this, temp_array) + 3, precision: 0}, scaleLabel: { display: true, labelString: 'Fahrenheit'}}], xAxes: [{ scaleLabel: { display: true, labelString: 'Time difference from current hour' }}] }};         
              this.barChartLabels = arr_time_bar;
              this.barChartData_temp = [ {data: temp_array, label: 'Temperature', backgroundColor: 'rgba(165,208, 238)',
              borderColor: 'rgba(165,208, 238)',
              hoverBackgroundColor: 'rgb(110,145,170)',
              hoverBorderColor: 'rgba(165,208, 238)', "fill":false}];
  

              this.barChartOptions_pressure = { legend: { onClick: function(event, legendItem) {}}, scaleShowVerticalLines: false, responsive: true, scales: { yAxes: [{ticks: { min: Math.min.apply(this, pressure_array)-2, max: Math.max.apply(this, pressure_array) + 2, precision: 0}, scaleLabel: { display: true, labelString: 'Millibars'}}], xAxes: [{ scaleLabel: { display: true, labelString: 'Time difference from current hour' }}] } };         
              this.barChartData_pressure = [ {data: pressure_array, label: 'Pressure', backgroundColor: 'rgba(165,208, 238)',
              borderColor: 'rgba(165,208, 238)',
              hoverBackgroundColor: 'rgb(110,145,170)',
              hoverBorderColor: 'rgba(165,208, 238)', "fill":false}];
  
              this.barChartOptions_humidity = { legend: { onClick: function(event, legendItem) {}}, scaleShowVerticalLines: false, responsive: true, scales: {yAxes: [{ ticks: {min: Math.min.apply(this, humidity_array) - 6, max: Math.max.apply(this, humidity_array) + 6, precision: 0}, scaleLabel: { display: true, labelString: " % Percent"}}], xAxes: [{ scaleLabel: { display: true, labelString: 'Time difference from current hour' }}] } };         
              this.barChartData_humidity = [ {data: humidity_array, label: 'Humidity', backgroundColor: 'rgba(165,208, 238)',
              borderColor: 'rgba(165,208, 238)',
              hoverBackgroundColor: 'rgb(110,145,170)',
              hoverBorderColor: 'rgba(165,208, 238)', "fill":false}];
  
              this.barChartOptions_ozone = { legend: { onClick: function(event, legendItem) {}}, scaleShowVerticalLines: false, responsive: true, scales: {yAxes: [{ ticks: { min: Math.min.apply(this, ozone_array) - 1, max: Math.max.apply(this, ozone_array) + 1, precision: 0}, scaleLabel: { display: true, labelString: 'Dobson Units'}}], xAxes: [{ scaleLabel: { display: true, labelString: 'Time difference from current hour' }}] } };        
              this.barChartData_ozone = [ {data: ozone_array, label: 'Ozone', backgroundColor: 'rgba(165,208, 238)',
              borderColor: 'rgba(165,208, 238)',
              hoverBackgroundColor: 'rgb(110,145,170)',
              hoverBorderColor: 'rgba(165,208, 238)', "fill":false}];
  
              this.barChartOptions_visibility = { legend: { onClick: function(event, legendItem) {}}, scaleShowVerticalLines: false, responsive: true, scales: {yAxes: [{ ticks: {min: Math.min.apply(this, visibility_array)-2, max: Math.max.apply(this, visibility_array) + 2, precision: 0}, scaleLabel: { display: true, labelString: 'Miles (maximum 10)'}}], xAxes: [{ scaleLabel: { display: true, labelString: 'Time difference from current hour' }}] } };         
              this.barChartData_visibility = [ {data: visibility_array, label: 'Visibility', backgroundColor: 'rgba(165,208, 238)',
              borderColor: 'rgba(165,208, 238)',
              hoverBackgroundColor: 'rgb(110,145,170)',
              hoverBorderColor: 'rgba(165,208, 238)', "fill":false}];
  
              this.barChartOptions_windspeed = { legend: { onClick: function(event, legendItem) {}}, scaleShowVerticalLines: false, responsive: true, scales: {yAxes: [{ ticks: {min: Math.min.apply(this, windspeed_array)-1, max: Math.max.apply(this, windspeed_array) + 1, precision: 0}, scaleLabel: { display: true, labelString: 'Miles per hour'}}], xAxes: [{ scaleLabel: { display: true, labelString: 'Time difference from current hour' }}] } };         
              this.barChartData_windspeed = [ {data: windspeed_array, label: 'Wind Speed', backgroundColor: 'rgba(165,208, 238)',
              borderColor: 'rgba(165,208, 238)',
              hoverBackgroundColor: 'rgb(110,145,170)',
              hoverBorderColor: 'rgba(165,208, 238)', "fill":false}];
  
              var week_count = obj.daily.data.length;
  
              for(var j = 0; j < week_count; j++)
              {
                  var dt = new Date(obj.daily.data[j].time * 1000);
                  this.arr_time[j] = dt;
                  this.arr_range[j] = [parseInt(obj.daily.data[j].temperatureLow), parseInt(obj.daily.data[j].temperatureHigh)]
              }
  
              this.status = "60%";
  
              if (this.fetchStateSeal) {
                this.fetchStateSeal.unsubscribe();
              }
              var sealUrl = "http://localhost:3000/customSearch/" + arr_data[3];
              this.fetchStateSeal = this.http.get(sealUrl).subscribe((data: string) => {
                  this.status = "80%";
                  var customObj = JSON.parse(data);
                  if(customObj.hasOwnProperty('items'))
                  {
                    this.sealsrc = customObj.items[0].link;
                    this.arr_details[4] =  this.sealsrc;
                  }
  
                  this.status = "100%";
                  this.LoadDefaultSetting();
                  this.status = "0%";
                  this.showprogress = false;
                  
              }, err => {
                this.displayError("Custom Search API Error.");
              });
            }
        }
        catch(err)
        {
          this.displayError("Error in fecthing the location");
        }
      }, err => {
        this.displayError("Weather Details API Error.");
      });
    }
    catch(err)
    {
      this.displayError("Error in fecthing the location");
    }
    
  }

  private updatetwittertext(city, temperature, summary)
  {
    var tweetUpdate = "The Current Temperature at " + city + " is " + temperature + "\xB0" + " F. The weather conditions are " + summary + ".";
    this.tweethref = "https://twitter.com/intent/tweet?text=" + encodeURI(tweetUpdate) + "&button_hashtag=CSCI571WeatherSearch";  
  }

  private loadWeeklyChart(){
      CanvasJS.addColorSet("clr", ["rgba(165,208, 238)"]);
      var chart = new CanvasJS.Chart("abc",
      {
        interactivityEnabled: true,
        colorSet: "clr",
        width:800,      
        legend: {
          horizontalAlign: "center", 
          verticalAlign: "top", 
          fontSize: 15,
          text: "Weekly Weather"
        },
        title: {
          text: "Weekly Weather"
        },
        axisY: {
          title: "Temperature in Fahrenheit",
          gridThickness: 0,
          includeZero: false,
        },
        axisX: {
          title: 'Days',
          gridColor: "white",
          gridThickness: 0,
          margin: 20,
          valueFormatString: "DD/MM/YYYY",
          reversed:  true
        },
        toolTip: {
          content: "{x} : {y[0]} to {y[1]}"
        },
        data: [
        {
          type: "rangeBar",
          showInLegend: true,
          legendText: "Day wise temperature range",
          indexLabel: "{y[#index]}",
          dataPoints:[],
          click: (e) => this.Onabc(e)
        }
        ]
      });
      
      for(var i = this.arr_time.length-1; i >= 0; i--)
      {
        chart.options.data[0].dataPoints[i] = {x: this.arr_time[i], y: this.arr_range[i]};
      }
      chart.render();
  }

  private Onabc(e)
  {
    try
    {
      var lat = this.arr_details[0]; 
      var long =  this.arr_details[1]; 
      var city = this.arr_details[2]; 
      var time = (new Date(e.dataPoint.x).getTime()/1000).toString(); ;
      
      if (this.fetchPerDayDetail) {
        this.fetchPerDayDetail.unsubscribe();
      }
      var sealUrl = "http://localhost:3000/weatherday/" + lat + "/" + long + "/" + time;
      this.fetchPerDayDetail = this.http.get(sealUrl).subscribe((data: string) => {
          var dayDetailObj = JSON.parse(data);
          var dt = new Date(parseInt(time) * 1000);
          var month = dt .getMonth() + 1;
          var day = dt .getDate();
          var year = dt .getFullYear();
          var timeString = day + "/" + month + "/" + year;
  
          var temperature = parseInt(dayDetailObj.currently.temperature);
          var summary = dayDetailObj.currently.summary;
          var icons_links = {"clear-day": "https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png",
          "clear-night": "https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png", 
          "rain": "https://cdn3.iconfinder.com/data/icons/weather-344/142/rain-512.png",
          "snow": "https://cdn3.iconfinder.com/data/icons/weather-344/142/snow-512.png",
          "sleet": "https://cdn3.iconfinder.com/data/icons/weather-344/142/lightning-512.png",
          "wind": "https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png",
          "fog": "https://cdn3.iconfinder.com/data/icons/weather-344/142/cloudy-512.png",
          "cloudy": "https://cdn3.iconfinder.com/data/icons/weather-344/142/cloud-512.png",
          "partly-cloudy-day": "https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png",
          "partly-cloudy-night": "https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png"};
          var icon = dayDetailObj.currently.icon;
          var precipitation = dayDetailObj.currently.precipIntensity.toFixed(2);
          var rainChance  = dayDetailObj.currently.precipProbability.toFixed(2) * 100;
          var windspeed = dayDetailObj.currently.windSpeed.toFixed(2);
          var humidity = dayDetailObj.currently.humidity.toFixed(2) * 100;
          var visibility = dayDetailObj.currently.visibility.toFixed(2);
  
          this.detail1 = "Pecipitation : " + precipitation;
          this.detail2 = "Chance of Rain : " + rainChance + " %";
          this.detail3 = "Wind Speed : " + windspeed + " mph";
          this.detail4 = "Humidity : " + humidity + " %";
          this.detail5 = "Visibility : " + visibility + " miles";
  
          this.city_detail = city;
          this.temperature_detail = temperature.toString();
          this.summary_detail = summary;
          this.weather_png = icons_links[icon];
          this.date_detail = timeString;
          this.showModal = true;       
      }, err => {
        this.err = "Error in fetching details for this day.";
        this.showerror = true;
      });
    }
   catch(err)
   {
    this.err = "Can't load details for this day.";
    this.showerror = true;
   }
  }

  hideModel()
  {
      this.showModal = false;
  }

  private LoadDefaultSetting()
  {
    this.showOnload = false;
    this.showthecontent = true;
    this.cSelect = "temperature";
    this.onChange("temperature");
    this.isCurrentTab = true;
    this.isHourlyTab = false; 
    this.isWeeklyTab = false;
    this.showerror = false;
    this.setFav();
  }

  private setFav()
  {
    this.notfav= true;
    this.isfav = false;
    for(var i = 0; i < this.elements.length; i++)
    {
      if(this.elements[i].city == this.arr_details[2])
      {
        this.isfav = true;
        this.notfav= false;
        break;
      }
    }
  }

  private resetTheSettings()
  {
    this.showOnload = false;
    this.isfavActive = false;
    this.isresult = true;
    this.showprogress = true; 
    this.showthecontent = false;
    this.showOnload = false;
    this.err = "";
    this.showerror = false;
  }
  
  private getTheLocation(street, city, state)
  {
    try
    {
      let address: string;
      if(street != " ")
      {
        address = street + ",";
      }
      address = address + city + "," + state;
      
      let add = encodeURI(address);
      var url = "http://localhost:3000/location/" + add;
        
      if (this.fetchLocation) {
        this.fetchLocation.unsubscribe();
      }
  
      this.fetchLocation = this.http.get(url).subscribe((data: string) => {        
      this.status = "20%";
      var obj = JSON.parse(data);
      var arr_data;
      if(obj.status == "OK")
      {
        var latitude = obj.results[0].geometry.location.lat;
        var longitude = obj.results[0].geometry.location.lng;
        arr_data = [latitude, longitude, city, state];
        this.display_WeatherCard(arr_data);
      }
      else
      {
        this.isnotsubmitted = true;
        this.displayError("Invalid Address.");
      }
      }, err => {
        this.displayError("Error in Location API.");
      });
    }
    catch(err)
    {
      this.displayError("Some error in reading location.");
    }
  }

  onSubmit(){
    this.isnotsubmitted = false;
    this.resetTheSettings();

    this.showprogress = true;
    if(this.checked)
    {
      this.getCurrentLocation();
    }
    else
    {
      let street = this.streetCtrl.value.trim();
      let city = this.cityCntrl.value.trim();
      let state = this.stateCtrl.value.trim();
      this.getTheLocation(street, city, state);
    }
  }

  public onChange(value): void { 
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

  public OnTabClick(): void{
    this.loadWeeklyChart();
  }
  
  deleteRow(id, city, state){
    this.elements.splice(id, 1);
    localStorage.removeItem(city+state);
    this.OnFavClick();
  }
  
  loadCity(id){
    this.isnotsubmitted = false;
    this.showModal = false;
    this.checked = false;
    this.isSearchDisabled = true;
    this.isInputDisable = null;
    this.resetTheSettings();
    this.getTheLocation("", this.elements[id].city, this.elements[id].state);
  }

  addToFav()
  {
     var entry = { image: this.arr_details[4], city: this.arr_details[2],  state: this.arr_details[3] };
     this.elements.push(entry);
     var entry_string = entry.image + "," + entry.city + "," + entry.state;
     localStorage.setItem(entry.city+entry.state, entry_string);

     this.isfav = true;
     this.notfav = false;
  }

  deleteFav()
  {
    this.isfav = false;
    this.notfav = true;
     for(var i = 0; i < this.elements.length; i++) {
        if(this.elements[i].city === this.arr_details[2] && this.elements[i].state === this.arr_details[3]) {
          this.elements.splice(i, 1);
          localStorage.removeItem(this.arr_details[2]+this.arr_details[3]);     
        }
     }
  }

  resetTheScreen()
  {
    this.isfavActive = false;
    this.isresult = true;
    this.showprogress = false; 
    this.showthecontent = false;
    this.showerror = false;
    this.isSearchDisabled = true;
    this.city_err = "";
    this.state_error = "";
    this.street_err = "";
    this.showOnload = false;
    this.isnotsubmitted = true;
    this.stateSelect ="";
    this.street_v="";
    this.city_v="";
    this.isInputDisable = null;
    this.showModal = false;
  }

  OnFavClick()
  {
    if(this.elements.length == 0){
      this.showOnload = false;
      this.showthecontent = false;
      this.err = "No Records";
      this.showerror = true;
    }
    else{
      this.showerror = false;
      this.headElements = ['#', 'Image', 'City', 'State', 'Wish List'];
      if(this.isnotsubmitted)
      {
        this.showOnload = true;
      }
      else
      {
        this.showOnload = false;
      }
    }
  }

  OnResultClick()
  {
    this.showOnload = false;
   
    this.cSelect = "temperature";
    this.onChange("temperature");
    this.isCurrentTab = true;
    this.isHourlyTab = false; 
    this.isWeeklyTab = false;
    this.showModal = false;
    this.err = "";
    this.showerror = false;
    this.setFav();
    if(this.isnotsubmitted)
    {
      this.showthecontent = false;
      this.showerror = true;
      this.err = "No Results.";
    }
    else
    {
      this.showthecontent = true;
    }
  }

  enableDisable()
  {
    if(this.checked)
    {
      this.isSearchDisabled = false;
      this.isInputDisable = true;
      this.city_err = "";
      this.state_error = "";
      this.street_err = "";
    }
    else
    {
      this.isSearchDisabled = !this.checkifvalidString(this.stateSelect, this.street_v, this.city_v);
      this.isInputDisable = null;
    }
  }

  openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
  }

}



