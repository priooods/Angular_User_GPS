import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserserviceService } from 'src/app/service/user/userservice.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formgroup : FormGroup;

  constructor(private connect: UserserviceService, private router: Router) { 
    this.formgroup = new FormGroup({
      nama: new FormControl(null, Validators.required),
      poslat: new FormControl(null),
      poslng: new FormControl(null),
      tujuan: new FormControl(null)
    })
  }

  ngOnInit(): void {
  }

  onClick(){
    if (this.formgroup.valid) {
      this.connect.Register(this.formgroup.value).subscribe(
        data => {
          const datass: any = data;
          if (datass != null) {
            this.router.navigate(['/dashboard/', datass.nama]) 
          }
        }
      )
    }
  }

}
