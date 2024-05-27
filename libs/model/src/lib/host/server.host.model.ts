export const BaseServerHostEvent = {
    JOIN_REQUEST: 'join-request',
    LEFT: 'left',
    POLL_RESPONSE: 'poll-response',

    // Connection events
    CLIENT_DISCONNECTED: 'client-disconnected', // Sent to host in case of unexpected client disconnection
    CLIENT_RECONNECTED: 'client-reconnected',
} as const;
