<script>

import ItemSelect from '../item-select.svelte';
import { sendPlayerInput } from '../index.js'

let selectedDie = $state('')

const options = [
  'CAR',
  'PAT',
  'HIA'
]

function roll(e) {
  if (!selectedDie) {
    alert('PICK A DIE')
    return
  }
  sendPlayerInput('carpathia', { rolledDie: selectedDie }, { keep: true });
}

</script>


<style>
  :global(.carpathia-dice .item-select label) {
    font-size: 4rem;
    font-family: "Vast Shadow", serif;
    font-weight: 400;
    font-style: normal;
  }
</style>

<div class="carpathia-dice">
  <h2>ROLL THE CARPATHIA DICE</h2>
  <ItemSelect exclusive=true items={options} bind:value={selectedDie} />
  <button onclick={roll}>ROLL</button>
</div>