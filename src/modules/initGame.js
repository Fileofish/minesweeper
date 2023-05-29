export default function initGame(parent, base) {
  for (let i = 0; i < base.length; i++) {
    if (!Array.isArray(base[i])) {
      let childElem = document.createElement(base[i]["tagName"]);
      if ("className" in base[i]) childElem.className = base[i]["className"];
      if ("innerHTML" in base[i]) childElem.innerHTML = base[i]["innerHTML"];
      if ("href" in base[i]) childElem.href = base[i]["href"];
      if ("target" in base[i]) childElem.target = base[i]["target"];
      if ("type" in base[i]) childElem.type = base[i]["type"];
      if ("placeholder" in base[i]) childElem.placeholder = base[i]["placeholder"];
      if ("value" in base[i]) childElem.value = base[i]["value"];
      if ("min" in base[i]) childElem.min = base[i]["min"];
      if ("max" in base[i]) childElem.max = base[i]["max"];
      if ("id" in base[i]) childElem.id = base[i]["id"];
      parent.append(childElem);
      if (Array.isArray(base[i]["children"])) {
        initGame(childElem, base[i]["children"]);
      }
    } else {
      initGame(parent, base[i]);
    }
  }
}