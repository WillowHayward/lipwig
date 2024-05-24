export interface Validator {
    required?: string[]; // Required paramaters on request
    roomExists?: boolean; // Code parameter passed is real room
    validUser?: boolean; // User is valid (initialised, exists in room)
    isHost?: boolean; // If the user is or isn't the host. Leave undefined for either.
    other?: (args: any) => boolean; // Event-specific validation function
}
