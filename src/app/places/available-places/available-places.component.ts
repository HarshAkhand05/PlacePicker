import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFeatching=signal<true|false>(false);
  private placesService=inject(PlacesService);
  private destroyRef=inject(DestroyRef);
  error=signal(' ');
    ngOnInit() {
      this.isFeatching.set(true);
     const subscribe= this.placesService.loadAvailablePlaces().subscribe({
          next: (places) => {this.places.set(places)},
          complete: ()=> this.isFeatching.set(false),
          error: (error: Error)=> { 
            this.error.set(error.message )}
          
        })
        this.destroyRef.onDestroy(()=>{
          subscribe.unsubscribe();
        })
    }

  // <===================== setting observe to get http resposnse instead of response data
  // ngOnInit() {
  //   const subscribe=  this.httpClient.get<{places:Place}>('http://localhost:3000/places',{observe:'response'}).subscribe({
  //       next: response => {
  //         console.log(response)// http response object
  //         console.log(response.body?.places)
  //       }
  //     })
  //     this.destroyRef.onDestroy(()=>{
  //       subscribe.unsubscribe();
  //     })
  // }

  // <======================= observe the event that is during the response and the request ====================>
  // ngOnInit() {
  //   const subscribe=  this.httpClient.get<{places:Place}>('http://localhost:3000/places',{observe:'events'}).subscribe({
  //       next: event => console.log(event)
  //     })
  //     this.destroyRef.onDestroy(()=>{
  //       subscribe.unsubscribe();
  //     })
  // }
    onselectevent(SelectedPlace: Place){
      const subscribe=this.placesService.addPlaceToUserPlaces(SelectedPlace).subscribe({
          next: resData=> console.log(resData)
        });
        this.destroyRef.onDestroy(()=>{
          subscribe.unsubscribe();
        })
    }
}
