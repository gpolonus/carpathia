# Carpathia V3

This time it's gonna be so good.

## ToDos

- [ ] **The BoardView App**
  - get this working with SSEs
    - [o] move the old business logic into the new app-logic file
  - make this only show what's happening on the board, doesn't need any user input
    - will send out message asking for player input, player will give input on their screen, then the boardview will get the input and continue
      - example:
```javascript
function getPlayerInput(currentPlayer, inputNeeded) {
  return new Promise(resolve => {
    addEventListener(new CustomEvent('remoteUserInputReceived'), (e) => {resolve(e)})
    // will also need to do event listener cleanup
    // and will need to fire this event somewhere else

    sendMessage('Hey server, I need this input from this player etc etc')
  })
}

// ...

const playerInput = await getPlayerInput(currentPlayer, inputNeeded)

```
  - better player standings UI
- [ ] **The Client Controls App**
- [ ] **Nginx Setup for all this**
  - all of this off of the cringemas subdomain or no?
    - would help with cert provisioning
  - [ ] get all the paths and ports set up correctly for local and prod
- [ ] **Game Points**
- [ ] **admin controls**
- [ ] **get rid of alerts in the boardview**
- [ ] **Icons for everything**


## Ideas

- [x] separate the game logic from the SSE logic
- [ ] move the canvas images to something more efficient
- [ ] add all the animation smoothing [best practices](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations)
  - and better animations in general, the dice one sucks
- [ ] custom player faces
- [ ] start programming in TS so that I can reuse things more easily
  - It makes reusability tougher if I have to reread everything every time
- [ ] make the connection erroring more graceful
- [ ] make it easily togglable between all in one room and all separate
  - could do this pretty easily by just putting the controls adjacent to the board and abstracting both to work together or standalone
- [ ] oauth the endpoints
- [ ] players select an icon to use for their play piece



