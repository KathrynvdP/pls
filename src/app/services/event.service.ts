import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })

export class EventService {
    noteComplete: EventEmitter<any>;
    constructor()   {
        this.noteComplete = new EventEmitter();
    }

    public emitComplete(id: string, pod: string)   {
        this.noteComplete.emit(
            {
                id: id,
                pod: pod
            }
        );
    }
}