// Generated by CoffeeScript 1.12.7
(function() {
  var DomUtils, root;

  DomUtils = {
    documentReady: (function() {
      var callbacks, isReady, onDOMContentLoaded, ref;
      ref = [document.readyState !== "loading", []], isReady = ref[0], callbacks = ref[1];
      if (!isReady) {
        window.addEventListener("DOMContentLoaded", (onDOMContentLoaded = forTrusted(function() {
          var callback, i, len;
          window.removeEventListener("DOMContentLoaded", onDOMContentLoaded, true);
          isReady = true;
          for (i = 0, len = callbacks.length; i < len; i++) {
            callback = callbacks[i];
            callback();
          }
          return callbacks = null;
        })), true);
      }
      return function(callback) {
        if (isReady) {
          return callback();
        } else {
          return callbacks.push(callback);
        }
      };
    })(),
    documentComplete: (function() {
      var callbacks, isComplete, onLoad, ref;
      ref = [document.readyState === "complete", []], isComplete = ref[0], callbacks = ref[1];
      if (!isComplete) {
        window.addEventListener("load", (onLoad = forTrusted(function(event) {
          var callback, i, len;
          if (event.target !== document) {
            return;
          }
          window.removeEventListener("load", onLoad, true);
          isComplete = true;
          for (i = 0, len = callbacks.length; i < len; i++) {
            callback = callbacks[i];
            callback();
          }
          return callbacks = null;
        })), true);
      }
      return function(callback) {
        if (isComplete) {
          return callback();
        } else {
          return callbacks.push(callback);
        }
      };
    })(),
    createElement: function(tagName) {
      var element;
      element = document.createElement(tagName);
      if (element instanceof HTMLElement) {
        this.createElement = function(tagName) {
          return document.createElement(tagName);
        };
        return element;
      } else {
        this.createElement = function(tagName) {
          return document.createElementNS("http://www.w3.org/1999/xhtml", tagName);
        };
        return this.createElement(tagName);
      }
    },
    addElementList: function(els, overlayOptions) {
      var el, i, len, parent;
      parent = this.createElement("div");
      if (overlayOptions.id != null) {
        parent.id = overlayOptions.id;
      }
      if (overlayOptions.className != null) {
        parent.className = overlayOptions.className;
      }
      for (i = 0, len = els.length; i < len; i++) {
        el = els[i];
        parent.appendChild(el);
      }
      document.documentElement.appendChild(parent);
      return parent;
    },
    removeElement: function(el) {
      return el.parentNode.removeChild(el);
    },
    isTopFrame: function() {
      return window.top === window.self;
    },
    makeXPath: function(elementArray) {
      var element, i, len, xpath;
      xpath = [];
      for (i = 0, len = elementArray.length; i < len; i++) {
        element = elementArray[i];
        xpath.push(".//" + element, ".//xhtml:" + element);
      }
      return xpath.join(" | ");
    },
    evaluateXPath: function(xpath, resultType) {
      var contextNode, namespaceResolver;
      contextNode = document.webkitIsFullScreen ? document.webkitFullscreenElement : document.documentElement;
      namespaceResolver = function(namespace) {
        if (namespace === "xhtml") {
          return "http://www.w3.org/1999/xhtml";
        } else {
          return null;
        }
      };
      return document.evaluate(xpath, contextNode, namespaceResolver, resultType, null);
    },
    getVisibleClientRect: function(element, testChildren) {
      var child, childClientRect, clientRect, clientRects, computedStyle, i, isInlineZeroHeight, j, len, len1, ref, ref1;
      if (testChildren == null) {
        testChildren = false;
      }
      clientRects = (function() {
        var i, len, ref, results;
        ref = element.getClientRects();
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          clientRect = ref[i];
          results.push(Rect.copy(clientRect));
        }
        return results;
      })();
      isInlineZeroHeight = function() {
        var elementComputedStyle, isInlineZeroFontSize;
        elementComputedStyle = window.getComputedStyle(element, null);
        isInlineZeroFontSize = (0 === elementComputedStyle.getPropertyValue("display").indexOf("inline")) && (elementComputedStyle.getPropertyValue("font-size") === "0px");
        isInlineZeroHeight = function() {
          return isInlineZeroFontSize;
        };
        return isInlineZeroFontSize;
      };
      for (i = 0, len = clientRects.length; i < len; i++) {
        clientRect = clientRects[i];
        if ((clientRect.width === 0 || clientRect.height === 0) && testChildren) {
          ref = element.children;
          for (j = 0, len1 = ref.length; j < len1; j++) {
            child = ref[j];
            computedStyle = window.getComputedStyle(child, null);
            if (computedStyle.getPropertyValue("float") === "none" && !((ref1 = computedStyle.getPropertyValue("position")) === "absolute" || ref1 === "fixed") && !(clientRect.height === 0 && isInlineZeroHeight() && 0 === computedStyle.getPropertyValue("display").indexOf("inline"))) {
              continue;
            }
            childClientRect = this.getVisibleClientRect(child, true);
            if (childClientRect === null || childClientRect.width < 3 || childClientRect.height < 3) {
              continue;
            }
            return childClientRect;
          }
        } else {
          clientRect = this.cropRectToVisible(clientRect);
          if (clientRect === null || clientRect.width < 3 || clientRect.height < 3) {
            continue;
          }
          computedStyle = window.getComputedStyle(element, null);
          if (computedStyle.getPropertyValue('visibility') !== 'visible') {
            continue;
          }
          return clientRect;
        }
      }
      return null;
    },
    cropRectToVisible: function(rect) {
      var boundedRect;
      boundedRect = Rect.create(Math.max(rect.left, 0), Math.max(rect.top, 0), rect.right, rect.bottom);
      if (boundedRect.top >= window.innerHeight - 4 || boundedRect.left >= window.innerWidth - 4) {
        return null;
      } else {
        return boundedRect;
      }
    },
    getClientRectsForAreas: function(imgClientRect, areas) {
      var area, coords, diff, i, len, r, rect, rects, ref, shape, x, x1, x2, y, y1, y2;
      rects = [];
      for (i = 0, len = areas.length; i < len; i++) {
        area = areas[i];
        coords = area.coords.split(",").map(function(coord) {
          return parseInt(coord, 10);
        });
        shape = area.shape.toLowerCase();
        if (shape === "rect" || shape === "rectangle") {
          x1 = coords[0], y1 = coords[1], x2 = coords[2], y2 = coords[3];
        } else if (shape === "circle" || shape === "circ") {
          x = coords[0], y = coords[1], r = coords[2];
          diff = r / Math.sqrt(2);
          x1 = x - diff;
          x2 = x + diff;
          y1 = y - diff;
          y2 = y + diff;
        } else if (shape === "default") {
          ref = [0, 0, imgClientRect.width, imgClientRect.height], x1 = ref[0], y1 = ref[1], x2 = ref[2], y2 = ref[3];
        } else {
          x1 = coords[0], y1 = coords[1], x2 = coords[2], y2 = coords[3];
        }
        rect = Rect.translate(Rect.create(x1, y1, x2, y2), imgClientRect.left, imgClientRect.top);
        rect = this.cropRectToVisible(rect);
        if (rect && !isNaN(rect.top)) {
          rects.push({
            element: area,
            rect: rect
          });
        }
      }
      return rects;
    },
    isSelectable: function(element) {
      var unselectableTypes;
      if (!(element instanceof Element)) {
        return false;
      }
      unselectableTypes = ["button", "checkbox", "color", "file", "hidden", "image", "radio", "reset", "submit"];
      return (element.nodeName.toLowerCase() === "input" && unselectableTypes.indexOf(element.type) === -1) || element.nodeName.toLowerCase() === "textarea" || element.isContentEditable;
    },
    isEditable: function(element) {
      var ref;
      return (this.isSelectable(element)) || ((ref = element.nodeName) != null ? ref.toLowerCase() : void 0) === "select";
    },
    isEmbed: function(element) {
      var ref, ref1;
      return (ref = (ref1 = element.nodeName) != null ? ref1.toLowerCase() : void 0) === "embed" || ref === "object";
    },
    isFocusable: function(element) {
      return element && (this.isEditable(element) || this.isEmbed(element));
    },
    isDOMDescendant: function(parent, child) {
      var node;
      node = child;
      while (node !== null) {
        if (node === parent) {
          return true;
        }
        node = node.parentNode;
      }
      return false;
    },
    isSelected: function(element) {
      var containerNode, node, selection;
      selection = document.getSelection();
      if (element.isContentEditable) {
        node = selection.anchorNode;
        return node && this.isDOMDescendant(element, node);
      } else {
        if (DomUtils.getSelectionType(selection) === "Range" && selection.isCollapsed) {
          containerNode = selection.anchorNode.childNodes[selection.anchorOffset];
          return element === containerNode;
        } else {
          return false;
        }
      }
    },
    simulateSelect: function(element) {
      if (element === document.activeElement && DomUtils.isEditable(document.activeElement)) {
        return handlerStack.bubbleEvent("click", {
          target: element
        });
      } else {
        element.focus();
        if (element.tagName.toLowerCase() !== "textarea") {
          try {
            if (element.selectionStart === 0 && element.selectionEnd === 0) {
              return element.setSelectionRange(element.value.length, element.value.length);
            }
          } catch (error) {}
        }
      }
    },
    simulateClick: function(element, modifiers) {
      var defaultActionShouldTrigger, event, eventSequence, i, len, results;
      if (modifiers == null) {
        modifiers = {};
      }
      eventSequence = ["mouseover", "mousedown", "mouseup", "click"];
      results = [];
      for (i = 0, len = eventSequence.length; i < len; i++) {
        event = eventSequence[i];
        defaultActionShouldTrigger = Utils.isFirefox() && Object.keys(modifiers).length === 0 && event === "click" && element.target === "_blank" && element.href && !element.hasAttribute("onclick") && !element.hasAttribute("_vimium-has-onclick-listener") ? true : this.simulateMouseEvent(event, element, modifiers);
        if (event === "click" && defaultActionShouldTrigger && Utils.isFirefox()) {
          if (0 < Object.keys(modifiers).length || element.target === "_blank") {
            DomUtils.simulateClickDefaultAction(element, modifiers);
          }
        }
        results.push(defaultActionShouldTrigger);
      }
      return results;
    },
    simulateMouseEvent: (function() {
      var lastHoveredElement;
      lastHoveredElement = void 0;
      return function(event, element, modifiers) {
        var mouseEvent;
        if (modifiers == null) {
          modifiers = {};
        }
        if (event === "mouseout") {
          if (element == null) {
            element = lastHoveredElement;
          }
          lastHoveredElement = void 0;
          if (element == null) {
            return;
          }
        } else if (event === "mouseover") {
          this.simulateMouseEvent("mouseout", void 0, modifiers);
          lastHoveredElement = element;
        }
        mouseEvent = new MouseEvent(event, {
          bubbles: true,
          cancelable: true,
          composed: true,
          view: window,
          detail: 1,
          ctrlKey: modifiers.ctrlKey,
          altKey: modifiers.altKey,
          shiftKey: modifiers.shiftKey,
          metaKey: modifiers.metaKey
        });
        return element.dispatchEvent(mouseEvent);
      };
    })(),
    simulateClickDefaultAction: function(element, modifiers) {
      var altKey, ctrlKey, metaKey, newTabModifier, ref, shiftKey;
      if (modifiers == null) {
        modifiers = {};
      }
      if (!(((ref = element.tagName) != null ? ref.toLowerCase() : void 0) === "a" && element.href)) {
        return;
      }
      ctrlKey = modifiers.ctrlKey, shiftKey = modifiers.shiftKey, metaKey = modifiers.metaKey, altKey = modifiers.altKey;
      if (KeyboardUtils.platform === "Mac") {
        newTabModifier = metaKey === true && ctrlKey === false;
      } else {
        newTabModifier = metaKey === false && ctrlKey === true;
      }
      if (newTabModifier) {
        chrome.runtime.sendMessage({
          handler: "openUrlInNewTab",
          url: element.href,
          active: shiftKey === true
        });
      } else if (shiftKey === true && metaKey === false && ctrlKey === false && altKey === false) {
        chrome.runtime.sendMessage({
          handler: "openUrlInNewWindow",
          url: element.href
        });
      } else if (element.target === "_blank") {
        chrome.runtime.sendMessage({
          handler: "openUrlInNewTab",
          url: element.href,
          active: true
        });
      }
    },
    simulateHover: function(element, modifiers) {
      if (modifiers == null) {
        modifiers = {};
      }
      return this.simulateMouseEvent("mouseover", element, modifiers);
    },
    simulateUnhover: function(element, modifiers) {
      if (modifiers == null) {
        modifiers = {};
      }
      return this.simulateMouseEvent("mouseout", element, modifiers);
    },
    addFlashRect: function(rect) {
      var flashEl;
      flashEl = this.createElement("div");
      flashEl.classList.add("vimiumReset");
      flashEl.classList.add("vimiumFlash");
      flashEl.style.left = rect.left + "px";
      flashEl.style.top = rect.top + "px";
      flashEl.style.width = rect.width + "px";
      flashEl.style.height = rect.height + "px";
      document.documentElement.appendChild(flashEl);
      return flashEl;
    },
    flashRect: function(rect) {
      var flashEl;
      flashEl = this.addFlashRect(rect);
      return setTimeout((function() {
        return DomUtils.removeElement(flashEl);
      }), 400);
    },
    getViewportTopLeft: function() {
      var box, clientLeft, clientTop, marginLeft, marginTop, rect, style;
      box = document.documentElement;
      style = getComputedStyle(box);
      rect = box.getBoundingClientRect();
      if (style.position === "static" && !/content|paint|strict/.test(style.contain || "")) {
        marginTop = parseInt(style.marginTop);
        marginLeft = parseInt(style.marginLeft);
        return {
          top: -rect.top + marginTop,
          left: -rect.left + marginLeft
        };
      } else {
        if (Utils.isFirefox()) {
          clientTop = parseInt(style.borderTopWidth);
          clientLeft = parseInt(style.borderLeftWidth);
        } else {
          clientTop = box.clientTop, clientLeft = box.clientLeft;
        }
        return {
          top: -rect.top - clientTop,
          left: -rect.left - clientLeft
        };
      }
    },
    suppressPropagation: function(event) {
      return event.stopImmediatePropagation();
    },
    suppressEvent: function(event) {
      event.preventDefault();
      return this.suppressPropagation(event);
    },
    consumeKeyup: (function() {
      var handlerId;
      handlerId = null;
      return function(event, callback, suppressPropagation) {
        var code;
        if (callback == null) {
          callback = null;
        }
        if (!event.repeat) {
          if (handlerId != null) {
            handlerStack.remove(handlerId);
          }
          code = event.code;
          handlerId = handlerStack.push({
            _name: "dom_utils/consumeKeyup",
            keyup: function(event) {
              if (event.code !== code) {
                return handlerStack.continueBubbling;
              }
              this.remove();
              if (suppressPropagation) {
                DomUtils.suppressPropagation(event);
              } else {
                DomUtils.suppressEvent(event);
              }
              return handlerStack.continueBubbling;
            },
            blur: function(event) {
              if (event.target === window) {
                this.remove();
              }
              return handlerStack.continueBubbling;
            }
          });
        }
        if (typeof callback === "function") {
          callback();
        }
        if (suppressPropagation) {
          DomUtils.suppressPropagation(event);
          return handlerStack.suppressPropagation;
        } else {
          DomUtils.suppressEvent(event);
          return handlerStack.suppressEvent;
        }
      };
    })(),
    getSelectionType: function(selection) {
      if (selection == null) {
        selection = document.getSelection();
      }
      return selection.type || (function() {
        if (selection.rangeCount === 0) {
          return "None";
        } else if (selection.isCollapsed) {
          return "Caret";
        } else {
          return "Range";
        }
      })();
    },
    getElementWithFocus: function(selection, backwards) {
      var o, r, t;
      r = t = selection.getRangeAt(0);
      if (DomUtils.getSelectionType(selection) === "Range") {
        r = t.cloneRange();
        r.collapse(backwards);
      }
      t = r.startContainer;
      if (t.nodeType === 1) {
        t = t.childNodes[r.startOffset];
      }
      o = t;
      while (o && o.nodeType !== 1) {
        o = o.previousSibling;
      }
      t = o || (t != null ? t.parentNode : void 0);
      return t;
    },
    getSelectionFocusElement: function() {
      var node, sel;
      sel = window.getSelection();
      node = sel.focusNode;
      if (node == null) {
        return null;
      }
      if (node === sel.anchorNode && sel.focusOffset === sel.anchorOffset) {
        node = node.childNodes[sel.focusOffset] || node;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return node.parentElement;
      } else {
        return node;
      }
    },
    getContainingElement: function(element) {
      return (typeof element.getDestinationInsertionPoints === "function" ? element.getDestinationInsertionPoints()[0] : void 0) || element.parentElement;
    },
    windowIsTooSmall: function() {
      return window.innerWidth < 3 || window.innerHeight < 3;
    },
    injectUserCss: function() {
      return Settings.onLoaded(function() {
        var style;
        style = document.createElement("style");
        style.type = "text/css";
        style.textContent = Settings.get("userDefinedLinkHintCss");
        return document.head.appendChild(style);
      });
    },
    injectUserScript: function(text) {
      var script;
      if (text.slice(0, 11) === "javascript:") {
        text = text.slice(11).trim();
        if (text.indexOf(" ") < 0) {
          try {
            text = decodeURIComponent(text);
          } catch (error) {}
        }
      }
      script = document.createElement("script");
      script.textContent = text;
      return document.head.appendChild(script);
    }
  };

  root = typeof exports !== "undefined" && exports !== null ? exports : (window.root != null ? window.root : window.root = {});

  root.DomUtils = DomUtils;

  if (typeof exports === "undefined" || exports === null) {
    extend(window, root);
  }

}).call(this);
