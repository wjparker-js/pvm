import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DocumentInfoPage } from './documentinfo';

@NgModule({
  declarations: [
    DocumentInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(DocumentInfoPage),
  ],
  exports: [
    DocumentInfoPage
  ],
  providers: []
})
export class DocumentInfoPageModule {}