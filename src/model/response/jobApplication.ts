export interface JobApplicationResponse {
    id: string
    name: string
    email: string
    phone: string
    currentCity: string
    position: string
    description: string
    resume: {
        originalName: string
        path: string
        mimeType: string
    }
    createdAt: Date
}