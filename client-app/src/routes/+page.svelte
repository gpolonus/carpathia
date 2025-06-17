<script>
  import {
    gameStatusStore,
    openConnection,
    sendMessage,
    GAME_STATUSES,
    playerName
  } from '$lib';
  import { onMount } from 'svelte';
    import PlayerInput from '../lib/playerInputs/PlayerInput.svelte';
    import { playerInputStore } from '../lib';

  onMount(async () => {
    console.log('opening connection')
    await openConnection()
    console.log('opened connection')
  });

  let playerNameInput, nameErrorMessage;

  const swears = [
    'fuck',
    'ass',
    'shit',
    'cunt',
    'fart'
  ];

  const signIn = async () => {
    console.log({ playerNameInput })
		if (!playerNameInput) {
			nameErrorMessage = "Don't be modest, give yourself a name!";
			return;
		} else if (typeof playerNameInput === 'string' && playerNameInput.indexOf('~') > -1) {
			nameErrorMessage = "You really shouldn't put a tilde in your name.";
			return;
		} else if (typeof playerNameInput === 'string' && playerNameInput.length > 15) {
			nameErrorMessage = "TOO LONG";
			return;
		} else if (swears.some(s => playerNameInput.indexOf(s) != -1)) {
			if (confirm("Are you sure you really want " + playerNameInput + " to be your name?"))
				alert("Alrighty then. You crass bastard.");
			else {
				alert("Great choice! I think it's better for people to have real names too.");
			}
		}

		const clientName = playerNameInput.replace(/[^a-zA-Z ]/g, "");
    await sendMessage('setName', { name: clientName });
    playerName.value = clientName;
  }
</script>

<style>
  .content {
    padding: 20px;
    text-align: center;
    background: var(--primary);
  }

  .name-error {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.5rem;
    background-color: black;
    color: red;
    border-radius: 1rem;
    font-size: 120%;
  }

  button {
    cursor: pointer;
  }

  input {
    font-size: 140%;
    position: relative;
    padding: 1rem;
    margin: 1rem 0.5rem 0;
    border: 2px solid black;
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: 4px 4px 0 0px black;
    color: black;
  }

  .coverContainerContents {
    color: black;
  }
</style>

<div class="content">
  <div class="coverContainerContents">
  {#if gameStatusStore.value === GAME_STATUSES.UNSTARTED}
    {#if !playerName.value}
      <h2>Enter your name</h2>
      <div>
        <input type="text" id="signInName" bind:value={playerNameInput} placeholder="Name" />
      </div>
      {#if nameErrorMessage}
      <div class="name-error">
        {nameErrorMessage}
      </div>
      {/if}
      <div>
        <button type="button" onclick={signIn}>Sign In</button>
      </div>
    {:else}
    <h2>Wait for other players</h2>
    {/if}
  {:else if gameStatusStore.value === GAME_STATUSES.STARTED}
    <PlayerInput />
  {:else if gameStatusStore.value === GAME_STATUSES.FINISHED}
    <div class="the-end">
      <h1>THE END</h1>
      <h1>TAKE A BOW</h1>
    </div>
  {/if}
  </div>
</div>

