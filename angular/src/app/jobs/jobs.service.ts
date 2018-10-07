import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Job } from './job.model'

@Injectable({
  providedIn: 'root'
})
export class JobService {
  constructor(private http: HttpClient) {}

    getAllJobs(): Observable<Job[]> {
      return this.http.get<Job[]>('/api/job');
    }
  
    getJobById(jobID): Observable<Job> {
      return this.http.get<Job>('/api/job/' + jobID)
    }
  
    postJob(job: Job): Observable<Job> {
      return this.http.post<Job>('/api/job', job);
    }
  
    updateJob(job: Job) {
      return this.http.put('/api/job', job);
    }
  
    deleteJob(jobID) {
      return this.http.delete('/api/job/' + jobID);
    }

    getSubJobs(jobID): Observable<Job[]>{
      return this.http.get<Job[]>('/api/job/subjobs/' + jobID)
    }

    getJobsByMachine(machineID): Observable<Job[]>{
      return this.http.get<Job[]>('/api/machine/jobs/' + machineID)
    }
}