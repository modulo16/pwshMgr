export interface AlertPolicy {
    _id: string,
    machineId: string,
    drive: string,
    threshold: string,
    type: string,
    priority: string,
    integrations: String
}

export interface AlertPolicyView {
    name: string,
    _id: string,
    machineId: string,
    drive: string,
    threshold: string,
    type: string,
    priority: string
}