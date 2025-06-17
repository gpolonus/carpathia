<script>
  import Alert from '../lib/alert.svelte';
  import { alertMessage } from '$lib';

  const DEFAULTS = {
    primary: '#cc9425',
    secondary: '#4A412A',
    text: 'white',
  }
  let primaryColor = localStorage.getItem('primary-color') || DEFAULTS.primary
  let secondaryColor = localStorage.getItem('secondary-color') || DEFAULTS.secondary
  let textColor = localStorage.getItem('text-color') || DEFAULTS.text
  let colorStyles = `--primary:${primaryColor};--secondary:${secondaryColor};--text-color:${textColor}`

</script>

<style>
  :global(body) {
    position: relative;
    top: 0;
    left: 0;
    margin: 0;
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
  }

  :global(.body) {
    position: relative;
    top: 0;
    left: 0;
    min-height: 100vh;
    text-align: center;
    background: var(--secondary);
    color: var(--text-color);
  }

  :global(.body:has(.line-coming-up)) {
    background: var(--primary);
  }

  .header {
    padding-top: 1rem;
    font-family: "Vast Shadow", serif;
  }

  .header a {
    color: var(--text-color);
    text-decoration: none;
  }

  :global(h1, h2, h3) {
    font-family: "Creepster", system-ui;
    font-weight: 400;
    font-style: normal;
    margin: 0;
    padding-bottom: 1rem;
    font-weight: 400;
  }

  :global(h1) {
    font-size: 4rem;
  }

  :global(h2) {
    font-size: 3rem;
  }

  :global(h3) {
    font-size: 1.5rem;
  }

  :global(.underline) {
    text-decoration: underline;
  }

  :global(button) {
    position: relative;
    padding: 1rem;
    margin: 1rem 0.5rem 0;
    border: 2px solid black;
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: 4px 4px 0 0px black;
    color: black;
  }

  :global(button:active) {
    transform: translate(4px, 4px);
    box-shadow: unset;
  }

  footer {
    padding: 2rem 0 0.5rem ;
    font-size: 0.75rem;
  }

  footer a {
    color: var(--text-color);
  }

  footer div {
    display: inline-block;
    padding: 0 0.25rem;
  }
</style>

<div class="body" style={colorStyles}>
  <div class="header">
    <h1>
      Carpathia Controls
    </h1>
  </div>

  <Alert {...alertMessage.value} />

  <slot></slot>

  <footer>
    <div>
      © Griffin Polonus 2025. All Rights Reserved.
    </div>
  </footer>
</div>