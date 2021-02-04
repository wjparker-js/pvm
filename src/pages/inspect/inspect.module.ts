import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectPage } from './inspect';

@NgModule({
  declarations: [
    InspectPage,
  ],
  imports: [
    IonicPageModule.forChild(InspectPage),
  ],
})
export class InspectPageModule {}
