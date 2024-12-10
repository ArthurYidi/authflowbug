/**
 * Requires redirect to be: https://<id>.chromiumapp.org/*
 */
const launchWebAuthFlow = async () => {
  let url = new URL("http://localhost:3000/");
  // TESTING: Deliberately passing chrome id value to generate required redirect.
  // This is generally configured in authentication provider as allowed callbacks.
  url.searchParams.append("id", chrome.runtime.id);

  console.log(`opening: ${url.toString()}`);

  try {
    const responseUrl = await chrome.identity.launchWebAuthFlow({
      interactive: true, // ASSERTION: Error handling should remain unchanged in non-interactive mode
      url: url.toString(),
    });

    console.log(responseUrl);
    document.getElementById("message").textContent = `Success!\n${responseUrl}`;
  } catch (error) {
    console.error(error);
    document.getElementById("message").textContent = error;
    return error;
  }
};

// register click handler
document.getElementById("signIn").addEventListener("click", () => {
  launchWebAuthFlow();
});
