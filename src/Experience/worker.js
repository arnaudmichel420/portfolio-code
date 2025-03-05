self.onmessage = async function (event) {
  const data = event.data; // Get data from the main thread

  // Await the result from the parallax function if it's async
  const result = await parallax(data); // Call the function inside the worker

  // Send the result back to the main thread
  postMessage(result);
};

function parallax(data) {
  const mouseXY = data[0];
  const cameraGroupPosition = data[1];
  const parametersParallaxAmplitude = data[2];
  const parametersParallaxSmoothing = data[3];
  cameraGroupPosition.x +=
    (mouseXY.x * parametersParallaxAmplitude - cameraGroupPosition.x) *
    parametersParallaxSmoothing;
  cameraGroupPosition.y +=
    (mouseXY.y * parametersParallaxAmplitude - cameraGroupPosition.y) *
    parametersParallaxSmoothing;

  return cameraGroupPosition;
}
