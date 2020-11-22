import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { WebsocketService } from '../service/socket/websocket.service';
import { UserserviceService } from '../service/user/userservice.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit {
  
  public map: google.maps.Map;
  public directionsService = new google.maps.DirectionsService();
  public directionsRenderer = new google.maps.DirectionsRenderer({preserveViewport: true});
  public distance = new google.maps.DistanceMatrixService();
  public geocoder = new google.maps.Geocoder();
  public marker = new google.maps.Marker;
  public infowindow = new google.maps.InfoWindow();
  
  //Information User
  yourOrigin: string;
  yourDestination: string;
  yourDirection: string;
  yourName: any = this.route.snapshot.paramMap.get('nama');
  public lati: any;
  public lngi: any;

  //Datas send to Db;
  formData: FormGroup;
  tujuan: any;

  constructor( private route: ActivatedRoute, private connect: UserserviceService,
     private socket: WebsocketService,) {
  }

  ngOnInit(): void { 
    this.gettingData();
    this.initLocation();
  }

  gettingData(): void {
    this.connect.getDetailUser(this.yourName).subscribe((dta) => {
      const datas: any = dta;
      this.tujuan = datas.tujuan;
      console.log(datas.docs[0].tujuan);
      if (this.tujuan == null) {
        console.log("direction mati");
      } else {
        console.log("direction nyala");
      }
    });
  }

  updateLocation(): void {
    navigator.geolocation.getCurrentPosition((pos) => {
      this.lati = pos.coords.latitude , this.lngi = pos.coords.longitude,

      this.marker.setPosition({lat:this.lati, lng:this.lngi});
      const origin = new google.maps.LatLng({lat: this.lati, lng: this.lngi});
      this.showInfoLocation(this.lati, this.lngi);
      // this.getDirection(origin,"Jakarta");

      //push to server and admin
      this.socket.setCordinate({lat: this.lati, lng: this.lngi, nama: this.yourName});

      ///Setting data value
      this.formData = new FormGroup({
        nama: new FormControl(this.yourName, Validators.required),
        poslat: new FormControl(this.lati),
        poslng: new FormControl(this.lngi),
      })
      //push to db
      this.connect.Lokasi(this.yourName, this.formData.value)
        .subscribe((data) => {
          console.log(data);
        })

    },
    function (err){
      window.alert("Cannot Get Your Location");
    },
    {enableHighAccuracy: true, timeout: 8000,
      maximumAge: 0}
    );
  }

  initLocation(): void {
    navigator.geolocation.getCurrentPosition((pos) => {
      this.lati = pos.coords.latitude , this.lngi = pos.coords.longitude,
      this.showMaps(this.lati,this.lngi),

      this.marker = new google.maps.Marker({
        position: {lat: this.lati, lng: this.lngi},
        map: this.map,
        icon: "https://img.icons8.com/material-rounded/24/000000/car-top-view.png",
      }
      );
      // setInterval(()=>{this.updateLocation()}, 8000);
    },
      function (err){
        window.alert("Cannot Get Your Location");
      },
      {enableHighAccuracy: true, timeout: 8000,
        maximumAge: 0}
    );
  }

  showMaps(latitude: any, longitude: any): void {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: latitude, lng: longitude},
      zoom: 15
    });
  }

  //Checkbook Bantuan Route Status
  toggle(event): void{
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
  showInfoLocation(lat: any, lng: any): void {
    return  this.geocoder.geocode({location: {lat: lat, lng: lng}}, (
      results: google.maps.GeocoderResult[],
      status: google.maps.GeocoderStatus
    ) => {
      if (status == 'OK') {
        if (results[0]) {
          this.yourOrigin = results[0].formatted_address;
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
  getDirection(origin: any, tujuan: any): void{
    this.calculateAndDisplayRoute(this.directionsService, this.directionsRenderer, origin, tujuan);
  }

  //Create Line Direction in Maps
  calculateAndDisplayRoute(
    directionsService: google.maps.DirectionsService, directionsRenderer: google.maps.DirectionsRenderer, 
    origin: any, destination: string): void {
    directionsService.route({
        origin: origin,
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

  //Getting Distance Matrix on Route ( Jarak dan Waktu )
  getDistanceMatrix(origin: any, destination: any): void {
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
