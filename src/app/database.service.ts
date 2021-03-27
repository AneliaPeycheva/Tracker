import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

declare var sha1;

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {
  isPinned:boolean = false;
  logged:boolean = false;  
  members:any = [];
  projects:any = [];
  projectTypes:any = [];
  currentProjectType:string = "";
  boards:any = [];
  notes:any = [];
  noteTypes:any = [];
  currentUsername:any;
  currentUser:any;
  currentUid:any;
  currentUserName:any;
  archiveNote:boolean = false;
  updateProjectsInterval:any;
  updateProjectsByUserInterval:any;
  updateBoardsInterval:any;
  updateNotesInterval:any;
  updateMembersInterval:any;
  isClickToOpenNewNote = false;

  currentProject:any;
 
  constructor(private http:HttpClient) { }

  GetProjects() {
    this.http.get("api/service.php?action=get_projects")
    .subscribe(response => {    
      this.projects = response['projects'];
      // alert(JSON.stringify(response['projects']));
      err => console.error(err);       
    })
    clearInterval(this.updateProjectsInterval);
    this.updateProjectsInterval = setInterval(() => {
      this.UpdateProjects();      
    }, 5000);
  }

  UpdateProjects() {
    this.http.get("api/service.php?action=get_projects")
      .subscribe(response => {
        if (this.projects.length != response['projects'].length) {
          this.projects = response['projects'];
        } else {
          for (let i = 0; i <this.projects.length; i++) {            
            this.projects[i].members = response['projects'][i].members;
            this.projects[i].type = response['projects'][i].type;
          }
        }
      })
  }

  GetProjectsByUser(userId) {   
    this.http.get("api/service.php?action=get_projects_by_user&uid=" + userId).subscribe(
      response => {    
      this.GetBoards();
      this.GetNotes();
      this.projects = response['projects']; },   
      // alert(JSON.stringify(response['projects']));   
      err => console.error(err)      
    );
    clearInterval(this.updateProjectsByUserInterval);
    this.updateProjectsByUserInterval = setInterval(() => {
      this.UpdateProjectsByUser(userId);      
    }, 5000);
  }

  UpdateProjectsByUser(userId) {
    this.http.get("api/service.php?action=get_projects_by_user&uid=" + userId)
      .subscribe(response => {
        if (this.projects.length != response['projects'].length) {
          this.projects = response['projects'];
        } else {
          for (let i = 0; i <this.projects.length; i++) {   
            this.projects[i].projectName = response['projects'][i].projectName;       
            this.projects[i].members = response['projects'][i].members;
            this.projects[i].type = response['projects'][i].type;
          }
        }
      })
  }

  GetBoards() {
    this.http.get("api/service.php?action=get_boards").subscribe(
      response => { this.boards = response['boards']; },
      err => console.error(err)       
    );
    clearInterval(this.updateBoardsInterval);
    this.updateBoardsInterval = setInterval(() => {
      this.UpdateBoards();      
    }, 5000);
  }

  UpdateBoards() {
    this.http.get("api/service.php?action=get_boards").subscribe(
      response => {
      if (this.boards.length != response['boards'].length) {
        this.boards = response['boards'];
      } else {
        for (let i = 0; i <this.boards.length; i++) {            
          this.boards[i].title = response['boards'][i].title;                
        }
      }
    })
  }

  GetNotes() {
    this.http.get("api/service.php?action=get_notes").subscribe(
      response => { this.notes = response['notes']; },
      err => console.error(err)  
    );
    clearInterval(this.updateNotesInterval);
    this.updateNotesInterval = setInterval(() => {
      this.UpdateNotes();      
    }, 5000);
  }

  UpdateNotes() {
    this.http.get("api/service.php?action=get_notes").subscribe(
      response => {
      if (this.notes.length != response['notes'].length) {
        this.notes = response['notes'];
      } else {
        for (let i = 0; i <this.notes.length; i++) {            
          this.notes[i].boardId = response['notes'][i].boardId;    
          this.notes[i].members = response['notes'][i].members; 
          this.notes[i].title = response['notes'][i].title; 
          this.notes[i].type = response['notes'][i].type; 
          this.notes[i].description = response['notes'][i].description;
          this.notes[i].deleted = response['notes'][i].deleted;  
        }
      }
    })
  }

  GetMembers() {
    this.http.get("api/service.php?action=get_members").subscribe(
      response => { this.members = response['members']; }, 
      err => console.error(err)
    );
    clearInterval(this.updateMembersInterval);
    this.updateMembersInterval = setInterval(() => {
      this.UpdateMembers();
    }, 5000);
  }

  UpdateMembers() {
    this.http.get("api/service.php?action=get_members").subscribe(
      response => {
      if (this.members.length != response['members'].length) {
        this.members = response['members'];
      } else {
        for (let i = 0; i < this.members.length; i++) {            
          this.members[i].title = response['members'][i].title;    
          this.members[i].password = response['members'][i].password;           
        }
      }
    })
  }

  GetProjectType() {
    this.http.get("api/service.php?action=get_project_type").subscribe(
      response => { this.projectTypes = response['project_type']; },
      err => console.error(err)      
    );
  }

  GetNoteType() {
    this.http.get("api/service.php?action=get_note_types").subscribe(
      response => { this.noteTypes = response['note_types']; },
      err => console.error(err)
    );
  }
  
  DeleteNote(noteId) {   
    this.notes.filter(note => note.uid == noteId)[0].deleted = 1;
    this.http.get("api/service.php?action=delete_note&noteId=" + noteId)
    .subscribe(response => {}) ; 
  }

  Login(username, password, app) {
    if (!username || !password) {
      alert("Wrong data");
    } else {   
        this.http.get("api/service.php?action=login&username=" + username + "&password=" + sha1(password))
        .subscribe( response => {
          if (response['logged'] == true) {
            this.logged  = true;
            this.currentUser = response['uid'];  
            this.currentUserName = response['name'];
            this.GetMembers();
            this.GetProjectsByUser(this.currentUser);
            this.GetProjectType();  
            app.username = "";
            app.password = ""; 
          }
        })
      } 
  }
  
  Logout() {  
    this.http.get("api/service.php?action=logout")
    .subscribe(response => {      
      this.logged = response['logged'];       
    })
  }

  pinTheCard(project) { 
    if (project.pinned) {
      project.pinned = false;
    } else {
      project.pinned = true;
      }
  }

  EditBoardIdInNotes(noteId,boardId) {  
    console.log(noteId);
    this.http.get("api/service.php?action=edit_note_boardId&uid=" + noteId + "&boardId=" + boardId)
      .subscribe(response => {
         
      })
  }

  drop(event: CdkDragDrop<string[]>, boardID) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data, 
        event.previousIndex, 
        event.currentIndex);
    } else {     
      this.notes.filter(note => note.uid == event.item.data.uid)[0].boardId = boardID;     
      this.EditBoardIdInNotes(event.item.data.uid,boardID);
      transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex);      
    }
  }
  
  // CreateNewNote(projectId, title, boardId, type, description, userModal) {    
  //   if (!title || !boardId || !type || !description) {
  //     alert("Invalid data");
  //   } 
  //   else {
  //     this.http.get("api/service.php?action=create_new_note&projectId=" + projectId + "&title=" + title + "&boardId=" + boardId + "&type=" + type.toLowerCase() + "&description=" + description)
  //       .subscribe(response => {              
  //         this.GetNotes;
  //         userModal.title = "";
  //         userModal.boardID = "";
  //         userModal.type = "";
  //         userModal.description = "";
  //       });
  //       userModal.closeModal();
  //     }     
  // }

  CreateNewNote(projectId, note) {   
    if (!note.title) {
      alert("Invalid data");
    } 
    else {
        this.http.get("api/service.php?action=create_new_note&projectId=" + projectId + "&title=" + note.title + "&boardId=" + note.boardId)
        .subscribe(response => {              
          this.GetNotes;         
        });
       
      }     
  }

  CreateNewBoard(projectId, title) {    
    if (!title) {
      alert("Invalid data");
    } 
    else {
        this.http.get("api/service.php?action=create_new_board&projectId=" + projectId + "&title=" + title )
        .subscribe(response => {                        
          this.GetBoards;   
          this.GetNotes;        
        });
       
      }  
  }

  EditNote(projectId,note,userModal){
    console.log(projectId);
    console.log(note);
    this.http.get("api/service.php?action=edit_note&projectId=" + projectId + "&uid=" + note.uid + "&title=" + note.title + "&description=" + note.description + "&type=" + note.type + "&boardId=" + note.boardId)
    .subscribe(response => {                        
      this.GetBoards;   
      this.GetNotes;        
    });
    userModal.closeModal();
  }

  ReturnProjects (search) { 
    if (search == "") {      
      return this.projects;
       //   return this.projects.sort((a,b) => b.pinned - a.pinned);
    } else {
        return this.projects.filter(p => p.projectName.includes(search) );
        //   return this.projects.filter(p => p.projectName.includes(search) || p.clientName.includes(search)).sort((a,b) => b.pinned - a.pinned);
      }
  }  


  ReturnProjectTypeById(typeId) {     
    let projectType = this.projectTypes.filter(p => p.uid == typeId);
    if (projectType.length > 0) {
      return projectType[0].name_project_type;
    } else {
      return "";
    }
  }

  ReturnNoteTypes(){
    this. GetNoteType();  
    return this.noteTypes; 
  }

  ReturnProjectById(uid) {
    let currentProject = this.projects.filter(p => p.uid == uid);
    return currentProject[0];
  }  

  ReturnBoards(projectId) {
    return this.boards.filter(board => board.projectId == projectId);
  } 

  ReturnNotesByBoardId(boardID) {
    return this.notes.filter(note => note.boardId == boardID);
  }

  ReturnNotes(boardId,projectId) {
    let currentNotes = this.notes.filter(note => note.boardId == boardId && note.projectId == projectId && note.deleted == 0); 
    return currentNotes;
  }

  ReturnNotesbyProjectId(uid) {
    let currentNotes = this.notes.filter(note => note.projectId == uid);   
    return currentNotes;
  }  

  ReturnLoggedIn() {
    return this.logged;
  }

  ReturnPersonalProgress(projectId) {   
      let allNotesForUser = 0;
      let userDoneNotesCount = 0;       
      let doneBoardsByProject = this.boards.filter(board => board.projectId==projectId && board.title == 'done' || board.title == 'Done'); 
      if (doneBoardsByProject.length > 0){
        this.notes.filter(note => note.deleted == 0 && note.projectId == projectId)
        .forEach(note => { 
          if (note.members.includes(this.currentUser)) {
            allNotesForUser++;
          } 
          if ((note.boardId == doneBoardsByProject[0].uid) && note.members.includes(this.currentUser)) {
            userDoneNotesCount++;
          } 
        })
      }  
      let personalProgress = ((userDoneNotesCount/allNotesForUser)*100) + '%' ; 
      return {
              userDoneNotesCount,
              allNotesForUser,
              personalProgress
      };  
  }

  ReturnProjectProgress(projectId) {  
    let doneBoardsByProject = this.boards.filter(board => board.projectId==projectId && board.title == 'done' || board.title == 'Done'); 
    if (doneBoardsByProject.length >0) {
      let allNotesForProject = 0;
      let projectDoneNotesCount = 0;  
      this.notes.filter(note => note.deleted == 0 && note.projectId == projectId)
      .forEach(note => { 
          allNotesForProject++;              
          if ((note.boardId == doneBoardsByProject[0].uid)) {
            projectDoneNotesCount++;
          } 
      }) 
      let result = ((projectDoneNotesCount/allNotesForProject)*100).toFixed();
      return result + '%';  
    } else {
      return 'в очакване';
    }   
    
  }
  
}

