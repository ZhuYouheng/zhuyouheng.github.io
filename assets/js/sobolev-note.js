(function () {
  "use strict";

  function copyWithSelection(text) {
    var field = document.createElement("textarea");
    var activeElement = document.activeElement;
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.top = "0";
    field.style.left = "-9999px";
    document.body.appendChild(field);
    field.select();
    var copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }
    document.body.removeChild(field);
    if (activeElement && typeof activeElement.focus === "function") {
      activeElement.focus({ preventScroll: true });
    }
    return copied;
  }

  function selectCitation(code) {
    var selection = window.getSelection();
    var range = document.createRange();
    code.parentElement.focus({ preventScroll: true });
    range.selectNodeContents(code);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function initCitationButtons() {
    document.querySelectorAll("[data-copy-bibtex]").forEach(function (button) {
      button.addEventListener("click", async function () {
        var code = document.getElementById(button.getAttribute("data-copy-bibtex"));
        var status = document.getElementById(button.getAttribute("aria-describedby"));
        if (!code) return;
        var copied = false;
        var citation = code.textContent.trim();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          try {
            await navigator.clipboard.writeText(citation);
            copied = true;
          } catch (error) {
            copied = false;
          }
        }
        if (!copied) copied = copyWithSelection(citation);
        if (copied) {
          if (status) status.textContent = "BibTeX copied to clipboard.";
        } else {
          selectCitation(code);
          if (status) status.textContent = "Citation selected. Press Ctrl+C (Windows) or Command+C (Mac) to copy.";
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCitationButtons);
  } else {
    initCitationButtons();
  }
}());
