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

  defectsEnabled : boolean;
 
  constructor() {

    let yourColor = "primary";

    var canViewDefects = localStorage.getItem('Role-PA5073');
    
    this.defectsEnabled = false;

    if(canViewDefects == "1"){
      this.defectsEnabled = true;
    }
  }
}
