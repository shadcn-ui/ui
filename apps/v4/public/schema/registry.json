{
  "$schema": "https://json-schema.org/draft-07/schema#",
  "description": "A shadcn registry of components, hooks, pages, etc.",
  "type": "object",
  "properties": {
    "$schema": {
      "type": "string"
    },
    "name": {
      "description": "The registry name. Required when this file is used as the root registry, optional for included registry chunks.",
      "type": "string"
    },
    "homepage": {
      "description": "The registry homepage. Required when this file is used as the root registry, optional for included registry chunks.",
      "type": "string"
    },
    "include": {
      "type": "array",
      "description": "An array of relative paths to registry.json files to include in this registry.",
      "items": {
        "type": "string"
      }
    },
    "items": {
      "type": "array",
      "default": [],
      "items": {
        "$ref": "https://ui.shadcn.com/schema/registry-item.json"
      }
    }
  },
  "anyOf": [{ "required": ["items"] }, { "required": ["include"] }]
}
