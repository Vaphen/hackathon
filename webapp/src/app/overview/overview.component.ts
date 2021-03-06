import { Component, OnInit } from '@angular/core';

import { RestService } from '../map/rest.service';

import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { AppService } from '../services/app.service';
import { map, filter } from "rxjs/operators";
import { of } from 'rxjs';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  city: string;
  work: string;
  inputWork: string;

  appService: AppService;


  constructor(appService: AppService, private activatedRoute: ActivatedRoute, private router: Router, private restService: RestService) { 

    this.appService = appService
   }

  ngOnInit(): void {
    this.activatedRoute.fragment.subscribe(fragment => this.appService.city = fragment);
  }

  updateCity() {
    this.router.navigate(['overview'], { fragment: this.appService.city });
  }
  
  updateWork() {
    this.inputWork = this.work;
  }

  formatLabel(value: number) {
    if (value > 7) {
      return "+++";
    } else if (value < 8 && value > 3) {
      return "++";
    } else {
      return "+";
    }
  }

  change() {

    const tiles = JSON.parse(JSON.stringify(this.restService.initialTiles));
    
    for (const tile of tiles) {
      //console.log(tile.barScore)
      
      tile.barScore += tile.barScore / 0.04 * this.appService.barsValue;
      if (this.appService.barsValue === 0) {
        tile.barScore = 0;
      }
      tile.groceriesScore += tile.groceriesScore / 0.04 *  this.appService.groceriesValue;
      if (this.appService.groceriesValue === 0) {
        tile.groceriesValue = 0;
      }
      tile.parkingLotScore +=  tile.parkingLotScore / 0.04 *  this.appService.parkingLotsValue;
      if (this.appService.parkingLotsValue === 0) {
        tile.parkingLotsValue = 0;
      }
      tile.restaurantScore += tile.restaurantScore / 0.04 * this.appService.restaurantsValue;
      if (this.appService.restaurantsValue === 0) {
        tile.restaurantsValue = 0;
      }
      tile.transportationScore += tile.transportationScore / 0.04 * this.appService.transportationValue;
      if (this.appService.transportationValue === 0) {
        tile.transportationValue = 0;
      }
      
    
    }
    console.log(tiles)
    this.restService.tiles.next(tiles);
  }

  getVal(value: number) {
    if (value === 6) {
      return 0.2;
    } else if (value === 7) {
      return 0.3;
    }else if (value === 8) {
      return 0.4;
    }else if (value === 9) {
      return 0.5;
    }else if (value === 10) {
      return 0.6;
    }

    if (value === 4) {
      return -0.1;
    } else if (value === 3) {
      return -0.2;
    }else if (value === 2) {
      return -0.3;
    }else if (value === 1) {
      return -0.4;
    }else if (value === 0) {
      return -0.5;
    }

    return 1;
  }
}
