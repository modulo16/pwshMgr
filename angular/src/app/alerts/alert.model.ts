export interface Alert {
    _id: string,
    machineId: string,
    name: String,
    alertPolicyId: String,
    dateRaised: String,
    priority: String,
    occurrenceCount: String,
    lastOccurred: String
}