import { Component } from '@angular/core';
import { DatabaseService } from './database.service';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Axion-tracker';
  username:any;
  password:any;

  constructor (public dataServ:DatabaseService) {
    //this.dataServ.GetProjects();
    //this.dataServ.GetProjectType();  
   }

 
  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(evt: KeyboardEvent) {
    console.log(evt);
    this.Login();
  }


   Login() {
     this.dataServ.Login(this.username, this.password, this);
   }
}
