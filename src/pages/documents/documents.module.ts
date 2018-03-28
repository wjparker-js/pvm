import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DocumentsPage } from './documents';
import { SplitPane } from '../../providers/split-pane';

@NgModule({
  declarations: [
    DocumentsPage,
  ],
  imports: [
    IonicPageModule.forChild(DocumentsPage),
  ],
  exports: [
    DocumentsPage
  ],
  providers: [
    SplitPane
  ]
})
export class DocumentsPageModule {}
