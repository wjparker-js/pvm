import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectorPage } from './inspector';

@NgModule({
  declarations: [
    InspectorPage,
  ],
  imports: [
    IonicPageModule.forChild(InspectorPage),
  ],
})
export class InspectorPageModule {}
