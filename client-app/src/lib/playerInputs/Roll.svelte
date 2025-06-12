<script>

import { sendPlayerInput } from '../index.js'

function roll(e) {
  sendPlayerInput('roll');
}
</script>

<button onclick={roll}>ROLL</button>
