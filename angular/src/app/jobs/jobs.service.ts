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
      return this.http.get<Job[]>('/api/jobs');
    }
  
    getJobById(jobID): Observable<Job> {
      return this.http.get<Job>('/api/jobs/' + jobID)
    }
  
    postJob(job: Job): Observable<Job> {
      return this.http.post<Job>('/api/jobs', job);
    }
  
    updateJob(job: Job) {
      return this.http.put('/api/jobs', job);
    }
  
    deleteJob(jobID) {
      return this.http.delete('/api/jobs/' + jobID);
    }

    getSubJobs(jobID): Observable<Job[]>{
      return this.http.get<Job[]>('/api/jobs/subjobs/' + jobID)
    }

    getJobsByMachine(machineID): Observable<Job[]>{
      return this.http.get<Job[]>('/api/machines/jobs/' + machineID)
    }
}