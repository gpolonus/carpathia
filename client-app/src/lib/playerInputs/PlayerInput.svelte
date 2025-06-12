
<script>
  import { playerInputStore } from "../stores.svelte";
  import Carpathia from "./Carpathia.svelte";
  import GreenCard from "./GreenCard.svelte";
  import ReadyUp from "./ReadyUp.svelte";
  import RedCard from "./RedCard.svelte";
  import Roll from './Roll.svelte'
  import Penalty from './Penalty.svelte'

  $effect(() => {
    console.log('playerInputStore', playerInputStore.value)
  })

</script>

<style>
  /* :global(.player-input button) {

  } */
</style>

<div class='player-input'>
  {#if playerInputStore.value?.type === 'roll'}
    <Roll />
  {:else if playerInputStore.value?.type === 'greenCard'}
    <GreenCard data={playerInputStore.value} />
  {:else if playerInputStore.value?.type === 'readyup'}
    <ReadyUp />
  {:else if playerInputStore.value?.type === 'redCard'}
    <RedCard />
  {:else if playerInputStore.value?.type === 'redCardReactions'}
    <RedCard responding=true />
  {:else if playerInputStore.value?.type === 'carpathia'}
    <Carpathia />
  {:else if playerInputStore.value?.type === 'penalty'}
    <Penalty />
  {:else if playerInputStore.value?.type === 'something else'}

  {/if}
</div>