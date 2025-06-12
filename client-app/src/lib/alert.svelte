<script>
  import { clearModal } from '$lib'
    import { alertMessage } from './stores.svelte';

  let {
    type,
    message,
    actionName,
    action,
    showCloseButton
  } = $props();

  let dialogEl;

  $effect(() => {
    if (dialogEl) {
      if (type && message) {
        dialogEl.showModal()
      } else {
        dialogEl.close()
      }
    }
  });
</script>

<style>
  dialog {
    padding: 2rem;
    max-height: calc(100vh - 210px);
    overflow-y: auto;
  }

  dialog.modal-body {
    max-height: calc(100vh - 210px);
    overflow-y: auto;
  }

  dialog::backdrop {
    background-color: rgba(aquamarine, 0.5);
  }

  dialog h1 {
    text-transform: capitalize;
  }

  dialog.error {
    border-color: red;
    background-color: lightcoral;
  }

  dialog.colors div.fields {
    text-align: left;
    --text-color: black;
  }

  dialog.colors div.field {
    padding: 1rem;
  }
</style>


<dialog bind:this={dialogEl} class={type}>
  <h1>{type}</h1>
  <div>{message}</div>
  {#if actionName && action}
  <div>
    <button onclick={action}>{actionName}</button>
  </div>
  {/if}
  {#if showCloseButton}
  <div>
    <button onclick={clearModal}>Close</button>
  </div>
  {/if}
</dialog>