<script>

import { sendPlayerInput } from '../index.js'

function click(e) {
  sendPlayerInput('readyup');
}
</script>

<h2>Ready for the next turn?</h2>
<button onclick={click}>READY</button>
