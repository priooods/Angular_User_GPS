import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WebsocketService } from 'src/app/service/socket/websocket.service';
import { UserserviceService } from 'src/app/service/user/userservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  forms: FormGroup;
  users: any;
  
  constructor(public socket: WebsocketService, private router: Router, 
    private connect: UserserviceService) {
     this.forms = new FormGroup({
       nama: new FormControl(null, Validators.required)
     })
  }

  ngOnInit(): void {
    // this.socket.getColors().subscribe((data) => {
    //   console.log("admin id " + data);
      
    // })
    // this.socket.getStatus().subscribe((data) =>
    //   {
    //     console.log("I'M ADMIN! "+ data)
    //   }
    // )
    // this.socket.sendColors(1);
  }

  onClick(): void {
    if (this.forms.valid) {
      this.connect.Login(this.forms.value).subscribe(
        data => {
          this.users = data
          if(this.users.succes == 0){
            alert('Kamu bukan pengguna')
          } else if (this.users.succes == 1){
            this.router.navigate(['/dashboard/', this.users.pesan]);
          }
        } 
      )
    }
  }


}
