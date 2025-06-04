<script>

export let items = []

export let value = []

export let exclusive = false;

function selectItem(e, item) {
  if (exclusive) {
    if (value !== item) {
      value = item
    } else {
      e.preventDefault()
      e.stopPropagation()
    }
  } else {
    if (value.some(c => c === item)) {
      value = value.filter(c => c !== item)
    } else {
      value = [...value, item]
    }
  }

}
</script>

<style>
  .item-select {
    text-align: center;
  }

  .item {
    display: inline-block;
  }

  input[type='checkbox'] {
    display: none;
  }

  label {
    display: inline-block;
    padding: 1rem;
    margin: 0.5rem;
    border: 2px solid var(--text-color);
    box-shadow: 4px 4px 0 0px var(--text-color);
    cursor: pointer;
  }

  input:checked + label {
    transform: translate(4px, 4px);
    background-color: var(--secondary);
    box-shadow: unset;
  }
</style>

<div class='item-select'>
  {#each items as item}
  <div class='item'>
    <input type="checkbox" id={item} on:change={(e) => selectItem(e, item)} checked={value.includes(item)} />
    <label for={item}>
      {item}
    </label>
  </div>
  {/each}
</div>
