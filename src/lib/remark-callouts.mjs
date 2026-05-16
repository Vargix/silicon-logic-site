const calloutTypes = new Set(["note", "caveat", "methodology"]);

export default function remarkCallouts() {
  return function transform(tree) {
    visit(tree, "blockquote", (node) => {
      const firstChild = node.children?.[0];
      const firstText = firstChild?.children?.[0];

      if (
        firstChild?.type !== "paragraph" ||
        firstText?.type !== "text" ||
        !firstText.value.startsWith("[!")
      ) {
        return;
      }

      const match = firstText.value.match(/^\[!(note|caveat|methodology)\]\s*/i);
      if (!match) return;

      const type = match[1].toLowerCase();
      if (!calloutTypes.has(type)) return;

      firstText.value = firstText.value.slice(match[0].length);
      node.data ||= {};
      node.data.hProperties ||= {};
      node.data.hProperties.className = [`callout-${type}`];
    });
  };
}

function visit(node, type, visitor) {
  if (!node || typeof node !== "object") return;
  if (node.type === type) visitor(node);
  if (!Array.isArray(node.children)) return;

  for (const child of node.children) {
    visit(child, type, visitor);
  }
}
