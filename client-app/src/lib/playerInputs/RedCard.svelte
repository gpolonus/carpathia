<script>

import ItemSelect from '../item-select.svelte';
import { sendPlayerInput, playerInputStore } from '../index.js'

let selectedAnswer = $state('')

const {
  responding
} = $props();

const options = [
  'TRUTHING',
  'LYING'
]

const playerName = $derived(playerInputStore.value?.playerName)

function respond(e) {
  if (!selectedAnswer) {
    alert('SELECT A RESPONSE')
    return
  }
  sendPlayerInput(responding ? 'redCardReactions' : 'redCard', { result: selectedAnswer });
}

</script>

{#if responding}
<h3>How is {playerName} responding to the prompt?</h3>
{:else}
<h3>Red Card Prompt:</h3>
{/if}
<h2>{playerInputStore.value.prompt}</h2>
<ItemSelect exclusive=true items={options} bind:value={selectedAnswer} />
<button onclick={respond}>{responding ? 'GUESS' : 'REVEAL'}</button>
