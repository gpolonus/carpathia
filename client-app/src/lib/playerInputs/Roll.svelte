<script>

import { sendPlayerInput } from '../index.js'

function roll(e) {
  sendPlayerInput('roll');
}
</script>

<style>
  button {
    font-size: 6rem;
  }
</style>

<button onclick={roll}>ROLL</button>
