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
  if (!selectedOption) {
    alert('SELECT A PENALTY')
    return
  }
  sendPlayerInput('penalty', { chosen: selectedOption - 1 });
}

</script>

<style>
  :global(.penalty .item-select label) {
    font-size: 4rem;
    font-family: "Vast Shadow", serif;
    font-weight: 400;
    font-style: normal;
  }
</style>

<div class="penalty">
  <h2>CHOSE YOUR FATE</h2>
  <ItemSelect exclusive=true items={options} bind:value={selectedOption} />
  <button onclick={chose}>CHoOoOoSE</button>
</div>