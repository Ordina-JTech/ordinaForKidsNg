import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatGridListModule } from '@angular/material/grid-list';


@NgModule({
  imports: [MatButtonModule, MatButtonToggleModule, MatGridListModule],
  exports: [MatButtonModule, MatButtonToggleModule, MatGridListModule],
})
export class MaterialModule { }