export interface Job {
        _id: string,
        name: string,
        machine: string,
        application: string,
        status: string,
        startDate: number,
        taskGuid: string,
        finishDate: string,
        group: string,
        subJob: boolean,
        dateAdded: number,
        subJobs: Job[],
        output: String,
        script: String,
        type: String
}