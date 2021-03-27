import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projectId: any;
  selectedProject:any='';
  search: any = "";
  types: any= [];

  constructor(public dataServ:DatabaseService, private route:ActivatedRoute, private router:Router, private http:HttpClient) { }

  ngOnInit(): void {  
 
  }
 
  loadProject(){
    let uid = this.selectedProject;
    this.router.navigate(['overview'],
      { queryParams: { uid: uid } });
  }

  loadProjectByClick(uid) {
    this.router.navigate(['overview'],
    { queryParams: { uid: uid } });
  }
 

}
