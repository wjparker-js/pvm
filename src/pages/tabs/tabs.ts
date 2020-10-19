import { Component } from '@angular/core';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { DocumentsPage } from '../documents/documents';
import { ProjectsPage } from '../projects/projects';
import { DefectsPage } from '../Defects/defects';
import { WrapperPage } from '../wrapper/wrapper';

@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ProjectsPage;
  tab3Root = DocumentsPage;
  tab4Root = DefectsPage;
  tab5Root = ContactPage;  
  tab6Root = WrapperPage;

  online : boolean=true;
  defectsShow : boolean=true;
 
  constructor() {

    var isonline         = localStorage.getItem('online');
    
    if(isonline != "1"){
      this.online = false;  
    }

  }
                                                                                          
}
