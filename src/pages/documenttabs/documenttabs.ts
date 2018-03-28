import { Component } from '@angular/core';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { DocumentsPage } from '../documents/documents';
import { ProjectsPage } from '../projects/projects';

import { DocumentIssues }  from './documentissues/documentissues';
import { DocumentAudit }   from './documentaudit/documentaudit';
import { DocumentInfoAll } from './documentinfoall/documentinfoall';

@Component({
  templateUrl: 'documenttabs.html'
})

export class DocumentTabs {

  tab1Root = DocumentInfoAll;
  tab2Root = DocumentAudit;
  tab3Root = DocumentIssues;

  constructor() {

  }
}
