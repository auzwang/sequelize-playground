/**
  * Utility functions for string formatting
  */

/**
  * Formats a greeting message with the given name
  * @param {string} name - The name to include in the greeting
  * @returns {string} The formatted greeting message
  */
function formatGreeting(name) {
    if (!name || typeof name !== 'string') {
        return 'Hello World';
    }
    return `Hello ${name}`;
}

module.exports = {
    formatGreeting
};
