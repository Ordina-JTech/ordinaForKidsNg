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
  MatSelectModule,
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
    MatTabsModule,
    MatSelectModule
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
    MatTabsModule,
    MatSelectModule
  ],
})
export class MaterialModule { }