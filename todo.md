--- Okay, actual todo list now ---
Medium Term (some of these can be moved up for fun)
    - Monolith things to potentially port
        - https://www.npmjs.com/package/eslint-plugin-import
        - env & parserOptions?
    - Thoughts on this one? https://typescript-eslint.io/rules/no-confusing-void-expression/
        - ignoreArrowShorthand holds appeal
    - Tinker: https://typescript-eslint.io/rules/restrict-template-expressions/

--- Message Format ---
 - Server Option - Message Format (low priority, would be fun)
    - Verbose - as existing, object with "event" containing string and (optionally) "data" containing data parameters
    - Concise - instead, an array where the first item is a _number_ corresponding to the numerical value of the event (if we keep these at 127 or less we can keep it as one byte in msgpack), and the second item is data object
        - This could go real deep if we want, with the data parameter either as an object with like { "code": "ABCD", "opts": <playeroptions> } for join, or have the whole thing be \[<join event number>, "ABCD", <playeroptions>] and then take care to construct is per-message
    - MessagePack. This could apply for either verbose or concise
    - Could be extended to like, protobuf or whatever. I dunno, I kinda like MessagePack, making it configurable means it's not locked out.
    - Message to set the message format should be its own thing I guess (not any other format)? Or any format? Assume json-simple? 
        - I _think_ this should happen at the very start to prevent race conditions (/as part of the create/join/rejoin maybe), but you'd need to confirm the threading on that ay.
    - So options would be
        - json-verbose (default, backwards compatible)
        - json-concise
        - messagepack-verbose (Verbose but with MessagePack encoding)
        - messagepack-concise (yeah you get it)
