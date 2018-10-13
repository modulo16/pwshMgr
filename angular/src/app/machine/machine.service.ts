import { Machine, Job } from './machine.model'
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  constructor(private http: HttpClient) {}

    getAllMachines(): Observable<Machine[]> {
      return this.http.get<Machine[]>('/api/machines');
    }
  
    getMachineById(machineID): Observable<Machine> {
      return this.http.get<Machine>('/api/machines/' + machineID)
    }
  
    postMachine(machine: Machine): Observable<Machine> {
      return this.http.post<Machine>('/api/machines/', machine);
    }
  
    updateMachine(machine: Machine): Observable<Machine> {
      return this.http.put<Machine>('/api/machines/' + machine._id, machine);
    }
  
    deleteMachine(machineID) {
      return this.http.delete('/api/machines/' + machineID);
    }

    getJobByMachine(machineID): Observable<Job[]> {
      return this.http.get<Job[]>('/api/machines/jobs/' + machineID);
    }

}