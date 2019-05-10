import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubtypesPage } from './subtypes';

@NgModule({
  declarations: [
    SubtypesPage,
  ],
  imports: [
    IonicPageModule.forChild(SubtypesPage),
  ],
})
export class SubtypesPageModule {}
