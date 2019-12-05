import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DefectsviewPage } from './defectsview';

@NgModule({
  declarations: [
    DefectsviewPage,
  ],
  imports: [
    IonicPageModule.forChild(DefectsviewPage),
  ],
  exports: [
    DefectsviewPage
  ]
})
export class DefectsviewPageModule {}
