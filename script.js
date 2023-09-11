const paramTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'i', 'b', 'ul', 'ol', 'span', 'img'];

const QueryParamUtils = {
  get(name) {
    const queryParams = new URLSearchParams(window.location.search); // Correct variable name
    const value = queryParams.get(name); // Use correct variable name
    if (value && this.validate(value)) {
      return this.sanitize(value);
    }
    return null;
  },
  validate(paramValue) {
    return !/<script|>|<|"/.test(paramValue);
  },
  sanitize(value) {
    return value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  },
  updateURL(paramName, paramValue) {
    if (history.pushState) {
      let searchParams = new URLSearchParams(window.location.search);
      searchParams.set(paramName, paramValue);
      let newurl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        "?" +
        searchParams.toString();
      window.history.pushState({ path: newurl }, "", newurl);
    }
  },
  isURLWhitelisted(url) {
    const whitelistedDomains = [
      window.location.hostname.split(":")[0], // Always whitelist the current domain without port
      "localhost", // Whitelist localhost for local testing
      "DOMAIN.COM",
    ]; // Add other domains to this list as needed
    const urlObj = new URL(url);
    const urlDomain = urlObj.hostname.split(":")[0]; // Extract the domain without port
    return whitelistedDomains.includes(urlDomain);
  },
};
document.addEventListener("DOMContentLoaded", function () {

  // Handle content updates
  for (const selector of paramTags) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
      const param = `${selector}_${index + 1}`;
      const contentValue = QueryParamUtils.get(param);
      
      if (contentValue) {
        if (selector === "img") {
          if (QueryParamUtils.isURLWhitelisted(contentValue)) {
            element.setAttribute("src", contentValue); // Set src attribute for <img> tags
          } else {
            console.warn("Domain not whitelisted:", contentValue);
          }
        } else {
          element.textContent = contentValue;
        }
      }
    });
}

  // Handle class configuration
  for (const [baseParam, selector] of Object.entries(paramTags)) {
    let index = 1;
    while (true) {
      const param = `${baseParam}_${index}_class`;
      const classValue = QueryParamUtils.get(param);
      const allElementsClassValue = QueryParamUtils.get(`${baseParam}_class`);

      if (!classValue && !allElementsClassValue) break;

      const elements = document.querySelectorAll(selector);
      if (allElementsClassValue) {
        elements.forEach((element) => {
          const classesToAdd = allElementsClassValue.split(",");
          classesToAdd.forEach((className) => {
            element.classList.add(className.trim());
          });
        });
      }
      if (baseParam === "body" || allElementsClassValue) {
        elements.forEach((element) => {
          const classesToAdd = classValue.split(",");
          classesToAdd.forEach((className) => {
            element.classList.add(className.trim());
          });
        });
      } else {
        const element = elements[index - 1];
        if (element) {
          const classesToAdd = classValue.split(",");
          classesToAdd.forEach((className) => {
            element.classList.add(className.trim());
          });
        }
      }

      index++;
    }
  }

  // Handle style changes from query parameters based on class names
  const urlParams = new URLSearchParams(window.location.search);

  // Update content based on URL parameters
  for (const [param, value] of urlParams.entries()) {
    if (paramTags.includes(param.split('_')[0])) {  // Check if the parameter corresponds to a known tag
      const elements = document.querySelectorAll(param);
      elements.forEach(element => {
        if (element.tagName.toLowerCase() === 'a') {
          // If the element is an <a> tag, update its href and text content
          const [href, text] = value.split('|');  // Assuming a format "href|text" for <a> tags in URL parameters
          element.setAttribute('href', href);
          element.textContent = text;
        } else {
          // For other elements, just update the text content
          element.textContent = value;
        }
      });
    }
  }
  for (const [key, value] of urlParams.entries()) {
    if (key.endsWith("_class")) {
      const parts = key.split("_");
      const tagName = parts[0];
      const index = parts.length === 3 ? parseInt(parts[1]) - 1 : null; // Subtract 1 to get 0-based index
      const elements =
        index !== null
          ? [document.querySelectorAll(tagName)[index]]
          : document.querySelectorAll(tagName);
      const classesToAdd = value.split(",");
      elements.forEach((element) => {
        if (element) {
          classesToAdd.forEach((className) => {
            element.classList.add(className.trim());
          });
        }
      });
    }
  }
  //Party Mode
  const partyMode = QueryParamUtils.get("party");
  if (partyMode === "true") {
      for (const selector of Object.values(paramTags)) {
          document.querySelectorAll(selector).forEach(elem => {
              elem.setAttribute('contenteditable', 'true');
              elem.addEventListener('input', function(event) {
                  // Unwrap any span elements inside the contenteditable (specifically for emojis)
                  const spans = elem.querySelectorAll('span');
                  spans.forEach(span => {
                      const parent = span.parentNode;
                      while (span.firstChild) {
                          parent.insertBefore(span.firstChild, span);
                      }
                      parent.removeChild(span);
                  });
                  
                  const elementType = elem.tagName.toLowerCase();
                  const index = [...document.querySelectorAll(elementType)].indexOf(elem) + 1;
                  const param = `${elementType}_${index}`;
                  const newValue = elem.textContent;
                  QueryParamUtils.updateURL(param, newValue);
              });
          });
      }
  }
});
