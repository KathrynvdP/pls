import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()

export class ConnectionService {

    date = '2018-11-11';

    constructor(private http: HttpClient) { }

    internetCheck() {
        return new Promise((resolve, reject) => {
            //this.http.get(`https://www.google.com?` ).subscribe(res => {resolve(true)}, err => reject(false))
            this.http.get(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${this.date}
            &end_date=${this.date}&api_key=pfkNYcgPePjH2yCuTUkeQeHwcvxcdMZbehWLwWvY`).subscribe(res => {
                resolve(true);
            },
            err =>resolve(false)
            )
        })
    }

}