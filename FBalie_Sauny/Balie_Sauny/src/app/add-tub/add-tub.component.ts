import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TubService } from '../services/tub.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-add-tub',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './add-tub.component.html',
  styleUrls: ['./add-tub.component.css'],
  providers: [TubService]
})
export class AddTubComponent {
  tubForm: FormGroup;

  constructor(private fb: FormBuilder, private tubService: TubService, private router: Router) {
    this.tubForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price_per_day: ['', Validators.required],
      price_per_week: ['', Validators.required],
      // logo_img: ['', Validators.null]
    });
  }

  onSubmit(): void {
    if (this.tubForm.valid) {
      const formData = new FormData();
      Object.keys(this.tubForm.value).forEach(key => {
        formData.append(key, this.tubForm.value[key]);
      });

      this.tubService.addTub(formData).subscribe(response => {
        console.log('Tub added successfully', response);
        this.router.navigate(['/shop']);
      });
    }
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.tubForm.patchValue({
        logo_img: file
      });
    }
  }
}
