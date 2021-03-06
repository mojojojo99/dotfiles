// Generated by CoffeeScript 1.3.3
(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : window;

  root.ExclusionRule = {
    buildRuleElement: function(rule, enableSaveButton) {
      var passKeys, pattern, remove, row;
      pattern = this.buildInput(enableSaveButton, rule.pattern, "URL pattern", "pattern");
      passKeys = this.buildInput(enableSaveButton, rule.passKeys, "Excluded keys", "passKeys");
      row = document.createElement("tr");
      row.className = "exclusionRow";
      remove = document.createElement("input");
      remove.type = "button";
      remove.value = "\u2716";
      remove.className = "exclusionRemoveButton";
      remove.addEventListener("click", function() {
        row.parentNode.removeChild(row);
        return enableSaveButton();
      });
      row.appendChild(pattern);
      row.appendChild(passKeys);
      row.appendChild(remove);
      return row;
    },
    buildInput: function(enableSaveButton, value, placeholder, cls) {
      var container, input;
      input = document.createElement("input");
      input.setAttribute("placeholder", placeholder);
      input.type = "text";
      input.value = value;
      input.className = cls;
      input.addEventListener("keyup", enableSaveButton, false);
      input.addEventListener("change", enableSaveButton, false);
      container = document.createElement("td");
      container.appendChild(input);
      return container;
    },
    extractRule: function(element) {
      var passKeys, passKeysElement, pattern, patternElement;
      patternElement = element.firstChild;
      passKeysElement = patternElement.nextSibling;
      pattern = patternElement.firstChild.value.trim();
      passKeys = passKeysElement.firstChild.value.trim();
      if (pattern) {
        return {
          pattern: pattern,
          passKeys: passKeys
        };
      } else {
        return null;
      }
    }
  };

}).call(this);
