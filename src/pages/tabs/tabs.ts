import { Component } from '@angular/core';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { DocumentsPage } from '../documents/documents';
import { ProjectsPage } from '../projects/projects';
import { DefectsPage } from '../defects/defects';
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


  constructor() {

  }
}
