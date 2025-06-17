<script>

import ItemSelect from '../item-select.svelte';
import { sendPlayerInput, playerInputStore } from '../index.js'

let selectedAnswer = $state('')

const options = $derived(playerInputStore.value.options)

function answer(e) {
  const optionsAnswerMap = options.reduce((ac, o, i) => ({ ...ac, [o]: i + 1 }), {})
  sendPlayerInput('greenCard', { answer: optionsAnswerMap[selectedAnswer] });
}
</script>

<h2>Answer the Green Card</h2>
<ItemSelect exclusive=true items={options} bind:value={selectedAnswer} />
<button onclick={answer}>ANSWER</button>
