const templateContent = function(template) {
  if("content" in document.createElement("template")) {
      return document.importNode(template.content, true);
  } else {
      const fragment = document.createDocumentFragment();
      const children = template.childNodes;
      for (let i = 0; i < children.length; i++) {
          fragment.appendChild(children[i].cloneNode(true));
      }
      return fragment;
  }
};

export {templateContent}
