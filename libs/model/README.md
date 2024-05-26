# lipwig-model

This library holds common data structures and constants used in other Lipwig applications, particularly `@lipwig/server` and `@lipwig/js`.

## Structure

There are four main directories under `src/lib`, `host`, `client`, `admin`, and `common`. The first three of these represent the different types of Lipwig socket connections, with `common` containing content shared between them.

In each connection type directory, there are the following files
 - `<connection type>.model.ts` - This contains enums for the events related to messages sent from the connection to the server
 - `<connection type>.event.ts` - This contains the interfaces needed for handling each connection -> server event
 - `server.<connection type>.model.ts` - This contains enums for the events related to messages sent from the server to the connection
 - `server.<connection type>.event.ts` - This contains the interfaces needed for handling each connection -> server event
 - `<connection type>.exports.ts` - This formats everything for export from `@lipwig/model`

The `common` directory contains similar things for events shared between the connections, as well as some other stuff that I should probably document hey
