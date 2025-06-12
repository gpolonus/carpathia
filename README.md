# Carpathia V3

This time it's gonna be so good.

## ToDos

- [x] **The BoardView App**
  - get this working with SSEs
    - [x] move the old business logic into the new app-logic file
  - make this only show what's happening on the board, doesn't need any user input
    - will send out message asking for player input, player will give input on their screen, then the boardview will get the input and continue
- [x] **The Client Controls App**
- [x] **Game Points**
  - just have it as some multiplier of tokens EZPZ
- [x] might be able to fix the reconnection issues by having the BE ask the FE for what its clientId and then if it matches, keep going from where it left off
- [ ] **get rid of alerts in the boardview**
- [ ] write and then use a reconnecting testing plan once the rest of the shit is done
- [ ] **Nginx Setup for all this**
  - all of this off of the cringemas subdomain or no?
    - would help with cert provisioning
  - [x] get all the paths and ports set up correctly for local and prod
- [ ] all the FE apps need error modals for when the server falls over
  - maybe a timed reload or something
    - apps will try to reconnect automatically
  - boardview needs an error modal
- [ ] **admin controls**


## Ideas

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
- refactor the BE reconnection data to make more sense
  - does the data live on the FE or the BE to make reconnection easier? FE right?
- make resuming the stores optional. Maybe they wanted to reset everything?
- TIL: syncing FE and BE data is hard. Reconnection solutioning makes both of them a point of truth
  - and keeping players in sync with each other could be a real bitch
- save boardview stuff in localStorage later on. It'll fuck the whole thing if it falls over, but it's unlikely to be refreshed
  - OOOH I can add a blocker against that
- start with the Carpathia likelihood pretty low and make it slightly more likely to roll over time (with each additional game roll)
  - LMAO I did this already forever ago