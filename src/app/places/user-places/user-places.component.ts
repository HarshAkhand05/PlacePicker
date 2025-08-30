import { Component, DestroyRef, inject, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { PlacesService } from '../places.service';


@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent {
  
    isFeatching=signal<true|false>(false);
    private PlaceService=inject(PlacesService);
    private destroyRef=inject(DestroyRef);
    error=signal(' ');
    places= this.PlaceService.loadedUserPlaces;
  ngOnInit() {
        this.isFeatching.set(true);
        
     const subscribe = this.PlaceService.loadUserPlaces().subscribe({
            
            complete: ()=> this.isFeatching.set(false),
            error: (error:Error)=> { console.log(error)
              this.error.set(error.message)}
            
          })
          this.destroyRef.onDestroy(()=>{

            subscribe.unsubscribe();
          })
      }

      ondeleteplace(select:Place){
         const subscribe= this.PlaceService.removeUserPlace(select).subscribe();
          console.log("deleted place id"+ select.id);
          this.destroyRef.onDestroy(()=> subscribe.unsubscribe());
      }
}
