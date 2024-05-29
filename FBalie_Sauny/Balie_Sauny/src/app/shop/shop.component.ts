import { Component, OnInit } from '@angular/core';
import { TubService } from '../services/tub.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [TubService],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit {
  tubs: any[] = [];

  constructor (private tubService: TubService) {}

  ngOnInit(): void {
    this.tubService.getTubs().subscribe(data => {
      this.tubs = data;
    })
  }

}
