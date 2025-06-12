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
  sendPlayerInput('carpathia', { rolledDie: selectedDie }, { keep: true });
}

</script>

<h2>ROLL THE CARPATHIA DICE</h2>
<ItemSelect exclusive=true items={options} bind:value={selectedDie} />
<button onclick={roll}>ROLL</button>
