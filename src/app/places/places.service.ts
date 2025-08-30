import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, tap, throwError } from 'rxjs';
import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from '../shared/error.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private errorService=inject(ErrorService);
  private httpClient=inject(HttpClient);
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchplaces('http://localhost:3000/places','Something went wrong in places container fetching');
  }

  loadUserPlaces() {
    return this.fetchplaces('http://localhost:3000/user-places','Something went wrong in user- places container fetching')
    .pipe(tap({
        next: userplace => this.userPlaces.set(userplace)
    }));
  }

  addPlaceToUserPlaces(place: Place) {
    // this.userPlaces.update( prevplace=> [...prevplace,place])
    //  the above leads to the optimistic updating 
    // ============improve the optimistic update ====================
      const prevplace=this.userPlaces();
      if(!(prevplace.some(p=>p.id===place.id))){
        this.userPlaces.set([...prevplace,place])
      }

   return  this.httpClient.put('http://localhost:3000/user-places',{
      placeId:place.id
    }).pipe(
      catchError((error)=>{
        
        this.userPlaces.set(prevplace);
        this.errorService.showError('Failed to store and select place')
        return throwError(()=> new Error('Failed to store and select place') )
      })
    )
  }

  removeUserPlace(place: Place) {
    const prevplace=this.userPlaces();
    if((prevplace.some(p=>p.id===place.id))){
      this.userPlaces.set(prevplace.filter((p)=> p.id !== place.id))
    }
    return this.httpClient.delete('http://localhost:3000/user-places/'+place.id).pipe(
      catchError((error)=>{
        
        this.userPlaces.set(prevplace);
        this.errorService.showError('Failed to store and select user place')
        return throwError(()=> new Error('Failed to store and  place') )
      })
    );
  }
 
  private fetchplaces(url:string, errormessage:string){
    return  this.httpClient.get<{places:Place[]}>(url)
   .pipe(map(resData => resData.places),
     catchError((error)=>{
       console.log(error);
       return throwError(
         () => new Error(errormessage)
       )
     })
 )
 }
}
