import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  uid: any;
 
  
  constructor(public dataServ: DatabaseService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void { 
    this.uid = this.route.snapshot.queryParams['uid'];  
  }
  
  loadProjectInNotes(uid) {
    this.router.navigate(['notes'],
    { queryParams: { uid: uid } });
  }

}
