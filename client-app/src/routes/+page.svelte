<script>
  import {
    gameStatusStore,
    openConnection,
    sendMessage,
    GAME_STATUSES
  } from '$lib';
  import { onMount } from 'svelte';

  onMount(async () => {
    console.log('opening connection')
    await openConnection()
    console.log('opened connection')
  });

  let playerName, nameErrorMessage, nameSubmitted = false;

  const swears = [
    'fuck',
    'ass',
    'shit',
    'cunt',
    'fart'
  ];

  const signIn = async () => {
		if (playerName > 0) {
			nameErrorMessage = "You really shouldn't put a tilde in your name.";
			return;
		} else if (playerName == '') {
			nameErrorMessage = "Don't be modest, give yourself a name!";
			return;
		} else if (swears.some(s => playerName.indexOf(s) != -1)) {
			if (confirm("Are you sure you really want " + playerName + " to be your name?"))
				alert("Alrighty then. You crass bastard.");
			else {
				alert("Great choice! I think it's better for people to have real names too.");
			}
		}

		const clientName = playerName.replace(/[^a-zA-Z ]/g, "");
    await sendMessage('setName', { name: clientName });
    nameSubmitted = true;
  }
</script>

<style>
  .content {
    padding: 20px;
    text-align: center;
    background: var(--primary);
  }

  .name-error {
    font-size: 80%;
    color: red;
  }

  button {
    cursor: pointer;
  }
</style>

<h1>
  {gameStatusStore.value}
</h1>
<div class="content">
{#if gameStatusStore.value === GAME_STATUSES.UNSTARTED}
  {#if !nameSubmitted}
  <div class="coverContainerContents">
    <ul>
      <li>
        <h2>SIGN IN TO PLAY</h2>
      </li>
      <li>
        Name: <input type="text" id="signInName" bind:value={playerName} />
      </li>
      <li class="name-error">
        {nameErrorMessage}
      </li>
      <li>
        <button type="button" onclick={signIn}>Sign In</button>
      </li>
    </ul>
  </div>
  {:else}
  <h2>Wait for other players</h2>
  {/if}
{:else if gameStatusStore.value === GAME_STATUSES.STARTED}
  <h2>The game started!</h2>
{:else if gameStatusStore.value === GAME_STATUSES.FINISHED}
  <div class="the-end">
    <h1>THE END</h1>
    <h1>TAKE A BOW</h1>
  </div>
{/if}
</div>


