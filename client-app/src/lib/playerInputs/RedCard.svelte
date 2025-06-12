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
  sendPlayerInput(responding ? 'redCardReactions' : 'redCard', { result: selectedAnswer });
}

</script>

{#if responding}
<h2>How is {playerName} responding to the prompt?</h2>
{:else}
<h2>Red Card Prompt:</h2>
{/if}
<h3>{playerInputStore.value.prompt}</h3>
<ItemSelect exclusive=true items={options} bind:value={selectedAnswer} />
<button onclick={respond}>{responding ? 'GUESS' : 'REVEAL'}</button>
