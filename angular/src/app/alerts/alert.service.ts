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


  getAllAlertPolicies(): Observable<AlertPolicy[]> {
    return this.http.get<AlertPolicy[]>('/api/alertpolicy');
  }

  getAllAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>('/api/alert');
  }

  postAlertPolicy(alertpolicy: AlertPolicy): Observable<AlertPolicy>{
    return this.http.post<AlertPolicy>('/api/alertpolicy', alertpolicy)
  }

  getAlertPolicyById(alertPolicyId): Observable<AlertPolicyView> {
    return this.http.get<AlertPolicyView>('/api/alertpolicy/' + alertPolicyId)
  }

  getAlertById(alertId): Observable<Alert> {
    return this.http.get<Alert>('/api/alert/' + alertId)
  }

  deleteAlert(alertId) {
    return this.http.delete('/api/alert/' + alertId)
  }

  deleteAlertPolicy(alertPolicyId) {
    return this.http.delete('/api/alertpolicy/' + alertPolicyId);
  }
}
