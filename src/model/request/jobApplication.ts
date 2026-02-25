export interface JobApplicationRequest {
    name: string
    email: string
    phone: string
    currentCity: string
    position: string
    description: string
    resumePath?: string
    resumeOriginalName?: string
    resumeMimeType?: string
}