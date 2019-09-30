import { NgModule } from '@angular/core';
import {  MatButtonModule, 
  MatButtonToggleModule, 
  MatGridListModule, 
  MatCardModule, 
  MatFormFieldModule, 
  MatProgressSpinnerModule,
  MatInputModule,
  MatTableModule,
  MatTabsModule,
} from '@angular/material';



@NgModule({
  imports: [
    MatButtonModule, 
    MatButtonToggleModule, 
    MatGridListModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatProgressSpinnerModule,
    MatInputModule,
    MatTableModule,
    MatTabsModule
  ],
  exports: [
    MatButtonModule, 
    MatButtonToggleModule, 
    MatGridListModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatProgressSpinnerModule,
    MatInputModule,
    MatTableModule,
    MatTabsModule
  ],
})
export class MaterialModule { }