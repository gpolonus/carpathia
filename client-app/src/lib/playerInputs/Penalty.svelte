<script>

import ItemSelect from '../item-select.svelte';
import { sendPlayerInput } from '../index.js'

let selectedOption = $state('')

const options = [
  '1',
  '2',
  '3'
]

function chose(e) {
  sendPlayerInput('penalty', { chosen: selectedOption - 1 });
}

</script>

<h2>CHOSE YOUR FATE</h2>
<ItemSelect exclusive=true items={options} bind:value={selectedOption} />
<button onclick={chose}>CHOSE</button>
