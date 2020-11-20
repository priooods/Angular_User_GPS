import { Component, OnInit, ViewChild } from '@angular/core';
import { ConnectService } from '../service/connect.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  public map: google.maps.Map;
  public directionsService = new google.maps.DirectionsService();
  public directionsRenderer = new google.maps.DirectionsRenderer();
  public distance = new google.maps.DistanceMatrixService();
  public geocoder = new google.maps.Geocoder();
  public marker = new google.maps.Marker();
  public infowindow = new google.maps.InfoWindow();
  
  //Information User
  yourOrigin: string;
  yourDestination: string;
  yourDirection: string;

  constructor() {}

  ngOnInit(): void { 
    this.initLocation()
  }

  initLocation(){
    navigator.geolocation.getCurrentPosition((pos) => {
      this.showMaps(pos.coords.latitude, pos.coords.longitude)},
      function (err){
        window.alert("Cannot Get Your Location");
      },
      {enableHighAccuracy: true, timeout: 1000,
        maximumAge: 0}
    );
  }

  showMaps(latitude: any, longitude: any) {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: latitude, lng: longitude},
      zoom: 15
    });
    
    
    //Getting Location Now
    this.showInfoLocation(latitude,longitude)
    this.marker = new google.maps.Marker({
      position: {lat: latitude, lng: longitude},
      map: this.map,
      icon: "https://img.icons8.com/material-rounded/24/000000/car-top-view.png"
    });
  }

  //Checkbook Bantuan Route Status
  toggle(event){
    if (event.checked) {
      //Tampilkan Route pada Map
      this.directionsRenderer.setMap(this.map) 

      //Setting element visibility
      document.getElementById("route-false").style.display = 'none';
      document.getElementById("route-true").style.display = 'block';

      //Tampilkan Bantuan Route pada element
      this.directionsRenderer.setPanel(document.getElementById("route-true") as HTMLElement);
    } else{
      //Setting Route visibility = null
      this.directionsRenderer.setMap(null);
      this.directionsRenderer.setOptions(null);
      //Setting Element visibility
      document.getElementById("route-false").style.display = 'block';
      document.getElementById("route-true").style.display = 'none';
    }
  }

  //Showing Info Address Location Now
  showInfoLocation(lat: any, lng: any){
    return  this.geocoder.geocode({location: {lat: lat, lng: lng}}, (
      results: google.maps.GeocoderResult[],
      status: google.maps.GeocoderStatus
    ) => {
      if (status == 'OK') {
        if (results[0]) {
          this.yourOrigin = results[0].formatted_address;
          this.getDirection(results[0].formatted_address);
          const infowindow = new google.maps.InfoWindow({
            content: this.yourOrigin,
          });
          
          this.marker.addListener("click", ()=> {
            infowindow.open(this.map, this.marker);
          })

        } else {
          window.alert("No results found");
        }
      } else {
        window.alert("Geocoder failed due to: " + status);
      }
    })
  }

  //Getting Direction from Origin to Destionation
  getDirection(origin: any){
    this.calculateAndDisplayRoute(this.directionsService, this.directionsRenderer, origin, "Cilegon");
  }

  //Create Line Direction in Maps
  calculateAndDisplayRoute(
    directionsService: google.maps.DirectionsService, directionsRenderer: google.maps.DirectionsRenderer, 
    origin: any, destination: string) {
    directionsService.route({
        origin: {
          query: (origin),
        },
        destination: {
          query: (destination),
        },
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      },
      (response, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
    this.yourDestination = destination;
    this.getDistanceMatrix(origin, destination);
  }

  //Getting Distance Matrix on Route
  getDistanceMatrix(origin: any, destination: any){
    this.distance.getDistanceMatrix({
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
    },
      (respon, status) => {
        if (status !== "OK") {
          alert("Error was :" + status)
        } else{
          const originList = respon.originAddresses;
          for (let i = 0; i < originList.length; i++) {
            const element = respon.rows[i].elements;
            for (let j = 0; j < element.length; j++) {
              this.yourDirection = element[j].distance.text + " " + element[j].duration.text;
            }
            
          }
        }
      }
    )
  }
}
