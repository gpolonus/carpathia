# Carpathia V3

This time it's gonna be so good.

## ToDos

- [x] The BoardView App
  - get this working with SSEs
    - [x] move the old business logic into the new app-logic file
  - make this only show what's happening on the board, doesn't need any user input
    - will send out message asking for player input, player will give input on their screen, then the boardview will get the input and continue
- [x] The Client Controls App
  - just have it as some multiplier of tokens EZPZ
- [x] might be able to fix the reconnection issues by having the BE ask the FE for what its clientId and then if it matches, keep going from where it left off
- [x] get rid of alerts in the boardview
- [x] Nginx Setup for all this
  - all of this off of the cringemas subdomain or no?
    - would help with cert provisioning
    - this is exactly what I did
  - [x] get all the paths and ports set up correctly for local and prod
  - maybe a timed reload or something
    - apps will try to reconnect automatically
  - boardview needs an error modal
- [ ] write and then use a reconnecting testing plan once the rest of the shit is done
- [ ] **admin controls**


## Ideas

- All of the ideas below are great, but this whole development process will be garbage until I get a much more standardized way of moving data from BE to FE and back. Ensuring connectivity and points of truth are shored up currently, but the next game has to have a better way of holding state. Having it live in the boardview screen is iffy at best. I need user profiles, or some way of holding onto user data and keeping that in sync with everything else, and I need persistent game state. Some kind of room system would fix a wealth of these issues. AND I NEED TO DECIDE WHERE THE GAME LOGIC LIVES. Having it on the FE is ass. Calculating it on the BE and sending it to the FE will help so so so much with resumability.
- move the canvas images to something more efficient
- add all the animation smoothing [best practices](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations)
  - and better animations in general, the dice one sucks
- custom player faces
- start programming in TS so that I can reuse things more easily
  - It makes reusability tougher if I have to reread everything every time
- make the connection erroring more graceful
- make it easily togglable between all in one room and all separate
  - could do this pretty easily by just putting the controls adjacent to the board and abstracting both to work together or standalone
- oauth the endpoints
- players select an icon to use for their play piece
- possibly could use multiple types of FE apps that could use different message endpoints to reduce confusion in the message transport layer
  - could also use multiple GameApp instances for this
- refactor to have all data live in the BE GameApp to halp with resumability
- make resuming the stores optional. Maybe they wanted to reset everything?
- TIL: syncing FE and BE data is hard. Reconnection solutioning makes both of them a point of truth
  - and keeping players in sync with each other could be a real bitch
  - Keep all the data on the BE and have the clientIds be the key to reconnecting to your data that is being stored on the BE
- Figure out how to serve boardview static files via NGINX instead of having to startup a separate HTTP Server via npm
- all the FE apps need error modals for when the server falls over
