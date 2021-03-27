import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from '../database.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
 

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  uid: any;
  memberId: any;
  notes:any = [];
  modal:any = { open: false, cntx:"", obj:{} };
  note:any = {};
  noteTitle:any;
  boardTitle:any;
  addNoteForm:any = false;
  addNoteBoard:any = -999;
  addBoard:any = false; 

  constructor( public dataServ:DatabaseService, private route:ActivatedRoute, private router:Router) {
    this.dataServ.GetBoards();
    this.dataServ.GetNotes();
   }

  ngOnInit(): void {
    this.uid = this.route.snapshot.queryParams['uid'];  
  }

  loadProjectOverview(uid) {
    this.router.navigate(['overview'],
    { queryParams: { uid: uid } });
  }

  // createNote() {  
  //   this.dataServ.CreateNewNote(this.uid, this.modal.obj.title , this.modal.obj.board, this.modal.obj.type, this.modal.obj.description, this);
  // }  

  openModal(cntx, obj){ 
    let new_obj = JSON.parse(JSON.stringify(obj));
    this.modal = { open:true, 'cntx':cntx, 'obj':new_obj };
  }

  
  OpenNewNote(boardID) {     
    this.addNoteForm = true;
    this.addNoteBoard = boardID;
  }

  CreateNote(boardId) {
    this.note.boardId = boardId;
    this.note.title = this.noteTitle;
    this.addNoteForm = false;    
    this.dataServ.CreateNewNote(this.uid, this.note);
    this.noteTitle = "";
  }

  EditCurrentNote() {
    this.note.uid = this.modal.obj.uid;
    this.note.boardId =  this.modal.obj.boardId;
    this.note.type =  this.modal.obj.type;
    this.note.title = this.modal.obj.title;
    this.note.description = this.modal.obj.description;
    this.dataServ.EditNote(this.uid, this.note,this);
  }

  CancelOpenNewNote() {
    this.addNoteForm = false; 
  }

  OpenNewBoard() {
    this.addBoard = true;
  }  

  CreateBoard() {
    this.addBoard = false;
    this.dataServ.CreateNewBoard(this.uid, this.boardTitle); 
    this.boardTitle = "";
  }

  CancelOpenNewBoard() {
    this.addBoard = false;   
  }

 

  closeModal() { this.modal.open = false; }


}
