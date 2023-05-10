import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

interface CountryData {
  Country: string;
  ISO2: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  countryList: CountryData[] = [];
  selectedCountries: string[] = [];
  fromDate: string = '';
  toDate: string = '';
  result: any[] = [];
  datesAreValid: boolean = true;
  isLoading: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCountryList();
  }

  loadCountryList() {
    this.http.get<CountryData[]>('http://localhost:9000/countries')
      .subscribe(data => {
        this.countryList = data;
      });
  }

  onSubmit(form: NgForm) {
    const fromDateInput = form.controls['fromDate'];
    const toDateInput = form.controls['toDate'];

    this.checkDatesValidity(form, fromDateInput, toDateInput);

    if (form.valid && this.datesAreValid) {
      const requestData = {
        countryList: this.selectedCountries.map(country => {
          const selectedCountryData = this.countryList.find(item => item.Country === country);
          return selectedCountryData ? selectedCountryData.ISO2 : '';
        }),
        fromDate: this.fromDate,
        toDate: this.toDate
      };

      this.isLoading = true;

      this.http.post<any[]>('http://localhost:9000/statistics', requestData)
        .subscribe(data => {
          this.result = data;
          this.isLoading = false;
        });
    }
  }

  checkDatesValidity(form: NgForm, fromDateInput: any, toDateInput: any) {
    const fromDateValue = fromDateInput.value;
    const toDateValue = toDateInput.value;
    if (fromDateValue && toDateValue) {
      const fromDate = new Date(fromDateValue);
      const toDate = new Date(toDateValue);
      this.datesAreValid = fromDate <= toDate;
    } else {
      this.datesAreValid = true;
    }
  }
}
