export interface AlertPolicy {
    _id: string,
    machineId: string,
    drive: string,
    threshold: string,
    type: string
}

export interface AlertPolicyView {
    name: string,
    _id: string,
    machineId: string,
    drive: string,
    threshold: string,
    type: string
}