import { Component } from '@angular/core';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { DocumentsPage } from '../documents/documents';
import { ProjectsPage } from '../projects/projects';
import { DefectsPage } from '../Defects/defects';
import { AboutPage } from '../about/about';


@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ProjectsPage;
  tab3Root = DocumentsPage;
  tab4Root = DefectsPage;
  tab5Root = ContactPage;

  defectsShow : boolean;
 
  constructor() {
/*
    var canViewDefects   = localStorage.getItem('Role-PA5073');
    var canAddDefects    = localStorage.getItem('Role-PA5038');    
    var canManageDefects = localStorage.getItem('Role-PA5039');
    
    this.defectsShow = false;
    //canManageDefects = "1";

    if(canManageDefects == "1" || canAddDefects == "1" || canViewDefects == "1"){
      this.defectsShow = true;
      this.tab4Root = DocumentsPage;
      this.tab5Root = DefectsPage;
*/
    }
                                                                                          
}
