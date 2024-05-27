export const BaseServerClientEvent = {
    // Lipwig events
    POLL: 'poll',

    // Connection events
    HOST_DISCONNECTED: 'host-disconnected', // Sent to clients in case of unexpected host disconnection
    HOST_RECONNECTED: 'host-reconnected',
} as const;
