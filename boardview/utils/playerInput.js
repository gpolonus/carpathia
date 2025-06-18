
// TODO LATER: Add the ability for other players to chime in with input even when it's not asked for
// The above might be accomplishable without changing this
// TODO LATER: make this more implicit by putting it in the frontend SSE layer

import { sendMessage } from "../frontend-sse";

// picking a random outcome of 3
  // // $(ctx.canvas).on("click", function () {
// rolling carpathia dice
  // // $(ctx.canvas).on("click", function () {
// roll the main die
  // // $(ctx.canvas).on("click", function () {
// gotta just remove this bit
  // // $("body").on("keyup", function () {
  // // $("#endTurnButton").on("keyup", function () {
  // // $("#endTurnButton").on("click", function () {
  // // $("#startGameButton").on("keyup", function () {
  // // $("#startGameButton").on("click", function () {
  // // $("#greenCardSubmit").on("click", function () {
  // // $("#truth").on("click", function () {
  // // $("#lying").on("click", function () {
  // // $("#lying").on("click", function () {
  // // $("#truth").on("click", function () {

export function fetchPlayerInput(clientId, type) {
  return new Promise((resolve, reject) => {
    sendMessage('requestPlayerInput', {
      clientId,
      type
    });

    const intervalId = setInterval(() => {
      sendMessage('requestPlayerInput', {
        clientId,
        type
      });
    }, 5 * 1000)

    const eventHandler = (e) => {
      const data = e.detail
      removeEventListener('playerInput', eventHandler)
      clearInterval(intervalId)
      resolve(data);
    };

    addEventListener('playerInput', eventHandler);
  });
}

export function receivedPlayerInput(data) {
  const e = new CustomEvent('playerInput', { detail: data });
  dispatchEvent(e)
}
