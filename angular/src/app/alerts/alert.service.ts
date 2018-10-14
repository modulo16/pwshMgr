import { Injectable } from '@angular/core';
import { AlertPolicy, AlertPolicyView } from './alertpolicy.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alert } from './alert.model';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private http: HttpClient) {}


  getAllAlertPolicies(): Observable<AlertPolicyView[]> {
    return this.http.get<AlertPolicyView[]>('/api/alertpolicies');
  }

  getAllAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>('/api/alerts');
  }

  postAlertPolicy(alertpolicy: AlertPolicy): Observable<AlertPolicy>{
    return this.http.post<AlertPolicy>('/api/alertpolicies', alertpolicy)
  }

  getAlertPolicyById(alertPolicyId): Observable<AlertPolicyView> {
    return this.http.get<AlertPolicyView>('/api/alertpolicies/' + alertPolicyId)
  }

  getAlertById(alertId): Observable<Alert> {
    return this.http.get<Alert>('/api/alerts/' + alertId)
  }

  deleteAlert(alertId) {
    return this.http.delete('/api/alerts/' + alertId)
  }

  deleteAlertPolicy(alertPolicyId) {
    return this.http.delete('/api/alertpolicies/' + alertPolicyId);
  }
}
