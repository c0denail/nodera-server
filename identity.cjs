"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/identity.js
var require_identity = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/identity.js"(exports2) {
    "use strict";
    var ALIAS = /* @__PURE__ */ Symbol.for("yaml.alias");
    var DOC = /* @__PURE__ */ Symbol.for("yaml.document");
    var MAP = /* @__PURE__ */ Symbol.for("yaml.map");
    var PAIR = /* @__PURE__ */ Symbol.for("yaml.pair");
    var SCALAR = /* @__PURE__ */ Symbol.for("yaml.scalar");
    var SEQ = /* @__PURE__ */ Symbol.for("yaml.seq");
    var NODE_TYPE = /* @__PURE__ */ Symbol.for("yaml.node.type");
    var isAlias = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS;
    var isDocument = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC;
    var isMap = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP;
    var isPair = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR;
    var isScalar = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR;
    var isSeq = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ;
    function isCollection(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case MAP:
          case SEQ:
            return true;
        }
      return false;
    }
    function isNode(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case ALIAS:
          case MAP:
          case SCALAR:
          case SEQ:
            return true;
        }
      return false;
    }
    var hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;
    exports2.ALIAS = ALIAS;
    exports2.DOC = DOC;
    exports2.MAP = MAP;
    exports2.NODE_TYPE = NODE_TYPE;
    exports2.PAIR = PAIR;
    exports2.SCALAR = SCALAR;
    exports2.SEQ = SEQ;
    exports2.hasAnchor = hasAnchor;
    exports2.isAlias = isAlias;
    exports2.isCollection = isCollection;
    exports2.isDocument = isDocument;
    exports2.isMap = isMap;
    exports2.isNode = isNode;
    exports2.isPair = isPair;
    exports2.isScalar = isScalar;
    exports2.isSeq = isSeq;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/visit.js
var require_visit = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/visit.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var BREAK = /* @__PURE__ */ Symbol("break visit");
    var SKIP = /* @__PURE__ */ Symbol("skip children");
    var REMOVE = /* @__PURE__ */ Symbol("remove node");
    function visit(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = visit_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        visit_(null, node, visitor_, Object.freeze([]));
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    function visit_(key, node, visitor, path2) {
      const ctrl = callVisitor(key, node, visitor, path2);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path2, ctrl);
        return visit_(key, ctrl, visitor, path2);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path2 = Object.freeze(path2.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = visit_(i, node.items[i], visitor, path2);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path2 = Object.freeze(path2.concat(node));
          const ck = visit_("key", node.key, visitor, path2);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = visit_("value", node.value, visitor, path2);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    async function visitAsync(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = await visitAsync_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        await visitAsync_(null, node, visitor_, Object.freeze([]));
    }
    visitAsync.BREAK = BREAK;
    visitAsync.SKIP = SKIP;
    visitAsync.REMOVE = REMOVE;
    async function visitAsync_(key, node, visitor, path2) {
      const ctrl = await callVisitor(key, node, visitor, path2);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path2, ctrl);
        return visitAsync_(key, ctrl, visitor, path2);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path2 = Object.freeze(path2.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = await visitAsync_(i, node.items[i], visitor, path2);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path2 = Object.freeze(path2.concat(node));
          const ck = await visitAsync_("key", node.key, visitor, path2);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = await visitAsync_("value", node.value, visitor, path2);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    function initVisitor(visitor) {
      if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) {
        return Object.assign({
          Alias: visitor.Node,
          Map: visitor.Node,
          Scalar: visitor.Node,
          Seq: visitor.Node
        }, visitor.Value && {
          Map: visitor.Value,
          Scalar: visitor.Value,
          Seq: visitor.Value
        }, visitor.Collection && {
          Map: visitor.Collection,
          Seq: visitor.Collection
        }, visitor);
      }
      return visitor;
    }
    function callVisitor(key, node, visitor, path2) {
      if (typeof visitor === "function")
        return visitor(key, node, path2);
      if (identity.isMap(node))
        return visitor.Map?.(key, node, path2);
      if (identity.isSeq(node))
        return visitor.Seq?.(key, node, path2);
      if (identity.isPair(node))
        return visitor.Pair?.(key, node, path2);
      if (identity.isScalar(node))
        return visitor.Scalar?.(key, node, path2);
      if (identity.isAlias(node))
        return visitor.Alias?.(key, node, path2);
      return void 0;
    }
    function replaceNode(key, path2, node) {
      const parent = path2[path2.length - 1];
      if (identity.isCollection(parent)) {
        parent.items[key] = node;
      } else if (identity.isPair(parent)) {
        if (key === "key")
          parent.key = node;
        else
          parent.value = node;
      } else if (identity.isDocument(parent)) {
        parent.contents = node;
      } else {
        const pt = identity.isAlias(parent) ? "alias" : "scalar";
        throw new Error(`Cannot replace node with ${pt} parent`);
      }
    }
    exports2.visit = visit;
    exports2.visitAsync = visitAsync;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/doc/directives.js
var require_directives = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/doc/directives.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    var escapeChars = {
      "!": "%21",
      ",": "%2C",
      "[": "%5B",
      "]": "%5D",
      "{": "%7B",
      "}": "%7D"
    };
    var escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);
    var Directives = class _Directives {
      constructor(yaml, tags) {
        this.docStart = null;
        this.docEnd = false;
        this.yaml = Object.assign({}, _Directives.defaultYaml, yaml);
        this.tags = Object.assign({}, _Directives.defaultTags, tags);
      }
      clone() {
        const copy = new _Directives(this.yaml, this.tags);
        copy.docStart = this.docStart;
        return copy;
      }
      /**
       * During parsing, get a Directives instance for the current document and
       * update the stream state according to the current version's spec.
       */
      atDocument() {
        const res = new _Directives(this.yaml, this.tags);
        switch (this.yaml.version) {
          case "1.1":
            this.atNextDocument = true;
            break;
          case "1.2":
            this.atNextDocument = false;
            this.yaml = {
              explicit: _Directives.defaultYaml.explicit,
              version: "1.2"
            };
            this.tags = Object.assign({}, _Directives.defaultTags);
            break;
        }
        return res;
      }
      /**
       * @param onError - May be called even if the action was successful
       * @returns `true` on success
       */
      add(line, onError) {
        if (this.atNextDocument) {
          this.yaml = { explicit: _Directives.defaultYaml.explicit, version: "1.1" };
          this.tags = Object.assign({}, _Directives.defaultTags);
          this.atNextDocument = false;
        }
        const parts = line.trim().split(/[ \t]+/);
        const name = parts.shift();
        switch (name) {
          case "%TAG": {
            if (parts.length !== 2) {
              onError(0, "%TAG directive should contain exactly two parts");
              if (parts.length < 2)
                return false;
            }
            const [handle, prefix] = parts;
            this.tags[handle] = prefix;
            return true;
          }
          case "%YAML": {
            this.yaml.explicit = true;
            if (parts.length !== 1) {
              onError(0, "%YAML directive should contain exactly one part");
              return false;
            }
            const [version] = parts;
            if (version === "1.1" || version === "1.2") {
              this.yaml.version = version;
              return true;
            } else {
              const isValid = /^\d+\.\d+$/.test(version);
              onError(6, `Unsupported YAML version ${version}`, isValid);
              return false;
            }
          }
          default:
            onError(0, `Unknown directive ${name}`, true);
            return false;
        }
      }
      /**
       * Resolves a tag, matching handles to those defined in %TAG directives.
       *
       * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
       *   `'!local'` tag, or `null` if unresolvable.
       */
      tagName(source, onError) {
        if (source === "!")
          return "!";
        if (source[0] !== "!") {
          onError(`Not a valid tag: ${source}`);
          return null;
        }
        if (source[1] === "<") {
          const verbatim = source.slice(2, -1);
          if (verbatim === "!" || verbatim === "!!") {
            onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
            return null;
          }
          if (source[source.length - 1] !== ">")
            onError("Verbatim tags must end with a >");
          return verbatim;
        }
        const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/s);
        if (!suffix)
          onError(`The ${source} tag has no suffix`);
        const prefix = this.tags[handle];
        if (prefix) {
          try {
            return prefix + decodeURIComponent(suffix);
          } catch (error) {
            onError(String(error));
            return null;
          }
        }
        if (handle === "!")
          return source;
        onError(`Could not resolve tag: ${source}`);
        return null;
      }
      /**
       * Given a fully resolved tag, returns its printable string form,
       * taking into account current tag prefixes and defaults.
       */
      tagString(tag) {
        for (const [handle, prefix] of Object.entries(this.tags)) {
          if (tag.startsWith(prefix))
            return handle + escapeTagName(tag.substring(prefix.length));
        }
        return tag[0] === "!" ? tag : `!<${tag}>`;
      }
      toString(doc) {
        const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
        const tagEntries = Object.entries(this.tags);
        let tagNames;
        if (doc && tagEntries.length > 0 && identity.isNode(doc.contents)) {
          const tags = {};
          visit.visit(doc.contents, (_key, node) => {
            if (identity.isNode(node) && node.tag)
              tags[node.tag] = true;
          });
          tagNames = Object.keys(tags);
        } else
          tagNames = [];
        for (const [handle, prefix] of tagEntries) {
          if (handle === "!!" && prefix === "tag:yaml.org,2002:")
            continue;
          if (!doc || tagNames.some((tn) => tn.startsWith(prefix)))
            lines.push(`%TAG ${handle} ${prefix}`);
        }
        return lines.join("\n");
      }
    };
    Directives.defaultYaml = { explicit: false, version: "1.2" };
    Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };
    exports2.Directives = Directives;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/doc/anchors.js
var require_anchors = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/doc/anchors.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    function anchorIsValid(anchor) {
      if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
        const sa = JSON.stringify(anchor);
        const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
        throw new Error(msg);
      }
      return true;
    }
    function anchorNames(root) {
      const anchors = /* @__PURE__ */ new Set();
      visit.visit(root, {
        Value(_key, node) {
          if (node.anchor)
            anchors.add(node.anchor);
        }
      });
      return anchors;
    }
    function findNewAnchor(prefix, exclude) {
      for (let i = 1; true; ++i) {
        const name = `${prefix}${i}`;
        if (!exclude.has(name))
          return name;
      }
    }
    function createNodeAnchors(doc, prefix) {
      const aliasObjects = [];
      const sourceObjects = /* @__PURE__ */ new Map();
      let prevAnchors = null;
      return {
        onAnchor: (source) => {
          aliasObjects.push(source);
          prevAnchors ?? (prevAnchors = anchorNames(doc));
          const anchor = findNewAnchor(prefix, prevAnchors);
          prevAnchors.add(anchor);
          return anchor;
        },
        /**
         * With circular references, the source node is only resolved after all
         * of its child nodes are. This is why anchors are set only after all of
         * the nodes have been created.
         */
        setAnchors: () => {
          for (const source of aliasObjects) {
            const ref = sourceObjects.get(source);
            if (typeof ref === "object" && ref.anchor && (identity.isScalar(ref.node) || identity.isCollection(ref.node))) {
              ref.node.anchor = ref.anchor;
            } else {
              const error = new Error("Failed to resolve repeated object (this should not happen)");
              error.source = source;
              throw error;
            }
          }
        },
        sourceObjects
      };
    }
    exports2.anchorIsValid = anchorIsValid;
    exports2.anchorNames = anchorNames;
    exports2.createNodeAnchors = createNodeAnchors;
    exports2.findNewAnchor = findNewAnchor;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/doc/applyReviver.js
var require_applyReviver = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/doc/applyReviver.js"(exports2) {
    "use strict";
    function applyReviver(reviver, obj, key, val) {
      if (val && typeof val === "object") {
        if (Array.isArray(val)) {
          for (let i = 0, len = val.length; i < len; ++i) {
            const v0 = val[i];
            const v1 = applyReviver(reviver, val, String(i), v0);
            if (v1 === void 0)
              delete val[i];
            else if (v1 !== v0)
              val[i] = v1;
          }
        } else if (val instanceof Map) {
          for (const k of Array.from(val.keys())) {
            const v0 = val.get(k);
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              val.delete(k);
            else if (v1 !== v0)
              val.set(k, v1);
          }
        } else if (val instanceof Set) {
          for (const v0 of Array.from(val)) {
            const v1 = applyReviver(reviver, val, v0, v0);
            if (v1 === void 0)
              val.delete(v0);
            else if (v1 !== v0) {
              val.delete(v0);
              val.add(v1);
            }
          }
        } else {
          for (const [k, v0] of Object.entries(val)) {
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              delete val[k];
            else if (v1 !== v0)
              val[k] = v1;
          }
        }
      }
      return reviver.call(obj, key, val);
    }
    exports2.applyReviver = applyReviver;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/toJS.js
var require_toJS = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/toJS.js"(exports2) {
    "use strict";
    var identity = require_identity();
    function toJS(value, arg, ctx) {
      if (Array.isArray(value))
        return value.map((v, i) => toJS(v, String(i), ctx));
      if (value && typeof value.toJSON === "function") {
        if (!ctx || !identity.hasAnchor(value))
          return value.toJSON(arg, ctx);
        const data = { aliasCount: 0, count: 1, res: void 0 };
        ctx.anchors.set(value, data);
        ctx.onCreate = (res2) => {
          data.res = res2;
          delete ctx.onCreate;
        };
        const res = value.toJSON(arg, ctx);
        if (ctx.onCreate)
          ctx.onCreate(res);
        return res;
      }
      if (typeof value === "bigint" && !ctx?.keep)
        return Number(value);
      return value;
    }
    exports2.toJS = toJS;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/Node.js
var require_Node = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/Node.js"(exports2) {
    "use strict";
    var applyReviver = require_applyReviver();
    var identity = require_identity();
    var toJS = require_toJS();
    var NodeBase = class {
      constructor(type) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: type });
      }
      /** Create a copy of this node.  */
      clone() {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** A plain JavaScript representation of this node. */
      toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        if (!identity.isDocument(doc))
          throw new TypeError("A document argument is required");
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc,
          keep: true,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this, "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
    };
    exports2.NodeBase = NodeBase;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/Alias.js
var require_Alias = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/Alias.js"(exports2) {
    "use strict";
    var anchors = require_anchors();
    var visit = require_visit();
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var Alias = class extends Node.NodeBase {
      constructor(source) {
        super(identity.ALIAS);
        this.source = source;
        Object.defineProperty(this, "tag", {
          set() {
            throw new Error("Alias nodes cannot have tags");
          }
        });
      }
      /**
       * Resolve the value of this alias within `doc`, finding the last
       * instance of the `source` anchor before this node.
       */
      resolve(doc, ctx) {
        if (ctx?.maxAliasCount === 0)
          throw new ReferenceError("Alias resolution is disabled");
        let nodes;
        if (ctx?.aliasResolveCache) {
          nodes = ctx.aliasResolveCache;
        } else {
          nodes = [];
          visit.visit(doc, {
            Node: (_key, node) => {
              if (identity.isAlias(node) || identity.hasAnchor(node))
                nodes.push(node);
            }
          });
          if (ctx)
            ctx.aliasResolveCache = nodes;
        }
        let found = void 0;
        for (const node of nodes) {
          if (node === this)
            break;
          if (node.anchor === this.source)
            found = node;
        }
        if (found && ctx) {
          const { anchors: anchors2, doc: doc2, maxAliasCount } = ctx;
          let data = anchors2.get(found);
          if (!data) {
            toJS.toJS(found, null, ctx);
            data = anchors2.get(found);
          }
          if (data?.res === void 0) {
            const msg = "This should not happen: Alias anchor was not resolved?";
            throw new ReferenceError(msg);
          }
          if (maxAliasCount >= 0) {
            data.count += 1;
            if (data.aliasCount === 0)
              data.aliasCount = getAliasCount(doc2, found, anchors2);
            if (data.count * data.aliasCount > maxAliasCount) {
              const msg = "Excessive alias count indicates a resource exhaustion attack";
              throw new ReferenceError(msg);
            }
          }
        }
        return found;
      }
      toJSON(_arg, ctx) {
        if (!ctx)
          return { source: this.source };
        const source = this.resolve(ctx.doc, ctx);
        if (!source) {
          const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw new ReferenceError(msg);
        }
        return ctx.anchors.get(source).res;
      }
      toString(ctx, _onComment, _onChompKeep) {
        const src = `*${this.source}`;
        if (ctx) {
          anchors.anchorIsValid(this.source);
          if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
            const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
            throw new Error(msg);
          }
          if (ctx.implicitKey)
            return `${src} `;
        }
        return src;
      }
    };
    function getAliasCount(doc, node, anchors2) {
      if (identity.isAlias(node)) {
        const source = node.resolve(doc);
        const anchor = anchors2 && source && anchors2.get(source);
        return anchor ? anchor.count * anchor.aliasCount : 0;
      } else if (identity.isCollection(node)) {
        let count = 0;
        for (const item of node.items) {
          const c = getAliasCount(doc, item, anchors2);
          if (c > count)
            count = c;
        }
        return count;
      } else if (identity.isPair(node)) {
        const kc = getAliasCount(doc, node.key, anchors2);
        const vc = getAliasCount(doc, node.value, anchors2);
        return Math.max(kc, vc);
      }
      return 1;
    }
    exports2.Alias = Alias;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/Scalar.js
var require_Scalar = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/Scalar.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";
    var Scalar = class extends Node.NodeBase {
      constructor(value) {
        super(identity.SCALAR);
        this.value = value;
      }
      toJSON(arg, ctx) {
        return ctx?.keep ? this.value : toJS.toJS(this.value, arg, ctx);
      }
      toString() {
        return String(this.value);
      }
    };
    Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
    Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
    Scalar.PLAIN = "PLAIN";
    Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
    Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";
    exports2.Scalar = Scalar;
    exports2.isScalarValue = isScalarValue;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/doc/createNode.js
var require_createNode = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/doc/createNode.js"(exports2) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var defaultTagPrefix = "tag:yaml.org,2002:";
    function findTagObject(value, tagName, tags) {
      if (tagName) {
        const match = tags.filter((t) => t.tag === tagName);
        const tagObj = match.find((t) => !t.format) ?? match[0];
        if (!tagObj)
          throw new Error(`Tag ${tagName} not found`);
        return tagObj;
      }
      return tags.find((t) => t.identify?.(value) && !t.format);
    }
    function createNode(value, tagName, ctx) {
      if (identity.isDocument(value))
        value = value.contents;
      if (identity.isNode(value))
        return value;
      if (identity.isPair(value)) {
        const map = ctx.schema[identity.MAP].createNode?.(ctx.schema, null, ctx);
        map.items.push(value);
        return map;
      }
      if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) {
        value = value.valueOf();
      }
      const { aliasDuplicateObjects, onAnchor, onTagObj, schema, sourceObjects } = ctx;
      let ref = void 0;
      if (aliasDuplicateObjects && value && typeof value === "object") {
        ref = sourceObjects.get(value);
        if (ref) {
          ref.anchor ?? (ref.anchor = onAnchor(value));
          return new Alias.Alias(ref.anchor);
        } else {
          ref = { anchor: null, node: null };
          sourceObjects.set(value, ref);
        }
      }
      if (tagName?.startsWith("!!"))
        tagName = defaultTagPrefix + tagName.slice(2);
      let tagObj = findTagObject(value, tagName, schema.tags);
      if (!tagObj) {
        if (value && typeof value.toJSON === "function") {
          value = value.toJSON();
        }
        if (!value || typeof value !== "object") {
          const node2 = new Scalar.Scalar(value);
          if (ref)
            ref.node = node2;
          return node2;
        }
        tagObj = value instanceof Map ? schema[identity.MAP] : Symbol.iterator in Object(value) ? schema[identity.SEQ] : schema[identity.MAP];
      }
      if (onTagObj) {
        onTagObj(tagObj);
        delete ctx.onTagObj;
      }
      const node = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : typeof tagObj?.nodeClass?.from === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar.Scalar(value);
      if (tagName)
        node.tag = tagName;
      else if (!tagObj.default)
        node.tag = tagObj.tag;
      if (ref)
        ref.node = node;
      return node;
    }
    exports2.createNode = createNode;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/Collection.js
var require_Collection = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/Collection.js"(exports2) {
    "use strict";
    var createNode = require_createNode();
    var identity = require_identity();
    var Node = require_Node();
    function collectionFromPath(schema, path2, value) {
      let v = value;
      for (let i = path2.length - 1; i >= 0; --i) {
        const k = path2[i];
        if (typeof k === "number" && Number.isInteger(k) && k >= 0) {
          const a = [];
          a[k] = v;
          v = a;
        } else {
          v = /* @__PURE__ */ new Map([[k, v]]);
        }
      }
      return createNode.createNode(v, void 0, {
        aliasDuplicateObjects: false,
        keepUndefined: false,
        onAnchor: () => {
          throw new Error("This should not happen, please report a bug.");
        },
        schema,
        sourceObjects: /* @__PURE__ */ new Map()
      });
    }
    var isEmptyPath = (path2) => path2 == null || typeof path2 === "object" && !!path2[Symbol.iterator]().next().done;
    var Collection = class extends Node.NodeBase {
      constructor(type, schema) {
        super(type);
        Object.defineProperty(this, "schema", {
          value: schema,
          configurable: true,
          enumerable: false,
          writable: true
        });
      }
      /**
       * Create a copy of this collection.
       *
       * @param schema - If defined, overwrites the original's schema
       */
      clone(schema) {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (schema)
          copy.schema = schema;
        copy.items = copy.items.map((it) => identity.isNode(it) || identity.isPair(it) ? it.clone(schema) : it);
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /**
       * Adds a value to the collection. For `!!map` and `!!omap` the value must
       * be a Pair instance or a `{ key, value }` object, which may not have a key
       * that already exists in the map.
       */
      addIn(path2, value) {
        if (isEmptyPath(path2))
          this.add(value);
        else {
          const [key, ...rest] = path2;
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.addIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
      /**
       * Removes a value from the collection.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path2) {
        const [key, ...rest] = path2;
        if (rest.length === 0)
          return this.delete(key);
        const node = this.get(key, true);
        if (identity.isCollection(node))
          return node.deleteIn(rest);
        else
          throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path2, keepScalar) {
        const [key, ...rest] = path2;
        const node = this.get(key, true);
        if (rest.length === 0)
          return !keepScalar && identity.isScalar(node) ? node.value : node;
        else
          return identity.isCollection(node) ? node.getIn(rest, keepScalar) : void 0;
      }
      hasAllNullValues(allowScalar) {
        return this.items.every((node) => {
          if (!identity.isPair(node))
            return false;
          const n = node.value;
          return n == null || allowScalar && identity.isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
        });
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       */
      hasIn(path2) {
        const [key, ...rest] = path2;
        if (rest.length === 0)
          return this.has(key);
        const node = this.get(key, true);
        return identity.isCollection(node) ? node.hasIn(rest) : false;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path2, value) {
        const [key, ...rest] = path2;
        if (rest.length === 0) {
          this.set(key, value);
        } else {
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.setIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
    };
    exports2.Collection = Collection;
    exports2.collectionFromPath = collectionFromPath;
    exports2.isEmptyPath = isEmptyPath;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringifyComment.js
var require_stringifyComment = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringifyComment.js"(exports2) {
    "use strict";
    var stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, "#");
    function indentComment(comment, indent) {
      if (/^\n+$/.test(comment))
        return comment.substring(1);
      return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
    }
    var lineComment = (str, indent, comment) => str.endsWith("\n") ? indentComment(comment, indent) : comment.includes("\n") ? "\n" + indentComment(comment, indent) : (str.endsWith(" ") ? "" : " ") + comment;
    exports2.indentComment = indentComment;
    exports2.lineComment = lineComment;
    exports2.stringifyComment = stringifyComment;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/foldFlowLines.js
var require_foldFlowLines = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/foldFlowLines.js"(exports2) {
    "use strict";
    var FOLD_FLOW = "flow";
    var FOLD_BLOCK = "block";
    var FOLD_QUOTED = "quoted";
    function foldFlowLines(text3, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
      if (!lineWidth || lineWidth < 0)
        return text3;
      if (lineWidth < minContentWidth)
        minContentWidth = 0;
      const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
      if (text3.length <= endStep)
        return text3;
      const folds = [];
      const escapedFolds = {};
      let end = lineWidth - indent.length;
      if (typeof indentAtStart === "number") {
        if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
          folds.push(0);
        else
          end = lineWidth - indentAtStart;
      }
      let split = void 0;
      let prev = void 0;
      let overflow = false;
      let i = -1;
      let escStart = -1;
      let escEnd = -1;
      if (mode === FOLD_BLOCK) {
        i = consumeMoreIndentedLines(text3, i, indent.length);
        if (i !== -1)
          end = i + endStep;
      }
      for (let ch; ch = text3[i += 1]; ) {
        if (mode === FOLD_QUOTED && ch === "\\") {
          escStart = i;
          switch (text3[i + 1]) {
            case "x":
              i += 3;
              break;
            case "u":
              i += 5;
              break;
            case "U":
              i += 9;
              break;
            default:
              i += 1;
          }
          escEnd = i;
        }
        if (ch === "\n") {
          if (mode === FOLD_BLOCK)
            i = consumeMoreIndentedLines(text3, i, indent.length);
          end = i + indent.length + endStep;
          split = void 0;
        } else {
          if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
            const next = text3[i + 1];
            if (next && next !== " " && next !== "\n" && next !== "	")
              split = i;
          }
          if (i >= end) {
            if (split) {
              folds.push(split);
              end = split + endStep;
              split = void 0;
            } else if (mode === FOLD_QUOTED) {
              while (prev === " " || prev === "	") {
                prev = ch;
                ch = text3[i += 1];
                overflow = true;
              }
              const j = i > escEnd + 1 ? i - 2 : escStart - 1;
              if (escapedFolds[j])
                return text3;
              folds.push(j);
              escapedFolds[j] = true;
              end = j + endStep;
              split = void 0;
            } else {
              overflow = true;
            }
          }
        }
        prev = ch;
      }
      if (overflow && onOverflow)
        onOverflow();
      if (folds.length === 0)
        return text3;
      if (onFold)
        onFold();
      let res = text3.slice(0, folds[0]);
      for (let i2 = 0; i2 < folds.length; ++i2) {
        const fold = folds[i2];
        const end2 = folds[i2 + 1] || text3.length;
        if (fold === 0)
          res = `
${indent}${text3.slice(0, end2)}`;
        else {
          if (mode === FOLD_QUOTED && escapedFolds[fold])
            res += `${text3[fold]}\\`;
          res += `
${indent}${text3.slice(fold + 1, end2)}`;
        }
      }
      return res;
    }
    function consumeMoreIndentedLines(text3, i, indent) {
      let end = i;
      let start = i + 1;
      let ch = text3[start];
      while (ch === " " || ch === "	") {
        if (i < start + indent) {
          ch = text3[++i];
        } else {
          do {
            ch = text3[++i];
          } while (ch && ch !== "\n");
          end = i;
          start = i + 1;
          ch = text3[start];
        }
      }
      return end;
    }
    exports2.FOLD_BLOCK = FOLD_BLOCK;
    exports2.FOLD_FLOW = FOLD_FLOW;
    exports2.FOLD_QUOTED = FOLD_QUOTED;
    exports2.foldFlowLines = foldFlowLines;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringifyString.js
var require_stringifyString = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringifyString.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var foldFlowLines = require_foldFlowLines();
    var getFoldOptions = (ctx, isBlock) => ({
      indentAtStart: isBlock ? ctx.indent.length : ctx.indentAtStart,
      lineWidth: ctx.options.lineWidth,
      minContentWidth: ctx.options.minContentWidth
    });
    var containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
    function lineLengthOverLimit(str, lineWidth, indentLength) {
      if (!lineWidth || lineWidth < 0)
        return false;
      const limit = lineWidth - indentLength;
      const strLen = str.length;
      if (strLen <= limit)
        return false;
      for (let i = 0, start = 0; i < strLen; ++i) {
        if (str[i] === "\n") {
          if (i - start > limit)
            return true;
          start = i + 1;
          if (strLen - start <= limit)
            return false;
        }
      }
      return true;
    }
    function doubleQuotedString(value, ctx) {
      const json = JSON.stringify(value);
      if (ctx.options.doubleQuotedAsJSON)
        return json;
      const { implicitKey } = ctx;
      const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      let str = "";
      let start = 0;
      for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
        if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
          str += json.slice(start, i) + "\\ ";
          i += 1;
          start = i;
          ch = "\\";
        }
        if (ch === "\\")
          switch (json[i + 1]) {
            case "u":
              {
                str += json.slice(start, i);
                const code = json.substr(i + 2, 4);
                switch (code) {
                  case "0000":
                    str += "\\0";
                    break;
                  case "0007":
                    str += "\\a";
                    break;
                  case "000b":
                    str += "\\v";
                    break;
                  case "001b":
                    str += "\\e";
                    break;
                  case "0085":
                    str += "\\N";
                    break;
                  case "00a0":
                    str += "\\_";
                    break;
                  case "2028":
                    str += "\\L";
                    break;
                  case "2029":
                    str += "\\P";
                    break;
                  default:
                    if (code.substr(0, 2) === "00")
                      str += "\\x" + code.substr(2);
                    else
                      str += json.substr(i, 6);
                }
                i += 5;
                start = i + 1;
              }
              break;
            case "n":
              if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
                i += 1;
              } else {
                str += json.slice(start, i) + "\n\n";
                while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"') {
                  str += "\n";
                  i += 2;
                }
                str += indent;
                if (json[i + 2] === " ")
                  str += "\\";
                i += 1;
                start = i + 1;
              }
              break;
            default:
              i += 1;
          }
      }
      str = start ? str + json.slice(start) : json;
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_QUOTED, getFoldOptions(ctx, false));
    }
    function singleQuotedString(value, ctx) {
      if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes("\n") || /[ \t]\n|\n[ \t]/.test(value))
        return doubleQuotedString(value, ctx);
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
      return ctx.implicitKey ? res : foldFlowLines.foldFlowLines(res, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function quotedString(value, ctx) {
      const { singleQuote } = ctx.options;
      let qs;
      if (singleQuote === false)
        qs = doubleQuotedString;
      else {
        const hasDouble = value.includes('"');
        const hasSingle = value.includes("'");
        if (hasDouble && !hasSingle)
          qs = singleQuotedString;
        else if (hasSingle && !hasDouble)
          qs = doubleQuotedString;
        else
          qs = singleQuote ? singleQuotedString : doubleQuotedString;
      }
      return qs(value, ctx);
    }
    var blockEndNewlines;
    try {
      blockEndNewlines = new RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
    } catch {
      blockEndNewlines = /\n+(?!\n|$)/g;
    }
    function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
      const { blockQuote, commentString, lineWidth } = ctx.options;
      if (!blockQuote || /\n[\t ]+$/.test(value)) {
        return quotedString(value, ctx);
      }
      const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
      const literal = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.Scalar.BLOCK_FOLDED ? false : type === Scalar.Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent.length);
      if (!value)
        return literal ? "|\n" : ">\n";
      let chomp;
      let endStart;
      for (endStart = value.length; endStart > 0; --endStart) {
        const ch = value[endStart - 1];
        if (ch !== "\n" && ch !== "	" && ch !== " ")
          break;
      }
      let end = value.substring(endStart);
      const endNlPos = end.indexOf("\n");
      if (endNlPos === -1) {
        chomp = "-";
      } else if (value === end || endNlPos !== end.length - 1) {
        chomp = "+";
        if (onChompKeep)
          onChompKeep();
      } else {
        chomp = "";
      }
      if (end) {
        value = value.slice(0, -end.length);
        if (end[end.length - 1] === "\n")
          end = end.slice(0, -1);
        end = end.replace(blockEndNewlines, `$&${indent}`);
      }
      let startWithSpace = false;
      let startEnd;
      let startNlPos = -1;
      for (startEnd = 0; startEnd < value.length; ++startEnd) {
        const ch = value[startEnd];
        if (ch === " ")
          startWithSpace = true;
        else if (ch === "\n")
          startNlPos = startEnd;
        else
          break;
      }
      let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
      if (start) {
        value = value.substring(start.length);
        start = start.replace(/\n+/g, `$&${indent}`);
      }
      const indentSize = indent ? "2" : "1";
      let header = (startWithSpace ? indentSize : "") + chomp;
      if (comment) {
        header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
        if (onComment)
          onComment();
      }
      if (!literal) {
        const foldedValue = value.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
        let literalFallback = false;
        const foldOptions = getFoldOptions(ctx, true);
        if (blockQuote !== "folded" && type !== Scalar.Scalar.BLOCK_FOLDED) {
          foldOptions.onOverflow = () => {
            literalFallback = true;
          };
        }
        const body = foldFlowLines.foldFlowLines(`${start}${foldedValue}${end}`, indent, foldFlowLines.FOLD_BLOCK, foldOptions);
        if (!literalFallback)
          return `>${header}
${indent}${body}`;
      }
      value = value.replace(/\n+/g, `$&${indent}`);
      return `|${header}
${indent}${start}${value}${end}`;
    }
    function plainString(item, ctx, onComment, onChompKeep) {
      const { type, value } = item;
      const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
      if (implicitKey && value.includes("\n") || inFlow && /[[\]{},]/.test(value)) {
        return quotedString(value, ctx);
      }
      if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
        return implicitKey || inFlow || !value.includes("\n") ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
      }
      if (!implicitKey && !inFlow && type !== Scalar.Scalar.PLAIN && value.includes("\n")) {
        return blockString(item, ctx, onComment, onChompKeep);
      }
      if (containsDocumentMarker(value)) {
        if (indent === "") {
          ctx.forceBlockIndent = true;
          return blockString(item, ctx, onComment, onChompKeep);
        } else if (implicitKey && indent === indentStep) {
          return quotedString(value, ctx);
        }
      }
      const str = value.replace(/\n+/g, `$&
${indent}`);
      if (actualString) {
        const test = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str);
        const { compat, tags } = ctx.doc.schema;
        if (tags.some(test) || compat?.some(test))
          return quotedString(value, ctx);
      }
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function stringifyString(item, ctx, onComment, onChompKeep) {
      const { implicitKey, inFlow } = ctx;
      const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
      let { type } = item;
      if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
        if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
          type = Scalar.Scalar.QUOTE_DOUBLE;
      }
      const _stringify = (_type) => {
        switch (_type) {
          case Scalar.Scalar.BLOCK_FOLDED:
          case Scalar.Scalar.BLOCK_LITERAL:
            return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
          case Scalar.Scalar.QUOTE_DOUBLE:
            return doubleQuotedString(ss.value, ctx);
          case Scalar.Scalar.QUOTE_SINGLE:
            return singleQuotedString(ss.value, ctx);
          case Scalar.Scalar.PLAIN:
            return plainString(ss, ctx, onComment, onChompKeep);
          default:
            return null;
        }
      };
      let res = _stringify(type);
      if (res === null) {
        const { defaultKeyType, defaultStringType } = ctx.options;
        const t = implicitKey && defaultKeyType || defaultStringType;
        res = _stringify(t);
        if (res === null)
          throw new Error(`Unsupported default string type ${t}`);
      }
      return res;
    }
    exports2.stringifyString = stringifyString;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringify.js
var require_stringify = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringify.js"(exports2) {
    "use strict";
    var anchors = require_anchors();
    var identity = require_identity();
    var stringifyComment = require_stringifyComment();
    var stringifyString = require_stringifyString();
    function createStringifyContext(doc, options) {
      const opt = Object.assign({
        blockQuote: true,
        commentString: stringifyComment.stringifyComment,
        defaultKeyType: null,
        defaultStringType: "PLAIN",
        directives: null,
        doubleQuotedAsJSON: false,
        doubleQuotedMinMultiLineLength: 40,
        falseStr: "false",
        flowCollectionPadding: true,
        indentSeq: true,
        lineWidth: 80,
        minContentWidth: 20,
        nullStr: "null",
        simpleKeys: false,
        singleQuote: null,
        trailingComma: false,
        trueStr: "true",
        verifyAliasOrder: true
      }, doc.schema.toStringOptions, options);
      let inFlow;
      switch (opt.collectionStyle) {
        case "block":
          inFlow = false;
          break;
        case "flow":
          inFlow = true;
          break;
        default:
          inFlow = null;
      }
      return {
        anchors: /* @__PURE__ */ new Set(),
        doc,
        flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
        indent: "",
        indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
        inFlow,
        options: opt
      };
    }
    function getTagObject(tags, item) {
      if (item.tag) {
        const match = tags.filter((t) => t.tag === item.tag);
        if (match.length > 0)
          return match.find((t) => t.format === item.format) ?? match[0];
      }
      let tagObj = void 0;
      let obj;
      if (identity.isScalar(item)) {
        obj = item.value;
        let match = tags.filter((t) => t.identify?.(obj));
        if (match.length > 1) {
          const testMatch = match.filter((t) => t.test);
          if (testMatch.length > 0)
            match = testMatch;
        }
        tagObj = match.find((t) => t.format === item.format) ?? match.find((t) => !t.format);
      } else {
        obj = item;
        tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
      }
      if (!tagObj) {
        const name = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
        throw new Error(`Tag not resolved for ${name} value`);
      }
      return tagObj;
    }
    function stringifyProps(node, tagObj, { anchors: anchors$1, doc }) {
      if (!doc.directives)
        return "";
      const props = [];
      const anchor = (identity.isScalar(node) || identity.isCollection(node)) && node.anchor;
      if (anchor && anchors.anchorIsValid(anchor)) {
        anchors$1.add(anchor);
        props.push(`&${anchor}`);
      }
      const tag = node.tag ?? (tagObj.default ? null : tagObj.tag);
      if (tag)
        props.push(doc.directives.tagString(tag));
      return props.join(" ");
    }
    function stringify(item, ctx, onComment, onChompKeep) {
      if (identity.isPair(item))
        return item.toString(ctx, onComment, onChompKeep);
      if (identity.isAlias(item)) {
        if (ctx.doc.directives)
          return item.toString(ctx);
        if (ctx.resolvedAliases?.has(item)) {
          throw new TypeError(`Cannot stringify circular structure without alias nodes`);
        } else {
          if (ctx.resolvedAliases)
            ctx.resolvedAliases.add(item);
          else
            ctx.resolvedAliases = /* @__PURE__ */ new Set([item]);
          item = item.resolve(ctx.doc);
        }
      }
      let tagObj = void 0;
      const node = identity.isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o) => tagObj = o });
      tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node));
      const props = stringifyProps(node, tagObj, ctx);
      if (props.length > 0)
        ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
      const str = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : identity.isScalar(node) ? stringifyString.stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
      if (!props)
        return str;
      return identity.isScalar(node) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}`;
    }
    exports2.createStringifyContext = createStringifyContext;
    exports2.stringify = stringify;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringifyPair.js
var require_stringifyPair = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringifyPair.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
      const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
      let keyComment = identity.isNode(key) && key.comment || null;
      if (simpleKeys) {
        if (keyComment) {
          throw new Error("With simple keys, key nodes cannot have comments");
        }
        if (identity.isCollection(key) || !identity.isNode(key) && typeof key === "object") {
          const msg = "With simple keys, collection cannot be used as a key value";
          throw new Error(msg);
        }
      }
      let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || identity.isCollection(key) || (identity.isScalar(key) ? key.type === Scalar.Scalar.BLOCK_FOLDED || key.type === Scalar.Scalar.BLOCK_LITERAL : typeof key === "object"));
      ctx = Object.assign({}, ctx, {
        allNullValues: false,
        implicitKey: !explicitKey && (simpleKeys || !allNullValues),
        indent: indent + indentStep
      });
      let keyCommentDone = false;
      let chompKeep = false;
      let str = stringify.stringify(key, ctx, () => keyCommentDone = true, () => chompKeep = true);
      if (!explicitKey && !ctx.inFlow && str.length > 1024) {
        if (simpleKeys)
          throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
        explicitKey = true;
      }
      if (ctx.inFlow) {
        if (allNullValues || value == null) {
          if (keyCommentDone && onComment)
            onComment();
          return str === "" ? "?" : explicitKey ? `? ${str}` : str;
        }
      } else if (allNullValues && !simpleKeys || value == null && explicitKey) {
        str = `? ${str}`;
        if (keyComment && !keyCommentDone) {
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        } else if (chompKeep && onChompKeep)
          onChompKeep();
        return str;
      }
      if (keyCommentDone)
        keyComment = null;
      if (explicitKey) {
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        str = `? ${str}
${indent}:`;
      } else {
        str = `${str}:`;
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
      }
      let vsb, vcb, valueComment;
      if (identity.isNode(value)) {
        vsb = !!value.spaceBefore;
        vcb = value.commentBefore;
        valueComment = value.comment;
      } else {
        vsb = false;
        vcb = null;
        valueComment = null;
        if (value && typeof value === "object")
          value = doc.createNode(value);
      }
      ctx.implicitKey = false;
      if (!explicitKey && !keyComment && identity.isScalar(value))
        ctx.indentAtStart = str.length + 1;
      chompKeep = false;
      if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && identity.isSeq(value) && !value.flow && !value.tag && !value.anchor) {
        ctx.indent = ctx.indent.substring(2);
      }
      let valueCommentDone = false;
      const valueStr = stringify.stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
      let ws = " ";
      if (keyComment || vsb || vcb) {
        ws = vsb ? "\n" : "";
        if (vcb) {
          const cs = commentString(vcb);
          ws += `
${stringifyComment.indentComment(cs, ctx.indent)}`;
        }
        if (valueStr === "" && !ctx.inFlow) {
          if (ws === "\n" && valueComment)
            ws = "\n\n";
        } else {
          ws += `
${ctx.indent}`;
        }
      } else if (!explicitKey && identity.isCollection(value)) {
        const vs0 = valueStr[0];
        const nl0 = valueStr.indexOf("\n");
        const hasNewline = nl0 !== -1;
        const flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
        if (hasNewline || !flow) {
          let hasPropsLine = false;
          if (hasNewline && (vs0 === "&" || vs0 === "!")) {
            let sp0 = valueStr.indexOf(" ");
            if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") {
              sp0 = valueStr.indexOf(" ", sp0 + 1);
            }
            if (sp0 === -1 || nl0 < sp0)
              hasPropsLine = true;
          }
          if (!hasPropsLine)
            ws = `
${ctx.indent}`;
        }
      } else if (valueStr === "" || valueStr[0] === "\n") {
        ws = "";
      }
      str += ws + valueStr;
      if (ctx.inFlow) {
        if (valueCommentDone && onComment)
          onComment();
      } else if (valueComment && !valueCommentDone) {
        str += stringifyComment.lineComment(str, ctx.indent, commentString(valueComment));
      } else if (chompKeep && onChompKeep) {
        onChompKeep();
      }
      return str;
    }
    exports2.stringifyPair = stringifyPair;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/log.js
var require_log = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/log.js"(exports2) {
    "use strict";
    var node_process = require("process");
    function debug(logLevel, ...messages2) {
      if (logLevel === "debug")
        console.log(...messages2);
    }
    function warn(logLevel, warning) {
      if (logLevel === "debug" || logLevel === "warn") {
        if (typeof node_process.emitWarning === "function")
          node_process.emitWarning(warning);
        else
          console.warn(warning);
      }
    }
    exports2.debug = debug;
    exports2.warn = warn;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/merge.js
var require_merge = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/merge.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var MERGE_KEY = "<<";
    var merge = {
      identify: (value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY,
      default: "key",
      tag: "tag:yaml.org,2002:merge",
      test: /^<<$/,
      resolve: () => Object.assign(new Scalar.Scalar(Symbol(MERGE_KEY)), {
        addToJSMap: addMergeToJSMap
      }),
      stringify: () => MERGE_KEY
    };
    var isMergeKey = (ctx, key) => (merge.identify(key) || identity.isScalar(key) && (!key.type || key.type === Scalar.Scalar.PLAIN) && merge.identify(key.value)) && ctx?.doc.schema.tags.some((tag) => tag.tag === merge.tag && tag.default);
    function addMergeToJSMap(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (identity.isSeq(source))
        for (const it of source.items)
          mergeValue(ctx, map, it);
      else if (Array.isArray(source))
        for (const it of source)
          mergeValue(ctx, map, it);
      else
        mergeValue(ctx, map, source);
    }
    function mergeValue(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (!identity.isMap(source))
        throw new Error("Merge sources must be maps or map aliases");
      const srcMap = source.toJSON(null, ctx, Map);
      for (const [key, value2] of srcMap) {
        if (map instanceof Map) {
          if (!map.has(key))
            map.set(key, value2);
        } else if (map instanceof Set) {
          map.add(key);
        } else if (!Object.prototype.hasOwnProperty.call(map, key)) {
          Object.defineProperty(map, key, {
            value: value2,
            writable: true,
            enumerable: true,
            configurable: true
          });
        }
      }
      return map;
    }
    function resolveAliasValue(ctx, value) {
      return ctx && identity.isAlias(value) ? value.resolve(ctx.doc, ctx) : value;
    }
    exports2.addMergeToJSMap = addMergeToJSMap;
    exports2.isMergeKey = isMergeKey;
    exports2.merge = merge;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/addPairToJSMap.js
var require_addPairToJSMap = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/addPairToJSMap.js"(exports2) {
    "use strict";
    var log = require_log();
    var merge = require_merge();
    var stringify = require_stringify();
    var identity = require_identity();
    var toJS = require_toJS();
    function addPairToJSMap(ctx, map, { key, value }) {
      if (identity.isNode(key) && key.addToJSMap)
        key.addToJSMap(ctx, map, value);
      else if (merge.isMergeKey(ctx, key))
        merge.addMergeToJSMap(ctx, map, value);
      else {
        const jsKey = toJS.toJS(key, "", ctx);
        if (map instanceof Map) {
          map.set(jsKey, toJS.toJS(value, jsKey, ctx));
        } else if (map instanceof Set) {
          map.add(jsKey);
        } else {
          const stringKey = stringifyKey(key, jsKey, ctx);
          const jsValue = toJS.toJS(value, stringKey, ctx);
          if (stringKey in map)
            Object.defineProperty(map, stringKey, {
              value: jsValue,
              writable: true,
              enumerable: true,
              configurable: true
            });
          else
            map[stringKey] = jsValue;
        }
      }
      return map;
    }
    function stringifyKey(key, jsKey, ctx) {
      if (jsKey === null)
        return "";
      if (typeof jsKey !== "object")
        return String(jsKey);
      if (identity.isNode(key) && ctx?.doc) {
        const strCtx = stringify.createStringifyContext(ctx.doc, {});
        strCtx.anchors = /* @__PURE__ */ new Set();
        for (const node of ctx.anchors.keys())
          strCtx.anchors.add(node.anchor);
        strCtx.inFlow = true;
        strCtx.inStringifyKey = true;
        const strKey = key.toString(strCtx);
        if (!ctx.mapKeyWarned) {
          let jsonStr = JSON.stringify(strKey);
          if (jsonStr.length > 40)
            jsonStr = jsonStr.substring(0, 36) + '..."';
          log.warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
          ctx.mapKeyWarned = true;
        }
        return strKey;
      }
      return JSON.stringify(jsKey);
    }
    exports2.addPairToJSMap = addPairToJSMap;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/Pair.js
var require_Pair = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/Pair.js"(exports2) {
    "use strict";
    var createNode = require_createNode();
    var stringifyPair = require_stringifyPair();
    var addPairToJSMap = require_addPairToJSMap();
    var identity = require_identity();
    function createPair(key, value, ctx) {
      const k = createNode.createNode(key, void 0, ctx);
      const v = createNode.createNode(value, void 0, ctx);
      return new Pair(k, v);
    }
    var Pair = class _Pair {
      constructor(key, value = null) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.PAIR });
        this.key = key;
        this.value = value;
      }
      clone(schema) {
        let { key, value } = this;
        if (identity.isNode(key))
          key = key.clone(schema);
        if (identity.isNode(value))
          value = value.clone(schema);
        return new _Pair(key, value);
      }
      toJSON(_, ctx) {
        const pair = ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        return addPairToJSMap.addPairToJSMap(ctx, pair, this);
      }
      toString(ctx, onComment, onChompKeep) {
        return ctx?.doc ? stringifyPair.stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
      }
    };
    exports2.Pair = Pair;
    exports2.createPair = createPair;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringifyCollection.js
var require_stringifyCollection = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringifyCollection.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyCollection(collection, ctx, options) {
      const flow = ctx.inFlow ?? collection.flow;
      const stringify2 = flow ? stringifyFlowCollection : stringifyBlockCollection;
      return stringify2(collection, ctx, options);
    }
    function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
      const { indent, options: { commentString } } = ctx;
      const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
      let chompKeep = false;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment2 = null;
        if (identity.isNode(item)) {
          if (!chompKeep && item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
          if (item.comment)
            comment2 = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (!chompKeep && ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
          }
        }
        chompKeep = false;
        let str2 = stringify.stringify(item, itemCtx, () => comment2 = null, () => chompKeep = true);
        if (comment2)
          str2 += stringifyComment.lineComment(str2, itemIndent, commentString(comment2));
        if (chompKeep && comment2)
          chompKeep = false;
        lines.push(blockItemPrefix + str2);
      }
      let str;
      if (lines.length === 0) {
        str = flowChars.start + flowChars.end;
      } else {
        str = lines[0];
        for (let i = 1; i < lines.length; ++i) {
          const line = lines[i];
          str += line ? `
${indent}${line}` : "\n";
        }
      }
      if (comment) {
        str += "\n" + stringifyComment.indentComment(commentString(comment), indent);
        if (onComment)
          onComment();
      } else if (chompKeep && onChompKeep)
        onChompKeep();
      return str;
    }
    function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
      const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
      itemIndent += indentStep;
      const itemCtx = Object.assign({}, ctx, {
        indent: itemIndent,
        inFlow: true,
        type: null
      });
      let reqNewline = false;
      let linesAtValue = 0;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment = null;
        if (identity.isNode(item)) {
          if (item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, false);
          if (item.comment)
            comment = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, false);
            if (ik.comment)
              reqNewline = true;
          }
          const iv = identity.isNode(item.value) ? item.value : null;
          if (iv) {
            if (iv.comment)
              comment = iv.comment;
            if (iv.commentBefore)
              reqNewline = true;
          } else if (item.value == null && ik?.comment) {
            comment = ik.comment;
          }
        }
        if (comment)
          reqNewline = true;
        let str = stringify.stringify(item, itemCtx, () => comment = null);
        reqNewline || (reqNewline = lines.length > linesAtValue || str.includes("\n"));
        if (i < items.length - 1) {
          str += ",";
        } else if (ctx.options.trailingComma) {
          if (ctx.options.lineWidth > 0) {
            reqNewline || (reqNewline = lines.reduce((sum, line) => sum + line.length + 2, 2) + (str.length + 2) > ctx.options.lineWidth);
          }
          if (reqNewline) {
            str += ",";
          }
        }
        if (comment)
          str += stringifyComment.lineComment(str, itemIndent, commentString(comment));
        lines.push(str);
        linesAtValue = lines.length;
      }
      const { start, end } = flowChars;
      if (lines.length === 0) {
        return start + end;
      } else {
        if (!reqNewline) {
          const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
          reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
        }
        if (reqNewline) {
          let str = start;
          for (const line of lines)
            str += line ? `
${indentStep}${indent}${line}` : "\n";
          return `${str}
${indent}${end}`;
        } else {
          return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
        }
      }
    }
    function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
      if (comment && chompKeep)
        comment = comment.replace(/^\n+/, "");
      if (comment) {
        const ic = stringifyComment.indentComment(commentString(comment), indent);
        lines.push(ic.trimStart());
      }
    }
    exports2.stringifyCollection = stringifyCollection;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/YAMLMap.js
var require_YAMLMap = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/YAMLMap.js"(exports2) {
    "use strict";
    var stringifyCollection = require_stringifyCollection();
    var addPairToJSMap = require_addPairToJSMap();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    function findPair(items, key) {
      const k = identity.isScalar(key) ? key.value : key;
      for (const it of items) {
        if (identity.isPair(it)) {
          if (it.key === key || it.key === k)
            return it;
          if (identity.isScalar(it.key) && it.key.value === k)
            return it;
        }
      }
      return void 0;
    }
    var YAMLMap = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:map";
      }
      constructor(schema) {
        super(identity.MAP, schema);
        this.items = [];
      }
      /**
       * A generic collection parsing method that can be extended
       * to other node classes that inherit from YAMLMap
       */
      static from(schema, obj, ctx) {
        const { keepUndefined, replacer } = ctx;
        const map = new this(schema);
        const add = (key, value) => {
          if (typeof replacer === "function")
            value = replacer.call(obj, key, value);
          else if (Array.isArray(replacer) && !replacer.includes(key))
            return;
          if (value !== void 0 || keepUndefined)
            map.items.push(Pair.createPair(key, value, ctx));
        };
        if (obj instanceof Map) {
          for (const [key, value] of obj)
            add(key, value);
        } else if (obj && typeof obj === "object") {
          for (const key of Object.keys(obj))
            add(key, obj[key]);
        }
        if (typeof schema.sortMapEntries === "function") {
          map.items.sort(schema.sortMapEntries);
        }
        return map;
      }
      /**
       * Adds a value to the collection.
       *
       * @param overwrite - If not set `true`, using a key that is already in the
       *   collection will throw. Otherwise, overwrites the previous value.
       */
      add(pair, overwrite) {
        let _pair;
        if (identity.isPair(pair))
          _pair = pair;
        else if (!pair || typeof pair !== "object" || !("key" in pair)) {
          _pair = new Pair.Pair(pair, pair?.value);
        } else
          _pair = new Pair.Pair(pair.key, pair.value);
        const prev = findPair(this.items, _pair.key);
        const sortEntries = this.schema?.sortMapEntries;
        if (prev) {
          if (!overwrite)
            throw new Error(`Key ${_pair.key} already set`);
          if (identity.isScalar(prev.value) && Scalar.isScalarValue(_pair.value))
            prev.value.value = _pair.value;
          else
            prev.value = _pair.value;
        } else if (sortEntries) {
          const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
          if (i === -1)
            this.items.push(_pair);
          else
            this.items.splice(i, 0, _pair);
        } else {
          this.items.push(_pair);
        }
      }
      delete(key) {
        const it = findPair(this.items, key);
        if (!it)
          return false;
        const del = this.items.splice(this.items.indexOf(it), 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const it = findPair(this.items, key);
        const node = it?.value;
        return (!keepScalar && identity.isScalar(node) ? node.value : node) ?? void 0;
      }
      has(key) {
        return !!findPair(this.items, key);
      }
      set(key, value) {
        this.add(new Pair.Pair(key, value), true);
      }
      /**
       * @param ctx - Conversion context, originally set in Document#toJS()
       * @param {Class} Type - If set, forces the returned collection type
       * @returns Instance of Type, Map, or Object
       */
      toJSON(_, ctx, Type) {
        const map = Type ? new Type() : ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const item of this.items)
          addPairToJSMap.addPairToJSMap(ctx, map, item);
        return map;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        for (const item of this.items) {
          if (!identity.isPair(item))
            throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
        }
        if (!ctx.allNullValues && this.hasAllNullValues(false))
          ctx = Object.assign({}, ctx, { allNullValues: true });
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "",
          flowChars: { start: "{", end: "}" },
          itemIndent: ctx.indent || "",
          onChompKeep,
          onComment
        });
      }
    };
    exports2.YAMLMap = YAMLMap;
    exports2.findPair = findPair;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/common/map.js
var require_map = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/common/map.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var YAMLMap = require_YAMLMap();
    var map = {
      collection: "map",
      default: true,
      nodeClass: YAMLMap.YAMLMap,
      tag: "tag:yaml.org,2002:map",
      resolve(map2, onError) {
        if (!identity.isMap(map2))
          onError("Expected a mapping for this tag");
        return map2;
      },
      createNode: (schema, obj, ctx) => YAMLMap.YAMLMap.from(schema, obj, ctx)
    };
    exports2.map = map;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/YAMLSeq.js
var require_YAMLSeq = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/nodes/YAMLSeq.js"(exports2) {
    "use strict";
    var createNode = require_createNode();
    var stringifyCollection = require_stringifyCollection();
    var Collection = require_Collection();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var toJS = require_toJS();
    var YAMLSeq = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:seq";
      }
      constructor(schema) {
        super(identity.SEQ, schema);
        this.items = [];
      }
      add(value) {
        this.items.push(value);
      }
      /**
       * Removes a value from the collection.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       *
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return false;
        const del = this.items.splice(idx, 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return void 0;
        const it = this.items[idx];
        return !keepScalar && identity.isScalar(it) ? it.value : it;
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       */
      has(key) {
        const idx = asItemIndex(key);
        return typeof idx === "number" && idx < this.items.length;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       *
       * If `key` does not contain a representation of an integer, this will throw.
       * It may be wrapped in a `Scalar`.
       */
      set(key, value) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          throw new Error(`Expected a valid index, not ${key}.`);
        const prev = this.items[idx];
        if (identity.isScalar(prev) && Scalar.isScalarValue(value))
          prev.value = value;
        else
          this.items[idx] = value;
      }
      toJSON(_, ctx) {
        const seq = [];
        if (ctx?.onCreate)
          ctx.onCreate(seq);
        let i = 0;
        for (const item of this.items)
          seq.push(toJS.toJS(item, String(i++), ctx));
        return seq;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "- ",
          flowChars: { start: "[", end: "]" },
          itemIndent: (ctx.indent || "") + "  ",
          onChompKeep,
          onComment
        });
      }
      static from(schema, obj, ctx) {
        const { replacer } = ctx;
        const seq = new this(schema);
        if (obj && Symbol.iterator in Object(obj)) {
          let i = 0;
          for (let it of obj) {
            if (typeof replacer === "function") {
              const key = obj instanceof Set ? it : String(i++);
              it = replacer.call(obj, key, it);
            }
            seq.items.push(createNode.createNode(it, void 0, ctx));
          }
        }
        return seq;
      }
    };
    function asItemIndex(key) {
      let idx = identity.isScalar(key) ? key.value : key;
      if (idx && typeof idx === "string")
        idx = Number(idx);
      return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
    }
    exports2.YAMLSeq = YAMLSeq;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/common/seq.js
var require_seq = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/common/seq.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var YAMLSeq = require_YAMLSeq();
    var seq = {
      collection: "seq",
      default: true,
      nodeClass: YAMLSeq.YAMLSeq,
      tag: "tag:yaml.org,2002:seq",
      resolve(seq2, onError) {
        if (!identity.isSeq(seq2))
          onError("Expected a sequence for this tag");
        return seq2;
      },
      createNode: (schema, obj, ctx) => YAMLSeq.YAMLSeq.from(schema, obj, ctx)
    };
    exports2.seq = seq;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/common/string.js
var require_string = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/common/string.js"(exports2) {
    "use strict";
    var stringifyString = require_stringifyString();
    var string = {
      identify: (value) => typeof value === "string",
      default: true,
      tag: "tag:yaml.org,2002:str",
      resolve: (str) => str,
      stringify(item, ctx, onComment, onChompKeep) {
        ctx = Object.assign({ actualString: true }, ctx);
        return stringifyString.stringifyString(item, ctx, onComment, onChompKeep);
      }
    };
    exports2.string = string;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/common/null.js
var require_null = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/common/null.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var nullTag = {
      identify: (value) => value == null,
      createNode: () => new Scalar.Scalar(null),
      default: true,
      tag: "tag:yaml.org,2002:null",
      test: /^(?:~|[Nn]ull|NULL)?$/,
      resolve: () => new Scalar.Scalar(null),
      stringify: ({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
    };
    exports2.nullTag = nullTag;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/core/bool.js
var require_bool = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/core/bool.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var boolTag = {
      identify: (value) => typeof value === "boolean",
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
      resolve: (str) => new Scalar.Scalar(str[0] === "t" || str[0] === "T"),
      stringify({ source, value }, ctx) {
        if (source && boolTag.test.test(source)) {
          const sv = source[0] === "t" || source[0] === "T";
          if (value === sv)
            return source;
        }
        return value ? ctx.options.trueStr : ctx.options.falseStr;
      }
    };
    exports2.boolTag = boolTag;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringifyNumber.js
var require_stringifyNumber = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringifyNumber.js"(exports2) {
    "use strict";
    function stringifyNumber({ format, minFractionDigits, tag, value }) {
      if (typeof value === "bigint")
        return String(value);
      const num = typeof value === "number" ? value : Number(value);
      if (!isFinite(num))
        return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
      let n = Object.is(value, -0) ? "-0" : JSON.stringify(value);
      if (!format && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^-?\d/.test(n) && !n.includes("e")) {
        let i = n.indexOf(".");
        if (i < 0) {
          i = n.length;
          n += ".";
        }
        let d = minFractionDigits - (n.length - i - 1);
        while (d-- > 0)
          n += "0";
      }
      return n;
    }
    exports2.stringifyNumber = stringifyNumber;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/core/float.js
var require_float = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/core/float.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str));
        const dot = str.indexOf(".");
        if (dot !== -1 && str[str.length - 1] === "0")
          node.minFractionDigits = str.length - dot - 1;
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports2.float = float;
    exports2.floatExp = floatExp;
    exports2.floatNaN = floatNaN;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/core/int.js
var require_int = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/core/int.js"(exports2) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    var intResolve = (str, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix);
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value) && value >= 0)
        return prefix + value.toString(radix);
      return stringifyNumber.stringifyNumber(node);
    }
    var intOct = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^0o[0-7]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
      stringify: (node) => intStringify(node, 8, "0o")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^0x[0-9a-fA-F]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports2.int = int;
    exports2.intHex = intHex;
    exports2.intOct = intOct;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/core/schema.js
var require_schema = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/core/schema.js"(exports2) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.boolTag,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float
    ];
    exports2.schema = schema;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/json/schema.js
var require_schema2 = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/json/schema.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var map = require_map();
    var seq = require_seq();
    function intIdentify(value) {
      return typeof value === "bigint" || Number.isInteger(value);
    }
    var stringifyJSON = ({ value }) => JSON.stringify(value);
    var jsonScalars = [
      {
        identify: (value) => typeof value === "string",
        default: true,
        tag: "tag:yaml.org,2002:str",
        resolve: (str) => str,
        stringify: stringifyJSON
      },
      {
        identify: (value) => value == null,
        createNode: () => new Scalar.Scalar(null),
        default: true,
        tag: "tag:yaml.org,2002:null",
        test: /^null$/,
        resolve: () => null,
        stringify: stringifyJSON
      },
      {
        identify: (value) => typeof value === "boolean",
        default: true,
        tag: "tag:yaml.org,2002:bool",
        test: /^true$|^false$/,
        resolve: (str) => str === "true",
        stringify: stringifyJSON
      },
      {
        identify: intIdentify,
        default: true,
        tag: "tag:yaml.org,2002:int",
        test: /^-?(?:0|[1-9][0-9]*)$/,
        resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
        stringify: ({ value }) => intIdentify(value) ? value.toString() : JSON.stringify(value)
      },
      {
        identify: (value) => typeof value === "number",
        default: true,
        tag: "tag:yaml.org,2002:float",
        test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
        resolve: (str) => parseFloat(str),
        stringify: stringifyJSON
      }
    ];
    var jsonError = {
      default: true,
      tag: "",
      test: /^/,
      resolve(str, onError) {
        onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
        return str;
      }
    };
    var schema = [map.map, seq.seq].concat(jsonScalars, jsonError);
    exports2.schema = schema;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/binary.js
var require_binary = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/binary.js"(exports2) {
    "use strict";
    var node_buffer = require("buffer");
    var Scalar = require_Scalar();
    var stringifyString = require_stringifyString();
    var binary = {
      identify: (value) => value instanceof Uint8Array,
      // Buffer inherits from Uint8Array
      default: false,
      tag: "tag:yaml.org,2002:binary",
      /**
       * Returns a Buffer in node and an Uint8Array in browsers
       *
       * To use the resulting buffer as an image, you'll want to do something like:
       *
       *   const blob = new Blob([buffer], { type: 'image/jpeg' })
       *   document.querySelector('#photo').src = URL.createObjectURL(blob)
       */
      resolve(src, onError) {
        if (typeof node_buffer.Buffer === "function") {
          return node_buffer.Buffer.from(src, "base64");
        } else if (typeof atob === "function") {
          const str = atob(src.replace(/[\n\r]/g, ""));
          const buffer = new Uint8Array(str.length);
          for (let i = 0; i < str.length; ++i)
            buffer[i] = str.charCodeAt(i);
          return buffer;
        } else {
          onError("This environment does not support reading binary tags; either Buffer or atob is required");
          return src;
        }
      },
      stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
        if (!value)
          return "";
        const buf = value;
        let str;
        if (typeof node_buffer.Buffer === "function") {
          str = buf instanceof node_buffer.Buffer ? buf.toString("base64") : node_buffer.Buffer.from(buf.buffer).toString("base64");
        } else if (typeof btoa === "function") {
          let s = "";
          for (let i = 0; i < buf.length; ++i)
            s += String.fromCharCode(buf[i]);
          str = btoa(s);
        } else {
          throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
        }
        type ?? (type = Scalar.Scalar.BLOCK_LITERAL);
        if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
          const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
          const n = Math.ceil(str.length / lineWidth);
          const lines = new Array(n);
          for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
            lines[i] = str.substr(o, lineWidth);
          }
          str = lines.join(type === Scalar.Scalar.BLOCK_LITERAL ? "\n" : " ");
        }
        return stringifyString.stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
      }
    };
    exports2.binary = binary;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/pairs.js
var require_pairs = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/pairs.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLSeq = require_YAMLSeq();
    function resolvePairs(seq, onError) {
      if (identity.isSeq(seq)) {
        for (let i = 0; i < seq.items.length; ++i) {
          let item = seq.items[i];
          if (identity.isPair(item))
            continue;
          else if (identity.isMap(item)) {
            if (item.items.length > 1)
              onError("Each pair must have its own sequence indicator");
            const pair = item.items[0] || new Pair.Pair(new Scalar.Scalar(null));
            if (item.commentBefore)
              pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore;
            if (item.comment) {
              const cn = pair.value ?? pair.key;
              cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
            }
            item = pair;
          }
          seq.items[i] = identity.isPair(item) ? item : new Pair.Pair(item);
        }
      } else
        onError("Expected a sequence for this tag");
      return seq;
    }
    function createPairs(schema, iterable, ctx) {
      const { replacer } = ctx;
      const pairs2 = new YAMLSeq.YAMLSeq(schema);
      pairs2.tag = "tag:yaml.org,2002:pairs";
      let i = 0;
      if (iterable && Symbol.iterator in Object(iterable))
        for (let it of iterable) {
          if (typeof replacer === "function")
            it = replacer.call(iterable, String(i++), it);
          let key, value;
          if (Array.isArray(it)) {
            if (it.length === 2) {
              key = it[0];
              value = it[1];
            } else
              throw new TypeError(`Expected [key, value] tuple: ${it}`);
          } else if (it && it instanceof Object) {
            const keys = Object.keys(it);
            if (keys.length === 1) {
              key = keys[0];
              value = it[key];
            } else {
              throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
            }
          } else {
            key = it;
          }
          pairs2.items.push(Pair.createPair(key, value, ctx));
        }
      return pairs2;
    }
    var pairs = {
      collection: "seq",
      default: false,
      tag: "tag:yaml.org,2002:pairs",
      resolve: resolvePairs,
      createNode: createPairs
    };
    exports2.createPairs = createPairs;
    exports2.pairs = pairs;
    exports2.resolvePairs = resolvePairs;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/omap.js
var require_omap = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/omap.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var toJS = require_toJS();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var pairs = require_pairs();
    var YAMLOMap = class _YAMLOMap extends YAMLSeq.YAMLSeq {
      constructor() {
        super();
        this.add = YAMLMap.YAMLMap.prototype.add.bind(this);
        this.delete = YAMLMap.YAMLMap.prototype.delete.bind(this);
        this.get = YAMLMap.YAMLMap.prototype.get.bind(this);
        this.has = YAMLMap.YAMLMap.prototype.has.bind(this);
        this.set = YAMLMap.YAMLMap.prototype.set.bind(this);
        this.tag = _YAMLOMap.tag;
      }
      /**
       * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
       * but TypeScript won't allow widening the signature of a child method.
       */
      toJSON(_, ctx) {
        if (!ctx)
          return super.toJSON(_);
        const map = /* @__PURE__ */ new Map();
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const pair of this.items) {
          let key, value;
          if (identity.isPair(pair)) {
            key = toJS.toJS(pair.key, "", ctx);
            value = toJS.toJS(pair.value, key, ctx);
          } else {
            key = toJS.toJS(pair, "", ctx);
          }
          if (map.has(key))
            throw new Error("Ordered maps must not include duplicate keys");
          map.set(key, value);
        }
        return map;
      }
      static from(schema, iterable, ctx) {
        const pairs$1 = pairs.createPairs(schema, iterable, ctx);
        const omap2 = new this();
        omap2.items = pairs$1.items;
        return omap2;
      }
    };
    YAMLOMap.tag = "tag:yaml.org,2002:omap";
    var omap = {
      collection: "seq",
      identify: (value) => value instanceof Map,
      nodeClass: YAMLOMap,
      default: false,
      tag: "tag:yaml.org,2002:omap",
      resolve(seq, onError) {
        const pairs$1 = pairs.resolvePairs(seq, onError);
        const seenKeys = [];
        for (const { key } of pairs$1.items) {
          if (identity.isScalar(key)) {
            if (seenKeys.includes(key.value)) {
              onError(`Ordered maps must not include duplicate keys: ${key.value}`);
            } else {
              seenKeys.push(key.value);
            }
          }
        }
        return Object.assign(new YAMLOMap(), pairs$1);
      },
      createNode: (schema, iterable, ctx) => YAMLOMap.from(schema, iterable, ctx)
    };
    exports2.YAMLOMap = YAMLOMap;
    exports2.omap = omap;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/bool.js
var require_bool2 = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/bool.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    function boolStringify({ value, source }, ctx) {
      const boolObj = value ? trueTag : falseTag;
      if (source && boolObj.test.test(source))
        return source;
      return value ? ctx.options.trueStr : ctx.options.falseStr;
    }
    var trueTag = {
      identify: (value) => value === true,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
      resolve: () => new Scalar.Scalar(true),
      stringify: boolStringify
    };
    var falseTag = {
      identify: (value) => value === false,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
      resolve: () => new Scalar.Scalar(false),
      stringify: boolStringify
    };
    exports2.falseTag = falseTag;
    exports2.trueTag = trueTag;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/float.js
var require_float2 = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/float.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str.replace(/_/g, "")),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str.replace(/_/g, "")));
        const dot = str.indexOf(".");
        if (dot !== -1) {
          const f = str.substring(dot + 1).replace(/_/g, "");
          if (f[f.length - 1] === "0")
            node.minFractionDigits = f.length;
        }
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports2.float = float;
    exports2.floatExp = floatExp;
    exports2.floatNaN = floatNaN;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/int.js
var require_int2 = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/int.js"(exports2) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    function intResolve(str, offset, radix, { intAsBigInt }) {
      const sign = str[0];
      if (sign === "-" || sign === "+")
        offset += 1;
      str = str.substring(offset).replace(/_/g, "");
      if (intAsBigInt) {
        switch (radix) {
          case 2:
            str = `0b${str}`;
            break;
          case 8:
            str = `0o${str}`;
            break;
          case 16:
            str = `0x${str}`;
            break;
        }
        const n2 = BigInt(str);
        return sign === "-" ? BigInt(-1) * n2 : n2;
      }
      const n = parseInt(str, radix);
      return sign === "-" ? -1 * n : n;
    }
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value)) {
        const str = value.toString(radix);
        return value < 0 ? "-" + prefix + str.substr(1) : prefix + str;
      }
      return stringifyNumber.stringifyNumber(node);
    }
    var intBin = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "BIN",
      test: /^[-+]?0b[0-1_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 2, opt),
      stringify: (node) => intStringify(node, 2, "0b")
    };
    var intOct = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^[-+]?0[0-7_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 1, 8, opt),
      stringify: (node) => intStringify(node, 8, "0")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9][0-9_]*$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^[-+]?0x[0-9a-fA-F_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports2.int = int;
    exports2.intBin = intBin;
    exports2.intHex = intHex;
    exports2.intOct = intOct;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/set.js
var require_set = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/set.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSet = class _YAMLSet extends YAMLMap.YAMLMap {
      constructor(schema) {
        super(schema);
        this.tag = _YAMLSet.tag;
      }
      add(key) {
        let pair;
        if (identity.isPair(key))
          pair = key;
        else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null)
          pair = new Pair.Pair(key.key, null);
        else
          pair = new Pair.Pair(key, null);
        const prev = YAMLMap.findPair(this.items, pair.key);
        if (!prev)
          this.items.push(pair);
      }
      /**
       * If `keepPair` is `true`, returns the Pair matching `key`.
       * Otherwise, returns the value of that Pair's key.
       */
      get(key, keepPair) {
        const pair = YAMLMap.findPair(this.items, key);
        return !keepPair && identity.isPair(pair) ? identity.isScalar(pair.key) ? pair.key.value : pair.key : pair;
      }
      set(key, value) {
        if (typeof value !== "boolean")
          throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
        const prev = YAMLMap.findPair(this.items, key);
        if (prev && !value) {
          this.items.splice(this.items.indexOf(prev), 1);
        } else if (!prev && value) {
          this.items.push(new Pair.Pair(key));
        }
      }
      toJSON(_, ctx) {
        return super.toJSON(_, ctx, Set);
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        if (this.hasAllNullValues(true))
          return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
        else
          throw new Error("Set items must all have null values");
      }
      static from(schema, iterable, ctx) {
        const { replacer } = ctx;
        const set2 = new this(schema);
        if (iterable && Symbol.iterator in Object(iterable))
          for (let value of iterable) {
            if (typeof replacer === "function")
              value = replacer.call(iterable, value, value);
            set2.items.push(Pair.createPair(value, null, ctx));
          }
        return set2;
      }
    };
    YAMLSet.tag = "tag:yaml.org,2002:set";
    var set = {
      collection: "map",
      identify: (value) => value instanceof Set,
      nodeClass: YAMLSet,
      default: false,
      tag: "tag:yaml.org,2002:set",
      createNode: (schema, iterable, ctx) => YAMLSet.from(schema, iterable, ctx),
      resolve(map, onError) {
        if (identity.isMap(map)) {
          if (map.hasAllNullValues(true))
            return Object.assign(new YAMLSet(), map);
          else
            onError("Set items must all have null values");
        } else
          onError("Expected a mapping for this tag");
        return map;
      }
    };
    exports2.YAMLSet = YAMLSet;
    exports2.set = set;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/timestamp.js
var require_timestamp = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/timestamp.js"(exports2) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    function parseSexagesimal(str, asBigInt) {
      const sign = str[0];
      const parts = sign === "-" || sign === "+" ? str.substring(1) : str;
      const num = (n) => asBigInt ? BigInt(n) : Number(n);
      const res = parts.replace(/_/g, "").split(":").reduce((res2, p) => res2 * num(60) + num(p), num(0));
      return sign === "-" ? num(-1) * res : res;
    }
    function stringifySexagesimal(node) {
      let { value } = node;
      let num = (n) => n;
      if (typeof value === "bigint")
        num = (n) => BigInt(n);
      else if (isNaN(value) || !isFinite(value))
        return stringifyNumber.stringifyNumber(node);
      let sign = "";
      if (value < 0) {
        sign = "-";
        value *= num(-1);
      }
      const _60 = num(60);
      const parts = [value % _60];
      if (value < 60) {
        parts.unshift(0);
      } else {
        value = (value - parts[0]) / _60;
        parts.unshift(value % _60);
        if (value >= 60) {
          value = (value - parts[0]) / _60;
          parts.unshift(value);
        }
      }
      return sign + parts.map((n) => String(n).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
    }
    var intTime = {
      identify: (value) => typeof value === "bigint" || Number.isInteger(value),
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
      resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
      stringify: stringifySexagesimal
    };
    var floatTime = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
      resolve: (str) => parseSexagesimal(str, false),
      stringify: stringifySexagesimal
    };
    var timestamp = {
      identify: (value) => value instanceof Date,
      default: true,
      tag: "tag:yaml.org,2002:timestamp",
      // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
      // may be omitted altogether, resulting in a date format. In such a case, the time part is
      // assumed to be 00:00:00Z (start of day, UTC).
      test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
      resolve(str) {
        const match = str.match(timestamp.test);
        if (!match)
          throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
        const [, year, month, day, hour, minute, second] = match.map(Number);
        const millisec = match[7] ? Number((match[7] + "00").substr(1, 3)) : 0;
        let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
        const tz = match[8];
        if (tz && tz !== "Z") {
          let d = parseSexagesimal(tz, false);
          if (Math.abs(d) < 30)
            d *= 60;
          date -= 6e4 * d;
        }
        return new Date(date);
      },
      stringify: ({ value }) => value?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
    };
    exports2.floatTime = floatTime;
    exports2.intTime = intTime;
    exports2.timestamp = timestamp;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/schema.js
var require_schema3 = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/yaml-1.1/schema.js"(exports2) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var binary = require_binary();
    var bool = require_bool2();
    var float = require_float2();
    var int = require_int2();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var set = require_set();
    var timestamp = require_timestamp();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.trueTag,
      bool.falseTag,
      int.intBin,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float,
      binary.binary,
      merge.merge,
      omap.omap,
      pairs.pairs,
      set.set,
      timestamp.intTime,
      timestamp.floatTime,
      timestamp.timestamp
    ];
    exports2.schema = schema;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/tags.js
var require_tags = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/tags.js"(exports2) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = require_schema();
    var schema$1 = require_schema2();
    var binary = require_binary();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var schema$2 = require_schema3();
    var set = require_set();
    var timestamp = require_timestamp();
    var schemas = /* @__PURE__ */ new Map([
      ["core", schema.schema],
      ["failsafe", [map.map, seq.seq, string.string]],
      ["json", schema$1.schema],
      ["yaml11", schema$2.schema],
      ["yaml-1.1", schema$2.schema]
    ]);
    var tagsByName = {
      binary: binary.binary,
      bool: bool.boolTag,
      float: float.float,
      floatExp: float.floatExp,
      floatNaN: float.floatNaN,
      floatTime: timestamp.floatTime,
      int: int.int,
      intHex: int.intHex,
      intOct: int.intOct,
      intTime: timestamp.intTime,
      map: map.map,
      merge: merge.merge,
      null: _null.nullTag,
      omap: omap.omap,
      pairs: pairs.pairs,
      seq: seq.seq,
      set: set.set,
      timestamp: timestamp.timestamp
    };
    var coreKnownTags = {
      "tag:yaml.org,2002:binary": binary.binary,
      "tag:yaml.org,2002:merge": merge.merge,
      "tag:yaml.org,2002:omap": omap.omap,
      "tag:yaml.org,2002:pairs": pairs.pairs,
      "tag:yaml.org,2002:set": set.set,
      "tag:yaml.org,2002:timestamp": timestamp.timestamp
    };
    function getTags(customTags, schemaName, addMergeTag) {
      const schemaTags = schemas.get(schemaName);
      if (schemaTags && !customTags) {
        return addMergeTag && !schemaTags.includes(merge.merge) ? schemaTags.concat(merge.merge) : schemaTags.slice();
      }
      let tags = schemaTags;
      if (!tags) {
        if (Array.isArray(customTags))
          tags = [];
        else {
          const keys = Array.from(schemas.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
        }
      }
      if (Array.isArray(customTags)) {
        for (const tag of customTags)
          tags = tags.concat(tag);
      } else if (typeof customTags === "function") {
        tags = customTags(tags.slice());
      }
      if (addMergeTag)
        tags = tags.concat(merge.merge);
      return tags.reduce((tags2, tag) => {
        const tagObj = typeof tag === "string" ? tagsByName[tag] : tag;
        if (!tagObj) {
          const tagName = JSON.stringify(tag);
          const keys = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown custom tag ${tagName}; use one of ${keys}`);
        }
        if (!tags2.includes(tagObj))
          tags2.push(tagObj);
        return tags2;
      }, []);
    }
    exports2.coreKnownTags = coreKnownTags;
    exports2.getTags = getTags;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/Schema.js
var require_Schema = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/schema/Schema.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var map = require_map();
    var seq = require_seq();
    var string = require_string();
    var tags = require_tags();
    var sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
    var Schema = class _Schema {
      constructor({ compat, customTags, merge, resolveKnownTags, schema, sortMapEntries, toStringDefaults }) {
        this.compat = Array.isArray(compat) ? tags.getTags(compat, "compat") : compat ? tags.getTags(null, compat) : null;
        this.name = typeof schema === "string" && schema || "core";
        this.knownTags = resolveKnownTags ? tags.coreKnownTags : {};
        this.tags = tags.getTags(customTags, this.name, merge);
        this.toStringOptions = toStringDefaults ?? null;
        Object.defineProperty(this, identity.MAP, { value: map.map });
        Object.defineProperty(this, identity.SCALAR, { value: string.string });
        Object.defineProperty(this, identity.SEQ, { value: seq.seq });
        this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
      }
      clone() {
        const copy = Object.create(_Schema.prototype, Object.getOwnPropertyDescriptors(this));
        copy.tags = this.tags.slice();
        return copy;
      }
    };
    exports2.Schema = Schema;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringifyDocument.js
var require_stringifyDocument = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/stringify/stringifyDocument.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyDocument(doc, options) {
      const lines = [];
      let hasDirectives = options.directives === true;
      if (options.directives !== false && doc.directives) {
        const dir = doc.directives.toString(doc);
        if (dir) {
          lines.push(dir);
          hasDirectives = true;
        } else if (doc.directives.docStart)
          hasDirectives = true;
      }
      if (hasDirectives)
        lines.push("---");
      const ctx = stringify.createStringifyContext(doc, options);
      const { commentString } = ctx.options;
      if (doc.commentBefore) {
        if (lines.length !== 1)
          lines.unshift("");
        const cs = commentString(doc.commentBefore);
        lines.unshift(stringifyComment.indentComment(cs, ""));
      }
      let chompKeep = false;
      let contentComment = null;
      if (doc.contents) {
        if (identity.isNode(doc.contents)) {
          if (doc.contents.spaceBefore && hasDirectives)
            lines.push("");
          if (doc.contents.commentBefore) {
            const cs = commentString(doc.contents.commentBefore);
            lines.push(stringifyComment.indentComment(cs, ""));
          }
          ctx.forceBlockIndent = !!doc.comment;
          contentComment = doc.contents.comment;
        }
        const onChompKeep = contentComment ? void 0 : () => chompKeep = true;
        let body = stringify.stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
        if (contentComment)
          body += stringifyComment.lineComment(body, "", commentString(contentComment));
        if ((body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---") {
          lines[lines.length - 1] = `--- ${body}`;
        } else
          lines.push(body);
      } else {
        lines.push(stringify.stringify(doc.contents, ctx));
      }
      if (doc.directives?.docEnd) {
        if (doc.comment) {
          const cs = commentString(doc.comment);
          if (cs.includes("\n")) {
            lines.push("...");
            lines.push(stringifyComment.indentComment(cs, ""));
          } else {
            lines.push(`... ${cs}`);
          }
        } else {
          lines.push("...");
        }
      } else {
        let dc = doc.comment;
        if (dc && chompKeep)
          dc = dc.replace(/^\n+/, "");
        if (dc) {
          if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "")
            lines.push("");
          lines.push(stringifyComment.indentComment(commentString(dc), ""));
        }
      }
      return lines.join("\n") + "\n";
    }
    exports2.stringifyDocument = stringifyDocument;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/doc/Document.js
var require_Document = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/doc/Document.js"(exports2) {
    "use strict";
    var Alias = require_Alias();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var toJS = require_toJS();
    var Schema = require_Schema();
    var stringifyDocument = require_stringifyDocument();
    var anchors = require_anchors();
    var applyReviver = require_applyReviver();
    var createNode = require_createNode();
    var directives = require_directives();
    var Document = class _Document {
      constructor(value, replacer, options) {
        this.commentBefore = null;
        this.comment = null;
        this.errors = [];
        this.warnings = [];
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.DOC });
        let _replacer = null;
        if (typeof replacer === "function" || Array.isArray(replacer)) {
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const opt = Object.assign({
          intAsBigInt: false,
          keepSourceTokens: false,
          logLevel: "warn",
          prettyErrors: true,
          strict: true,
          stringKeys: false,
          uniqueKeys: true,
          version: "1.2"
        }, options);
        this.options = opt;
        let { version } = opt;
        if (options?._directives) {
          this.directives = options._directives.atDocument();
          if (this.directives.yaml.explicit)
            version = this.directives.yaml.version;
        } else
          this.directives = new directives.Directives({ version });
        this.setSchema(version, options);
        this.contents = value === void 0 ? null : this.createNode(value, _replacer, options);
      }
      /**
       * Create a deep copy of this Document and its contents.
       *
       * Custom Node values that inherit from `Object` still refer to their original instances.
       */
      clone() {
        const copy = Object.create(_Document.prototype, {
          [identity.NODE_TYPE]: { value: identity.DOC }
        });
        copy.commentBefore = this.commentBefore;
        copy.comment = this.comment;
        copy.errors = this.errors.slice();
        copy.warnings = this.warnings.slice();
        copy.options = Object.assign({}, this.options);
        if (this.directives)
          copy.directives = this.directives.clone();
        copy.schema = this.schema.clone();
        copy.contents = identity.isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents;
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** Adds a value to the document. */
      add(value) {
        if (assertCollection(this.contents))
          this.contents.add(value);
      }
      /** Adds a value to the document. */
      addIn(path2, value) {
        if (assertCollection(this.contents))
          this.contents.addIn(path2, value);
      }
      /**
       * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
       *
       * If `node` already has an anchor, `name` is ignored.
       * Otherwise, the `node.anchor` value will be set to `name`,
       * or if an anchor with that name is already present in the document,
       * `name` will be used as a prefix for a new unique anchor.
       * If `name` is undefined, the generated anchor will use 'a' as a prefix.
       */
      createAlias(node, name) {
        if (!node.anchor) {
          const prev = anchors.anchorNames(this);
          node.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          !name || prev.has(name) ? anchors.findNewAnchor(name || "a", prev) : name;
        }
        return new Alias.Alias(node.anchor);
      }
      createNode(value, replacer, options) {
        let _replacer = void 0;
        if (typeof replacer === "function") {
          value = replacer.call({ "": value }, "", value);
          _replacer = replacer;
        } else if (Array.isArray(replacer)) {
          const keyToStr = (v) => typeof v === "number" || v instanceof String || v instanceof Number;
          const asStr = replacer.filter(keyToStr).map(String);
          if (asStr.length > 0)
            replacer = replacer.concat(asStr);
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {};
        const { onAnchor, setAnchors, sourceObjects } = anchors.createNodeAnchors(
          this,
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          anchorPrefix || "a"
        );
        const ctx = {
          aliasDuplicateObjects: aliasDuplicateObjects ?? true,
          keepUndefined: keepUndefined ?? false,
          onAnchor,
          onTagObj,
          replacer: _replacer,
          schema: this.schema,
          sourceObjects
        };
        const node = createNode.createNode(value, tag, ctx);
        if (flow && identity.isCollection(node))
          node.flow = true;
        setAnchors();
        return node;
      }
      /**
       * Convert a key and a value into a `Pair` using the current schema,
       * recursively wrapping all values as `Scalar` or `Collection` nodes.
       */
      createPair(key, value, options = {}) {
        const k = this.createNode(key, null, options);
        const v = this.createNode(value, null, options);
        return new Pair.Pair(k, v);
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        return assertCollection(this.contents) ? this.contents.delete(key) : false;
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path2) {
        if (Collection.isEmptyPath(path2)) {
          if (this.contents == null)
            return false;
          this.contents = null;
          return true;
        }
        return assertCollection(this.contents) ? this.contents.deleteIn(path2) : false;
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      get(key, keepScalar) {
        return identity.isCollection(this.contents) ? this.contents.get(key, keepScalar) : void 0;
      }
      /**
       * Returns item at `path`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path2, keepScalar) {
        if (Collection.isEmptyPath(path2))
          return !keepScalar && identity.isScalar(this.contents) ? this.contents.value : this.contents;
        return identity.isCollection(this.contents) ? this.contents.getIn(path2, keepScalar) : void 0;
      }
      /**
       * Checks if the document includes a value with the key `key`.
       */
      has(key) {
        return identity.isCollection(this.contents) ? this.contents.has(key) : false;
      }
      /**
       * Checks if the document includes a value at `path`.
       */
      hasIn(path2) {
        if (Collection.isEmptyPath(path2))
          return this.contents !== void 0;
        return identity.isCollection(this.contents) ? this.contents.hasIn(path2) : false;
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      set(key, value) {
        if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, [key], value);
        } else if (assertCollection(this.contents)) {
          this.contents.set(key, value);
        }
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path2, value) {
        if (Collection.isEmptyPath(path2)) {
          this.contents = value;
        } else if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, Array.from(path2), value);
        } else if (assertCollection(this.contents)) {
          this.contents.setIn(path2, value);
        }
      }
      /**
       * Change the YAML version and schema used by the document.
       * A `null` version disables support for directives, explicit tags, anchors, and aliases.
       * It also requires the `schema` option to be given as a `Schema` instance value.
       *
       * Overrides all previously set schema options.
       */
      setSchema(version, options = {}) {
        if (typeof version === "number")
          version = String(version);
        let opt;
        switch (version) {
          case "1.1":
            if (this.directives)
              this.directives.yaml.version = "1.1";
            else
              this.directives = new directives.Directives({ version: "1.1" });
            opt = { resolveKnownTags: false, schema: "yaml-1.1" };
            break;
          case "1.2":
          case "next":
            if (this.directives)
              this.directives.yaml.version = version;
            else
              this.directives = new directives.Directives({ version });
            opt = { resolveKnownTags: true, schema: "core" };
            break;
          case null:
            if (this.directives)
              delete this.directives;
            opt = null;
            break;
          default: {
            const sv = JSON.stringify(version);
            throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
          }
        }
        if (options.schema instanceof Object)
          this.schema = options.schema;
        else if (opt)
          this.schema = new Schema.Schema(Object.assign(opt, options));
        else
          throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
      }
      // json & jsonArg are only used from toJSON()
      toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc: this,
          keep: !json,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this.contents, jsonArg ?? "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
      /**
       * A JSON representation of the document `contents`.
       *
       * @param jsonArg Used by `JSON.stringify` to indicate the array index or
       *   property name.
       */
      toJSON(jsonArg, onAnchor) {
        return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
      }
      /** A YAML representation of the document. */
      toString(options = {}) {
        if (this.errors.length > 0)
          throw new Error("Document with errors cannot be stringified");
        if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
          const s = JSON.stringify(options.indent);
          throw new Error(`"indent" option must be a positive integer, not ${s}`);
        }
        return stringifyDocument.stringifyDocument(this, options);
      }
    };
    function assertCollection(contents) {
      if (identity.isCollection(contents))
        return true;
      throw new Error("Expected a YAML collection as document contents");
    }
    exports2.Document = Document;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/errors.js
var require_errors = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/errors.js"(exports2) {
    "use strict";
    var YAMLError = class extends Error {
      constructor(name, pos, code, message) {
        super();
        this.name = name;
        this.code = code;
        this.message = message;
        this.pos = pos;
      }
    };
    var YAMLParseError = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLParseError", pos, code, message);
      }
    };
    var YAMLWarning = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLWarning", pos, code, message);
      }
    };
    var prettifyError = (src, lc) => (error) => {
      if (error.pos[0] === -1)
        return;
      error.linePos = error.pos.map((pos) => lc.linePos(pos));
      const { line, col } = error.linePos[0];
      error.message += ` at line ${line}, column ${col}`;
      let ci = col - 1;
      let lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
      if (ci >= 60 && lineStr.length > 80) {
        const trimStart = Math.min(ci - 39, lineStr.length - 79);
        lineStr = "\u2026" + lineStr.substring(trimStart);
        ci -= trimStart - 1;
      }
      if (lineStr.length > 80)
        lineStr = lineStr.substring(0, 79) + "\u2026";
      if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
        let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
        if (prev.length > 80)
          prev = prev.substring(0, 79) + "\u2026\n";
        lineStr = prev + lineStr;
      }
      if (/[^ ]/.test(lineStr)) {
        let count = 1;
        const end = error.linePos[1];
        if (end?.line === line && end.col > col) {
          count = Math.max(1, Math.min(end.col - col, 80 - ci));
        }
        const pointer = " ".repeat(ci) + "^".repeat(count);
        error.message += `:

${lineStr}
${pointer}
`;
      }
    };
    exports2.YAMLError = YAMLError;
    exports2.YAMLParseError = YAMLParseError;
    exports2.YAMLWarning = YAMLWarning;
    exports2.prettifyError = prettifyError;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-props.js
var require_resolve_props = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-props.js"(exports2) {
    "use strict";
    function resolveProps(tokens, { flow, indicator, next, offset, onError, parentIndent, startOnNewline }) {
      let spaceBefore = false;
      let atNewline = startOnNewline;
      let hasSpace = startOnNewline;
      let comment = "";
      let commentSep = "";
      let hasNewline = false;
      let reqSpace = false;
      let tab = null;
      let anchor = null;
      let tag = null;
      let newlineAfterProp = null;
      let comma = null;
      let found = null;
      let start = null;
      for (const token of tokens) {
        if (reqSpace) {
          if (token.type !== "space" && token.type !== "newline" && token.type !== "comma")
            onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
          reqSpace = false;
        }
        if (tab) {
          if (atNewline && token.type !== "comment" && token.type !== "newline") {
            onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
          }
          tab = null;
        }
        switch (token.type) {
          case "space":
            if (!flow && (indicator !== "doc-start" || next?.type !== "flow-collection") && token.source.includes("	")) {
              tab = token;
            }
            hasSpace = true;
            break;
          case "comment": {
            if (!hasSpace)
              onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            const cb = token.source.substring(1) || " ";
            if (!comment)
              comment = cb;
            else
              comment += commentSep + cb;
            commentSep = "";
            atNewline = false;
            break;
          }
          case "newline":
            if (atNewline) {
              if (comment)
                comment += token.source;
              else if (!found || indicator !== "seq-item-ind")
                spaceBefore = true;
            } else
              commentSep += token.source;
            atNewline = true;
            hasNewline = true;
            if (anchor || tag)
              newlineAfterProp = token;
            hasSpace = true;
            break;
          case "anchor":
            if (anchor)
              onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
            if (token.source.endsWith(":"))
              onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", true);
            anchor = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          case "tag": {
            if (tag)
              onError(token, "MULTIPLE_TAGS", "A node can have at most one tag");
            tag = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          }
          case indicator:
            if (anchor || tag)
              onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`);
            if (found)
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow ?? "collection"}`);
            found = token;
            atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind";
            hasSpace = false;
            break;
          case "comma":
            if (flow) {
              if (comma)
                onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`);
              comma = token;
              atNewline = false;
              hasSpace = false;
              break;
            }
          // else fallthrough
          default:
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`);
            atNewline = false;
            hasSpace = false;
        }
      }
      const last = tokens[tokens.length - 1];
      const end = last ? last.offset + last.source.length : offset;
      if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== "")) {
        onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
      }
      if (tab && (atNewline && tab.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq"))
        onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
      return {
        comma,
        found,
        spaceBefore,
        comment,
        hasNewline,
        anchor,
        tag,
        newlineAfterProp,
        end,
        start: start ?? end
      };
    }
    exports2.resolveProps = resolveProps;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/util-contains-newline.js
var require_util_contains_newline = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/util-contains-newline.js"(exports2) {
    "use strict";
    function containsNewline(key) {
      if (!key)
        return null;
      switch (key.type) {
        case "alias":
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          if (key.source.includes("\n"))
            return true;
          if (key.end) {
            for (const st of key.end)
              if (st.type === "newline")
                return true;
          }
          return false;
        case "flow-collection":
          for (const it of key.items) {
            for (const st of it.start)
              if (st.type === "newline")
                return true;
            if (it.sep) {
              for (const st of it.sep)
                if (st.type === "newline")
                  return true;
            }
            if (containsNewline(it.key) || containsNewline(it.value))
              return true;
          }
          return false;
        default:
          return true;
      }
    }
    exports2.containsNewline = containsNewline;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/util-flow-indent-check.js
var require_util_flow_indent_check = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/util-flow-indent-check.js"(exports2) {
    "use strict";
    var utilContainsNewline = require_util_contains_newline();
    function flowIndentCheck(indent, fc, onError) {
      if (fc?.type === "flow-collection") {
        const end = fc.end[0];
        if (end.indent === indent && (end.source === "]" || end.source === "}") && utilContainsNewline.containsNewline(fc)) {
          const msg = "Flow end indicator should be more indented than parent";
          onError(end, "BAD_INDENT", msg, true);
        }
      }
    }
    exports2.flowIndentCheck = flowIndentCheck;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/util-map-includes.js
var require_util_map_includes = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/util-map-includes.js"(exports2) {
    "use strict";
    var identity = require_identity();
    function mapIncludes(ctx, items, search) {
      const { uniqueKeys } = ctx.options;
      if (uniqueKeys === false)
        return false;
      const isEqual = typeof uniqueKeys === "function" ? uniqueKeys : (a, b) => a === b || identity.isScalar(a) && identity.isScalar(b) && a.value === b.value;
      return items.some((pair) => isEqual(pair.key, search));
    }
    exports2.mapIncludes = mapIncludes;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-block-map.js
var require_resolve_block_map = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-block-map.js"(exports2) {
    "use strict";
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    var utilMapIncludes = require_util_map_includes();
    var startColMsg = "All mapping items must start at the same column";
    function resolveBlockMap({ composeNode, composeEmptyNode }, ctx, bm, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLMap.YAMLMap;
      const map = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      let offset = bm.offset;
      let commentEnd = null;
      for (const collItem of bm.items) {
        const { start, key, sep, value } = collItem;
        const keyProps = resolveProps.resolveProps(start, {
          indicator: "explicit-key-ind",
          next: key ?? sep?.[0],
          offset,
          onError,
          parentIndent: bm.indent,
          startOnNewline: true
        });
        const implicitKey = !keyProps.found;
        if (implicitKey) {
          if (key) {
            if (key.type === "block-seq")
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
            else if ("indent" in key && key.indent !== bm.indent)
              onError(offset, "BAD_INDENT", startColMsg);
          }
          if (!keyProps.anchor && !keyProps.tag && !sep) {
            commentEnd = keyProps.end;
            if (keyProps.comment) {
              if (map.comment)
                map.comment += "\n" + keyProps.comment;
              else
                map.comment = keyProps.comment;
            }
            continue;
          }
          if (keyProps.newlineAfterProp || utilContainsNewline.containsNewline(key)) {
            onError(key ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
          }
        } else if (keyProps.found?.indent !== bm.indent) {
          onError(offset, "BAD_INDENT", startColMsg);
        }
        ctx.atKey = true;
        const keyStart = keyProps.end;
        const keyNode = key ? composeNode(ctx, key, keyProps, onError) : composeEmptyNode(ctx, keyStart, start, null, keyProps, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bm.indent, key, onError);
        ctx.atKey = false;
        if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
          onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
        const valueProps = resolveProps.resolveProps(sep ?? [], {
          indicator: "map-value-ind",
          next: value,
          offset: keyNode.range[2],
          onError,
          parentIndent: bm.indent,
          startOnNewline: !key || key.type === "block-scalar"
        });
        offset = valueProps.end;
        if (valueProps.found) {
          if (implicitKey) {
            if (value?.type === "block-map" && !valueProps.hasNewline)
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
            if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024)
              onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : composeEmptyNode(ctx, offset, sep, null, valueProps, onError);
          if (ctx.schema.compat)
            utilFlowIndentCheck.flowIndentCheck(bm.indent, value, onError);
          offset = valueNode.range[2];
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        } else {
          if (implicitKey)
            onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
          if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        }
      }
      if (commentEnd && commentEnd < offset)
        onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
      map.range = [bm.offset, offset, commentEnd ?? offset];
      return map;
    }
    exports2.resolveBlockMap = resolveBlockMap;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-block-seq.js
var require_resolve_block_seq = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-block-seq.js"(exports2) {
    "use strict";
    var YAMLSeq = require_YAMLSeq();
    var resolveProps = require_resolve_props();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    function resolveBlockSeq({ composeNode, composeEmptyNode }, ctx, bs, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLSeq.YAMLSeq;
      const seq = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = bs.offset;
      let commentEnd = null;
      for (const { start, value } of bs.items) {
        const props = resolveProps.resolveProps(start, {
          indicator: "seq-item-ind",
          next: value,
          offset,
          onError,
          parentIndent: bs.indent,
          startOnNewline: true
        });
        if (!props.found) {
          if (props.anchor || props.tag || value) {
            if (value?.type === "block-seq")
              onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
            else
              onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
          } else {
            commentEnd = props.end;
            if (props.comment)
              seq.comment = props.comment;
            continue;
          }
        }
        const node = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bs.indent, value, onError);
        offset = node.range[2];
        seq.items.push(node);
      }
      seq.range = [bs.offset, offset, commentEnd ?? offset];
      return seq;
    }
    exports2.resolveBlockSeq = resolveBlockSeq;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-end.js
var require_resolve_end = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-end.js"(exports2) {
    "use strict";
    function resolveEnd(end, offset, reqSpace, onError) {
      let comment = "";
      if (end) {
        let hasSpace = false;
        let sep = "";
        for (const token of end) {
          const { source, type } = token;
          switch (type) {
            case "space":
              hasSpace = true;
              break;
            case "comment": {
              if (reqSpace && !hasSpace)
                onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
              const cb = source.substring(1) || " ";
              if (!comment)
                comment = cb;
              else
                comment += sep + cb;
              sep = "";
              break;
            }
            case "newline":
              if (comment)
                sep += source;
              hasSpace = true;
              break;
            default:
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
          }
          offset += source.length;
        }
      }
      return { comment, offset };
    }
    exports2.resolveEnd = resolveEnd;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-flow-collection.js
var require_resolve_flow_collection = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-flow-collection.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilMapIncludes = require_util_map_includes();
    var blockMsg = "Block collections are not allowed within flow collections";
    var isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
    function resolveFlowCollection({ composeNode, composeEmptyNode }, ctx, fc, onError, tag) {
      const isMap = fc.start.source === "{";
      const fcName = isMap ? "flow map" : "flow sequence";
      const NodeClass = tag?.nodeClass ?? (isMap ? YAMLMap.YAMLMap : YAMLSeq.YAMLSeq);
      const coll = new NodeClass(ctx.schema);
      coll.flow = true;
      const atRoot = ctx.atRoot;
      if (atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = fc.offset + fc.start.source.length;
      for (let i = 0; i < fc.items.length; ++i) {
        const collItem = fc.items[i];
        const { start, key, sep, value } = collItem;
        const props = resolveProps.resolveProps(start, {
          flow: fcName,
          indicator: "explicit-key-ind",
          next: key ?? sep?.[0],
          offset,
          onError,
          parentIndent: fc.indent,
          startOnNewline: false
        });
        if (!props.found) {
          if (!props.anchor && !props.tag && !sep && !value) {
            if (i === 0 && props.comma)
              onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
            else if (i < fc.items.length - 1)
              onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
            if (props.comment) {
              if (coll.comment)
                coll.comment += "\n" + props.comment;
              else
                coll.comment = props.comment;
            }
            offset = props.end;
            continue;
          }
          if (!isMap && ctx.options.strict && utilContainsNewline.containsNewline(key))
            onError(
              key,
              // checked by containsNewline()
              "MULTILINE_IMPLICIT_KEY",
              "Implicit keys of flow sequence pairs need to be on a single line"
            );
        }
        if (i === 0) {
          if (props.comma)
            onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
        } else {
          if (!props.comma)
            onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
          if (props.comment) {
            let prevItemComment = "";
            loop: for (const st of start) {
              switch (st.type) {
                case "comma":
                case "space":
                  break;
                case "comment":
                  prevItemComment = st.source.substring(1);
                  break loop;
                default:
                  break loop;
              }
            }
            if (prevItemComment) {
              let prev = coll.items[coll.items.length - 1];
              if (identity.isPair(prev))
                prev = prev.value ?? prev.key;
              if (prev.comment)
                prev.comment += "\n" + prevItemComment;
              else
                prev.comment = prevItemComment;
              props.comment = props.comment.substring(prevItemComment.length + 1);
            }
          }
        }
        if (!isMap && !sep && !props.found) {
          const valueNode = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, sep, null, props, onError);
          coll.items.push(valueNode);
          offset = valueNode.range[2];
          if (isBlock(value))
            onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
        } else {
          ctx.atKey = true;
          const keyStart = props.end;
          const keyNode = key ? composeNode(ctx, key, props, onError) : composeEmptyNode(ctx, keyStart, start, null, props, onError);
          if (isBlock(key))
            onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
          ctx.atKey = false;
          const valueProps = resolveProps.resolveProps(sep ?? [], {
            flow: fcName,
            indicator: "map-value-ind",
            next: value,
            offset: keyNode.range[2],
            onError,
            parentIndent: fc.indent,
            startOnNewline: false
          });
          if (valueProps.found) {
            if (!isMap && !props.found && ctx.options.strict) {
              if (sep)
                for (const st of sep) {
                  if (st === valueProps.found)
                    break;
                  if (st.type === "newline") {
                    onError(st, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                    break;
                  }
                }
              if (props.start < valueProps.found.offset - 1024)
                onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
            }
          } else if (value) {
            if ("source" in value && value.source?.[0] === ":")
              onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`);
            else
              onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode(ctx, valueProps.end, sep, null, valueProps, onError) : null;
          if (valueNode) {
            if (isBlock(value))
              onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
          } else if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          if (isMap) {
            const map = coll;
            if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
              onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
            map.items.push(pair);
          } else {
            const map = new YAMLMap.YAMLMap(ctx.schema);
            map.flow = true;
            map.items.push(pair);
            const endRange = (valueNode ?? keyNode).range;
            map.range = [keyNode.range[0], endRange[1], endRange[2]];
            coll.items.push(map);
          }
          offset = valueNode ? valueNode.range[2] : valueProps.end;
        }
      }
      const expectedEnd = isMap ? "}" : "]";
      const [ce, ...ee] = fc.end;
      let cePos = offset;
      if (ce?.source === expectedEnd)
        cePos = ce.offset + ce.source.length;
      else {
        const name = fcName[0].toUpperCase() + fcName.substring(1);
        const msg = atRoot ? `${name} must end with a ${expectedEnd}` : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
        onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg);
        if (ce && ce.source.length !== 1)
          ee.unshift(ce);
      }
      if (ee.length > 0) {
        const end = resolveEnd.resolveEnd(ee, cePos, ctx.options.strict, onError);
        if (end.comment) {
          if (coll.comment)
            coll.comment += "\n" + end.comment;
          else
            coll.comment = end.comment;
        }
        coll.range = [fc.offset, cePos, end.offset];
      } else {
        coll.range = [fc.offset, cePos, cePos];
      }
      return coll;
    }
    exports2.resolveFlowCollection = resolveFlowCollection;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/compose-collection.js
var require_compose_collection = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/compose-collection.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveBlockMap = require_resolve_block_map();
    var resolveBlockSeq = require_resolve_block_seq();
    var resolveFlowCollection = require_resolve_flow_collection();
    function resolveCollection(CN, ctx, token, onError, tagName, tag) {
      const coll = token.type === "block-map" ? resolveBlockMap.resolveBlockMap(CN, ctx, token, onError, tag) : token.type === "block-seq" ? resolveBlockSeq.resolveBlockSeq(CN, ctx, token, onError, tag) : resolveFlowCollection.resolveFlowCollection(CN, ctx, token, onError, tag);
      const Coll = coll.constructor;
      if (tagName === "!" || tagName === Coll.tagName) {
        coll.tag = Coll.tagName;
        return coll;
      }
      if (tagName)
        coll.tag = tagName;
      return coll;
    }
    function composeCollection(CN, ctx, token, props, onError) {
      const tagToken = props.tag;
      const tagName = !tagToken ? null : ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
      if (token.type === "block-seq") {
        const { anchor, newlineAfterProp: nl } = props;
        const lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
        if (lastProp && (!nl || nl.offset < lastProp.offset)) {
          const message = "Missing newline after block sequence props";
          onError(lastProp, "MISSING_CHAR", message);
        }
      }
      const expType = token.type === "block-map" ? "map" : token.type === "block-seq" ? "seq" : token.start.source === "{" ? "map" : "seq";
      if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.YAMLMap.tagName && expType === "map" || tagName === YAMLSeq.YAMLSeq.tagName && expType === "seq") {
        return resolveCollection(CN, ctx, token, onError, tagName);
      }
      let tag = ctx.schema.tags.find((t) => t.tag === tagName && t.collection === expType);
      if (!tag) {
        const kt = ctx.schema.knownTags[tagName];
        if (kt?.collection === expType) {
          ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
          tag = kt;
        } else {
          if (kt) {
            onError(tagToken, "BAD_COLLECTION_TYPE", `${kt.tag} used for ${expType} collection, but expects ${kt.collection ?? "scalar"}`, true);
          } else {
            onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, true);
          }
          return resolveCollection(CN, ctx, token, onError, tagName);
        }
      }
      const coll = resolveCollection(CN, ctx, token, onError, tagName, tag);
      const res = tag.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll;
      const node = identity.isNode(res) ? res : new Scalar.Scalar(res);
      node.range = coll.range;
      node.tag = tagName;
      if (tag?.format)
        node.format = tag.format;
      return node;
    }
    exports2.composeCollection = composeCollection;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-block-scalar.js
var require_resolve_block_scalar = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-block-scalar.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    function resolveBlockScalar(ctx, scalar, onError) {
      const start = scalar.offset;
      const header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
      if (!header)
        return { value: "", type: null, comment: "", range: [start, start, start] };
      const type = header.mode === ">" ? Scalar.Scalar.BLOCK_FOLDED : Scalar.Scalar.BLOCK_LITERAL;
      const lines = scalar.source ? splitLines(scalar.source) : [];
      let chompStart = lines.length;
      for (let i = lines.length - 1; i >= 0; --i) {
        const content = lines[i][1];
        if (content === "" || content === "\r")
          chompStart = i;
        else
          break;
      }
      if (chompStart === 0) {
        const value2 = header.chomp === "+" && lines.length > 0 ? "\n".repeat(Math.max(1, lines.length - 1)) : "";
        let end2 = start + header.length;
        if (scalar.source)
          end2 += scalar.source.length;
        return { value: value2, type, comment: header.comment, range: [start, end2, end2] };
      }
      let trimIndent = scalar.indent + header.indent;
      let offset = scalar.offset + header.length;
      let contentStart = 0;
      for (let i = 0; i < chompStart; ++i) {
        const [indent, content] = lines[i];
        if (content === "" || content === "\r") {
          if (header.indent === 0 && indent.length > trimIndent)
            trimIndent = indent.length;
        } else {
          if (indent.length < trimIndent) {
            const message = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
            onError(offset + indent.length, "MISSING_CHAR", message);
          }
          if (header.indent === 0)
            trimIndent = indent.length;
          contentStart = i;
          if (trimIndent === 0 && !ctx.atRoot) {
            const message = "Block scalar values in collections must be indented";
            onError(offset, "BAD_INDENT", message);
          }
          break;
        }
        offset += indent.length + content.length + 1;
      }
      for (let i = lines.length - 1; i >= chompStart; --i) {
        if (lines[i][0].length > trimIndent)
          chompStart = i + 1;
      }
      let value = "";
      let sep = "";
      let prevMoreIndented = false;
      for (let i = 0; i < contentStart; ++i)
        value += lines[i][0].slice(trimIndent) + "\n";
      for (let i = contentStart; i < chompStart; ++i) {
        let [indent, content] = lines[i];
        offset += indent.length + content.length + 1;
        const crlf = content[content.length - 1] === "\r";
        if (crlf)
          content = content.slice(0, -1);
        if (content && indent.length < trimIndent) {
          const src = header.indent ? "explicit indentation indicator" : "first line";
          const message = `Block scalar lines must not be less indented than their ${src}`;
          onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message);
          indent = "";
        }
        if (type === Scalar.Scalar.BLOCK_LITERAL) {
          value += sep + indent.slice(trimIndent) + content;
          sep = "\n";
        } else if (indent.length > trimIndent || content[0] === "	") {
          if (sep === " ")
            sep = "\n";
          else if (!prevMoreIndented && sep === "\n")
            sep = "\n\n";
          value += sep + indent.slice(trimIndent) + content;
          sep = "\n";
          prevMoreIndented = true;
        } else if (content === "") {
          if (sep === "\n")
            value += "\n";
          else
            sep = "\n";
        } else {
          value += sep + content;
          sep = " ";
          prevMoreIndented = false;
        }
      }
      switch (header.chomp) {
        case "-":
          break;
        case "+":
          for (let i = chompStart; i < lines.length; ++i)
            value += "\n" + lines[i][0].slice(trimIndent);
          if (value[value.length - 1] !== "\n")
            value += "\n";
          break;
        default:
          value += "\n";
      }
      const end = start + header.length + scalar.source.length;
      return { value, type, comment: header.comment, range: [start, end, end] };
    }
    function parseBlockScalarHeader({ offset, props }, strict, onError) {
      if (props[0].type !== "block-scalar-header") {
        onError(props[0], "IMPOSSIBLE", "Block scalar header not found");
        return null;
      }
      const { source } = props[0];
      const mode = source[0];
      let indent = 0;
      let chomp = "";
      let error = -1;
      for (let i = 1; i < source.length; ++i) {
        const ch = source[i];
        if (!chomp && (ch === "-" || ch === "+"))
          chomp = ch;
        else {
          const n = Number(ch);
          if (!indent && n)
            indent = n;
          else if (error === -1)
            error = offset + i;
        }
      }
      if (error !== -1)
        onError(error, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
      let hasSpace = false;
      let comment = "";
      let length = source.length;
      for (let i = 1; i < props.length; ++i) {
        const token = props[i];
        switch (token.type) {
          case "space":
            hasSpace = true;
          // fallthrough
          case "newline":
            length += token.source.length;
            break;
          case "comment":
            if (strict && !hasSpace) {
              const message = "Comments must be separated from other tokens by white space characters";
              onError(token, "MISSING_CHAR", message);
            }
            length += token.source.length;
            comment = token.source.substring(1);
            break;
          case "error":
            onError(token, "UNEXPECTED_TOKEN", token.message);
            length += token.source.length;
            break;
          /* istanbul ignore next should not happen */
          default: {
            const message = `Unexpected token in block scalar header: ${token.type}`;
            onError(token, "UNEXPECTED_TOKEN", message);
            const ts = token.source;
            if (ts && typeof ts === "string")
              length += ts.length;
          }
        }
      }
      return { mode, indent, chomp, comment, length };
    }
    function splitLines(source) {
      const split = source.split(/\n( *)/);
      const first = split[0];
      const m = first.match(/^( *)/);
      const line0 = m?.[1] ? [m[1], first.slice(m[1].length)] : ["", first];
      const lines = [line0];
      for (let i = 1; i < split.length; i += 2)
        lines.push([split[i], split[i + 1]]);
      return lines;
    }
    exports2.resolveBlockScalar = resolveBlockScalar;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-flow-scalar.js
var require_resolve_flow_scalar = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/resolve-flow-scalar.js"(exports2) {
    "use strict";
    var Scalar = require_Scalar();
    var resolveEnd = require_resolve_end();
    function resolveFlowScalar(scalar, strict, onError) {
      const { offset, type, source, end } = scalar;
      let _type;
      let value;
      const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
      switch (type) {
        case "scalar":
          _type = Scalar.Scalar.PLAIN;
          value = plainValue(source, _onError);
          break;
        case "single-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_SINGLE;
          value = singleQuotedValue(source, _onError);
          break;
        case "double-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_DOUBLE;
          value = doubleQuotedValue(source, _onError);
          break;
        /* istanbul ignore next should not happen */
        default:
          onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`);
          return {
            value: "",
            type: null,
            comment: "",
            range: [offset, offset + source.length, offset + source.length]
          };
      }
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, strict, onError);
      return {
        value,
        type: _type,
        comment: re.comment,
        range: [offset, valueEnd, re.offset]
      };
    }
    function plainValue(source, onError) {
      let badChar = "";
      switch (source[0]) {
        /* istanbul ignore next should not happen */
        case "	":
          badChar = "a tab character";
          break;
        case ",":
          badChar = "flow indicator character ,";
          break;
        case "%":
          badChar = "directive indicator character %";
          break;
        case "|":
        case ">": {
          badChar = `block scalar indicator ${source[0]}`;
          break;
        }
        case "@":
        case "`": {
          badChar = `reserved character ${source[0]}`;
          break;
        }
      }
      if (badChar)
        onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
      return unfoldLines(source);
    }
    function singleQuotedValue(source, onError) {
      if (source[source.length - 1] !== "'" || source.length === 1)
        onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
      return unfoldLines(source.slice(1, -1)).replace(/''/g, "'");
    }
    function unfoldLines(source) {
      const line = /(.*?)\r?\n/sy;
      let match = line.exec(source);
      if (!match)
        return source;
      let trimEnd, trimBoth;
      try {
        trimEnd = new RegExp("(?<![ 	])[ 	]+$");
        trimBoth = new RegExp("^[ 	]+|(?<![ 	])[ 	]+$", "g");
      } catch {
        trimEnd = /[ \t]+$/;
        trimBoth = /^[ \t]+|[ \t]+$/g;
      }
      let res = match[1].replace(trimEnd, "");
      let sep = " ";
      let pos = line.lastIndex;
      while (match = line.exec(source)) {
        const lm = match[1].replace(trimBoth, "");
        if (lm === "") {
          if (sep === "\n")
            res += sep;
          else
            sep = "\n";
        } else {
          res += sep + lm;
          sep = " ";
        }
        pos = line.lastIndex;
      }
      const last = /[ \t]*(.*)/sy;
      last.lastIndex = pos;
      match = last.exec(source);
      return res + sep + (match?.[1] ?? "");
    }
    function doubleQuotedValue(source, onError) {
      let res = "";
      for (let i = 1; i < source.length - 1; ++i) {
        const ch = source[i];
        if (ch === "\r" && source[i + 1] === "\n")
          continue;
        if (ch === "\n") {
          const { fold, offset } = foldNewline(source, i);
          res += fold;
          i = offset;
        } else if (ch === "\\") {
          let next = source[++i];
          const cc = escapeCodes[next];
          if (cc)
            res += cc;
          else if (next === "\n") {
            next = source[i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "\r" && source[i + 1] === "\n") {
            next = source[++i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "x" || next === "u" || next === "U") {
            const length = next === "x" ? 2 : next === "u" ? 4 : 8;
            res += parseCharCode(source, i + 1, length, onError);
            i += length;
          } else {
            const raw = source.substr(i - 1, 2);
            onError(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
            res += raw;
          }
        } else if (ch === " " || ch === "	") {
          const wsStart = i;
          let next = source[i + 1];
          while (next === " " || next === "	")
            next = source[++i + 1];
          if (next !== "\n" && !(next === "\r" && source[i + 2] === "\n"))
            res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
        } else {
          res += ch;
        }
      }
      if (source[source.length - 1] !== '"' || source.length === 1)
        onError(source.length, "MISSING_CHAR", 'Missing closing "quote');
      return res;
    }
    function foldNewline(source, offset) {
      let fold = "";
      let ch = source[offset + 1];
      while (ch === " " || ch === "	" || ch === "\n" || ch === "\r") {
        if (ch === "\r" && source[offset + 2] !== "\n")
          break;
        if (ch === "\n")
          fold += "\n";
        offset += 1;
        ch = source[offset + 1];
      }
      if (!fold)
        fold = " ";
      return { fold, offset };
    }
    var escapeCodes = {
      "0": "\0",
      // null character
      a: "\x07",
      // bell character
      b: "\b",
      // backspace
      e: "\x1B",
      // escape character
      f: "\f",
      // form feed
      n: "\n",
      // line feed
      r: "\r",
      // carriage return
      t: "	",
      // horizontal tab
      v: "\v",
      // vertical tab
      N: "\x85",
      // Unicode next line
      _: "\xA0",
      // Unicode non-breaking space
      L: "\u2028",
      // Unicode line separator
      P: "\u2029",
      // Unicode paragraph separator
      " ": " ",
      '"': '"',
      "/": "/",
      "\\": "\\",
      "	": "	"
    };
    function parseCharCode(source, offset, length, onError) {
      const cc = source.substr(offset, length);
      const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
      const code = ok ? parseInt(cc, 16) : NaN;
      try {
        return String.fromCodePoint(code);
      } catch {
        const raw = source.substr(offset - 2, length + 2);
        onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
        return raw;
      }
    }
    exports2.resolveFlowScalar = resolveFlowScalar;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/compose-scalar.js
var require_compose_scalar = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/compose-scalar.js"(exports2) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    function composeScalar(ctx, token, tagToken, onError) {
      const { value, type, comment, range } = token.type === "block-scalar" ? resolveBlockScalar.resolveBlockScalar(ctx, token, onError) : resolveFlowScalar.resolveFlowScalar(token, ctx.options.strict, onError);
      const tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
      let tag;
      if (ctx.options.stringKeys && ctx.atKey) {
        tag = ctx.schema[identity.SCALAR];
      } else if (tagName)
        tag = findScalarTagByName(ctx.schema, value, tagName, tagToken, onError);
      else if (token.type === "scalar")
        tag = findScalarTagByTest(ctx, value, token, onError);
      else
        tag = ctx.schema[identity.SCALAR];
      let scalar;
      try {
        const res = tag.resolve(value, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
        scalar = identity.isScalar(res) ? res : new Scalar.Scalar(res);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg);
        scalar = new Scalar.Scalar(value);
      }
      scalar.range = range;
      scalar.source = value;
      if (type)
        scalar.type = type;
      if (tagName)
        scalar.tag = tagName;
      if (tag.format)
        scalar.format = tag.format;
      if (comment)
        scalar.comment = comment;
      return scalar;
    }
    function findScalarTagByName(schema, value, tagName, tagToken, onError) {
      if (tagName === "!")
        return schema[identity.SCALAR];
      const matchWithTest = [];
      for (const tag of schema.tags) {
        if (!tag.collection && tag.tag === tagName) {
          if (tag.default && tag.test)
            matchWithTest.push(tag);
          else
            return tag;
        }
      }
      for (const tag of matchWithTest)
        if (tag.test?.test(value))
          return tag;
      const kt = schema.knownTags[tagName];
      if (kt && !kt.collection) {
        schema.tags.push(Object.assign({}, kt, { default: false, test: void 0 }));
        return kt;
      }
      onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str");
      return schema[identity.SCALAR];
    }
    function findScalarTagByTest({ atKey, directives, schema }, value, token, onError) {
      const tag = schema.tags.find((tag2) => (tag2.default === true || atKey && tag2.default === "key") && tag2.test?.test(value)) || schema[identity.SCALAR];
      if (schema.compat) {
        const compat = schema.compat.find((tag2) => tag2.default && tag2.test?.test(value)) ?? schema[identity.SCALAR];
        if (tag.tag !== compat.tag) {
          const ts = directives.tagString(tag.tag);
          const cs = directives.tagString(compat.tag);
          const msg = `Value may be parsed as either ${ts} or ${cs}`;
          onError(token, "TAG_RESOLVE_FAILED", msg, true);
        }
      }
      return tag;
    }
    exports2.composeScalar = composeScalar;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/util-empty-scalar-position.js
var require_util_empty_scalar_position = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/util-empty-scalar-position.js"(exports2) {
    "use strict";
    function emptyScalarPosition(offset, before, pos) {
      if (before) {
        pos ?? (pos = before.length);
        for (let i = pos - 1; i >= 0; --i) {
          let st = before[i];
          switch (st.type) {
            case "space":
            case "comment":
            case "newline":
              offset -= st.source.length;
              continue;
          }
          st = before[++i];
          while (st?.type === "space") {
            offset += st.source.length;
            st = before[++i];
          }
          break;
        }
      }
      return offset;
    }
    exports2.emptyScalarPosition = emptyScalarPosition;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/compose-node.js
var require_compose_node = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/compose-node.js"(exports2) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var composeCollection = require_compose_collection();
    var composeScalar = require_compose_scalar();
    var resolveEnd = require_resolve_end();
    var utilEmptyScalarPosition = require_util_empty_scalar_position();
    var CN = { composeNode, composeEmptyNode };
    function composeNode(ctx, token, props, onError) {
      const atKey = ctx.atKey;
      const { spaceBefore, comment, anchor, tag } = props;
      let node;
      let isSrcToken = true;
      switch (token.type) {
        case "alias":
          node = composeAlias(ctx, token, onError);
          if (anchor || tag)
            onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
          break;
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "block-scalar":
          node = composeScalar.composeScalar(ctx, token, tag, onError);
          if (anchor)
            node.anchor = anchor.source.substring(1);
          break;
        case "block-map":
        case "block-seq":
        case "flow-collection":
          try {
            node = composeCollection.composeCollection(CN, ctx, token, props, onError);
            if (anchor)
              node.anchor = anchor.source.substring(1);
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            onError(token, "RESOURCE_EXHAUSTION", message);
          }
          break;
        default: {
          const message = token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`;
          onError(token, "UNEXPECTED_TOKEN", message);
          isSrcToken = false;
        }
      }
      node ?? (node = composeEmptyNode(ctx, token.offset, void 0, null, props, onError));
      if (anchor && node.anchor === "")
        onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      if (atKey && ctx.options.stringKeys && (!identity.isScalar(node) || typeof node.value !== "string" || node.tag && node.tag !== "tag:yaml.org,2002:str")) {
        const msg = "With stringKeys, all keys must be strings";
        onError(tag ?? token, "NON_STRING_KEY", msg);
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        if (token.type === "scalar" && token.source === "")
          node.comment = comment;
        else
          node.commentBefore = comment;
      }
      if (ctx.options.keepSourceTokens && isSrcToken)
        node.srcToken = token;
      return node;
    }
    function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
      const token = {
        type: "scalar",
        offset: utilEmptyScalarPosition.emptyScalarPosition(offset, before, pos),
        indent: -1,
        source: ""
      };
      const node = composeScalar.composeScalar(ctx, token, tag, onError);
      if (anchor) {
        node.anchor = anchor.source.substring(1);
        if (node.anchor === "")
          onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        node.comment = comment;
        node.range[2] = end;
      }
      return node;
    }
    function composeAlias({ options }, { offset, source, end }, onError) {
      const alias = new Alias.Alias(source.substring(1));
      if (alias.source === "")
        onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
      if (alias.source.endsWith(":"))
        onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", true);
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, options.strict, onError);
      alias.range = [offset, valueEnd, re.offset];
      if (re.comment)
        alias.comment = re.comment;
      return alias;
    }
    exports2.composeEmptyNode = composeEmptyNode;
    exports2.composeNode = composeNode;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/compose-doc.js
var require_compose_doc = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/compose-doc.js"(exports2) {
    "use strict";
    var Document = require_Document();
    var composeNode = require_compose_node();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    function composeDoc(options, directives, { offset, start, value, end }, onError) {
      const opts = Object.assign({ _directives: directives }, options);
      const doc = new Document.Document(void 0, opts);
      const ctx = {
        atKey: false,
        atRoot: true,
        directives: doc.directives,
        options: doc.options,
        schema: doc.schema
      };
      const props = resolveProps.resolveProps(start, {
        indicator: "doc-start",
        next: value ?? end?.[0],
        offset,
        onError,
        parentIndent: 0,
        startOnNewline: true
      });
      if (props.found) {
        doc.directives.docStart = true;
        if (value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline)
          onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
      }
      doc.contents = value ? composeNode.composeNode(ctx, value, props, onError) : composeNode.composeEmptyNode(ctx, props.end, start, null, props, onError);
      const contentEnd = doc.contents.range[2];
      const re = resolveEnd.resolveEnd(end, contentEnd, false, onError);
      if (re.comment)
        doc.comment = re.comment;
      doc.range = [offset, contentEnd, re.offset];
      return doc;
    }
    exports2.composeDoc = composeDoc;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/composer.js
var require_composer = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/compose/composer.js"(exports2) {
    "use strict";
    var node_process = require("process");
    var directives = require_directives();
    var Document = require_Document();
    var errors = require_errors();
    var identity = require_identity();
    var composeDoc = require_compose_doc();
    var resolveEnd = require_resolve_end();
    function getErrorPos(src) {
      if (typeof src === "number")
        return [src, src + 1];
      if (Array.isArray(src))
        return src.length === 2 ? src : [src[0], src[1]];
      const { offset, source } = src;
      return [offset, offset + (typeof source === "string" ? source.length : 1)];
    }
    function parsePrelude(prelude) {
      let comment = "";
      let atComment = false;
      let afterEmptyLine = false;
      for (let i = 0; i < prelude.length; ++i) {
        const source = prelude[i];
        switch (source[0]) {
          case "#":
            comment += (comment === "" ? "" : afterEmptyLine ? "\n\n" : "\n") + (source.substring(1) || " ");
            atComment = true;
            afterEmptyLine = false;
            break;
          case "%":
            if (prelude[i + 1]?.[0] !== "#")
              i += 1;
            atComment = false;
            break;
          default:
            if (!atComment)
              afterEmptyLine = true;
            atComment = false;
        }
      }
      return { comment, afterEmptyLine };
    }
    var Composer = class {
      constructor(options = {}) {
        this.doc = null;
        this.atDirectives = false;
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
        this.onError = (source, code, message, warning) => {
          const pos = getErrorPos(source);
          if (warning)
            this.warnings.push(new errors.YAMLWarning(pos, code, message));
          else
            this.errors.push(new errors.YAMLParseError(pos, code, message));
        };
        this.directives = new directives.Directives({ version: options.version || "1.2" });
        this.options = options;
      }
      decorate(doc, afterDoc) {
        const { comment, afterEmptyLine } = parsePrelude(this.prelude);
        if (comment) {
          const dc = doc.contents;
          if (afterDoc) {
            doc.comment = doc.comment ? `${doc.comment}
${comment}` : comment;
          } else if (afterEmptyLine || doc.directives.docStart || !dc) {
            doc.commentBefore = comment;
          } else if (identity.isCollection(dc) && !dc.flow && dc.items.length > 0) {
            let it = dc.items[0];
            if (identity.isPair(it))
              it = it.key;
            const cb = it.commentBefore;
            it.commentBefore = cb ? `${comment}
${cb}` : comment;
          } else {
            const cb = dc.commentBefore;
            dc.commentBefore = cb ? `${comment}
${cb}` : comment;
          }
        }
        if (afterDoc) {
          for (let i = 0; i < this.errors.length; ++i)
            doc.errors.push(this.errors[i]);
          for (let i = 0; i < this.warnings.length; ++i)
            doc.warnings.push(this.warnings[i]);
        } else {
          doc.errors = this.errors;
          doc.warnings = this.warnings;
        }
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
      }
      /**
       * Current stream status information.
       *
       * Mostly useful at the end of input for an empty stream.
       */
      streamInfo() {
        return {
          comment: parsePrelude(this.prelude).comment,
          directives: this.directives,
          errors: this.errors,
          warnings: this.warnings
        };
      }
      /**
       * Compose tokens into documents.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *compose(tokens, forceDoc = false, endOffset = -1) {
        for (const token of tokens)
          yield* this.next(token);
        yield* this.end(forceDoc, endOffset);
      }
      /** Advance the composer by one CST token. */
      *next(token) {
        if (node_process.env.LOG_STREAM)
          console.dir(token, { depth: null });
        switch (token.type) {
          case "directive":
            this.directives.add(token.source, (offset, message, warning) => {
              const pos = getErrorPos(token);
              pos[0] += offset;
              this.onError(pos, "BAD_DIRECTIVE", message, warning);
            });
            this.prelude.push(token.source);
            this.atDirectives = true;
            break;
          case "document": {
            const doc = composeDoc.composeDoc(this.options, this.directives, token, this.onError);
            if (this.atDirectives && !doc.directives.docStart)
              this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
            this.decorate(doc, false);
            if (this.doc)
              yield this.doc;
            this.doc = doc;
            this.atDirectives = false;
            break;
          }
          case "byte-order-mark":
          case "space":
            break;
          case "comment":
          case "newline":
            this.prelude.push(token.source);
            break;
          case "error": {
            const msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message;
            const error = new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
            if (this.atDirectives || !this.doc)
              this.errors.push(error);
            else
              this.doc.errors.push(error);
            break;
          }
          case "doc-end": {
            if (!this.doc) {
              const msg = "Unexpected doc-end without preceding document";
              this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg));
              break;
            }
            this.doc.directives.docEnd = true;
            const end = resolveEnd.resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
            this.decorate(this.doc, true);
            if (end.comment) {
              const dc = this.doc.comment;
              this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
            }
            this.doc.range[2] = end.offset;
            break;
          }
          default:
            this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
        }
      }
      /**
       * Call at end of input to yield any remaining document.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *end(forceDoc = false, endOffset = -1) {
        if (this.doc) {
          this.decorate(this.doc, true);
          yield this.doc;
          this.doc = null;
        } else if (forceDoc) {
          const opts = Object.assign({ _directives: this.directives }, this.options);
          const doc = new Document.Document(void 0, opts);
          if (this.atDirectives)
            this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
          doc.range = [0, endOffset, endOffset];
          this.decorate(doc, false);
          yield doc;
        }
      }
    };
    exports2.Composer = Composer;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/cst-scalar.js
var require_cst_scalar = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/cst-scalar.js"(exports2) {
    "use strict";
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    var errors = require_errors();
    var stringifyString = require_stringifyString();
    function resolveAsScalar(token, strict = true, onError) {
      if (token) {
        const _onError = (pos, code, message) => {
          const offset = typeof pos === "number" ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
          if (onError)
            onError(offset, code, message);
          else
            throw new errors.YAMLParseError([offset, offset + 1], code, message);
        };
        switch (token.type) {
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return resolveFlowScalar.resolveFlowScalar(token, strict, _onError);
          case "block-scalar":
            return resolveBlockScalar.resolveBlockScalar({ options: { strict } }, token, _onError);
        }
      }
      return null;
    }
    function createScalarToken(value, context) {
      const { implicitKey = false, indent, inFlow = false, offset = -1, type = "PLAIN" } = context;
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey,
        indent: indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      const end = context.end ?? [
        { type: "newline", offset: -1, indent, source: "\n" }
      ];
      switch (source[0]) {
        case "|":
        case ">": {
          const he = source.indexOf("\n");
          const head = source.substring(0, he);
          const body = source.substring(he + 1) + "\n";
          const props = [
            { type: "block-scalar-header", offset, indent, source: head }
          ];
          if (!addEndtoBlockProps(props, end))
            props.push({ type: "newline", offset: -1, indent, source: "\n" });
          return { type: "block-scalar", offset, indent, props, source: body };
        }
        case '"':
          return { type: "double-quoted-scalar", offset, indent, source, end };
        case "'":
          return { type: "single-quoted-scalar", offset, indent, source, end };
        default:
          return { type: "scalar", offset, indent, source, end };
      }
    }
    function setScalarValue(token, value, context = {}) {
      let { afterKey = false, implicitKey = false, inFlow = false, type } = context;
      let indent = "indent" in token ? token.indent : null;
      if (afterKey && typeof indent === "number")
        indent += 2;
      if (!type)
        switch (token.type) {
          case "single-quoted-scalar":
            type = "QUOTE_SINGLE";
            break;
          case "double-quoted-scalar":
            type = "QUOTE_DOUBLE";
            break;
          case "block-scalar": {
            const header = token.props[0];
            if (header.type !== "block-scalar-header")
              throw new Error("Invalid block scalar header");
            type = header.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
            break;
          }
          default:
            type = "PLAIN";
        }
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey: implicitKey || indent === null,
        indent: indent !== null && indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      switch (source[0]) {
        case "|":
        case ">":
          setBlockScalarValue(token, source);
          break;
        case '"':
          setFlowScalarValue(token, source, "double-quoted-scalar");
          break;
        case "'":
          setFlowScalarValue(token, source, "single-quoted-scalar");
          break;
        default:
          setFlowScalarValue(token, source, "scalar");
      }
    }
    function setBlockScalarValue(token, source) {
      const he = source.indexOf("\n");
      const head = source.substring(0, he);
      const body = source.substring(he + 1) + "\n";
      if (token.type === "block-scalar") {
        const header = token.props[0];
        if (header.type !== "block-scalar-header")
          throw new Error("Invalid block scalar header");
        header.source = head;
        token.source = body;
      } else {
        const { offset } = token;
        const indent = "indent" in token ? token.indent : -1;
        const props = [
          { type: "block-scalar-header", offset, indent, source: head }
        ];
        if (!addEndtoBlockProps(props, "end" in token ? token.end : void 0))
          props.push({ type: "newline", offset: -1, indent, source: "\n" });
        for (const key of Object.keys(token))
          if (key !== "type" && key !== "offset")
            delete token[key];
        Object.assign(token, { type: "block-scalar", indent, props, source: body });
      }
    }
    function addEndtoBlockProps(props, end) {
      if (end)
        for (const st of end)
          switch (st.type) {
            case "space":
            case "comment":
              props.push(st);
              break;
            case "newline":
              props.push(st);
              return true;
          }
      return false;
    }
    function setFlowScalarValue(token, source, type) {
      switch (token.type) {
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          token.type = type;
          token.source = source;
          break;
        case "block-scalar": {
          const end = token.props.slice(1);
          let oa = source.length;
          if (token.props[0].type === "block-scalar-header")
            oa -= token.props[0].source.length;
          for (const tok of end)
            tok.offset += oa;
          delete token.props;
          Object.assign(token, { type, source, end });
          break;
        }
        case "block-map":
        case "block-seq": {
          const offset = token.offset + source.length;
          const nl = { type: "newline", offset, indent: token.indent, source: "\n" };
          delete token.items;
          Object.assign(token, { type, source, end: [nl] });
          break;
        }
        default: {
          const indent = "indent" in token ? token.indent : -1;
          const end = "end" in token && Array.isArray(token.end) ? token.end.filter((st) => st.type === "space" || st.type === "comment" || st.type === "newline") : [];
          for (const key of Object.keys(token))
            if (key !== "type" && key !== "offset")
              delete token[key];
          Object.assign(token, { type, indent, source, end });
        }
      }
    }
    exports2.createScalarToken = createScalarToken;
    exports2.resolveAsScalar = resolveAsScalar;
    exports2.setScalarValue = setScalarValue;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/cst-stringify.js
var require_cst_stringify = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/cst-stringify.js"(exports2) {
    "use strict";
    var stringify = (cst) => "type" in cst ? stringifyToken(cst) : stringifyItem(cst);
    function stringifyToken(token) {
      switch (token.type) {
        case "block-scalar": {
          let res = "";
          for (const tok of token.props)
            res += stringifyToken(tok);
          return res + token.source;
        }
        case "block-map":
        case "block-seq": {
          let res = "";
          for (const item of token.items)
            res += stringifyItem(item);
          return res;
        }
        case "flow-collection": {
          let res = token.start.source;
          for (const item of token.items)
            res += stringifyItem(item);
          for (const st of token.end)
            res += st.source;
          return res;
        }
        case "document": {
          let res = stringifyItem(token);
          if (token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
        default: {
          let res = token.source;
          if ("end" in token && token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
      }
    }
    function stringifyItem({ start, key, sep, value }) {
      let res = "";
      for (const st of start)
        res += st.source;
      if (key)
        res += stringifyToken(key);
      if (sep)
        for (const st of sep)
          res += st.source;
      if (value)
        res += stringifyToken(value);
      return res;
    }
    exports2.stringify = stringify;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/cst-visit.js
var require_cst_visit = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/cst-visit.js"(exports2) {
    "use strict";
    var BREAK = /* @__PURE__ */ Symbol("break visit");
    var SKIP = /* @__PURE__ */ Symbol("skip children");
    var REMOVE = /* @__PURE__ */ Symbol("remove item");
    function visit(cst, visitor) {
      if ("type" in cst && cst.type === "document")
        cst = { start: cst.start, value: cst.value };
      _visit(Object.freeze([]), cst, visitor);
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    visit.itemAtPath = (cst, path2) => {
      let item = cst;
      for (const [field, index] of path2) {
        const tok = item?.[field];
        if (tok && "items" in tok) {
          item = tok.items[index];
        } else
          return void 0;
      }
      return item;
    };
    visit.parentCollection = (cst, path2) => {
      const parent = visit.itemAtPath(cst, path2.slice(0, -1));
      const field = path2[path2.length - 1][0];
      const coll = parent?.[field];
      if (coll && "items" in coll)
        return coll;
      throw new Error("Parent collection not found");
    };
    function _visit(path2, item, visitor) {
      let ctrl = visitor(item, path2);
      if (typeof ctrl === "symbol")
        return ctrl;
      for (const field of ["key", "value"]) {
        const token = item[field];
        if (token && "items" in token) {
          for (let i = 0; i < token.items.length; ++i) {
            const ci = _visit(Object.freeze(path2.concat([[field, i]])), token.items[i], visitor);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              token.items.splice(i, 1);
              i -= 1;
            }
          }
          if (typeof ctrl === "function" && field === "key")
            ctrl = ctrl(item, path2);
        }
      }
      return typeof ctrl === "function" ? ctrl(item, path2) : ctrl;
    }
    exports2.visit = visit;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/cst.js
var require_cst = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/cst.js"(exports2) {
    "use strict";
    var cstScalar = require_cst_scalar();
    var cstStringify = require_cst_stringify();
    var cstVisit = require_cst_visit();
    var BOM = "\uFEFF";
    var DOCUMENT = "";
    var FLOW_END = "";
    var SCALAR = "";
    var isCollection = (token) => !!token && "items" in token;
    var isScalar = (token) => !!token && (token.type === "scalar" || token.type === "single-quoted-scalar" || token.type === "double-quoted-scalar" || token.type === "block-scalar");
    function prettyToken(token) {
      switch (token) {
        case BOM:
          return "<BOM>";
        case DOCUMENT:
          return "<DOC>";
        case FLOW_END:
          return "<FLOW_END>";
        case SCALAR:
          return "<SCALAR>";
        default:
          return JSON.stringify(token);
      }
    }
    function tokenType(source) {
      switch (source) {
        case BOM:
          return "byte-order-mark";
        case DOCUMENT:
          return "doc-mode";
        case FLOW_END:
          return "flow-error-end";
        case SCALAR:
          return "scalar";
        case "---":
          return "doc-start";
        case "...":
          return "doc-end";
        case "":
        case "\n":
        case "\r\n":
          return "newline";
        case "-":
          return "seq-item-ind";
        case "?":
          return "explicit-key-ind";
        case ":":
          return "map-value-ind";
        case "{":
          return "flow-map-start";
        case "}":
          return "flow-map-end";
        case "[":
          return "flow-seq-start";
        case "]":
          return "flow-seq-end";
        case ",":
          return "comma";
      }
      switch (source[0]) {
        case " ":
        case "	":
          return "space";
        case "#":
          return "comment";
        case "%":
          return "directive-line";
        case "*":
          return "alias";
        case "&":
          return "anchor";
        case "!":
          return "tag";
        case "'":
          return "single-quoted-scalar";
        case '"':
          return "double-quoted-scalar";
        case "|":
        case ">":
          return "block-scalar-header";
      }
      return null;
    }
    exports2.createScalarToken = cstScalar.createScalarToken;
    exports2.resolveAsScalar = cstScalar.resolveAsScalar;
    exports2.setScalarValue = cstScalar.setScalarValue;
    exports2.stringify = cstStringify.stringify;
    exports2.visit = cstVisit.visit;
    exports2.BOM = BOM;
    exports2.DOCUMENT = DOCUMENT;
    exports2.FLOW_END = FLOW_END;
    exports2.SCALAR = SCALAR;
    exports2.isCollection = isCollection;
    exports2.isScalar = isScalar;
    exports2.prettyToken = prettyToken;
    exports2.tokenType = tokenType;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/lexer.js
var require_lexer = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/lexer.js"(exports2) {
    "use strict";
    var cst = require_cst();
    function isEmpty(ch) {
      switch (ch) {
        case void 0:
        case " ":
        case "\n":
        case "\r":
        case "	":
          return true;
        default:
          return false;
      }
    }
    var hexDigits = new Set("0123456789ABCDEFabcdef");
    var tagChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()");
    var flowIndicatorChars = new Set(",[]{}");
    var invalidAnchorChars = new Set(" ,[]{}\n\r	");
    var isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch);
    var Lexer = class {
      constructor() {
        this.atEnd = false;
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        this.buffer = "";
        this.flowKey = false;
        this.flowLevel = 0;
        this.indentNext = 0;
        this.indentValue = 0;
        this.lineEndPos = null;
        this.next = null;
        this.pos = 0;
      }
      /**
       * Generate YAML tokens from the `source` string. If `incomplete`,
       * a part of the last line may be left as a buffer for the next call.
       *
       * @returns A generator of lexical tokens
       */
      *lex(source, incomplete = false) {
        if (source) {
          if (typeof source !== "string")
            throw TypeError("source is not a string");
          this.buffer = this.buffer ? this.buffer + source : source;
          this.lineEndPos = null;
        }
        this.atEnd = !incomplete;
        let next = this.next ?? "stream";
        while (next && (incomplete || this.hasChars(1)))
          next = yield* this.parseNext(next);
      }
      atLineEnd() {
        let i = this.pos;
        let ch = this.buffer[i];
        while (ch === " " || ch === "	")
          ch = this.buffer[++i];
        if (!ch || ch === "#" || ch === "\n")
          return true;
        if (ch === "\r")
          return this.buffer[i + 1] === "\n";
        return false;
      }
      charAt(n) {
        return this.buffer[this.pos + n];
      }
      continueScalar(offset) {
        let ch = this.buffer[offset];
        if (this.indentNext > 0) {
          let indent = 0;
          while (ch === " ")
            ch = this.buffer[++indent + offset];
          if (ch === "\r") {
            const next = this.buffer[indent + offset + 1];
            if (next === "\n" || !next && !this.atEnd)
              return offset + indent + 1;
          }
          return ch === "\n" || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
        }
        if (ch === "-" || ch === ".") {
          const dt = this.buffer.substr(offset, 3);
          if ((dt === "---" || dt === "...") && isEmpty(this.buffer[offset + 3]))
            return -1;
        }
        return offset;
      }
      getLine() {
        let end = this.lineEndPos;
        if (typeof end !== "number" || end !== -1 && end < this.pos) {
          end = this.buffer.indexOf("\n", this.pos);
          this.lineEndPos = end;
        }
        if (end === -1)
          return this.atEnd ? this.buffer.substring(this.pos) : null;
        if (this.buffer[end - 1] === "\r")
          end -= 1;
        return this.buffer.substring(this.pos, end);
      }
      hasChars(n) {
        return this.pos + n <= this.buffer.length;
      }
      setNext(state) {
        this.buffer = this.buffer.substring(this.pos);
        this.pos = 0;
        this.lineEndPos = null;
        this.next = state;
        return null;
      }
      peek(n) {
        return this.buffer.substr(this.pos, n);
      }
      *parseNext(next) {
        switch (next) {
          case "stream":
            return yield* this.parseStream();
          case "line-start":
            return yield* this.parseLineStart();
          case "block-start":
            return yield* this.parseBlockStart();
          case "doc":
            return yield* this.parseDocument();
          case "flow":
            return yield* this.parseFlowCollection();
          case "quoted-scalar":
            return yield* this.parseQuotedScalar();
          case "block-scalar":
            return yield* this.parseBlockScalar();
          case "plain-scalar":
            return yield* this.parsePlainScalar();
        }
      }
      *parseStream() {
        let line = this.getLine();
        if (line === null)
          return this.setNext("stream");
        if (line[0] === cst.BOM) {
          yield* this.pushCount(1);
          line = line.substring(1);
        }
        if (line[0] === "%") {
          let dirEnd = line.length;
          let cs = line.indexOf("#");
          while (cs !== -1) {
            const ch = line[cs - 1];
            if (ch === " " || ch === "	") {
              dirEnd = cs - 1;
              break;
            } else {
              cs = line.indexOf("#", cs + 1);
            }
          }
          while (true) {
            const ch = line[dirEnd - 1];
            if (ch === " " || ch === "	")
              dirEnd -= 1;
            else
              break;
          }
          const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
          yield* this.pushCount(line.length - n);
          this.pushNewline();
          return "stream";
        }
        if (this.atLineEnd()) {
          const sp = yield* this.pushSpaces(true);
          yield* this.pushCount(line.length - sp);
          yield* this.pushNewline();
          return "stream";
        }
        yield cst.DOCUMENT;
        return yield* this.parseLineStart();
      }
      *parseLineStart() {
        const ch = this.charAt(0);
        if (!ch && !this.atEnd)
          return this.setNext("line-start");
        if (ch === "-" || ch === ".") {
          if (!this.atEnd && !this.hasChars(4))
            return this.setNext("line-start");
          const s = this.peek(3);
          if ((s === "---" || s === "...") && isEmpty(this.charAt(3))) {
            yield* this.pushCount(3);
            this.indentValue = 0;
            this.indentNext = 0;
            return s === "---" ? "doc" : "stream";
          }
        }
        this.indentValue = yield* this.pushSpaces(false);
        if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
          this.indentNext = this.indentValue;
        return yield* this.parseBlockStart();
      }
      *parseBlockStart() {
        const [ch0, ch1] = this.peek(2);
        if (!ch1 && !this.atEnd)
          return this.setNext("block-start");
        if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
          const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
          this.indentNext = this.indentValue + 1;
          this.indentValue += n;
          return "block-start";
        }
        return "doc";
      }
      *parseDocument() {
        yield* this.pushSpaces(true);
        const line = this.getLine();
        if (line === null)
          return this.setNext("doc");
        let n = yield* this.pushIndicators();
        switch (line[n]) {
          case "#":
            yield* this.pushCount(line.length - n);
          // fallthrough
          case void 0:
            yield* this.pushNewline();
            return yield* this.parseLineStart();
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel = 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            return "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "doc";
          case '"':
          case "'":
            return yield* this.parseQuotedScalar();
          case "|":
          case ">":
            n += yield* this.parseBlockScalarHeader();
            n += yield* this.pushSpaces(true);
            yield* this.pushCount(line.length - n);
            yield* this.pushNewline();
            return yield* this.parseBlockScalar();
          default:
            return yield* this.parsePlainScalar();
        }
      }
      *parseFlowCollection() {
        let nl, sp;
        let indent = -1;
        do {
          nl = yield* this.pushNewline();
          if (nl > 0) {
            sp = yield* this.pushSpaces(false);
            this.indentValue = indent = sp;
          } else {
            sp = 0;
          }
          sp += yield* this.pushSpaces(true);
        } while (nl + sp > 0);
        const line = this.getLine();
        if (line === null)
          return this.setNext("flow");
        if (indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
          const atFlowEndMarker = indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}");
          if (!atFlowEndMarker) {
            this.flowLevel = 0;
            yield cst.FLOW_END;
            return yield* this.parseLineStart();
          }
        }
        let n = 0;
        while (line[n] === ",") {
          n += yield* this.pushCount(1);
          n += yield* this.pushSpaces(true);
          this.flowKey = false;
        }
        n += yield* this.pushIndicators();
        switch (line[n]) {
          case void 0:
            return "flow";
          case "#":
            yield* this.pushCount(line.length - n);
            return "flow";
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel += 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            this.flowKey = true;
            this.flowLevel -= 1;
            return this.flowLevel ? "flow" : "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "flow";
          case '"':
          case "'":
            this.flowKey = true;
            return yield* this.parseQuotedScalar();
          case ":": {
            const next = this.charAt(1);
            if (this.flowKey || isEmpty(next) || next === ",") {
              this.flowKey = false;
              yield* this.pushCount(1);
              yield* this.pushSpaces(true);
              return "flow";
            }
          }
          // fallthrough
          default:
            this.flowKey = false;
            return yield* this.parsePlainScalar();
        }
      }
      *parseQuotedScalar() {
        const quote = this.charAt(0);
        let end = this.buffer.indexOf(quote, this.pos + 1);
        if (quote === "'") {
          while (end !== -1 && this.buffer[end + 1] === "'")
            end = this.buffer.indexOf("'", end + 2);
        } else {
          while (end !== -1) {
            let n = 0;
            while (this.buffer[end - 1 - n] === "\\")
              n += 1;
            if (n % 2 === 0)
              break;
            end = this.buffer.indexOf('"', end + 1);
          }
        }
        const qb = this.buffer.substring(0, end);
        let nl = qb.indexOf("\n", this.pos);
        if (nl !== -1) {
          while (nl !== -1) {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = qb.indexOf("\n", cs);
          }
          if (nl !== -1) {
            end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
          }
        }
        if (end === -1) {
          if (!this.atEnd)
            return this.setNext("quoted-scalar");
          end = this.buffer.length;
        }
        yield* this.pushToIndex(end + 1, false);
        return this.flowLevel ? "flow" : "doc";
      }
      *parseBlockScalarHeader() {
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        let i = this.pos;
        while (true) {
          const ch = this.buffer[++i];
          if (ch === "+")
            this.blockScalarKeep = true;
          else if (ch > "0" && ch <= "9")
            this.blockScalarIndent = Number(ch) - 1;
          else if (ch !== "-")
            break;
        }
        return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
      }
      *parseBlockScalar() {
        let nl = this.pos - 1;
        let indent = 0;
        let ch;
        loop: for (let i2 = this.pos; ch = this.buffer[i2]; ++i2) {
          switch (ch) {
            case " ":
              indent += 1;
              break;
            case "\n":
              nl = i2;
              indent = 0;
              break;
            case "\r": {
              const next = this.buffer[i2 + 1];
              if (!next && !this.atEnd)
                return this.setNext("block-scalar");
              if (next === "\n")
                break;
            }
            // fallthrough
            default:
              break loop;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("block-scalar");
        if (indent >= this.indentNext) {
          if (this.blockScalarIndent === -1)
            this.indentNext = indent;
          else {
            this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
          }
          do {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = this.buffer.indexOf("\n", cs);
          } while (nl !== -1);
          if (nl === -1) {
            if (!this.atEnd)
              return this.setNext("block-scalar");
            nl = this.buffer.length;
          }
        }
        let i = nl + 1;
        ch = this.buffer[i];
        while (ch === " ")
          ch = this.buffer[++i];
        if (ch === "	") {
          while (ch === "	" || ch === " " || ch === "\r" || ch === "\n")
            ch = this.buffer[++i];
          nl = i - 1;
        } else if (!this.blockScalarKeep) {
          do {
            let i2 = nl - 1;
            let ch2 = this.buffer[i2];
            if (ch2 === "\r")
              ch2 = this.buffer[--i2];
            const lastChar = i2;
            while (ch2 === " ")
              ch2 = this.buffer[--i2];
            if (ch2 === "\n" && i2 >= this.pos && i2 + 1 + indent > lastChar)
              nl = i2;
            else
              break;
          } while (true);
        }
        yield cst.SCALAR;
        yield* this.pushToIndex(nl + 1, true);
        return yield* this.parseLineStart();
      }
      *parsePlainScalar() {
        const inFlow = this.flowLevel > 0;
        let end = this.pos - 1;
        let i = this.pos - 1;
        let ch;
        while (ch = this.buffer[++i]) {
          if (ch === ":") {
            const next = this.buffer[i + 1];
            if (isEmpty(next) || inFlow && flowIndicatorChars.has(next))
              break;
            end = i;
          } else if (isEmpty(ch)) {
            let next = this.buffer[i + 1];
            if (ch === "\r") {
              if (next === "\n") {
                i += 1;
                ch = "\n";
                next = this.buffer[i + 1];
              } else
                end = i;
            }
            if (next === "#" || inFlow && flowIndicatorChars.has(next))
              break;
            if (ch === "\n") {
              const cs = this.continueScalar(i + 1);
              if (cs === -1)
                break;
              i = Math.max(i, cs - 2);
            }
          } else {
            if (inFlow && flowIndicatorChars.has(ch))
              break;
            end = i;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("plain-scalar");
        yield cst.SCALAR;
        yield* this.pushToIndex(end + 1, true);
        return inFlow ? "flow" : "doc";
      }
      *pushCount(n) {
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos += n;
          return n;
        }
        return 0;
      }
      *pushToIndex(i, allowEmpty) {
        const s = this.buffer.slice(this.pos, i);
        if (s) {
          yield s;
          this.pos += s.length;
          return s.length;
        } else if (allowEmpty)
          yield "";
        return 0;
      }
      *pushIndicators() {
        let n = 0;
        loop: while (true) {
          switch (this.charAt(0)) {
            case "!":
              n += yield* this.pushTag();
              n += yield* this.pushSpaces(true);
              continue loop;
            case "&":
              n += yield* this.pushUntil(isNotAnchorChar);
              n += yield* this.pushSpaces(true);
              continue loop;
            case "-":
            // this is an error
            case "?":
            // this is an error outside flow collections
            case ":": {
              const inFlow = this.flowLevel > 0;
              const ch1 = this.charAt(1);
              if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
                if (!inFlow)
                  this.indentNext = this.indentValue + 1;
                else if (this.flowKey)
                  this.flowKey = false;
                n += yield* this.pushCount(1);
                n += yield* this.pushSpaces(true);
                continue loop;
              }
            }
          }
          break loop;
        }
        return n;
      }
      *pushTag() {
        if (this.charAt(1) === "<") {
          let i = this.pos + 2;
          let ch = this.buffer[i];
          while (!isEmpty(ch) && ch !== ">")
            ch = this.buffer[++i];
          return yield* this.pushToIndex(ch === ">" ? i + 1 : i, false);
        } else {
          let i = this.pos + 1;
          let ch = this.buffer[i];
          while (ch) {
            if (tagChars.has(ch))
              ch = this.buffer[++i];
            else if (ch === "%" && hexDigits.has(this.buffer[i + 1]) && hexDigits.has(this.buffer[i + 2])) {
              ch = this.buffer[i += 3];
            } else
              break;
          }
          return yield* this.pushToIndex(i, false);
        }
      }
      *pushNewline() {
        const ch = this.buffer[this.pos];
        if (ch === "\n")
          return yield* this.pushCount(1);
        else if (ch === "\r" && this.charAt(1) === "\n")
          return yield* this.pushCount(2);
        else
          return 0;
      }
      *pushSpaces(allowTabs) {
        let i = this.pos - 1;
        let ch;
        do {
          ch = this.buffer[++i];
        } while (ch === " " || allowTabs && ch === "	");
        const n = i - this.pos;
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos = i;
        }
        return n;
      }
      *pushUntil(test) {
        let i = this.pos;
        let ch = this.buffer[i];
        while (!test(ch))
          ch = this.buffer[++i];
        return yield* this.pushToIndex(i, false);
      }
    };
    exports2.Lexer = Lexer;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/line-counter.js
var require_line_counter = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/line-counter.js"(exports2) {
    "use strict";
    var LineCounter = class {
      constructor() {
        this.lineStarts = [];
        this.addNewLine = (offset) => this.lineStarts.push(offset);
        this.linePos = (offset) => {
          let low = 0;
          let high = this.lineStarts.length;
          while (low < high) {
            const mid = low + high >> 1;
            if (this.lineStarts[mid] < offset)
              low = mid + 1;
            else
              high = mid;
          }
          if (this.lineStarts[low] === offset)
            return { line: low + 1, col: 1 };
          if (low === 0)
            return { line: 0, col: offset };
          const start = this.lineStarts[low - 1];
          return { line: low, col: offset - start + 1 };
        };
      }
    };
    exports2.LineCounter = LineCounter;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/parser.js
var require_parser = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/parse/parser.js"(exports2) {
    "use strict";
    var node_process = require("process");
    var cst = require_cst();
    var lexer = require_lexer();
    function includesToken(list, type) {
      for (let i = 0; i < list.length; ++i)
        if (list[i].type === type)
          return true;
      return false;
    }
    function findNonEmptyIndex(list) {
      for (let i = 0; i < list.length; ++i) {
        switch (list[i].type) {
          case "space":
          case "comment":
          case "newline":
            break;
          default:
            return i;
        }
      }
      return -1;
    }
    function isFlowToken(token) {
      switch (token?.type) {
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "flow-collection":
          return true;
        default:
          return false;
      }
    }
    function getPrevProps(parent) {
      switch (parent.type) {
        case "document":
          return parent.start;
        case "block-map": {
          const it = parent.items[parent.items.length - 1];
          return it.sep ?? it.start;
        }
        case "block-seq":
          return parent.items[parent.items.length - 1].start;
        /* istanbul ignore next should not happen */
        default:
          return [];
      }
    }
    function getFirstKeyStartProps(prev) {
      if (prev.length === 0)
        return [];
      let i = prev.length;
      loop: while (--i >= 0) {
        switch (prev[i].type) {
          case "doc-start":
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
          case "newline":
            break loop;
        }
      }
      while (prev[++i]?.type === "space") {
      }
      return prev.splice(i, prev.length);
    }
    function arrayPushArray(target, source) {
      if (source.length < 1e5)
        Array.prototype.push.apply(target, source);
      else
        for (let i = 0; i < source.length; ++i)
          target.push(source[i]);
    }
    function fixFlowSeqItems(fc) {
      if (fc.start.type === "flow-seq-start") {
        for (const it of fc.items) {
          if (it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind")) {
            if (it.key)
              it.value = it.key;
            delete it.key;
            if (isFlowToken(it.value)) {
              if (it.value.end)
                arrayPushArray(it.value.end, it.sep);
              else
                it.value.end = it.sep;
            } else
              arrayPushArray(it.start, it.sep);
            delete it.sep;
          }
        }
      }
    }
    var Parser = class {
      /**
       * @param onNewLine - If defined, called separately with the start position of
       *   each new line (in `parse()`, including the start of input).
       */
      constructor(onNewLine) {
        this.atNewLine = true;
        this.atScalar = false;
        this.indent = 0;
        this.offset = 0;
        this.onKeyLine = false;
        this.stack = [];
        this.source = "";
        this.type = "";
        this.lexer = new lexer.Lexer();
        this.onNewLine = onNewLine;
      }
      /**
       * Parse `source` as a YAML stream.
       * If `incomplete`, a part of the last line may be left as a buffer for the next call.
       *
       * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
       *
       * @returns A generator of tokens representing each directive, document, and other structure.
       */
      *parse(source, incomplete = false) {
        if (this.onNewLine && this.offset === 0)
          this.onNewLine(0);
        for (const lexeme of this.lexer.lex(source, incomplete))
          yield* this.next(lexeme);
        if (!incomplete)
          yield* this.end();
      }
      /**
       * Advance the parser by the `source` of one lexical token.
       */
      *next(source) {
        this.source = source;
        if (node_process.env.LOG_TOKENS)
          console.log("|", cst.prettyToken(source));
        if (this.atScalar) {
          this.atScalar = false;
          yield* this.step();
          this.offset += source.length;
          return;
        }
        const type = cst.tokenType(source);
        if (!type) {
          const message = `Not a YAML token: ${source}`;
          yield* this.pop({ type: "error", offset: this.offset, message, source });
          this.offset += source.length;
        } else if (type === "scalar") {
          this.atNewLine = false;
          this.atScalar = true;
          this.type = "scalar";
        } else {
          this.type = type;
          yield* this.step();
          switch (type) {
            case "newline":
              this.atNewLine = true;
              this.indent = 0;
              if (this.onNewLine)
                this.onNewLine(this.offset + source.length);
              break;
            case "space":
              if (this.atNewLine && source[0] === " ")
                this.indent += source.length;
              break;
            case "explicit-key-ind":
            case "map-value-ind":
            case "seq-item-ind":
              if (this.atNewLine)
                this.indent += source.length;
              break;
            case "doc-mode":
            case "flow-error-end":
              return;
            default:
              this.atNewLine = false;
          }
          this.offset += source.length;
        }
      }
      /** Call at end of input to push out any remaining constructions */
      *end() {
        while (this.stack.length > 0)
          yield* this.pop();
      }
      get sourceToken() {
        const st = {
          type: this.type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
        return st;
      }
      *step() {
        const top = this.peek(1);
        if (this.type === "doc-end" && top?.type !== "doc-end") {
          while (this.stack.length > 0)
            yield* this.pop();
          this.stack.push({
            type: "doc-end",
            offset: this.offset,
            source: this.source
          });
          return;
        }
        if (!top)
          return yield* this.stream();
        switch (top.type) {
          case "document":
            return yield* this.document(top);
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return yield* this.scalar(top);
          case "block-scalar":
            return yield* this.blockScalar(top);
          case "block-map":
            return yield* this.blockMap(top);
          case "block-seq":
            return yield* this.blockSequence(top);
          case "flow-collection":
            return yield* this.flowCollection(top);
          case "doc-end":
            return yield* this.documentEnd(top);
        }
        yield* this.pop();
      }
      peek(n) {
        return this.stack[this.stack.length - n];
      }
      *pop(error) {
        const token = error ?? this.stack.pop();
        if (!token) {
          const message = "Tried to pop an empty stack";
          yield { type: "error", offset: this.offset, source: "", message };
        } else if (this.stack.length === 0) {
          yield token;
        } else {
          const top = this.peek(1);
          if (token.type === "block-scalar") {
            token.indent = "indent" in top ? top.indent : 0;
          } else if (token.type === "flow-collection" && top.type === "document") {
            token.indent = 0;
          }
          if (token.type === "flow-collection")
            fixFlowSeqItems(token);
          switch (top.type) {
            case "document":
              top.value = token;
              break;
            case "block-scalar":
              top.props.push(token);
              break;
            case "block-map": {
              const it = top.items[top.items.length - 1];
              if (it.value) {
                top.items.push({ start: [], key: token, sep: [] });
                this.onKeyLine = true;
                return;
              } else if (it.sep) {
                it.value = token;
              } else {
                Object.assign(it, { key: token, sep: [] });
                this.onKeyLine = !it.explicitKey;
                return;
              }
              break;
            }
            case "block-seq": {
              const it = top.items[top.items.length - 1];
              if (it.value)
                top.items.push({ start: [], value: token });
              else
                it.value = token;
              break;
            }
            case "flow-collection": {
              const it = top.items[top.items.length - 1];
              if (!it || it.value)
                top.items.push({ start: [], key: token, sep: [] });
              else if (it.sep)
                it.value = token;
              else
                Object.assign(it, { key: token, sep: [] });
              return;
            }
            /* istanbul ignore next should not happen */
            default:
              yield* this.pop();
              yield* this.pop(token);
          }
          if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
            const last = token.items[token.items.length - 1];
            if (last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token.indent === 0 || last.start.every((st) => st.type !== "comment" || st.indent < token.indent))) {
              if (top.type === "document")
                top.end = last.start;
              else
                top.items.push({ start: last.start });
              token.items.splice(-1, 1);
            }
          }
        }
      }
      *stream() {
        switch (this.type) {
          case "directive-line":
            yield { type: "directive", offset: this.offset, source: this.source };
            return;
          case "byte-order-mark":
          case "space":
          case "comment":
          case "newline":
            yield this.sourceToken;
            return;
          case "doc-mode":
          case "doc-start": {
            const doc = {
              type: "document",
              offset: this.offset,
              start: []
            };
            if (this.type === "doc-start")
              doc.start.push(this.sourceToken);
            this.stack.push(doc);
            return;
          }
        }
        yield {
          type: "error",
          offset: this.offset,
          message: `Unexpected ${this.type} token in YAML stream`,
          source: this.source
        };
      }
      *document(doc) {
        if (doc.value)
          return yield* this.lineEnd(doc);
        switch (this.type) {
          case "doc-start": {
            if (findNonEmptyIndex(doc.start) !== -1) {
              yield* this.pop();
              yield* this.step();
            } else
              doc.start.push(this.sourceToken);
            return;
          }
          case "anchor":
          case "tag":
          case "space":
          case "comment":
          case "newline":
            doc.start.push(this.sourceToken);
            return;
        }
        const bv = this.startBlockValue(doc);
        if (bv)
          this.stack.push(bv);
        else {
          yield {
            type: "error",
            offset: this.offset,
            message: `Unexpected ${this.type} token in YAML document`,
            source: this.source
          };
        }
      }
      *scalar(scalar) {
        if (this.type === "map-value-ind") {
          const prev = getPrevProps(this.peek(2));
          const start = getFirstKeyStartProps(prev);
          let sep;
          if (scalar.end) {
            sep = scalar.end;
            sep.push(this.sourceToken);
            delete scalar.end;
          } else
            sep = [this.sourceToken];
          const map = {
            type: "block-map",
            offset: scalar.offset,
            indent: scalar.indent,
            items: [{ start, key: scalar, sep }]
          };
          this.onKeyLine = true;
          this.stack[this.stack.length - 1] = map;
        } else
          yield* this.lineEnd(scalar);
      }
      *blockScalar(scalar) {
        switch (this.type) {
          case "space":
          case "comment":
          case "newline":
            scalar.props.push(this.sourceToken);
            return;
          case "scalar":
            scalar.source = this.source;
            this.atNewLine = true;
            this.indent = 0;
            if (this.onNewLine) {
              let nl = this.source.indexOf("\n") + 1;
              while (nl !== 0) {
                this.onNewLine(this.offset + nl);
                nl = this.source.indexOf("\n", nl) + 1;
              }
            }
            yield* this.pop();
            break;
          /* istanbul ignore next should not happen */
          default:
            yield* this.pop();
            yield* this.step();
        }
      }
      *blockMap(map) {
        const it = map.items[map.items.length - 1];
        switch (this.type) {
          case "newline":
            this.onKeyLine = false;
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              it.start.push(this.sourceToken);
            }
            return;
          case "space":
          case "comment":
            if (it.value) {
              map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              if (this.atIndentedComment(it.start, map.indent)) {
                const prev = map.items[map.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  map.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
        }
        if (this.indent >= map.indent) {
          const atMapIndent = !this.onKeyLine && this.indent === map.indent;
          const atNextItem = atMapIndent && (it.sep || it.explicitKey) && this.type !== "seq-item-ind";
          let start = [];
          if (atNextItem && it.sep && !it.value) {
            const nl = [];
            for (let i = 0; i < it.sep.length; ++i) {
              const st = it.sep[i];
              switch (st.type) {
                case "newline":
                  nl.push(i);
                  break;
                case "space":
                  break;
                case "comment":
                  if (st.indent > map.indent)
                    nl.length = 0;
                  break;
                default:
                  nl.length = 0;
              }
            }
            if (nl.length >= 2)
              start = it.sep.splice(nl[1]);
          }
          switch (this.type) {
            case "anchor":
            case "tag":
              if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start });
                this.onKeyLine = true;
              } else if (it.sep) {
                it.sep.push(this.sourceToken);
              } else {
                it.start.push(this.sourceToken);
              }
              return;
            case "explicit-key-ind":
              if (!it.sep && !it.explicitKey) {
                it.start.push(this.sourceToken);
                it.explicitKey = true;
              } else if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start, explicitKey: true });
              } else {
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: [this.sourceToken], explicitKey: true }]
                });
              }
              this.onKeyLine = true;
              return;
            case "map-value-ind":
              if (it.explicitKey) {
                if (!it.sep) {
                  if (includesToken(it.start, "newline")) {
                    Object.assign(it, { key: null, sep: [this.sourceToken] });
                  } else {
                    const start2 = getFirstKeyStartProps(it.start);
                    this.stack.push({
                      type: "block-map",
                      offset: this.offset,
                      indent: this.indent,
                      items: [{ start: start2, key: null, sep: [this.sourceToken] }]
                    });
                  }
                } else if (it.value) {
                  map.items.push({ start: [], key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start, key: null, sep: [this.sourceToken] }]
                  });
                } else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
                  const start2 = getFirstKeyStartProps(it.start);
                  const key = it.key;
                  const sep = it.sep;
                  sep.push(this.sourceToken);
                  delete it.key;
                  delete it.sep;
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: start2, key, sep }]
                  });
                } else if (start.length > 0) {
                  it.sep = it.sep.concat(start, this.sourceToken);
                } else {
                  it.sep.push(this.sourceToken);
                }
              } else {
                if (!it.sep) {
                  Object.assign(it, { key: null, sep: [this.sourceToken] });
                } else if (it.value || atNextItem) {
                  map.items.push({ start, key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: [], key: null, sep: [this.sourceToken] }]
                  });
                } else {
                  it.sep.push(this.sourceToken);
                }
              }
              this.onKeyLine = true;
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (atNextItem || it.value) {
                map.items.push({ start, key: fs, sep: [] });
                this.onKeyLine = true;
              } else if (it.sep) {
                this.stack.push(fs);
              } else {
                Object.assign(it, { key: fs, sep: [] });
                this.onKeyLine = true;
              }
              return;
            }
            default: {
              const bv = this.startBlockValue(map);
              if (bv) {
                if (bv.type === "block-seq") {
                  if (!it.explicitKey && it.sep && !includesToken(it.sep, "newline")) {
                    yield* this.pop({
                      type: "error",
                      offset: this.offset,
                      message: "Unexpected block-seq-ind on same line with key",
                      source: this.source
                    });
                    return;
                  }
                } else if (atMapIndent) {
                  map.items.push({ start });
                }
                this.stack.push(bv);
                return;
              }
            }
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *blockSequence(seq) {
        const it = seq.items[seq.items.length - 1];
        switch (this.type) {
          case "newline":
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                seq.items.push({ start: [this.sourceToken] });
            } else
              it.start.push(this.sourceToken);
            return;
          case "space":
          case "comment":
            if (it.value)
              seq.items.push({ start: [this.sourceToken] });
            else {
              if (this.atIndentedComment(it.start, seq.indent)) {
                const prev = seq.items[seq.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  seq.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
          case "anchor":
          case "tag":
            if (it.value || this.indent <= seq.indent)
              break;
            it.start.push(this.sourceToken);
            return;
          case "seq-item-ind":
            if (this.indent !== seq.indent)
              break;
            if (it.value || includesToken(it.start, "seq-item-ind"))
              seq.items.push({ start: [this.sourceToken] });
            else
              it.start.push(this.sourceToken);
            return;
        }
        if (this.indent > seq.indent) {
          const bv = this.startBlockValue(seq);
          if (bv) {
            this.stack.push(bv);
            return;
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *flowCollection(fc) {
        const it = fc.items[fc.items.length - 1];
        if (this.type === "flow-error-end") {
          let top;
          do {
            yield* this.pop();
            top = this.peek(1);
          } while (top?.type === "flow-collection");
        } else if (fc.end.length === 0) {
          switch (this.type) {
            case "comma":
            case "explicit-key-ind":
              if (!it || it.sep)
                fc.items.push({ start: [this.sourceToken] });
              else
                it.start.push(this.sourceToken);
              return;
            case "map-value-ind":
              if (!it || it.value)
                fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                Object.assign(it, { key: null, sep: [this.sourceToken] });
              return;
            case "space":
            case "comment":
            case "newline":
            case "anchor":
            case "tag":
              if (!it || it.value)
                fc.items.push({ start: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                it.start.push(this.sourceToken);
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (!it || it.value)
                fc.items.push({ start: [], key: fs, sep: [] });
              else if (it.sep)
                this.stack.push(fs);
              else
                Object.assign(it, { key: fs, sep: [] });
              return;
            }
            case "flow-map-end":
            case "flow-seq-end":
              fc.end.push(this.sourceToken);
              return;
          }
          const bv = this.startBlockValue(fc);
          if (bv)
            this.stack.push(bv);
          else {
            yield* this.pop();
            yield* this.step();
          }
        } else {
          const parent = this.peek(2);
          if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep)) {
            yield* this.pop();
            yield* this.step();
          } else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            fixFlowSeqItems(fc);
            const sep = fc.end.splice(1, fc.end.length);
            sep.push(this.sourceToken);
            const map = {
              type: "block-map",
              offset: fc.offset,
              indent: fc.indent,
              items: [{ start, key: fc, sep }]
            };
            this.onKeyLine = true;
            this.stack[this.stack.length - 1] = map;
          } else {
            yield* this.lineEnd(fc);
          }
        }
      }
      flowScalar(type) {
        if (this.onNewLine) {
          let nl = this.source.indexOf("\n") + 1;
          while (nl !== 0) {
            this.onNewLine(this.offset + nl);
            nl = this.source.indexOf("\n", nl) + 1;
          }
        }
        return {
          type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
      }
      startBlockValue(parent) {
        switch (this.type) {
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return this.flowScalar(this.type);
          case "block-scalar-header":
            return {
              type: "block-scalar",
              offset: this.offset,
              indent: this.indent,
              props: [this.sourceToken],
              source: ""
            };
          case "flow-map-start":
          case "flow-seq-start":
            return {
              type: "flow-collection",
              offset: this.offset,
              indent: this.indent,
              start: this.sourceToken,
              items: [],
              end: []
            };
          case "seq-item-ind":
            return {
              type: "block-seq",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: [this.sourceToken] }]
            };
          case "explicit-key-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            start.push(this.sourceToken);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, explicitKey: true }]
            };
          }
          case "map-value-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, key: null, sep: [this.sourceToken] }]
            };
          }
        }
        return null;
      }
      atIndentedComment(start, indent) {
        if (this.type !== "comment")
          return false;
        if (this.indent <= indent)
          return false;
        return start.every((st) => st.type === "newline" || st.type === "space");
      }
      *documentEnd(docEnd) {
        if (this.type !== "doc-mode") {
          if (docEnd.end)
            docEnd.end.push(this.sourceToken);
          else
            docEnd.end = [this.sourceToken];
          if (this.type === "newline")
            yield* this.pop();
        }
      }
      *lineEnd(token) {
        switch (this.type) {
          case "comma":
          case "doc-start":
          case "doc-end":
          case "flow-seq-end":
          case "flow-map-end":
          case "map-value-ind":
            yield* this.pop();
            yield* this.step();
            break;
          case "newline":
            this.onKeyLine = false;
          // fallthrough
          case "space":
          case "comment":
          default:
            if (token.end)
              token.end.push(this.sourceToken);
            else
              token.end = [this.sourceToken];
            if (this.type === "newline")
              yield* this.pop();
        }
      }
    };
    exports2.Parser = Parser;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/public-api.js
var require_public_api = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/public-api.js"(exports2) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var errors = require_errors();
    var log = require_log();
    var identity = require_identity();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    function parseOptions(options) {
      const prettyErrors = options.prettyErrors !== false;
      const lineCounter$1 = options.lineCounter || prettyErrors && new lineCounter.LineCounter() || null;
      return { lineCounter: lineCounter$1, prettyErrors };
    }
    function parseAllDocuments(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      const docs = Array.from(composer$1.compose(parser$1.parse(source)));
      if (prettyErrors && lineCounter2)
        for (const doc of docs) {
          doc.errors.forEach(errors.prettifyError(source, lineCounter2));
          doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
        }
      if (docs.length > 0)
        return docs;
      return Object.assign([], { empty: true }, composer$1.streamInfo());
    }
    function parseDocument(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      let doc = null;
      for (const _doc of composer$1.compose(parser$1.parse(source), true, source.length)) {
        if (!doc)
          doc = _doc;
        else if (doc.options.logLevel !== "silent") {
          doc.errors.push(new errors.YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
          break;
        }
      }
      if (prettyErrors && lineCounter2) {
        doc.errors.forEach(errors.prettifyError(source, lineCounter2));
        doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
      }
      return doc;
    }
    function parse3(src, reviver, options) {
      let _reviver = void 0;
      if (typeof reviver === "function") {
        _reviver = reviver;
      } else if (options === void 0 && reviver && typeof reviver === "object") {
        options = reviver;
      }
      const doc = parseDocument(src, options);
      if (!doc)
        return null;
      doc.warnings.forEach((warning) => log.warn(doc.options.logLevel, warning));
      if (doc.errors.length > 0) {
        if (doc.options.logLevel !== "silent")
          throw doc.errors[0];
        else
          doc.errors = [];
      }
      return doc.toJS(Object.assign({ reviver: _reviver }, options));
    }
    function stringify(value, replacer, options) {
      let _replacer = null;
      if (typeof replacer === "function" || Array.isArray(replacer)) {
        _replacer = replacer;
      } else if (options === void 0 && replacer) {
        options = replacer;
      }
      if (typeof options === "string")
        options = options.length;
      if (typeof options === "number") {
        const indent = Math.round(options);
        options = indent < 1 ? void 0 : indent > 8 ? { indent: 8 } : { indent };
      }
      if (value === void 0) {
        const { keepUndefined } = options ?? replacer ?? {};
        if (!keepUndefined)
          return void 0;
      }
      if (identity.isDocument(value) && !_replacer)
        return value.toString(options);
      return new Document.Document(value, _replacer, options).toString(options);
    }
    exports2.parse = parse3;
    exports2.parseAllDocuments = parseAllDocuments;
    exports2.parseDocument = parseDocument;
    exports2.stringify = stringify;
  }
});

// node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/index.js
var require_dist = __commonJS({
  "node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/index.js"(exports2) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var Schema = require_Schema();
    var errors = require_errors();
    var Alias = require_Alias();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var cst = require_cst();
    var lexer = require_lexer();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    var publicApi = require_public_api();
    var visit = require_visit();
    exports2.Composer = composer.Composer;
    exports2.Document = Document.Document;
    exports2.Schema = Schema.Schema;
    exports2.YAMLError = errors.YAMLError;
    exports2.YAMLParseError = errors.YAMLParseError;
    exports2.YAMLWarning = errors.YAMLWarning;
    exports2.Alias = Alias.Alias;
    exports2.isAlias = identity.isAlias;
    exports2.isCollection = identity.isCollection;
    exports2.isDocument = identity.isDocument;
    exports2.isMap = identity.isMap;
    exports2.isNode = identity.isNode;
    exports2.isPair = identity.isPair;
    exports2.isScalar = identity.isScalar;
    exports2.isSeq = identity.isSeq;
    exports2.Pair = Pair.Pair;
    exports2.Scalar = Scalar.Scalar;
    exports2.YAMLMap = YAMLMap.YAMLMap;
    exports2.YAMLSeq = YAMLSeq.YAMLSeq;
    exports2.CST = cst;
    exports2.Lexer = lexer.Lexer;
    exports2.LineCounter = lineCounter.LineCounter;
    exports2.Parser = parser.Parser;
    exports2.parse = publicApi.parse;
    exports2.parseAllDocuments = publicApi.parseAllDocuments;
    exports2.parseDocument = publicApi.parseDocument;
    exports2.stringify = publicApi.stringify;
    exports2.visit = visit.visit;
    exports2.visitAsync = visit.visitAsync;
  }
});

// apps/api/src/store.ts
var import_node_crypto6 = require("node:crypto");
var import_mongodb4 = require("mongodb");

// packages/shared/src/errors.ts
var HttpError = class extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
  status;
};

// packages/shared/src/security.ts
var import_node_crypto = require("node:crypto");
var import_node_util = require("node:util");
var scrypt = (0, import_node_util.promisify)(import_node_crypto.scrypt);
async function hashPassword(password) {
  const salt = (0, import_node_crypto.randomBytes)(16).toString("hex");
  const hash2 = await scrypt(password, salt, 64);
  return `${salt}:${hash2.toString("hex")}`;
}
async function verifyPassword(password, stored) {
  if (!/^[a-f0-9]{32}:[a-f0-9]{128}$/.test(stored)) return false;
  const [salt, hash2] = stored.split(":");
  const actual = await scrypt(password, salt, 64);
  const expected = Buffer.from(hash2, "hex");
  return actual.length === expected.length && (0, import_node_crypto.timingSafeEqual)(actual, expected);
}
var tokenHash = (token) => (0, import_node_crypto.createHash)("sha256").update(token).digest("hex");
function credentials(body) {
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new Error("Ge\xE7erli bir e-posta adresi girin.");
  if (password.length < 12 || password.length > 128)
    throw new Error("Parolan\u0131z 12\u2013128 karakter aras\u0131nda olmal\u0131.");
  return { email, password };
}

// apps/api/src/startup-errors.ts
var messages = {
  CONFIG_ADMIN_AD: "NODERA_ADMIN_AUTH_MODE ve NODERA_ADMIN_AD_TRUST ayarlar\u0131 ge\xE7ersiz veya eksik. AD g\xFCven yap\u0131land\u0131rmas\u0131n\u0131 kurulum paketinden kontrol edin.",
  CONFIG_PORT: "PORT, 1 ile 65535 aras\u0131nda bir say\u0131 olmal\u0131.",
  CONFIG_SECRET: "AUTH_RATE_SECRET en az 32 karakter olmal\u0131.",
  CONFIG_URI: "API sunucusunun .env dosyas\u0131ndaki MONGODB_URI ba\u011Flant\u0131 adresini kontrol edin.",
  CONFIG_DATABASE: "MONGODB_DATABASE ge\xE7ersiz; yaln\u0131zca harf, rakam, alt \xE7izgi ve tire kullan\u0131n.",
  ATLAS_AUTH: "Atlas veritaban\u0131 kullan\u0131c\u0131s\u0131 veya parolas\u0131 kabul edilmedi. Database Access ayarlar\u0131n\u0131 kontrol edin.",
  ATLAS_PERMISSION: "Atlas kullan\u0131c\u0131s\u0131n\u0131n veritaban\u0131 ve indeks olu\u015Fturma yetkisi yetersiz. Database Access yetkilerini kontrol edin.",
  ATLAS_DNS: "Atlas adresi DNS \xFCzerinden \xE7\xF6z\xFCmlenemedi. \u0130nternet ba\u011Flant\u0131s\u0131n\u0131, DNS ve k\xFCme adresini kontrol edin.",
  ATLAS_TLS: "Atlas TLS ba\u011Flant\u0131s\u0131 kurulamad\u0131. \xD6nce Atlas Network Access listesinde g\xFCncel internet IP'nizin Active oldu\u011Funu kontrol edin; ard\u0131ndan VPN ve g\xFCvenlik duvar\u0131n\u0131 kontrol edin.",
  ATLAS_NETWORK: "Atlas'a ula\u015F\u0131lamad\u0131. K\xFCmenin \xE7al\u0131\u015Ft\u0131\u011F\u0131n\u0131, Network Access listesinde g\xFCncel internet IP'nizin Active oldu\u011Funu ve a\u011F eri\u015Fimini kontrol edin.",
  PORT_BUSY: "\xDCyelik API portu ba\u015Fka bir i\u015Flem taraf\u0131ndan kullan\u0131l\u0131yor. PORT ayar\u0131n\u0131 ve \xE7al\u0131\u015Fan \xFCyelik hizmetlerini kontrol edin.",
  LISTEN_ACCESS: "\xDCyelik API'si belirtilen HOST/PORT adresinde dinleyemiyor. Yerel a\u011F adresini ve port izinlerini kontrol edin.",
  UNKNOWN: "\xDCyelik hizmeti ba\u015Flat\u0131lamad\u0131. Sunucu yap\u0131land\u0131rmas\u0131n\u0131 ve Atlas ba\u011Flant\u0131s\u0131n\u0131 kontrol edin."
};
var IdentityStartupError = class extends Error {
  constructor(code) {
    super(messages[code]);
    this.code = code;
    this.name = "IdentityStartupError";
  }
  code;
};
function identityStartupFailure(error) {
  const codes = /* @__PURE__ */ new Set();
  const names = /* @__PURE__ */ new Set();
  const visited = /* @__PURE__ */ new Set();
  function visit(value, depth = 0) {
    if (!value || typeof value !== "object" || visited.has(value) || depth > 8)
      return;
    visited.add(value);
    const entry = value;
    codes.add(entry.code);
    names.add(entry.name);
    visit(entry.cause, depth + 1);
    visit(entry.error, depth + 1);
    visit(entry.reason, depth + 1);
    if (entry.servers instanceof Map)
      for (const server of entry.servers.values()) visit(server, depth + 1);
  }
  visit(error);
  let code = "UNKNOWN";
  if (error instanceof IdentityStartupError) code = error.code;
  else if (codes.has("EADDRINUSE")) code = "PORT_BUSY";
  else if (codes.has("EACCES") || codes.has("EADDRNOTAVAIL"))
    code = "LISTEN_ACCESS";
  else if (codes.has(18) || names.has("MongoMissingCredentialsError"))
    code = "ATLAS_AUTH";
  else if (codes.has(13)) code = "ATLAS_PERMISSION";
  else if (names.has("MongoParseError") || names.has("MongoInvalidArgumentError"))
    code = "CONFIG_URI";
  else if (["ENOTFOUND", "ENODATA", "EAI_AGAIN"].some((item) => codes.has(item)))
    code = "ATLAS_DNS";
  else if ([...codes].some(
    (item) => typeof item === "string" && /^ERR_(SSL|TLS)_/.test(item)
  ) || [
    "CERT_HAS_EXPIRED",
    "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
    "SELF_SIGNED_CERT_IN_CHAIN",
    "DEPTH_ZERO_SELF_SIGNED_CERT"
  ].some((item) => codes.has(item)))
    code = "ATLAS_TLS";
  else if (names.has("MongoServerSelectionError") || names.has("MongoNetworkError") || [
    "ETIMEDOUT",
    "ECONNREFUSED",
    "ECONNRESET",
    "ENETUNREACH",
    "EHOSTUNREACH"
  ].some((item) => codes.has(item)))
    code = "ATLAS_NETWORK";
  return `[NODERA_IDENTITY_${code}] ${messages[code]}`;
}

// apps/api/src/marketplace.ts
var import_node_crypto2 = require("node:crypto");
var import_mongodb = require("mongodb");
var uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
async function initializeMarketplace(db) {
  const listings = db.collection("rental_listings");
  await listings.createIndex(
    { ownerId: 1, deviceId: 1, machineId: 1 },
    { unique: true }
  );
  await listings.createIndex(
    { "lease.id": 1 },
    {
      unique: true,
      partialFilterExpression: { "lease.id": { $type: "string" } }
    }
  );
  await listings.createIndex(
    { "lease.guestId": 1 },
    {
      unique: true,
      partialFilterExpression: {
        "lease.phase": { $in: ["reserved", "active"] }
      }
    }
  );
  await listings.createIndex({ published: 1, updatedAt: -1 });
  await db.collection("rental_history").createIndex({ leaseId: 1 }, { unique: true });
}
var MarketplaceStore = class {
  constructor(db) {
    this.db = db;
    this.listings = db.collection("rental_listings");
  }
  db;
  listings;
  async publish(user, deviceId, body) {
    if (!uuid.test(deviceId) || typeof body.machineId !== "string" || !uuid.test(body.machineId))
      throw new HttpError(400, "Cihaz veya makine kimli\u011Fi ge\xE7ersiz.");
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (name.length < 2 || name.length > 48)
      throw new HttpError(400, "Makine ad\u0131 ge\xE7ersiz.");
    for (const [key2, min, max] of [
      ["cpu", 2, 256],
      ["memory", 4, 1024],
      ["storage", 64, 65536],
      ["network", 1, 1e3]
    ])
      if (!Number.isSafeInteger(body[key2]) || Number(body[key2]) < min || Number(body[key2]) > max)
        throw new HttpError(400, "Makine kaynaklar\u0131 ge\xE7ersiz.");
    const key = { ownerId: user.id, deviceId, machineId: body.machineId };
    const existing = await this.listings.findOne(key);
    if (existing?.lease || existing?.resetRequired)
      throw new HttpError(
        409,
        "\xD6nce mevcut oturumu sonland\u0131r\u0131p VM'yi temizleyin."
      );
    const value = {
      name,
      ownerName: user.name,
      cpu: Number(body.cpu),
      memory: Number(body.memory),
      storage: Number(body.storage),
      network: Number(body.network),
      ...typeof body.cpuModel === "string" && body.cpuModel.trim().length > 0 && body.cpuModel.length <= 200 && !/[\x00-\x1f\x7f]/.test(body.cpuModel) ? { cpuModel: body.cpuModel.trim() } : {},
      published: true,
      ...typeof body.directoryGeneration === "string" && uuid.test(body.directoryGeneration) ? { directoryGeneration: body.directoryGeneration, autoPublish: true } : {},
      updatedAt: /* @__PURE__ */ new Date()
    };
    if (existing) {
      const result = await this.listings.findOneAndUpdate(
        { _id: existing._id, lease: null, resetRequired: false },
        { $set: value },
        { returnDocument: "after" }
      );
      if (!result)
        throw new HttpError(409, "Makinenin durumu de\u011Fi\u015Fti; yeniden deneyin.");
      return result;
    }
    const listing = {
      _id: (0, import_node_crypto2.randomUUID)(),
      ...key,
      ...value,
      resetRequired: false,
      lease: null
    };
    try {
      await this.listings.insertOne(listing);
    } catch (error) {
      if (error instanceof import_mongodb.MongoServerError && error.code === 11e3)
        throw new HttpError(409, "Bu makine zaten yay\u0131mlanm\u0131\u015F.");
      throw error;
    }
    return listing;
  }
  async reserve(user, id, durationMinutes) {
    const lease = {
      id: (0, import_node_crypto2.randomUUID)(),
      guestId: user.id,
      guestName: user.name,
      phase: "reserved",
      reservedAt: /* @__PURE__ */ new Date(),
      expiresAt: new Date(Date.now() + 12e4),
      ...durationMinutes ? { durationMinutes } : {}
    };
    try {
      const result = await this.listings.findOneAndUpdate(
        {
          _id: id,
          ownerId: { $ne: user.id },
          published: true,
          resetRequired: false,
          lease: null
        },
        { $set: { lease, updatedAt: /* @__PURE__ */ new Date() } },
        { returnDocument: "after" }
      );
      if (!result) throw new HttpError(409, "Makine art\u0131k m\xFCsait de\u011Fil.");
      return result;
    } catch (error) {
      if (error instanceof import_mongodb.MongoServerError && error.code === 11e3)
        throw new HttpError(
          409,
          "Zaten bir rezervasyonun veya a\xE7\u0131k oturumun var."
        );
      throw error;
    }
  }
  async forLease(id) {
    return this.listings.findOne({ "lease.id": id });
  }
  async end(listing) {
    if (!listing.lease) return;
    const result = await this.listings.findOneAndUpdate(
      { _id: listing._id, "lease.id": listing.lease.id },
      {
        $set: {
          published: false,
          resetRequired: true,
          "lease.phase": "resetting"
        }
      },
      { returnDocument: "after" }
    );
    if (result)
      await this.db.collection("rental_history").updateOne(
        { leaseId: listing.lease.id },
        {
          $setOnInsert: {
            leaseId: listing.lease.id,
            listingId: listing._id,
            ownerId: listing.ownerId,
            guestId: listing.lease.guestId,
            guestName: listing.lease.guestName,
            ownerName: listing.ownerName,
            machineId: listing.machineId,
            machineName: listing.name,
            ...listing.lease.reservedAt ? { reservedAt: listing.lease.reservedAt } : {},
            ...listing.lease.startedAt ? { startedAt: listing.lease.startedAt } : {},
            expiresAt: listing.lease.expiresAt,
            ...listing.lease.durationMinutes ? { durationMinutes: listing.lease.durationMinutes } : {},
            endedAt: /* @__PURE__ */ new Date()
          }
        },
        { upsert: true }
      );
  }
  async reset(ownerId, deviceId, id, leaseId, directoryGeneration, republish = false) {
    const result = await this.listings.updateOne(
      {
        _id: id,
        ownerId,
        deviceId,
        resetRequired: true,
        "lease.id": leaseId,
        "lease.phase": "resetting"
      },
      {
        $set: {
          lease: null,
          resetRequired: false,
          published: republish,
          ...directoryGeneration ? { directoryGeneration } : {},
          updatedAt: /* @__PURE__ */ new Date()
        }
      }
    );
    if (!result.matchedCount)
      throw new HttpError(409, "Temizlenecek oturum bulunamad\u0131.");
  }
  public(listing, online, participant = false) {
    return {
      id: listing._id,
      machineId: listing.machineId,
      ownerId: listing.ownerId,
      ownerName: listing.ownerName,
      name: listing.name,
      cpu: listing.cpu,
      memory: listing.memory,
      storage: listing.storage,
      network: listing.network,
      ...listing.cpuModel ? { cpuModel: listing.cpuModel } : {},
      ...listing.directoryGeneration ? { domainAccount: true } : {},
      published: listing.published,
      resetRequired: listing.resetRequired,
      online,
      available: online && listing.published && !listing.lease && !listing.resetRequired,
      lease: participant && listing.lease ? {
        ...listing.lease,
        expiresAt: listing.lease.expiresAt.toISOString()
      } : null
    };
  }
};

// apps/api/src/directory.ts
var import_node_crypto5 = require("node:crypto");
var import_mongodb3 = require("mongodb");

// packages/shared/src/directory.ts
function readWindowsAccountProfile(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Windows hesab\u0131 i\xE7in ad, soyad ve e-posta bilgilerini doldur.");
  const fields = value;
  const name = (key, label) => {
    const raw = fields[key];
    if (typeof raw !== "string" || /[\x00-\x1f\x7f]/.test(raw)) throw new Error(`${label} 1\u201364 karakter olmal\u0131.`);
    const result = raw.normalize("NFC").trim().replace(/ +/g, " ");
    if (!result || result.length > 64) throw new Error(`${label} 1\u201364 karakter olmal\u0131.`);
    return result;
  };
  const givenName = name("givenName", "Ad"), surname = name("surname", "Soyad");
  const email = typeof fields.email === "string" ? fields.email.trim() : "";
  if (email.length > 254 || /[\x00-\x1f\x7f]/.test(email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Ge\xE7erli bir Windows hesab\u0131 e-posta adresi gir.");
  return { givenName, surname, email };
}
var directoryUuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
var windowsUsername = /^[a-z][a-z0-9_-]{2,19}$/;

// apps/api/src/observability.ts
var import_node_crypto3 = require("node:crypto");

// packages/shared/src/admin.ts
function safeDiagnostic(input) {
  return (typeof input === "string" ? input : "\u0130\u015Flem tamamlanamad\u0131.").slice(0, 6e3).replace(/(?:mongodb(?:\+srv)?|https?|wss?):\/\/[^\s<>"']+/gi, "[adres gizlendi]").replace(/(?:Bearer\s+|tskey-)[\w.-]+/gi, "[anahtar gizlendi]").replace(/\b[a-f0-9]{64,}\b/gi, "[gizli de\u011Fer]").replace(/(<(?:Password|Value)>)[\s\S]*?(<\/(?:Password|Value)>)/gi, "$1[gizlendi]$2").replace(/((?:password|passwd|parola|şifre|secret|token|authkey|client_secret|connectionstring)["']?\s*[=:]\s*)(?:"[^"]*"|'[^']*'|[^\s,;]+)/gi, "$1[gizlendi]").replace(/[A-Z]:\\(?:Users|Documents and Settings)\\[^\s<>"']+/gi, "[yerel dosya]").replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, "").slice(0, 1200);
}

// apps/api/src/observability.ts
async function initializeObservability(db) {
  await Promise.all([
    db.collection("admin_events").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db.collection("admin_events").createIndex({ createdAt: -1, userId: 1 }),
    db.collection("machine_inventory").createIndex({ ownerId: 1, deviceId: 1, machineId: 1 }, { unique: true }),
    db.collection("admin_auth_sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db.collection("admin_ad_proofs").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
  ]);
}
async function recordDiagnostic(db, event) {
  const now = /* @__PURE__ */ new Date();
  const id = (0, import_node_crypto3.createHash)("sha256").update(`${event.userId}:${event.deviceId ?? event.source}:${event.id ?? (0, import_node_crypto3.randomUUID)()}`).digest("hex");
  const { id: _id, message, ...fields } = event;
  await db.collection("admin_events").updateOne({ _id: id }, { $setOnInsert: {
    ...fields,
    message: safeDiagnostic(message),
    createdAt: now,
    expiresAt: new Date(now.getTime() + 90 * 864e5)
  } }, { upsert: true });
}

// apps/api/src/installations.ts
var import_node_crypto4 = require("node:crypto");
var import_mongodb2 = require("mongodb");
var liveStates = ["pending", "approved", "running"];
var states = [...liveStates, "succeeded", "failed", "rejected", "cancelled", "expired"];
var sid = /^S-1-5-21-\d+-\d+-\d+-\d+$/;
var hash = /^[a-f0-9]{64}$/;
async function initializeInstallations(db) {
  await db.collection("installation_requests").createIndex({ status: 1, createdAt: -1 });
  await db.collection("installation_requests").createIndex({ machineId: 1, generation: 1, leaseId: 1 });
  await db.collection("installation_requests").createIndex({ deleteAfter: 1 }, { expireAfterSeconds: 0 });
  await db.collection("installation_requests").createIndex({ machineId: 1, generation: 1, leaseId: 1, appId: 1 }, { unique: true, partialFilterExpression: { source: "catalog", status: { $in: ["approved", "running", "succeeded"] } } });
  await db.collection("directory_machines").createIndex({ installAgentHash: 1 }, { sparse: true, unique: true });
  await db.collection("catalog_previews").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
}
async function installationBootstrap(db, machine, key) {
  const token = (0, import_node_crypto4.createHmac)("sha256", Buffer.from(key, "hex")).update(`install-agent-v1:${machine.ownerId}:${machine.machineId}:${machine.generation}`).digest("hex");
  await db.collection("directory_machines").updateOne({ _id: machine.machineId, ownerId: machine.ownerId, generation: machine.generation }, { $set: { installAgentHash: tokenHash(token), installAgentGeneration: machine.generation } });
  return { token, machineId: machine.machineId, generation: machine.generation };
}
function text(value, max, required = false, multiline = false) {
  if (typeof value !== "string" || value.length > max || (multiline ? /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/ : /[\x00-\x1f\x7f]/).test(value) || required && !value.trim()) throw new HttpError(400, "Kurulum bilgileri ge\xE7ersiz.");
  return value.trim();
}
var InstallationService = class {
  constructor(db) {
    this.db = db;
  }
  db;
  get requests() {
    return this.db.collection("installation_requests");
  }
  async authenticate(token) {
    if (!hash.test(token)) throw new HttpError(401, "VM kurulum arac\u0131s\u0131 do\u011Frulanamad\u0131.");
    const machine = await this.db.collection("directory_machines").findOne({ installAgentHash: tokenHash(token), phase: "ready", $expr: { $eq: ["$installAgentGeneration", "$generation"] } });
    if (!machine) throw new HttpError(401, "VM kurulum arac\u0131s\u0131n\u0131n kimli\u011Fi art\u0131k ge\xE7erli de\u011Fil.");
    await this.db.collection("directory_machines").updateOne({ _id: machine._id, generation: machine.generation }, { $set: { installAgentSeenAt: /* @__PURE__ */ new Date() } });
    return machine;
  }
  async lease(machine) {
    const listing = await this.db.collection("rental_listings").findOne({ machineId: machine.machineId, ownerId: machine.ownerId, directoryGeneration: machine.generation, resetRequired: false, "lease.phase": "active", "lease.expiresAt": { $gt: /* @__PURE__ */ new Date() } });
    if (!listing?.lease) throw new HttpError(409, "Bu VM'de aktif kiralama yok.");
    const account = await this.db.collection("directory_accounts").findOne({ _id: listing.lease.guestId, state: "ready" });
    if (!account || !sid.test(account.sid)) throw new HttpError(409, "Kirac\u0131n\u0131n Windows hesab\u0131 haz\u0131r de\u011Fil.");
    return { listing, account };
  }
  async context(machine) {
    try {
      const { listing, account } = await this.lease(machine);
      return { active: true, machineId: machine.machineId, generation: machine.generation, leaseId: listing.lease.id, windowsSid: account.sid, windowsUsername: `${account.domain}\\${account.username}`, expiresAt: listing.lease.expiresAt.toISOString(), serverNow: (/* @__PURE__ */ new Date()).toISOString() };
    } catch (e) {
      if (e instanceof HttpError && e.status === 409) return { active: false, serverNow: (/* @__PURE__ */ new Date()).toISOString() };
      throw e;
    }
  }
  async valid(request) {
    if (request.expiresAt <= /* @__PURE__ */ new Date() || request.status === "approved" && request.approvalExpiresAt <= /* @__PURE__ */ new Date()) throw new HttpError(409, "Kurulum talebinin s\xFCresi doldu.");
    const machine = await this.db.collection("directory_machines").findOne({ _id: request.machineId, generation: request.generation, ownerId: request.ownerId, phase: "ready" });
    if (!machine) throw new HttpError(409, "VM'nin \xE7al\u0131\u015Fma ortam\u0131 de\u011Fi\u015Fti.");
    if (request.source === "catalog") {
      const setting = await this.db.collection("application_catalog").findOne({ _id: request.appId });
      if (setting?.enabled === false || request.appId.startsWith("winget:") && (!setting?.enabled || setting.revision !== request.catalogRevision)) throw new HttpError(409, "Bu uygulaman\u0131n ma\u011Faza izni veya incelenen s\xFCr\xFCm\xFC de\u011Fi\u015Fti.");
    }
    const current = await this.lease(machine);
    if (current.listing.lease.id !== request.leaseId || current.listing.lease.guestId !== request.userId || current.account.sid !== request.windowsSid) throw new HttpError(409, "Kiralama veya Windows hesab\u0131 de\u011Fi\u015Fti.");
    return current;
  }
  async invalidate(request) {
    if (!liveStates.includes(request.status)) return request;
    if (request.source === "catalog" && request.status === "running" && (request.progressAt ?? request.startedAt)?.getTime() < Date.now() - 12e4) {
      await this.requests.updateOne({ _id: request._id, status: "running", progressAt: request.progressAt ?? { $exists: false } }, { $set: { status: "failed", resultCode: "CATALOG_AGENT_LOST", completedAt: /* @__PURE__ */ new Date() } });
      return await this.requests.findOne({ _id: request._id });
    }
    try {
      await this.valid(request);
    } catch (e) {
      if (!(e instanceof HttpError)) throw e;
      const status = request.expiresAt <= /* @__PURE__ */ new Date() || request.status === "approved" && request.approvalExpiresAt <= /* @__PURE__ */ new Date() ? "expired" : "cancelled";
      await this.requests.updateOne({ _id: request._id, status: { $in: liveStates } }, { $set: { status, completedAt: /* @__PURE__ */ new Date(), resultCode: status === "expired" ? "REQUEST_EXPIRED" : "LEASE_CHANGED" } });
      request.status = status;
    }
    return request;
  }
  dto(r) {
    const { _id: id, machineId, generation, computerName, machineName, leaseId, userId, userName, userEmail, windowsUsername: windowsUsername2, fileName, productName, version, publisher, signatureStatus, sha256, size, status, mode, reason, decidedBy, createdAt, decidedAt, expiresAt, completedAt, resultCode, exitCode, rebootRequired, source, appId, stage, downloadedBytes, totalBytes, catalogExecution: execution } = r;
    return { id, machineId, generation, computerName, machineName, leaseId, userId, userName, userEmail, windowsUsername: windowsUsername2, fileName, productName, version, publisher, signatureStatus, sha256, size, status, mode, reason, decidedBy, createdAt, decidedAt, expiresAt, completedAt, resultCode, exitCode, rebootRequired, source, appId, stage, downloadedBytes, totalBytes, execution };
  }
  async submit(machine, body) {
    const { listing, account } = await this.lease(machine);
    if (typeof body.id !== "string" || !uuid.test(body.id) || body.windowsSid !== account.sid || typeof body.sha256 !== "string" || !hash.test(body.sha256) || !Number.isSafeInteger(body.size) || Number(body.size) < 1 || Number(body.size) > 2 * 1024 ** 3 || !["valid", "unsigned", "untrusted"].includes(String(body.signatureStatus))) throw new HttpError(400, "Dosya veya Windows oturum bilgileri ge\xE7ersiz.");
    const fileName = text(body.fileName, 240, true);
    if (!/\.(exe|msi)$/i.test(fileName) || /[\\/:*?"<>|]/.test(fileName)) throw new HttpError(400, "Yaln\u0131zca EXE ve MSI kurulum dosyalar\u0131 kabul edilir.");
    const user = await this.db.collection("users").findOne({ _id: listing.lease.guestId });
    if (!user) throw new HttpError(409, "Kirac\u0131 hesab\u0131 bulunamad\u0131.");
    const existing = await this.requests.findOne({ _id: body.id });
    if (existing) {
      if (existing.machineId !== machine.machineId || existing.generation !== machine.generation || existing.leaseId !== listing.lease.id || existing.sha256 !== body.sha256 || existing.windowsSid !== account.sid) throw new HttpError(409, "Talep kimli\u011Fi ba\u015Fka bir dosyaya veya kiralamaya ait.");
      return { request: this.dto(await this.invalidate(existing)) };
    }
    if (await this.requests.countDocuments({ machineId: machine.machineId, status: { $in: liveStates }, expiresAt: { $gt: /* @__PURE__ */ new Date() } }) >= 10) throw new HttpError(429, "Bu VM i\xE7in en fazla 10 bekleyen kurulum olabilir.");
    const now = /* @__PURE__ */ new Date(), request = {
      _id: body.id,
      machineId: machine.machineId,
      ownerId: machine.ownerId,
      generation: machine.generation,
      computerName: machine.computerName,
      machineName: listing.name,
      leaseId: listing.lease.id,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      windowsSid: account.sid,
      windowsUsername: `${account.domain}\\${account.username}`,
      fileName,
      sha256: body.sha256,
      size: body.size,
      productName: text(body.productName, 200),
      version: text(body.version, 100),
      publisher: text(body.publisher, 300),
      signatureStatus: body.signatureStatus,
      status: "pending",
      createdAt: now,
      expiresAt: new Date(Math.min(now.getTime() + 30 * 6e4, listing.lease.expiresAt.getTime())),
      deleteAfter: new Date(now.getTime() + 90 * 864e5)
    };
    try {
      await this.requests.insertOne(request);
    } catch (e) {
      if (e instanceof import_mongodb2.MongoServerError && e.code === 11e3) return this.submit(machine, body);
      throw e;
    }
    return { request: this.dto(request) };
  }
  async list(query) {
    const page = Number(query.get("page") ?? 1), pageSize = Number(query.get("pageSize") ?? 25), q = (query.get("q") ?? "").trim(), status = query.get("status") ?? "";
    if (!Number.isSafeInteger(page) || page < 1 || page > 1e4 || ![10, 25, 50].includes(pageSize) || q.length > 100 || status && !states.includes(status)) throw new HttpError(400, "Kurulum filtresi ge\xE7ersiz.");
    for (const r of await this.requests.find({ status: { $in: liveStates } }).limit(500).toArray()) await this.invalidate(r);
    const filter = status ? { status } : {};
    if (q) filter.$or = ["fileName", "productName", "userName", "userEmail", "windowsUsername", "computerName", "machineName", "sha256"].map((key) => ({ [key]: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } }));
    const [items, total, pendingCount] = await Promise.all([this.requests.find(filter).sort({ createdAt: -1, _id: 1 }).skip((page - 1) * pageSize).limit(pageSize).toArray(), this.requests.countDocuments(filter), this.requests.countDocuments({ status: "pending", expiresAt: { $gt: /* @__PURE__ */ new Date() } })]);
    return { items: items.map((r) => this.dto(r)), total, page, pageSize, pendingCount, serverNow: (/* @__PURE__ */ new Date()).toISOString() };
  }
  async decide(id, admin, body) {
    if (!uuid.test(id) || !["approve", "reject"].includes(String(body.decision))) throw new HttpError(400, "Kurulum karar\u0131 ge\xE7ersiz.");
    const request = await this.requests.findOne({ _id: id });
    if (!request) throw new HttpError(404, "Kurulum talebi bulunamad\u0131.");
    await this.valid(request);
    if (request.sha256 !== body.sha256) throw new HttpError(409, "Ekrandaki dosya kimli\u011Fi taleple uyu\u015Fmuyor. Listeyi yenile.");
    const reason = text(body.reason ?? "", 500, false, true), approve = body.decision === "approve", mode = String(body.mode ?? "interactive");
    if (approve && (!["interactive", "msi", "inno", "nsis"].includes(mode) || mode === "msi" && !/\.msi$/i.test(request.fileName) || /\.msi$/i.test(request.fileName) && !["msi", "interactive"].includes(mode))) throw new HttpError(400, "Kurucu t\xFCr\xFC dosyayla uyu\u015Fmuyor.");
    const result = await this.requests.findOneAndUpdate({ _id: id, status: "pending", expiresAt: { $gt: /* @__PURE__ */ new Date() } }, { $set: { status: approve ? "approved" : "rejected", mode, reason, decidedBy: { id: admin.id, name: admin.name }, decidedAt: /* @__PURE__ */ new Date(), ...approve ? { approvalExpiresAt: new Date(Math.min(Date.now() + 10 * 6e4, request.expiresAt.getTime())) } : { completedAt: /* @__PURE__ */ new Date() } } }, { returnDocument: "after" });
    if (!result) throw new HttpError(409, "Bu talep daha \xF6nce karara ba\u011Fland\u0131 veya s\xFCresi doldu.");
    return { request: this.dto(result) };
  }
  async owned(machine, id) {
    if (!uuid.test(id)) throw new HttpError(400, "Talep kimli\u011Fi ge\xE7ersiz.");
    const request = await this.requests.findOne({ _id: id, machineId: machine.machineId, generation: machine.generation, ownerId: machine.ownerId });
    if (!request) throw new HttpError(404, "Kurulum talebi bulunamad\u0131.");
    return this.invalidate(request);
  }
  async state(machine, id) {
    return { request: this.dto(await this.owned(machine, id)) };
  }
  async cancel(machine, id, windowsSid) {
    const r = await this.owned(machine, id);
    if (r.windowsSid !== windowsSid) throw new HttpError(403, "Bu talep ba\u015Fka bir Windows hesab\u0131na ait.");
    await this.requests.updateOne({ _id: r._id, status: { $in: liveStates } }, { $set: { status: "cancelled", resultCode: "USER_CANCELLED", completedAt: /* @__PURE__ */ new Date() } });
    return { ok: true };
  }
  async claim(machine, id) {
    const request = await this.owned(machine, id);
    await this.valid(request);
    if (request.source === "catalog") throw new HttpError(409, "Ma\u011Faza kurulumu yaln\u0131zca ma\u011Faza kuyru\u011Fundan ba\u015Flat\u0131l\u0131r.");
    const claim = (0, import_node_crypto4.randomBytes)(32).toString("hex");
    const saved = await this.requests.findOneAndUpdate({ _id: id, status: "approved", approvalExpiresAt: { $gt: /* @__PURE__ */ new Date() }, expiresAt: { $gt: /* @__PURE__ */ new Date() } }, { $set: { status: "running", claimHash: tokenHash(claim), startedAt: /* @__PURE__ */ new Date() } }, { returnDocument: "after" });
    if (!saved) throw new HttpError(409, "Kurulum onay\u0131 kullan\u0131lm\u0131\u015F veya s\xFCresi dolmu\u015F.");
    return { request: this.dto(saved), claim, serverNow: (/* @__PURE__ */ new Date()).toISOString() };
  }
  async running(machine, id, claim) {
    const r = await this.owned(machine, id);
    await this.valid(r);
    if (typeof claim !== "string" || !hash.test(claim) || r.claimHash !== tokenHash(claim) || r.status !== "running") throw new HttpError(409, "Kurulum y\xFCr\xFCtme yetkisi ge\xE7ersiz.");
    if (r.source === "catalog") await Promise.all([
      this.requests.updateOne({ _id: r._id, status: "running", claimHash: r.claimHash }, { $set: { progressAt: /* @__PURE__ */ new Date() } }),
      this.db.collection("directory_machines").updateOne({ _id: machine.machineId, generation: machine.generation }, { $set: { installCatalogSeenAt: /* @__PURE__ */ new Date() } })
    ]);
    return r;
  }
  async finish(machine, id, body) {
    const r = await this.running(machine, id, body.claim);
    if (!Number.isSafeInteger(body.exitCode) || !["INSTALL_EXIT", "INSTALL_CANCELLED", "INSTALL_RESTART", "INSTALL_ERROR"].includes(String(body.resultCode))) throw new HttpError(400, "Kurulum sonucu ge\xE7ersiz.");
    const success = body.resultCode === "INSTALL_EXIT" && [0, 3010, 1641].includes(Number(body.exitCode));
    if (r.source === "catalog" && success && (r.stage !== "installing" || body.sha256 !== r.sha256 || body.signatureStatus !== "valid" || typeof body.publisher !== "string" || !body.publisher)) throw new HttpError(400, "Ma\u011Faza dosyas\u0131 ve kurulum sonucu do\u011Frulanamad\u0131.");
    const resultCode = r.source === "catalog" && body.resultCode === "INSTALL_ERROR" && ["downloading", "verifying", "installing"].includes(r.stage) ? "CATALOG_" + r.stage.toUpperCase() : body.resultCode;
    await this.requests.updateOne({ _id: r._id, status: "running", claimHash: r.claimHash }, { $set: { status: success ? "succeeded" : "failed", resultCode, exitCode: body.exitCode, rebootRequired: success && body.exitCode !== 0, completedAt: /* @__PURE__ */ new Date(), ...r.source === "catalog" ? { publisher: text(body.publisher ?? "", 300), signatureStatus: body.signatureStatus === "valid" ? "valid" : "untrusted", size: r.downloadedBytes } : {} } });
    if (!success) await recordDiagnostic(this.db, { id: r._id, userId: r.userId, machineId: r.machineId, leaseId: r.leaseId, source: "api", category: "installation", operation: "application-install", code: "ND_APP_" + body.resultCode, message: "Onaylanan uygulama kurulumu tamamlanamad\u0131. Kurulum talepleri ekran\u0131ndan sonu\xE7 kodunu inceleyin." });
    return { ok: true };
  }
};

// apps/api/src/directory.ts
function directoryOptions(env = process.env) {
  if (env.NODERA_DIRECTORY_ENABLED !== "true") return;
  const value = {
    enabled: true,
    domain: env.NODERA_AD_DOMAIN ?? "ad.nodera.test",
    netbios: env.NODERA_AD_NETBIOS ?? "NODERA",
    dnsServer: env.NODERA_AD_DNS ?? "100.90.52.46",
    computerOU: env.NODERA_AD_COMPUTER_OU ?? "OU=Computers,OU=Nodera,DC=ad,DC=nodera,DC=test",
    msiUrl: env.NODERA_TAILSCALE_MSI_URL ?? "",
    msiSha256: (env.NODERA_TAILSCALE_MSI_SHA256 ?? "").toLowerCase(),
    agentToken: env.NODERA_AD_AGENT_TOKEN ?? "",
    dataKey: env.NODERA_AD_DATA_KEY ?? ""
  };
  if (!/^[a-f0-9]{64}$/.test(value.dataKey) || !/^[a-f0-9]{64}$/.test(value.agentToken) || !/^[a-f0-9]{64}$/i.test(value.msiSha256) || !/^https:\/\/pkgs\.tailscale\.com\/stable\/tailscale-setup-[\d.]+-amd64\.msi$/.test(value.msiUrl) || !/^[a-z0-9.-]+$/.test(value.domain) || !/^[A-Z0-9_-]{1,15}$/.test(value.netbios) || !/^100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.\d{1,3}\.\d{1,3}$/.test(value.dnsServer))
    throw new Error("AD yap\u0131land\u0131rmas\u0131 eksik veya ge\xE7ersiz. NODERA_AD_* ve Tailscale paket ayarlar\u0131n\u0131 kontrol edin.");
  return value;
}
async function initializeDirectory(db) {
  await db.collection("directory_machines").createIndex({ computerName: 1 }, { unique: true });
  await db.collection("directory_accounts").createIndex({ username: 1 }, { unique: true });
  await db.collection("directory_jobs").createIndex({ status: 1, createdAt: 1 });
  await db.collection("directory_jobs").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
}
var DirectoryService = class {
  constructor(db, options) {
    this.db = db;
    this.options = options;
    this.machines = db.collection("directory_machines");
    this.jobs = db.collection("directory_jobs");
    this.accounts = db.collection("directory_accounts");
  }
  db;
  options;
  machines;
  jobs;
  accounts;
  config() {
    const { agentToken: _token, dataKey: _key, ...config } = this.options;
    return config;
  }
  async agentOnline() {
    const agent = await this.db.collection("directory_agent").findOne({ name: "dc1" });
    return agent?.seenAt instanceof Date && agent.seenAt.getTime() > Date.now() - 12e4;
  }
  seal(value) {
    const iv = (0, import_node_crypto5.randomBytes)(12), cipher = (0, import_node_crypto5.createCipheriv)("aes-256-gcm", Buffer.from(this.options.dataKey, "hex"), iv);
    return Buffer.concat([iv, cipher.update(JSON.stringify(value)), cipher.final(), cipher.getAuthTag()]).toString("base64");
  }
  open(value) {
    const data = Buffer.from(value, "base64"), decipher = (0, import_node_crypto5.createDecipheriv)("aes-256-gcm", Buffer.from(this.options.dataKey, "hex"), data.subarray(0, 12));
    decipher.setAuthTag(data.subarray(-16));
    return JSON.parse(Buffer.concat([decipher.update(data.subarray(12, -16)), decipher.final()]).toString("utf8"));
  }
  async enqueue(kind, ownerId, payload, machine, id = (0, import_node_crypto5.randomUUID)()) {
    const job = { _id: id, kind, ownerId, ...machine ? { machineId: machine.machineId, generation: machine.generation } : {}, encrypted: this.seal(payload), status: "queued", createdAt: /* @__PURE__ */ new Date(), expiresAt: new Date(Date.now() + 30 * 6e4) };
    await this.jobs.insertOne(job);
    return id;
  }
  publicMachine(doc) {
    const { machineId, deviceId, generation, computerName, phase, jobId, group, error } = doc;
    return { machineId, deviceId, generation, computerName, phase, jobId, ...group ? { group } : {}, ...error ? { error } : {} };
  }
  async owned(userId, machineId) {
    let value = await this.machines.findOne({ _id: machineId, ownerId: userId });
    if (!value) throw new HttpError(404, "VM'nin domain haz\u0131rl\u0131\u011F\u0131 bulunamad\u0131.");
    const job = await this.jobs.findOne({ _id: value.jobId });
    if (job && (job.status === "done" || job.status === "failed")) {
      await this.reconcile(job);
      value = await this.machines.findOne({ _id: machineId, ownerId: userId });
      if (!value) throw new HttpError(404, "VM'nin domain haz\u0131rl\u0131\u011F\u0131 temizlendi.");
    }
    if (["preparing", "joining", "verifying", "cleaning"].includes(value.phase) && (!job || job.expiresAt.getTime() <= Date.now()) && (value.changedAt?.getTime() ?? 0) < Date.now() - 3e4) {
      await this.machines.updateOne({ _id: machineId, generation: value.generation, jobId: value.jobId }, { $set: { phase: "failed", error: "AD haz\u0131rl\u0131\u011F\u0131n\u0131n s\xFCresi doldu. Temizleyip yeniden haz\u0131rlay\u0131n." } });
      value.phase = "failed";
    }
    return value;
  }
  async account(userId) {
    let value = await this.accounts.findOne({ _id: userId });
    if (value?.state === "pending") {
      const job = await this.jobs.findOne({ _id: value.jobId });
      if (job && ["done", "failed"].includes(job.status)) {
        await this.reconcile(job);
        value = await this.accounts.findOne({ _id: userId });
      } else if ((!job || job.expiresAt.getTime() <= Date.now()) && (value.changedAt?.getTime() ?? 0) < Date.now() - 3e4) {
        await this.accounts.updateOne({ _id: userId, jobId: value.jobId }, { $set: { state: "failed" } });
        value.state = "failed";
      }
    }
    return value ? { username: value.username, domain: value.domain, state: value.state, ...value.profile ? { profile: value.profile } : {}, ...value.error ? { error: value.error } : {} } : null;
  }
  async setAccount(user, body) {
    const username = typeof body.username === "string" ? body.username.trim().toLowerCase() : "", password = body.password;
    if (!windowsUsername.test(username) || /^(administrator|admin|guest|krbtgt|dc1|defaultaccount)$/.test(username) || password !== void 0 && (typeof password !== "string" || password.length < 14 || password.length > 128 || /[\x00\r\n]/.test(password)))
      throw new HttpError(400, "Windows kullan\u0131c\u0131 ad\u0131 3\u201320 k\xFC\xE7\xFCk harf/rakam, alt \xE7izgi veya tire; parola en az 14 karakter olmal\u0131.");
    await this.account(user.id);
    const existing = await this.accounts.findOne({ _id: user.id });
    if (existing?.state === "pending") throw new HttpError(409, "Windows hesab\u0131 i\u015Flemi devam ediyor.");
    if (existing && existing.username !== username) throw new HttpError(409, "Mevcut Windows hesab\u0131n\u0131n kullan\u0131c\u0131 ad\u0131 de\u011Fi\u015Ftirilemez.");
    let profile = existing?.profile;
    if (body.profile !== void 0) {
      try {
        profile = readWindowsAccountProfile(body.profile);
      } catch (error) {
        throw new HttpError(400, error.message);
      }
    }
    if (!existing && (password === void 0 || !profile)) throw new HttpError(400, "Yeni Windows hesab\u0131 i\xE7in ad, soyad, e-posta ve parola gerekli.");
    if (existing && password === void 0 && body.profile === void 0) throw new HttpError(400, "G\xFCncellenecek Windows hesab\u0131 bilgilerini gir.");
    const jobId = (0, import_node_crypto5.randomUUID)();
    try {
      if (existing) {
        const saved = await this.accounts.updateOne({ _id: user.id, jobId: existing.jobId, state: { $ne: "pending" } }, { $set: { state: "pending", jobId, changedAt: /* @__PURE__ */ new Date(), ...profile ? { profile } : {} }, $unset: { error: "" } });
        if (!saved.modifiedCount) throw new HttpError(409, "Windows hesab\u0131 i\u015Flemi devam ediyor.");
      } else await this.accounts.insertOne({ _id: user.id, username, domain: this.options.netbios, state: "pending", jobId, changedAt: /* @__PURE__ */ new Date(), profile });
    } catch (error) {
      await this.jobs.deleteOne({ _id: jobId, status: "queued" });
      if (error instanceof import_mongodb3.MongoServerError && error.code === 11e3) throw new HttpError(409, "Bu Windows kullan\u0131c\u0131 ad\u0131 kullan\u0131l\u0131yor veya ba\u015Fka bir hesap i\u015Flemi devam ediyor.");
      throw error;
    }
    try {
      await this.enqueue("account", user.id, { userId: user.id, username, ...password !== void 0 ? { password } : {}, ...profile ? { profile } : {}, objectGuid: existing?.objectGuid }, void 0, jobId);
    } catch (error) {
      await this.accounts.updateOne({ _id: user.id, jobId }, { $set: { state: "failed" } });
      throw error;
    }
    return this.account(user.id);
  }
  async prepare(user, body) {
    const { machineId, deviceId } = body;
    if (typeof machineId !== "string" || !directoryUuid.test(machineId) || typeof deviceId !== "string" || !directoryUuid.test(deviceId)) throw new HttpError(400, "Makine veya cihaz kimli\u011Fi ge\xE7ersiz.");
    const old = await this.machines.findOne({ _id: machineId });
    if (old) {
      if (old.ownerId !== user.id || old.deviceId !== deviceId) throw new HttpError(403, "Makinenin sahipli\u011Fi uyu\u015Fmuyor.");
      const current = await this.owned(user.id, machineId);
      if (current.phase === "cleaning" || current.phase === "failed") throw new HttpError(409, "\xD6nce \xF6nceki AD/VPN haz\u0131rl\u0131\u011F\u0131n\u0131 temizleyin.");
      return this.publicMachine(current);
    }
    const generation = (0, import_node_crypto5.randomUUID)(), jobId = (0, import_node_crypto5.randomUUID)();
    const doc = { _id: machineId, machineId, deviceId, ownerId: user.id, generation, computerName: "ND-" + generation.replaceAll("-", "").slice(0, 12).toUpperCase(), phase: "preparing", jobId, changedAt: /* @__PURE__ */ new Date() };
    await this.machines.insertOne(doc);
    await this.enqueue("provision", user.id, { ...this.publicMachine(doc), ownerId: user.id }, doc, jobId);
    return this.publicMachine(doc);
  }
  async bootstrap(user, id) {
    const machine = await this.owned(user.id, id), job = await this.jobs.findOne({ _id: machine.jobId, status: "done", expiresAt: { $gt: /* @__PURE__ */ new Date() } });
    if (machine.phase !== "joining" || !job?.result || job.kind !== "provision") throw new HttpError(409, "VM kat\u0131l\u0131m bilgisi hen\xFCz haz\u0131r de\u011Fil veya s\xFCresi doldu.");
    return { ...this.publicMachine(machine), ...this.open(job.result), config: this.config(), installAgent: await installationBootstrap(this.db, machine, this.options.dataKey) };
  }
  async verify(user, id, body) {
    const machine = await this.owned(user.id, id);
    if (body.generation !== machine.generation || body.computerName !== machine.computerName || body.domain !== this.options.domain || body.secureChannel !== true || body.nla !== true) throw new HttpError(409, "VM'nin domain ve ba\u011Flant\u0131 kan\u0131t\u0131 uyu\u015Fmuyor.");
    if (machine.phase === "ready" || machine.phase === "verifying") return this.publicMachine(machine);
    if (machine.phase !== "joining") throw new HttpError(409, "VM domain kat\u0131l\u0131m\u0131 i\xE7in haz\u0131r de\u011Fil.");
    const jobId = (0, import_node_crypto5.randomUUID)();
    const changed = await this.machines.updateOne({ _id: id, generation: machine.generation, phase: "joining" }, { $set: { phase: "verifying", jobId, changedAt: /* @__PURE__ */ new Date() } });
    if (changed.modifiedCount) await this.enqueue("verify", user.id, { ...this.publicMachine(machine), ownerId: user.id, computerGuid: machine.computerGuid }, machine, jobId);
    return this.publicMachine(await this.owned(user.id, id));
  }
  async installationConfig(user, id) {
    const machine = await this.owned(user.id, id);
    if (machine.phase !== "ready") throw new HttpError(409, "\xD6nce VM'nin AD haz\u0131rl\u0131\u011F\u0131n\u0131 tamamla.");
    if (await this.db.collection("rental_listings").findOne({ machineId: id, ownerId: user.id, $or: [{ published: true }, { "lease.phase": { $in: ["active", "reserved", "resetting"] } }] })) throw new HttpError(409, "Kurulum arac\u0131s\u0131n\u0131 g\xFCncellemeden \xF6nce VM'yi kiralamaya kapat ve mevcut kiralaman\u0131n temizlenmesini bekle.");
    return { ...this.publicMachine(machine), installAgent: await installationBootstrap(this.db, machine, this.options.dataKey) };
  }
  async cleanup(userId, id) {
    if (await this.db.collection("rental_listings").findOne({ ownerId: userId, machineId: id, resetRequired: false, "lease.phase": { $in: ["reserved", "active"] } }, { projection: { _id: 1 } })) throw new HttpError(409, "Aktif kiralama bitmeden makinenin AD/VPN kimli\u011Fi temizlenemez.");
    const machine = await this.owned(userId, id);
    if (machine.phase === "cleaning") return this.publicMachine(machine);
    const jobId = (0, import_node_crypto5.randomUUID)();
    const saved = await this.machines.updateOne({ _id: id, generation: machine.generation, jobId: machine.jobId }, { $set: { phase: "cleaning", jobId, changedAt: /* @__PURE__ */ new Date() } });
    if (saved.modifiedCount) await this.enqueue("cleanup", userId, { ...this.publicMachine(machine), ownerId: userId, computerGuid: machine.computerGuid, deviceNodeId: machine.deviceNodeId }, machine, jobId);
    return this.publicMachine(await this.owned(userId, id));
  }
  async assertReady(ownerId, machineId, generation) {
    const machine = await this.owned(ownerId, machineId);
    if (machine.phase !== "ready" || machine.generation !== generation) throw new HttpError(409, "VM'nin AD/VPN do\u011Frulamas\u0131 tamamlanmad\u0131.");
    return machine;
  }
  async grant(machine, guestId, leaseId) {
    const account = await this.accounts.findOne({ _id: guestId, state: "ready" });
    if (!account?.sid) throw new HttpError(409, "\xD6nce Windows hesab\u0131m ekran\u0131ndan ki\u015Fisel hesab\u0131n\u0131 haz\u0131rla.");
    const jobId = await this.enqueue("grant", machine.ownerId, { machineId: machine.machineId, generation: machine.generation, computerName: machine.computerName, ownerId: machine.ownerId, group: machine.group, username: account.username, sid: account.sid, leaseId }, machine);
    return { jobId, username: `${this.options.netbios}\\${account.username}` };
  }
  async jobDone(id) {
    const job = await this.jobs.findOne({ _id: id, expiresAt: { $gt: /* @__PURE__ */ new Date() } });
    if (!job || job.status === "failed") throw new HttpError(409, job?.error ?? "AD i\u015Flemi tamamlanamad\u0131.");
    return job.status === "done";
  }
  authenticate(token) {
    return (0, import_node_crypto5.timingSafeEqual)((0, import_node_crypto5.createHash)("sha256").update(token).digest(), (0, import_node_crypto5.createHash)("sha256").update(this.options.agentToken).digest());
  }
  async claim() {
    await this.db.collection("directory_agent").updateOne({ name: "dc1" }, { $set: { seenAt: /* @__PURE__ */ new Date() } }, { upsert: true });
    const claim = (0, import_node_crypto5.randomBytes)(32).toString("hex"), now = /* @__PURE__ */ new Date();
    const job = await this.jobs.findOneAndUpdate({ expiresAt: { $gt: now }, $or: [{ status: "queued" }, { status: "running", claimUntil: { $lt: now } }] }, { $set: { status: "running", claim, claimUntil: new Date(Date.now() + 18e4) } }, { sort: { createdAt: 1 }, returnDocument: "after" });
    if (!job) return null;
    const current = job.kind === "account" ? await this.accounts.findOne({ _id: job.ownerId, jobId: job._id }) : job.machineId ? await this.machines.findOne({ _id: job.machineId, generation: job.generation, ...job.kind === "grant" ? { phase: "ready" } : { jobId: job._id } }) : null;
    if (!current) {
      await this.jobs.updateOne({ _id: job._id, claim }, { $set: { status: "failed", error: "AD i\u015Flemi daha yeni bir istekle de\u011Fi\u015Ftirildi." }, $unset: { encrypted: "", claim: "" } });
      return null;
    }
    return { id: job._id, kind: job.kind, claim, payload: this.open(job.encrypted), config: this.config() };
  }
  async complete(id, body) {
    if (!directoryUuid.test(id) || typeof body.claim !== "string" || typeof body.success !== "boolean" || !body.result || typeof body.result !== "object" || Array.isArray(body.result)) throw new HttpError(400, "AD i\u015F sonucu ge\xE7ersiz.");
    const job = await this.jobs.findOne({ _id: id, status: "running", claim: body.claim, claimUntil: { $gt: /* @__PURE__ */ new Date() }, expiresAt: { $gt: /* @__PURE__ */ new Date() } });
    if (!job) throw new HttpError(409, "AD i\u015Finin s\xFCresi veya sahipli\u011Fi de\u011Fi\u015Fti.");
    const result = body.result;
    if (body.success) {
      if (job.kind === "provision" && (typeof result.odj !== "string" || result.odj.length > 18e4 || typeof result.authKey !== "string" || !directoryUuid.test(String(result.computerGuid)) || !/^GG_ND_[A-F0-9]{12}$/.test(String(result.group)))) throw new HttpError(400, "Domain haz\u0131rl\u0131k sonucu ge\xE7ersiz.");
      if (job.kind === "account" && (!/^S-1-5-21-[\d-]+$/.test(String(result.sid)) || !directoryUuid.test(String(result.objectGuid)))) throw new HttpError(400, "Windows hesab\u0131 sonucu ge\xE7ersiz.");
      if (job.kind === "verify" && (!/^100\./.test(String(result.ip)) || typeof result.deviceNodeId !== "string" || !result.deviceNodeId)) throw new HttpError(400, "VPN do\u011Frulama sonucu ge\xE7ersiz.");
      if (job.kind === "account") {
        const requested = this.open(job.encrypted).profile;
        const confirmed = result.profile;
        if (requested && (!confirmed || ["givenName", "surname", "email"].some((key) => confirmed[key] !== requested[key]))) {
          body.success = false;
          result.code = "DIRECTORY_ACCOUNT_PROFILE";
        }
      }
    }
    const codes = {
      DIRECTORY_ACCOUNT: "Windows hesab\u0131 olu\u015Fturulamad\u0131. Kullan\u0131c\u0131 ad\u0131, AD parola politikas\u0131 ve Users OU yetkisini kontrol edin.",
      DIRECTORY_ACCOUNT_PROFILE: "AD profil alanlar\u0131 do\u011Frulanamad\u0131. DC1 \xFCzerindeki Nodera AD arac\u0131s\u0131n\u0131 profil destekleyen s\xFCr\xFCme g\xFCncelleyip yeniden deneyin.",
      DIRECTORY_DOMAIN_JOIN: "Domain kat\u0131l\u0131m verisi olu\u015Fturulamad\u0131. DC1 \xFCzerindeki servis hesab\u0131n\u0131n Computers OU yetkisini kontrol edin.",
      DIRECTORY_VPN_KEY: "Tailscale kay\u0131t anahtar\u0131 olu\u015Fturulamad\u0131. DC1 \xFCzerindeki OAuth istemcisinin auth_keys yetkisini ve VM etiketini kontrol edin.",
      DIRECTORY_DNS: "VM'nin dinamik DNS kayd\u0131 VPN IP'siyle uyu\u015Fmuyor. VM DNS kayd\u0131n\u0131 ve DC1 DNS hizmetini kontrol edin.",
      DIRECTORY_GRANT: "Ki\u015Fisel Windows hesab\u0131n\u0131n VM oturum izni verilemedi. Parola s\xFCresini ve VM grubunu kontrol edin.",
      DIRECTORY_CLEANUP: "\xD6nceki AD/VPN kimli\u011Fi temizlenemedi. DC1 arac\u0131s\u0131, Tailscale devices:core izni ve OU yetkilerini kontrol edin."
    };
    const error = codes[String(result.code)] ?? "AD arac\u0131s\u0131 i\u015Flemi tamamlayamad\u0131. DC1 \xFCzerindeki Nodera AD hizmetini ve ilgili OU yetkilerini kontrol edin.";
    const saved = await this.jobs.updateOne({ _id: id, status: "running", claim: body.claim }, { $set: { status: body.success ? "done" : "failed", ...body.success ? { result: this.seal(result) } : { error } }, $unset: { encrypted: "", claim: "" } });
    if (!saved.modifiedCount) throw new HttpError(409, "AD sonucu zaten i\u015Flendi.");
    if (!body.success) await recordDiagnostic(this.db, { id, userId: job.ownerId, source: "ad-agent", category: "directory", code: Object.hasOwn(codes, String(result.code)) ? String(result.code) : "ND_DIRECTORY_AGENT", message: error, operation: job.kind, jobId: id, ...job.machineId ? { machineId: job.machineId } : {} }).catch(() => {
    });
    await this.reconcile(await this.jobs.findOne({ _id: id }));
    return { ok: true };
  }
  async reconcile(job) {
    if (job.status !== "done" && job.status !== "failed") return;
    const id = job._id, success = job.status === "done", result = job.result ? this.open(job.result) : {}, error = job.error;
    if (job.kind === "account") await this.accounts.updateOne({ _id: job.ownerId, jobId: id, state: "pending" }, { $set: success ? { state: "ready", sid: String(result.sid), objectGuid: String(result.objectGuid) } : { state: "failed", error } });
    if (job.machineId && ["provision", "verify", "cleanup"].includes(job.kind)) {
      if (success && job.kind === "cleanup") {
        await this.machines.deleteOne({ _id: job.machineId, generation: job.generation, jobId: id, phase: "cleaning" });
        await this.jobs.updateMany({ machineId: job.machineId, generation: job.generation, _id: { $ne: id }, status: { $in: ["done", "failed"] } }, { $unset: { encrypted: "", result: "" } });
      } else {
        await this.machines.updateOne({ _id: job.machineId, generation: job.generation, jobId: id }, { $set: success ? job.kind === "provision" ? { phase: "joining", computerGuid: String(result.computerGuid), group: String(result.group) } : { phase: "ready", deviceNodeId: String(result.deviceNodeId) } : { phase: "failed", error } });
        if (success && job.kind === "verify") await this.jobs.updateMany({ machineId: job.machineId, generation: job.generation, kind: "provision" }, { $unset: { result: "", encrypted: "" } });
      }
    }
  }
};

// apps/api/src/store.ts
var fallbackHash = "0".repeat(32) + ":" + "0".repeat(128);
var publicUser = (account) => ({
  id: account.id,
  name: account.name,
  email: account.email
});
var AccountStore = class {
  constructor(db) {
    this.db = db;
  }
  db;
  get database() {
    return this.db;
  }
  get accounts() {
    return this.db.collection("users");
  }
  get sessions() {
    return this.db.collection("auth_sessions");
  }
  get attempts() {
    return this.db.collection("auth_attempts");
  }
  async initialize() {
    await initializeMarketplace(this.db);
    await initializeDirectory(this.db);
    await initializeObservability(this.db);
    await initializeInstallations(this.db);
    await this.accounts.createIndex(
      { email: 1 },
      { unique: true, name: "unique_email" }
    );
    await this.sessions.createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0, name: "expired_sessions" }
    );
    await this.sessions.createIndex({ userId: 1 });
    await this.attempts.createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0, name: "expired_attempts" }
    );
  }
  async ping() {
    await this.db.command({ ping: 1 });
  }
  async rateLimit(key, limit) {
    const now = Date.now(), window = 6e5;
    const id = `${key}:${Math.floor(now / window)}`;
    const update = {
      $inc: { count: 1 },
      $setOnInsert: {
        expiresAt: new Date((Math.floor(now / window) + 1) * window)
      }
    };
    let result;
    try {
      result = await this.attempts.findOneAndUpdate({ _id: id }, update, {
        upsert: true,
        returnDocument: "after"
      });
    } catch (error) {
      if (!(error instanceof import_mongodb4.MongoServerError) || error.code !== 11e3)
        throw error;
      result = await this.attempts.findOneAndUpdate({ _id: id }, update, {
        returnDocument: "after"
      });
    }
    if (!result || result.count > limit)
      throw new HttpError(
        429,
        "\xC7ok fazla deneme. 10 dakika sonra tekrar deneyin."
      );
  }
  async register(name, email, password, remember = false) {
    const id = (0, import_node_crypto6.randomUUID)();
    const account = {
      _id: id,
      id,
      name,
      email,
      passwordHash: await hashPassword(password),
      createdAt: /* @__PURE__ */ new Date()
    };
    try {
      await this.accounts.insertOne(account);
    } catch (error) {
      if (error instanceof import_mongodb4.MongoServerError && error.code === 11e3)
        throw new HttpError(409, "Bu e-posta ile zaten bir hesap var.");
      throw error;
    }
    return this.issueSession(account, remember);
  }
  async login(email, password, remember = false) {
    const user = await this.verifyCredentials(email, password);
    return this.issueSession(user, remember);
  }
  async verifyCredentials(email, password) {
    const account = await this.accounts.findOne({ email });
    const valid = await verifyPassword(
      password,
      account?.passwordHash ?? fallbackHash
    );
    if (!account || !valid)
      throw new HttpError(401, "E-posta veya parola hatal\u0131.");
    return publicUser(account);
  }
  async issueSession(account, remember) {
    const token = (0, import_node_crypto6.randomBytes)(32).toString("hex");
    const expiresAt = new Date(Date.now() + (remember ? 30 : 1) * 864e5);
    await this.sessions.insertOne({
      _id: tokenHash(token),
      userId: account.id,
      createdAt: /* @__PURE__ */ new Date(),
      expiresAt
    });
    return {
      user: publicUser(account),
      token,
      expiresAt: expiresAt.toISOString()
    };
  }
  async userFor(token) {
    const session = await this.sessions.findOne({
      _id: tokenHash(token),
      expiresAt: { $gt: /* @__PURE__ */ new Date() }
    });
    if (!session)
      throw new HttpError(401, "Oturumun sona erdi. Yeniden giri\u015F yap.");
    const account = await this.accounts.findOne({ _id: session.userId });
    if (!account)
      throw new HttpError(401, "Hesap bulunamad\u0131. Yeniden giri\u015F yap.");
    return publicUser(account);
  }
  async logout(token) {
    await this.sessions.deleteOne({ _id: tokenHash(token) });
  }
};
async function connectAccounts(uri, databaseName) {
  if (!/^mongodb(?:\+srv)?:\/\//.test(uri))
    throw new IdentityStartupError("CONFIG_URI");
  if (!/^[a-zA-Z0-9_-]{1,63}$/.test(databaseName))
    throw new IdentityStartupError("CONFIG_DATABASE");
  const client = new import_mongodb4.MongoClient(uri, {
    appName: "Nodera Identity",
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5e3,
    connectTimeoutMS: 5e3,
    socketTimeoutMS: 5e3,
    timeoutMS: 5e3
  });
  try {
    await client.connect();
    const store = new AccountStore(client.db(databaseName));
    await store.initialize();
    return { store, client };
  } catch (error) {
    await client.close();
    throw error;
  }
}

// apps/api/src/app.ts
var import_node_http = __toESM(require("node:http"), 1);
var import_node_crypto11 = require("node:crypto");
var import_node_net = require("node:net");

// apps/api/src/relay.ts
var import_ws = require("ws");
var import_node_crypto7 = require("node:crypto");

// packages/shared/src/marketplace-filters.ts
var marketResources = ["cpu", "memory", "storage"];
var marketSorts = {
  newest: "Son eklenen",
  cpuAsc: "\u0130\u015Flemci: azdan \xE7o\u011Fa",
  cpuDesc: "\u0130\u015Flemci: \xE7oktan aza",
  memoryAsc: "RAM: azdan \xE7o\u011Fa",
  memoryDesc: "RAM: \xE7oktan aza",
  storageAsc: "Depolama: azdan \xE7o\u011Fa",
  storageDesc: "Depolama: \xE7oktan aza"
};
var defaultMarketFilters = {
  cpuMin: 0,
  cpuMax: 0,
  memoryMin: 0,
  memoryMax: 0,
  storageMin: 0,
  storageMax: 0,
  sort: "newest",
  page: 1
};
function readMarketFilters(params = new URLSearchParams()) {
  const result = { ...defaultMarketFilters };
  for (const key of params.keys()) {
    if (!Object.hasOwn(defaultMarketFilters, key) || params.getAll(key).length !== 1)
      throw new Error("Filtre parametresi ge\xE7ersiz.");
  }
  for (const resource2 of marketResources) {
    for (const bound of ["Min", "Max"]) {
      const key = `${resource2}${bound}`;
      const value = params.get(key);
      if (value === null) continue;
      if (!/^\d{1,5}$/.test(value)) throw new Error("Kaynak filtresi tam say\u0131 olmal\u0131.");
      const limit = resource2 === "cpu" ? 256 : resource2 === "memory" ? 1024 : 65536;
      const number = Number(value);
      if (number > limit) throw new Error("Kaynak filtresi desteklenen aral\u0131\u011F\u0131n d\u0131\u015F\u0131nda.");
      result[key] = number;
    }
    if (result[`${resource2}Max`] && result[`${resource2}Min`] > result[`${resource2}Max`])
      throw new Error("En az de\u011Feri en \xE7ok de\u011Ferinden b\xFCy\xFCk olamaz.");
  }
  const sort = params.get("sort");
  if (sort !== null) {
    if (!Object.hasOwn(marketSorts, sort)) throw new Error("S\u0131ralama ge\xE7ersiz.");
    result.sort = sort;
  }
  const page = params.get("page");
  if (page !== null) {
    if (!/^[1-9]\d{0,4}$/.test(page)) throw new Error("Sayfa numaras\u0131 ge\xE7ersiz.");
    result.page = Number(page);
  }
  return result;
}

// apps/api/src/relay.ts
function createRentalRelay(server, accounts, rateSecret, directory) {
  const market = new MarketplaceStore(accounts.database);
  const hosts2 = /* @__PURE__ */ new Map();
  const pairs = /* @__PURE__ */ new Map();
  const credentials2 = /* @__PURE__ */ new Map();
  const clients = /* @__PURE__ */ new Map();
  const wss = new import_ws.WebSocketServer({
    noServer: true,
    maxPayload: 65536,
    perMessageDeflate: false
  });
  const key = (owner, device) => `${owner}:${device}`;
  const peerFor = (listing) => hosts2.get(key(listing.ownerId, listing.deviceId));
  const online = (listing) => {
    if (directory && !listing.directoryGeneration) return false;
    const peer = peerFor(listing);
    return !!peer && peer.ws.readyState === import_ws.WebSocket.OPEN && peer.seen > Date.now() - 3e4 && peer.ready.has(listing.machineId);
  };
  const send = (peer, message) => {
    if (peer?.ws.readyState === import_ws.WebSocket.OPEN)
      peer.ws.send(JSON.stringify(message));
  };
  function closePair(id) {
    const pair = pairs.get(id);
    if (!pair) return;
    pairs.delete(id);
    clearTimeout(pair.timer);
    for (const stream of pair.streams ?? []) stream.destroy();
    pair.host?.terminate();
    pair.guest?.terminate();
  }
  async function end(listing) {
    if (!listing.lease) return;
    closePair(listing.lease.id);
    await market.end(listing);
    if (directory && listing.directoryGeneration) await directory.cleanup(listing.ownerId, listing.machineId).catch(() => {
    });
    send(peerFor(listing), {
      type: "reset",
      listingId: listing._id,
      machineId: listing.machineId,
      leaseId: listing.lease.id
    });
  }
  async function pending(peer) {
    const dirty = await market.listings.find({
      ownerId: peer.user.id,
      deviceId: peer.deviceId,
      resetRequired: true
    }).limit(16).toArray();
    for (const listing of dirty)
      send(peer, {
        type: "reset",
        listingId: listing._id,
        machineId: listing.machineId,
        leaseId: listing.lease?.id
      });
  }
  server.on("upgrade", (req, socket, head) => {
    socket.on("error", () => {
    });
    const deadline = setTimeout(() => socket.destroy(), 8e3);
    void (async () => {
      const url = new URL(req.url ?? "/", "http://relay.local");
      const token = req.headers.authorization?.match(
        /^Bearer ([a-f0-9]{64})$/
      )?.[1];
      if (!token || req.headers.origin || clients.size >= 256)
        throw new Error();
      const user = await accounts.userFor(token);
      const deviceId = url.searchParams.get("deviceId") ?? "";
      const control = url.pathname === "/v1/relay/host" && uuid.test(deviceId);
      const data = url.pathname.match(
        /^\/v1\/relay\/data\/([a-f0-9-]{36})\/(host|guest)$/
      );
      let listing = null;
      if (!control) {
        if (!data) throw new Error();
        listing = await market.forLease(data[1]);
        if (!listing?.lease || listing.resetRequired || listing.lease.expiresAt.getTime() <= Date.now() || !online(listing))
          throw new Error();
        if (data[2] === "host" ? listing.ownerId !== user.id || listing.deviceId !== deviceId : listing.lease.guestId !== user.id)
          throw new Error();
        if (listing.directoryGeneration) {
          if (!directory || !listing.lease.startedAt) throw new Error();
          await directory.assertReady(listing.ownerId, listing.machineId, listing.directoryGeneration);
        }
        const pair = pairs.get(data[1]);
        if (pair?.[data[2]]) throw new Error();
      }
      clearTimeout(deadline);
      if (socket.destroyed) return;
      wss.handleUpgrade(req, socket, head, (ws) => {
        clients.set(ws, token);
        ws.on("error", () => {
        });
        ws.on("close", () => clients.delete(ws));
        if (control) {
          const hostKey = key(user.id, deviceId);
          hosts2.get(hostKey)?.ws.terminate();
          const peer = {
            ws,
            user,
            token,
            deviceId,
            seen: Date.now(),
            ready: /* @__PURE__ */ new Set()
          };
          hosts2.set(hostKey, peer);
          ws.send(JSON.stringify({ type: "ready" }));
          ws.on("message", (raw, binary) => {
            if (binary || raw.toString().length > 8192) {
              ws.terminate();
              return;
            }
            try {
              const message = JSON.parse(raw.toString());
              if (message.type !== "heartbeat" || !Array.isArray(message.ready) || message.ready.length > 16 || !message.ready.every(
                (id) => typeof id === "string" && uuid.test(id)
              ))
                throw new Error();
              peer.ready = new Set(message.ready);
              peer.seen = Date.now();
              ws.send(JSON.stringify({ type: "heartbeat" }));
              void pending(peer).catch(() => ws.terminate());
            } catch {
              ws.terminate();
            }
          });
          ws.on("close", () => {
            if (hosts2.get(hostKey) !== peer) return;
            hosts2.delete(hostKey);
            void market.listings.find({ ownerId: user.id, deviceId }).toArray().then(async (listings) => {
              for (const item2 of listings) {
                credentials2.delete(item2._id);
                if (item2.lease && item2.lease.phase !== "resetting") {
                  if (item2.directoryGeneration) closePair(item2.lease.id);
                  else await end(item2);
                }
              }
            }).catch(() => {
            });
          });
          return;
        }
        const item = listing;
        ws.pause();
        const leaseId = item.lease.id;
        let pair = pairs.get(leaseId);
        if (!pair) {
          pair = {
            timer: setTimeout(() => {
              if (item.directoryGeneration) closePair(leaseId);
              else void end(item).catch(() => closePair(leaseId));
            }, 2e4)
          };
          pairs.set(leaseId, pair);
        }
        pair[data[2]] = ws;
        ws.on("close", () => {
          if (pairs.has(leaseId)) {
            if (item.directoryGeneration) closePair(leaseId);
            else void end(item).catch(() => closePair(leaseId));
          }
        });
        if (data[2] === "guest" && !pair.host)
          send(peerFor(item), {
            type: "connect",
            machineId: item.machineId,
            listingId: item._id,
            leaseId,
            ...item.directoryGeneration ? { expiresAt: item.lease.expiresAt.toISOString(), directoryGeneration: item.directoryGeneration } : {}
          });
        if (pair.host && pair.guest && !pair.pairing) {
          pair.pairing = true;
          const connectedPair = pair;
          void market.listings.updateOne(
            {
              _id: item._id,
              "lease.id": leaseId,
              "lease.phase": { $in: ["reserved", "active"] },
              resetRequired: false
            },
            {
              $set: {
                "lease.phase": "active",
                ...item.directoryGeneration ? {} : {
                  "lease.startedAt": item.lease.startedAt ?? /* @__PURE__ */ new Date(),
                  "lease.expiresAt": item.lease.startedAt ? item.lease.expiresAt : new Date(Date.now() + 60 * 6e4),
                  "lease.durationMinutes": 60
                }
              }
            }
          ).then((result) => {
            if (!result.matchedCount || pairs.get(leaseId) !== connectedPair) {
              closePair(leaseId);
              return;
            }
            clearTimeout(connectedPair.timer);
            const left = (0, import_ws.createWebSocketStream)(connectedPair.host, {
              highWaterMark: 65536
            });
            const right = (0, import_ws.createWebSocketStream)(connectedPair.guest, {
              highWaterMark: 65536
            });
            connectedPair.streams = [left, right];
            for (const stream of connectedPair.streams)
              stream.on("error", () => {
                if (item.directoryGeneration) closePair(leaseId);
                else void end(item).catch(() => closePair(leaseId));
              });
            left.pipe(right);
            right.pipe(left);
            connectedPair.host.resume();
            connectedPair.guest.resume();
          }).catch(() => {
            if (item.directoryGeneration) closePair(leaseId);
            else void end(item).catch(() => closePair(leaseId));
          });
        }
      });
    })().catch(() => {
      clearTimeout(deadline);
      if (!socket.destroyed)
        socket.end("HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n");
    });
  });
  let checking = false;
  const timer = setInterval(() => {
    if (checking) return;
    checking = true;
    void (async () => {
      for (const [ws, token] of clients) {
        try {
          await accounts.userFor(token);
        } catch {
          ws.terminate();
        }
      }
      for (const peer of hosts2.values())
        if (peer.seen < Date.now() - 3e4) peer.ws.terminate();
      const expired = await market.listings.find({
        "lease.phase": { $in: ["reserved", "active"] },
        "lease.expiresAt": { $lte: /* @__PURE__ */ new Date() }
      }).limit(100).toArray();
      for (const listing of expired) await end(listing);
    })().catch(() => {
      for (const ws of clients.keys()) ws.terminate();
    }).finally(() => {
      checking = false;
    });
  }, 1e4);
  timer.unref();
  const stop = () => {
    clearInterval(timer);
    for (const ws of clients.keys()) ws.terminate();
    for (const id of pairs.keys()) closePair(id);
    wss.close();
    credentials2.clear();
  };
  server.on("close", stop);
  return {
    online,
    stop,
    market,
    async handle(user, method, pathname, body, params = new URLSearchParams()) {
      const publicItem = (item) => ({
        ...market.public(
          item,
          online(item),
          item.ownerId === user.id || item.lease?.guestId === user.id
        ),
        ...online(item) ? { availabilityCheckedAt: new Date(peerFor(item).seen).toISOString() } : {}
      });
      if (method === "GET" && pathname === "/v1/marketplace") {
        let filters;
        try {
          filters = readMarketFilters(params);
        } catch (error) {
          throw new HttpError(400, error.message);
        }
        const readyHosts = [...hosts2.values()].filter(
          (peer) => peer.ws.readyState === import_ws.WebSocket.OPEN && peer.seen > Date.now() - 3e4 && peer.ready.size
        ).map((peer) => ({ ownerId: peer.user.id, deviceId: peer.deviceId, machineId: { $in: [...peer.ready] } }));
        const query = {
          published: true,
          ownerId: { $ne: user.id },
          lease: null,
          resetRequired: false,
          ...directory ? { directoryGeneration: { $type: "string" } } : { _id: { $in: [...credentials2.keys()] } },
          $or: readyHosts.length ? readyHosts : [{ _id: "no-online-host" }]
        };
        for (const resource2 of marketResources) {
          const min = filters[`${resource2}Min`], max = filters[`${resource2}Max`];
          if (min || max) query[resource2] = { ...min ? { $gte: min } : {}, ...max ? { $lte: max } : {} };
        }
        const sort = filters.sort === "newest" ? { updatedAt: -1, _id: 1 } : {
          [filters.sort.replace(/Asc|Desc$/, "")]: filters.sort.endsWith("Asc") ? 1 : -1,
          _id: 1
        };
        const pageSize = 12;
        const totalOffers = await market.listings.countDocuments(query);
        const page = Math.min(filters.page, Math.max(1, Math.ceil(totalOffers / pageSize)));
        const [offers, mine, rentals] = await Promise.all([
          market.listings.find(query).sort(sort).skip((page - 1) * pageSize).limit(pageSize).toArray(),
          market.listings.find({ ownerId: user.id }).limit(100).toArray(),
          market.listings.find({ "lease.guestId": user.id }).limit(20).toArray()
        ]);
        return {
          offers: offers.filter(online).map(publicItem),
          mine: mine.map(publicItem),
          rentals: rentals.map(publicItem),
          page,
          pageSize,
          totalOffers
        };
      }
      if (method === "POST" && pathname === "/v1/marketplace/publish") {
        const deviceId = String(body.deviceId ?? "");
        const peer = hosts2.get(key(user.id, deviceId));
        if (!peer || !peer.ready.has(String(body.machineId)) || peer.seen < Date.now() - 3e4)
          throw new HttpError(
            409,
            "Makinenin \xE7evrimi\xE7i ve RDP ba\u011Flant\u0131s\u0131n\u0131n haz\u0131r olmas\u0131 gerekiyor."
          );
        if (directory) await directory.assertReady(user.id, String(body.machineId), body.directoryGeneration);
        if (!directory && (typeof body.username !== "string" || !/^[a-zA-Z0-9_.\\@-]{1,64}$/.test(body.username) || typeof body.password !== "string" || body.password.length < 12 || body.password.length > 128))
          throw new HttpError(
            400,
            "VM i\xE7in ayr\u0131 Windows kullan\u0131c\u0131 ad\u0131 ve en az 12 karakterli parolay\u0131 girin."
          );
        const item = await market.publish(user, deviceId, body);
        if (!directory) credentials2.set(item._id, { username: String(body.username), password: String(body.password) });
        return { offer: publicItem(item) };
      }
      const action = pathname.match(
        /^\/v1\/marketplace\/([a-f0-9-]{36})\/(reserve|unpublish|reset)$/
      );
      if (method === "POST" && action) {
        await accounts.rateLimit(
          (0, import_node_crypto7.createHmac)("sha256", rateSecret).update(`rental:${user.id}`).digest("hex"),
          60
        );
        const item = await market.listings.findOne({ _id: action[1] });
        if (!item) throw new HttpError(404, "Makine bulunamad\u0131.");
        if (action[2] === "reserve") {
          if (body.confirm !== true)
            throw new HttpError(
              400,
              "Oturum sonunda dosyalar\u0131n silinece\u011Fini onaylay\u0131n."
            );
          if (!online(item) || !item.directoryGeneration && !credentials2.has(item._id))
            throw new HttpError(409, "Makine \xE7evrimd\u0131\u015F\u0131.");
          if (item.directoryGeneration) {
            if (!directory) throw new HttpError(503, "AD hizmeti kapal\u0131.");
            const machine = await directory.assertReady(item.ownerId, item.machineId, item.directoryGeneration);
            if ((await directory.account(user.id))?.state !== "ready") throw new HttpError(409, "\xD6nce Windows hesab\u0131m ekran\u0131ndan hesab\u0131n\u0131 olu\u015Ftur.");
            const durationMinutes = Number(body.durationMinutes ?? 240);
            if (![60, 120, 240, 480, 720, 1440].includes(durationMinutes)) throw new HttpError(400, "Kiralama s\xFCresi ge\xE7ersiz.");
            const reserved = await market.reserve(user, item._id, durationMinutes);
            try {
              const grant = await directory.grant(machine, user.id, reserved.lease.id);
              await market.listings.updateOne({ _id: item._id, "lease.id": reserved.lease.id, "lease.phase": "reserved" }, { $set: { "lease.grantJobId": grant.jobId } });
              return { offer: publicItem(await market.forLease(reserved.lease.id)) };
            } catch (error) {
              await end(reserved);
              throw error;
            }
          }
          return { offer: publicItem(await market.reserve(user, item._id)) };
        }
        if (item.ownerId !== user.id || item.deviceId !== body.deviceId)
          throw new HttpError(403, "Bu makineyi y\xF6netemezsiniz.");
        if (action[2] === "reset") {
          if (typeof body.leaseId !== "string" || !uuid.test(body.leaseId))
            throw new HttpError(400, "Temizlenecek oturum kimli\u011Fi ge\xE7ersiz.");
          if (directory && item.directoryGeneration) {
            const machine = await directory.assertReady(user.id, item.machineId, body.directoryGeneration);
            if (!peerFor(item)?.ready.has(item.machineId)) throw new HttpError(409, "Yeni \xE7al\u0131\u015Fma ortam\u0131n\u0131n RDP kontrol\xFC tamamlanmal\u0131.");
            await market.reset(user.id, item.deviceId, item._id, body.leaseId, machine.generation, item.autoPublish === true);
          } else await market.reset(user.id, item.deviceId, item._id, body.leaseId);
          credentials2.delete(item._id);
          return { ok: true };
        }
        const unpublished = await market.listings.findOneAndUpdate(
          { _id: item._id, ownerId: user.id, deviceId: item.deviceId },
          { $set: { published: false, autoPublish: false } },
          { returnDocument: "after" }
        );
        if (!unpublished) throw new HttpError(404, "Makine bulunamad\u0131.");
        if (unpublished.lease) await end(unpublished);
        credentials2.delete(item._id);
        return { ok: true };
      }
      const rental = pathname.match(
        /^\/v1\/rentals\/([a-f0-9-]{36})\/(credentials|end)$/
      );
      if (rental) {
        const item = await market.forLease(rental[1]);
        if (!item?.lease || ![item.ownerId, item.lease.guestId].includes(user.id))
          throw new HttpError(404, "Oturum bulunamad\u0131.");
        if (method === "POST" && rental[2] === "end") {
          await end(item);
          return { ok: true };
        }
        if (method === "GET" && rental[2] === "credentials" && item.lease.guestId === user.id && !item.resetRequired && item.lease.expiresAt.getTime() > Date.now() && online(item)) {
          const value = credentials2.get(item._id);
          if (directory && item.directoryGeneration) {
            if (!item.lease.startedAt && (!item.lease.grantJobId || !await directory.jobDone(item.lease.grantJobId))) throw new HttpError(409, "Ki\u015Fisel Windows oturumunun yetkileri haz\u0131rlan\u0131yor.");
            const account = await directory.account(user.id);
            if (!account || account.state !== "ready") throw new HttpError(409, "Windows hesab\u0131 haz\u0131r de\u011Fil.");
            if (!item.lease.startedAt) await market.listings.updateOne({ _id: item._id, "lease.id": item.lease.id, "lease.phase": "reserved", "lease.startedAt": { $exists: false } }, { $set: { "lease.startedAt": /* @__PURE__ */ new Date(), "lease.expiresAt": new Date(Date.now() + (item.lease.durationMinutes ?? 240) * 6e4) } });
            const current = await market.forLease(item.lease.id);
            const machine = await directory.assertReady(item.ownerId, item.machineId, item.directoryGeneration);
            return { username: `${account.domain}\\${account.username}`, serverName: `${machine.computerName}.${directory.options.domain}`, domainAccount: true, expiresAt: current.lease.expiresAt.toISOString(), directoryGeneration: item.directoryGeneration };
          }
          if (!value)
            throw new HttpError(409, "Ba\u011Flant\u0131 yeniden haz\u0131rlanmal\u0131.");
          return value;
        }
        throw new HttpError(403, "Bu i\u015Flem i\xE7in oturum yetkin yok.");
      }
      throw new HttpError(404, "\u0130\u015Flem bulunamad\u0131.");
    }
  };
}

// apps/api/src/admin.ts
var import_node_crypto8 = require("node:crypto");
var import_mongodb5 = require("mongodb");
function adminEmails(value = "") {
  const emails = value.split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);
  if (emails.some((x) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x) || x.length > 254) || emails.length > 20)
    throw new Error("NODERA_ADMIN_EMAILS ge\xE7erli y\xF6netici e-posta adresleri i\xE7ermeli.");
  return [...new Set(emails)];
}
var userLookup = [
  { $lookup: { from: "users", localField: "ownerId", foreignField: "_id", pipeline: [{ $project: { _id: 0, id: 1, name: 1, email: 1 } }], as: "owner" } },
  { $set: { owner: { $first: "$owner" } } }
];
function machinePipeline() {
  return [
    { $project: { _id: 0, machineId: 1, ownerId: 1, deviceId: 1, name: 1, cpu: 1, memory: 1, storage: 1, network: 1, status: 1, runtimeState: 1, windowsPrepared: 1, createdAt: 1, seenAt: 1, deletedAt: 1, source: { $literal: "inventory" } } },
    { $unionWith: { coll: "rental_listings", pipeline: [{ $project: { _id: 0, machineId: 1, ownerId: 1, deviceId: 1, name: 1, cpu: 1, memory: 1, storage: 1, network: 1, published: 1, resetRequired: 1, lease: 1, listingId: "$_id", source: { $literal: "listing" } } }] } },
    { $unionWith: { coll: "directory_machines", pipeline: [{ $project: { _id: 0, machineId: 1, ownerId: 1, deviceId: 1, computerName: 1, directoryPhase: "$phase", directoryError: "$error", source: { $literal: "directory" } } }] } },
    { $group: { _id: { ownerId: "$ownerId", machineId: "$machineId" }, records: { $push: "$$ROOT" } } },
    { $set: Object.fromEntries(["directory", "listing", "inventory"].map((source) => [source, { $first: { $filter: { input: "$records", as: "r", cond: { $eq: ["$$r.source", source] } } } }])) },
    { $replaceWith: { $mergeObjects: ["$directory", "$listing", "$inventory"] } },
    ...userLookup
  ];
}
function rentalPipeline() {
  return [
    { $project: { _id: 0, leaseId: 1, listingId: 1, machineId: 1, machineName: 1, ownerId: 1, guestId: 1, guestName: 1, ownerName: 1, reservedAt: 1, startedAt: 1, expiresAt: 1, endedAt: 1, durationMinutes: 1, phase: { $literal: "ended" } } },
    { $unionWith: { coll: "rental_listings", pipeline: [
      { $match: { "lease.id": { $type: "string" } } },
      { $project: { _id: 0, leaseId: "$lease.id", listingId: "$_id", machineId: 1, machineName: "$name", ownerId: 1, ownerName: 1, guestId: "$lease.guestId", guestName: "$lease.guestName", reservedAt: "$lease.reservedAt", startedAt: "$lease.startedAt", expiresAt: "$lease.expiresAt", durationMinutes: "$lease.durationMinutes", phase: "$lease.phase" } }
    ] } },
    // History and a resetting listing represent the same rental. Merge rather than double count.
    { $sort: { phase: 1 } },
    { $group: { _id: "$leaseId", row: { $mergeObjects: "$$ROOT" } } },
    { $replaceWith: "$row" },
    ...userLookup,
    { $lookup: { from: "users", localField: "guestId", foreignField: "_id", pipeline: [{ $project: { _id: 0, id: 1, name: 1, email: 1 } }], as: "guest" } },
    { $set: { guest: { $first: "$guest" }, sortAt: { $ifNull: ["$startedAt", { $ifNull: ["$reservedAt", "$endedAt"] }] } } }
  ];
}
var escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function pageOptions(query) {
  const page = Number(query.get("page") ?? "1"), pageSize = Number(query.get("pageSize") ?? "25");
  if (!Number.isSafeInteger(page) || page < 1 || page > 1e4 || ![10, 25, 50].includes(pageSize)) throw new HttpError(400, "Sayfa se\xE7imi ge\xE7ersiz.");
  const search = (query.get("q") ?? "").trim();
  if (search.length > 100) throw new HttpError(400, "Arama en fazla 100 karakter olabilir.");
  const userId = query.get("userId");
  if (userId && !uuid.test(userId)) throw new HttpError(400, "Kullan\u0131c\u0131 kimli\u011Fi ge\xE7ersiz.");
  return { page, pageSize, search, userId, status: query.get("status") ?? "" };
}
var AdminService = class {
  constructor(store, emails, online, directoryEnabled, ad) {
    this.store = store;
    this.emails = emails;
    this.online = online;
    this.directoryEnabled = directoryEnabled;
    this.ad = ad;
  }
  store;
  emails;
  online;
  directoryEnabled;
  ad;
  get db() {
    return this.store.database;
  }
  async login(email, password) {
    if (this.ad) throw new HttpError(403, "Y\xF6netici eri\u015Fimi Windows hesab\u0131yla yap\u0131l\u0131r. G\xFCncel Nodera Y\xF6netim uygulamas\u0131n\u0131 kullan.");
    const user = await this.store.verifyCredentials(email, password);
    if (!this.emails.includes(user.email)) throw new HttpError(403, "Bu hesab\u0131n y\xF6netici eri\u015Fimi yok. Sunucudaki y\xF6netici listesine eklenmesi gerekiyor.");
    const token = (0, import_node_crypto8.randomBytes)(32).toString("hex"), expiresAt = new Date(Date.now() + 8 * 36e5);
    await this.db.collection("admin_auth_sessions").insertOne({ _id: tokenHash(token), userId: user.id, expiresAt });
    return { user, token, expiresAt: expiresAt.toISOString() };
  }
  async userFor(token) {
    const session = await this.db.collection("admin_auth_sessions").findOne({ _id: tokenHash(token) });
    if (!session || !(session.provider === "ad" && session.sessionMode === "application") && (!(session.expiresAt instanceof Date) || session.expiresAt.getTime() <= Date.now()))
      throw new HttpError(401, "Y\xF6netici oturumu sona erdi. Yeniden giri\u015F yap.");
    if (this.ad) {
      if (session.provider !== "ad" || !this.ad.accepts(session.kid, session.issuer, session.groupSid) || !session.principal) throw new HttpError(403, "Y\xF6netici oturumu ge\xE7erli AD yap\u0131land\u0131rmas\u0131na ait de\u011Fil.");
      const { id, name, email, username, provider } = session.principal;
      return { id, name, email, username, provider };
    }
    if (session.provider === "ad") throw new HttpError(403, "AD ile y\xF6netici giri\u015Fi sunucuda etkin de\u011Fil.");
    const user = await this.db.collection("users").findOne({ _id: session.userId }, { projection: { id: 1, name: 1, email: 1 } });
    if (!user || !this.emails.includes(user.email)) throw new HttpError(403, "Y\xF6netici yetkisi kald\u0131r\u0131lm\u0131\u015F.");
    return { id: user.id, name: user.name, email: user.email };
  }
  async loginAd(proof) {
    if (!this.ad) throw new HttpError(503, "Sunucuda Windows hesab\u0131yla y\xF6netici giri\u015Fi hen\xFCz etkinle\u015Ftirilmedi.");
    const verified = this.ad.verify(proof), now = /* @__PURE__ */ new Date();
    await this.store.rateLimit("admin-ad:" + verified.user.id, 30);
    try {
      await this.db.collection("admin_ad_proofs").insertOne({ _id: tokenHash(this.ad.issuer + ":" + verified.jti), expiresAt: new Date(verified.proofExpiresAt.getTime() + 6e4) });
    } catch (failure) {
      if (failure instanceof import_mongodb5.MongoServerError && failure.code === 11e3) throw new HttpError(409, "Bu giri\u015F belgesi kullan\u0131lm\u0131\u015F. Yeniden giri\u015F yap.");
      throw failure;
    }
    const token = (0, import_node_crypto8.randomBytes)(32).toString("hex");
    await this.db.collection("admin_auth_sessions").insertOne({ _id: tokenHash(token), provider: "ad", sessionMode: "application", principal: verified.user, userId: verified.user.id, issuer: this.ad.issuer, groupSid: this.ad.groupSid, kid: verified.kid, createdAt: now });
    return { user: verified.user, token, sessionMode: "application", expiresAt: null };
  }
  async logout(token) {
    await this.db.collection("admin_auth_sessions").deleteOne({ _id: tokenHash(token) });
    return { ok: true };
  }
  async paginate(collection, pipeline, query, fields, statuses, statusKey, sort, now = /* @__PURE__ */ new Date()) {
    const { page, pageSize, search, userId, status } = pageOptions(query);
    const filter = {};
    if (search) filter.$or = fields.map((field) => ({ [field]: { $regex: escapeRegex(search), $options: "i" } }));
    if (userId) filter.$and = [{ $or: [{ ownerId: userId }, { guestId: userId }, { userId }, { id: userId }] }];
    if (status) {
      if (!statuses.includes(status)) throw new HttpError(400, "Durum filtresi ge\xE7ersiz.");
      filter[statusKey] = status;
    }
    const [result] = await this.db.collection(collection).aggregate([...pipeline, { $match: filter }, { $facet: {
      items: [{ $sort: sort }, { $skip: (page - 1) * pageSize }, { $limit: pageSize }],
      total: [{ $count: "count" }]
    } }], { maxTimeMS: 8e3 }).toArray();
    return { items: result?.items ?? [], total: result?.total[0]?.count ?? 0, page, pageSize, serverNow: now.toISOString() };
  }
  async list(section, query) {
    const now = /* @__PURE__ */ new Date();
    if (section === "users") return this.paginate("users", [
      { $project: { _id: 0, id: 1, name: 1, email: 1, createdAt: 1 } },
      { $lookup: { from: "directory_accounts", localField: "id", foreignField: "_id", pipeline: [{ $project: { _id: 0, username: 1, state: 1 } }], as: "windowsAccount" } },
      { $set: { windowsAccount: { $first: "$windowsAccount" } } }
    ], query, ["name", "email", "id", "windowsAccount.username"], [], "", { createdAt: -1, id: 1 });
    if (section === "windows-accounts") return this.paginate("directory_accounts", [
      { $project: { _id: 0, userId: "$_id", ownerId: "$_id", username: 1, domain: 1, state: 1, profile: { givenName: "$profile.givenName", surname: "$profile.surname", email: "$profile.email" }, changedAt: 1 } },
      ...userLookup
    ], query, ["username", "profile.givenName", "profile.surname", "profile.email", "owner.name", "owner.email"], ["pending", "ready", "failed"], "state", { changedAt: -1, username: 1 });
    if (section === "machines") {
      const result = await this.paginate("machine_inventory", machinePipeline(), query, ["name", "machineId", "computerName", "owner.name", "owner.email"], ["creating", "awaiting_setup", "created", "failed", "stopped", "deleting", "delete_failed"], "status", { seenAt: -1, machineId: 1 }, now);
      const listings = await this.db.collection("rental_listings").find({ _id: { $in: result.items.map((r) => r.listingId).filter(Boolean) } }, { projection: { ownerId: 1, deviceId: 1, machineId: 1, directoryGeneration: 1 } }).toArray();
      const active = new Set(listings.filter((l) => this.online(l)).map((l) => l._id));
      result.items = result.items.map((r) => {
        const { lease, directoryError, ...safe } = r;
        return { ...safe, online: active.has(r.listingId), directoryError: directoryError ? safeDiagnostic(directoryError) : void 0, leaseId: lease?.id ?? null };
      });
      return result;
    }
    if (section === "rentals") {
      const result = await this.paginate("rental_history", [...rentalPipeline(), { $set: { phase: { $cond: [{ $and: [{ $in: ["$phase", ["active", "reserved"]] }, { $lte: ["$expiresAt", now] }] }, "expired", "$phase"] } } }], query, ["machineName", "machineId", "leaseId", "owner.name", "guest.name", "guest.email"], ["reserved", "active", "resetting", "ended", "expired"], "phase", { sortAt: -1, leaseId: 1 }, now);
      result.items = result.items.map((r) => ({
        ...r,
        remainingSeconds: ["active", "reserved"].includes(r.phase) && r.expiresAt ? Math.max(0, Math.ceil((new Date(r.expiresAt).getTime() - now.getTime()) / 1e3)) : 0,
        elapsedSeconds: r.startedAt ? Math.max(0, Math.floor((Math.min(now.getTime(), new Date(r.endedAt ?? r.expiresAt ?? now).getTime()) - new Date(r.startedAt).getTime()) / 1e3)) : null
      }));
      return result;
    }
    if (section === "errors") return this.paginate("admin_events", [
      { $project: { _id: 0, id: "$_id", ownerId: "$userId", deviceId: 1, machineId: 1, leaseId: 1, jobId: 1, source: 1, category: 1, code: 1, message: 1, operation: 1, createdAt: 1, observedAt: 1 } },
      ...userLookup
    ], query, ["message", "code", "machineId", "jobId", "owner.name", "owner.email"], ["installation", "rental", "directory", "system"], "category", { createdAt: -1, id: 1 });
    throw new HttpError(404, "Y\xF6netim ekran\u0131 bulunamad\u0131.");
  }
  async overview() {
    const now = /* @__PURE__ */ new Date();
    const [users, machines, windowsAccounts, activeRentals, errors24h, listings, agent, recentErrors, recentRentals] = await Promise.all([
      this.db.collection("users").countDocuments(),
      this.db.collection("machine_inventory").aggregate([...machinePipeline(), { $match: { deletedAt: { $exists: false }, $or: [{ source: { $ne: "listing" } }, { published: true }] } }, { $count: "count" }]).toArray(),
      this.db.collection("directory_accounts").countDocuments(),
      this.db.collection("rental_listings").countDocuments({ "lease.phase": "active", "lease.expiresAt": { $gt: now } }),
      this.db.collection("admin_events").countDocuments({ createdAt: { $gte: new Date(now.getTime() - 864e5) } }),
      this.db.collection("rental_listings").find({ published: true }, { projection: { ownerId: 1, deviceId: 1, machineId: 1, directoryGeneration: 1 } }).toArray(),
      this.db.collection("directory_agent").findOne({ name: "dc1" }, { projection: { seenAt: 1 } }),
      this.list("errors", new URLSearchParams("pageSize=10")),
      this.list("rentals", new URLSearchParams("pageSize=10"))
    ]);
    return {
      serverNow: now.toISOString(),
      users,
      machines: machines[0]?.count ?? 0,
      windowsAccounts,
      activeRentals,
      errors24h,
      onlineMachines: listings.filter((l) => this.online(l)).length,
      publishedMachines: listings.length,
      directoryEnabled: this.directoryEnabled,
      agentOnline: !!agent?.seenAt && agent.seenAt.getTime() > now.getTime() - 12e4,
      agentSeenAt: agent?.seenAt ?? null,
      recentErrors: recentErrors.items.slice(0, 5),
      recentRentals: recentRentals.items.slice(0, 5)
    };
  }
};
async function receiveInventory(db, user, body) {
  if (typeof body.deviceId !== "string" || !uuid.test(body.deviceId) || !Array.isArray(body.machines) || body.machines.length > 500 || !Array.isArray(body.errors) || body.errors.length > 100)
    throw new HttpError(400, "Makine raporu ge\xE7ersiz.");
  const now = /* @__PURE__ */ new Date(), deviceId = body.deviceId, seen = /* @__PURE__ */ new Set();
  const machines = body.machines.map((m) => {
    if (!m || typeof m.id !== "string" || !uuid.test(m.id) || seen.has(m.id) || typeof m.name !== "string" || m.name.length > 48 || !["awaiting_setup", "creating", "created", "failed", "stopped", "deleting", "delete_failed"].includes(m.status)) throw new HttpError(400, "Makine raporu ge\xE7ersiz.");
    for (const key of ["cpu", "memory", "storage", "network"]) if (!Number.isFinite(m[key]) || m[key] < 0 || m[key] > 1048576) throw new HttpError(400, "Kaynak raporu ge\xE7ersiz.");
    seen.add(m.id);
    return {
      machineId: m.id,
      ownerId: user.id,
      deviceId,
      name: m.name.replace(/[\x00-\x1f]/g, ""),
      cpu: m.cpu,
      memory: m.memory,
      storage: m.storage,
      network: m.network,
      status: m.status,
      runtimeState: typeof m.runtimeState === "string" ? m.runtimeState.slice(0, 40) : null,
      windowsPrepared: m.windowsPrepared === true,
      ...typeof m.createdAt === "string" && Number.isFinite(Date.parse(m.createdAt)) ? { createdAt: new Date(m.createdAt) } : {},
      seenAt: now
    };
  });
  const errors = body.errors.map((e) => {
    if (!e || typeof e.id !== "string" || !uuid.test(e.id) || typeof e.message !== "string" || e.message.length > 6e3 || !["installation", "rental", "directory", "system"].includes(e.category) || e.machineId !== void 0 && (typeof e.machineId !== "string" || !uuid.test(e.machineId)) || e.jobId !== void 0 && (typeof e.jobId !== "string" || !uuid.test(e.jobId))) throw new HttpError(400, "Hata raporu ge\xE7ersiz.");
    if (e.leaseId !== void 0 && (typeof e.leaseId !== "string" || !uuid.test(e.leaseId))) throw new HttpError(400, "Kiralama bildirimi ge\xE7ersiz.");
    return {
      id: e.id,
      userId: user.id,
      deviceId,
      source: "desktop",
      category: e.category,
      code: typeof e.code === "string" && /^[A-Z0-9_]{1,80}$/.test(e.code) ? e.code : "ND_CLIENT_ERROR",
      message: safeDiagnostic(e.message),
      ...e.machineId ? { machineId: e.machineId } : {},
      ...e.jobId ? { jobId: e.jobId } : {},
      ...e.leaseId ? { leaseId: e.leaseId } : {},
      operation: typeof e.operation === "string" ? e.operation.replace(/[^a-z-]/g, "").slice(0, 40) : void 0,
      ...typeof e.observedAt === "string" && Number.isFinite(Date.parse(e.observedAt)) ? { observedAt: new Date(Math.min(Date.now(), Date.parse(e.observedAt))) } : {}
    };
  });
  if (machines.length) await db.collection("machine_inventory").bulkWrite(machines.map((m) => ({ updateOne: { filter: { ownerId: user.id, deviceId, machineId: m.machineId }, update: { $set: m, $unset: { deletedAt: "" } }, upsert: true } })));
  await db.collection("machine_inventory").updateMany({ ownerId: user.id, deviceId, machineId: { $nin: [...seen] }, deletedAt: { $exists: false } }, { $set: { deletedAt: now } });
  for (const error of errors) await recordDiagnostic(db, error);
  return { ok: true, receivedAt: now.toISOString() };
}

// apps/api/src/catalog.ts
var import_node_crypto9 = require("node:crypto");
var import_mongodb6 = require("mongodb");

// packages/shared/src/catalog.ts
var catalogApps = [
  { id: "google-chrome", name: "Google Chrome", vendor: "Google", category: "Taray\u0131c\u0131", description: "Web'de gezinmek ve Google hizmetlerine eri\u015Fmek i\xE7in.", mark: "C", color: "chrome", license: "\xDCreticinin kullan\u0131m ko\u015Fullar\u0131 ge\xE7erlidir." },
  { id: "vscode", name: "Visual Studio Code", vendor: "Microsoft", category: "Geli\u015Ftirme", description: "Kod d\xFCzenleme, terminal ve geli\u015Ftirme ara\xE7lar\u0131 bir arada.", mark: "\u2318", color: "code", license: "\xDCreticinin kullan\u0131m ko\u015Fullar\u0131 ge\xE7erlidir." },
  { id: "intellij-idea", name: "IntelliJ IDEA", vendor: "JetBrains", category: "Geli\u015Ftirme", description: "Java ve Kotlin projelerin i\xE7in geli\u015Ftirme ortam\u0131.", mark: "IJ", color: "idea", license: "Baz\u0131 \xF6zellikler JetBrains hesab\u0131 veya lisans\u0131 gerektirebilir." },
  { id: "pycharm", name: "PyCharm", vendor: "JetBrains", category: "Geli\u015Ftirme", description: "Python projelerini geli\u015Ftirmek ve hata ay\u0131klamak i\xE7in.", mark: "PC", color: "python", license: "Baz\u0131 \xF6zellikler JetBrains hesab\u0131 veya lisans\u0131 gerektirebilir." }
];

// apps/api/src/catalog-recipes.ts
var import_yaml = __toESM(require_dist(), 1);
var hosts = {
  "google-chrome": ["dl.google.com"],
  vscode: ["vscode.download.prss.microsoft.com", "az764295.vo.msecnd.net"],
  "intellij-idea": ["download.jetbrains.com", "download-cdn.jetbrains.com", "download-cf.jetbrains.com"],
  pycharm: ["download.jetbrains.com", "download-cdn.jetbrains.com", "download-cf.jetbrains.com"]
};
function catalogId(value) {
  if (typeof value !== "string" || !catalogApps.some((a) => a.id === value) && !/^winget:[A-Za-z0-9][A-Za-z0-9_-]*(?:\.[A-Za-z0-9][A-Za-z0-9_+-]*)+$/.test(value) || typeof value === "string" && value.length > 180) throw new HttpError(400, "Bu uygulama haz\u0131r katalogda bulunmuyor.");
  return value;
}
function validateRecipe(recipe) {
  const id = catalogId(recipe.appId), url = new URL(recipe.url);
  if (recipe.execution !== void 0 && !["interactive", "silent"].includes(recipe.execution)) throw new Error("CATALOG_EXECUTION_INVALID");
  if (id.startsWith("winget:")) {
    if (url.protocol !== "https:" || url.port || url.username || url.password || url.hash || !/^[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i.test(url.hostname) || /\.(local|internal|localhost)$/i.test(url.hostname) || /^[0-9.]+$/.test(url.hostname) || !/^[a-f0-9]{64}$/i.test(recipe.sha256) || !recipe.version || recipe.version.length > 120 || /[\x00-\x1f\x7f]/.test(recipe.version) || ![".exe", ".msi"].includes(recipe.extension) || !["msi", "inno", "nsis", "custom"].includes(recipe.mode) || recipe.extension === ".msi" && recipe.mode !== "msi" || recipe.mode === "msi" && recipe.extension !== ".msi" || recipe.execution !== "interactive" && (typeof recipe.silentArgs !== "string" || !recipe.silentArgs.trim()) || recipe.silentArgs !== void 0 && (typeof recipe.silentArgs !== "string" || recipe.silentArgs.length > 2048 || /[\x00-\x1f\x7f<>]/.test(recipe.silentArgs)) || !recipe.displayNames?.length || recipe.displayNames.length > 12 || recipe.displayNames.some((n) => typeof n !== "string" || !n.trim() || n.length > 240 || /[\x00-\x1f\x7f]/.test(n)) || (recipe.productCodes ?? []).some((n) => typeof n !== "string" || n.length > 240 || /[\x00-\x1f\x7f]/.test(n))) throw new Error("CATALOG_RECIPE_INVALID");
    return { ...recipe, sha256: recipe.sha256.toLowerCase() };
  }
  const builtin = id;
  if (url.protocol !== "https:" || url.port && url.port !== "443" || url.username || url.password || url.hash || !hosts[builtin].includes(url.hostname) || !url.pathname.toLowerCase().endsWith(recipe.extension) || !/^[a-f0-9]{64}$/i.test(recipe.sha256) || !/^[0-9][0-9.a-zA-Z-]{0,79}$/.test(recipe.version) || recipe.extension !== (id === "google-chrome" ? ".msi" : ".exe") || recipe.mode !== (id === "google-chrome" ? "msi" : id === "vscode" ? "inno" : "nsis") || recipe.size !== void 0 && (!Number.isSafeInteger(recipe.size) || recipe.size < 64 || recipe.size > 2 * 1024 ** 3)) throw new Error("CATALOG_RECIPE_INVALID");
  return { ...recipe, sha256: recipe.sha256.toLowerCase() };
}
async function resource(url, allowedHosts, redirects = 0) {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.port || !allowedHosts.includes(parsed.hostname) || redirects > 4) throw new Error("CATALOG_METADATA_HOST");
  const response = await fetch(url, { signal: AbortSignal.timeout(8e3), redirect: "manual", headers: { "User-Agent": "Nodera-Application-Catalog", Accept: "application/vnd.github+json, application/json, text/plain" } });
  if ([301, 302, 303, 307, 308].includes(response.status)) {
    await response.body?.cancel();
    return resource(new URL(response.headers.get("location") ?? "", url).href, allowedHosts, redirects + 1);
  }
  if (!response.ok) {
    await response.body?.cancel();
    throw new Error("CATALOG_METADATA_UNAVAILABLE");
  }
  const reader = response.body.getReader(), parts = [];
  let size = 0;
  try {
    for (; ; ) {
      const r = await reader.read();
      if (r.done) break;
      size += r.value.length;
      if (size > 524288) throw new Error("CATALOG_METADATA_SIZE");
      parts.push(r.value);
    }
  } finally {
    await reader.cancel();
  }
  return Buffer.concat(parts).toString("utf8");
}
var CatalogResolver = class {
  cache = /* @__PURE__ */ new Map();
  invalidate(appId) {
    this.cache.delete(appId);
  }
  async resolve(appId) {
    if (appId.startsWith("winget:")) throw new Error("CATALOG_REVIEW_REQUIRED");
    const cached = this.cache.get(appId);
    if (cached && cached.expires > Date.now()) return cached.recipe;
    const get = async (url, allowed) => JSON.parse(await resource(url, allowed));
    let recipe;
    if (appId === "google-chrome") {
      const base = "https://api.github.com/repos/microsoft/winget-pkgs/contents/manifests/g/Google/Chrome";
      const entries = await get(base, ["api.github.com"]);
      const versions = entries.filter((e) => e.type === "dir" && /^\d+(\.\d+){3}$/.test(e.name)).map((e) => e.name);
      versions.sort((a, b) => {
        const aa = a.split(".").map(Number), bb = b.split(".").map(Number);
        for (let i = 0; i < 4; i++) if (aa[i] !== bb[i]) return bb[i] - aa[i];
        return 0;
      });
      const version = versions[0];
      if (!version) throw new Error("CATALOG_VERSION_MISSING");
      const file = await get(`${base}/${version}/Google.Chrome.installer.yaml`, ["api.github.com"]);
      if (file.encoding !== "base64" || typeof file.content !== "string" || file.content.length > 1e5) throw new Error("CATALOG_MANIFEST_INVALID");
      const manifest = (0, import_yaml.parse)(Buffer.from(file.content, "base64").toString("utf8"), { maxAliasCount: 0 });
      const installer = manifest.Installers?.find((i) => i.Architecture === "x64" && (i.Scope ?? manifest.Scope) === "machine" && ["msi", "wix"].includes(i.InstallerType ?? manifest.InstallerType));
      if (manifest.PackageIdentifier !== "Google.Chrome" || manifest.PackageVersion !== version || !installer) throw new Error("CATALOG_MANIFEST_INVALID");
      recipe = { appId, version, url: installer.InstallerUrl, sha256: installer.InstallerSha256, extension: ".msi", mode: "msi" };
    } else if (appId === "vscode") {
      const data = await get("https://update.code.visualstudio.com/api/update/win32-x64/stable/latest", ["update.code.visualstudio.com"]);
      recipe = { appId, version: data.productVersion, url: data.url, sha256: data.sha256hash, extension: ".exe", mode: "inno" };
    } else {
      const code = appId === "intellij-idea" ? "IIU" : "PCP";
      const releases = await get(`https://data.services.jetbrains.com/products/releases?code=${code}&latest=true&type=release`, ["data.services.jetbrains.com"]);
      const release = releases[code]?.find((r) => r.type === "release"), download2 = release?.downloads?.windows;
      if (!download2 || typeof download2.checksumLink !== "string") throw new Error("CATALOG_RELEASE_MISSING");
      const checksum = await resource(download2.checksumLink, hosts[appId]);
      recipe = { appId, version: release.version, url: download2.link, sha256: checksum.trim().split(/\s+/)[0], size: download2.size, extension: ".exe", mode: "nsis" };
    }
    recipe = validateRecipe(recipe);
    this.cache.set(appId, { recipe, expires: Date.now() + 15 * 6e4 });
    return recipe;
  }
};

// apps/api/src/winget.ts
var import_node_sqlite = require("node:sqlite");
var import_node_zlib = require("node:zlib");
var import_promises = require("node:fs/promises");
var import_node_os = require("node:os");
var import_node_path = __toESM(require("node:path"), 1);
var import_yaml2 = __toESM(require_dist(), 1);
var packagePattern = /^[^.\s\\/:*?"<>|%#\x00-\x1f\x7f]+(?:\.[^.\s\\/:*?"<>|%#\x00-\x1f\x7f]+)+$/;
function wingetAppId(id) {
  packageId(id);
  const ordinary = /^[A-Za-z0-9][A-Za-z0-9_-]*(?:\.[A-Za-z0-9][A-Za-z0-9_+-]*)+$/.test(id) && !id.startsWith("NoderaEncoded.");
  return `winget:${ordinary ? id : "NoderaEncoded." + Buffer.from(id, "utf8").toString("base64url")}`;
}
function packageId(value) {
  if (typeof value !== "string" || value.length > 170 || !packagePattern.test(value)) throw new HttpError(400, "WinGet paket kimli\u011Fi ge\xE7ersiz.");
  return value;
}
async function download(url, limit, missing = false) {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.port || !["cdn.winget.microsoft.com", "raw.githubusercontent.com"].includes(parsed.hostname)) throw new Error("WINGET_SOURCE_INVALID");
  const response = await fetch(url, { signal: AbortSignal.timeout(2e4), redirect: "error", headers: { "User-Agent": "Nodera-Catalog/2" } });
  if (missing && response.status === 404) {
    await response.body?.cancel();
    return null;
  }
  if (!response.ok) {
    await response.body?.cancel();
    throw new Error("WINGET_SOURCE_UNAVAILABLE");
  }
  const reader = response.body.getReader(), chunks = [];
  let total = 0;
  try {
    for (; ; ) {
      const r = await reader.read();
      if (r.done) break;
      total += r.value.length;
      if (total > limit) throw new Error("WINGET_SOURCE_SIZE");
      chunks.push(r.value);
    }
  } finally {
    await reader.cancel();
  }
  return Buffer.concat(chunks);
}
function wingetIndex(zip) {
  let end = -1;
  for (let i = zip.length - 22; i >= Math.max(0, zip.length - 65557); i--) if (zip.readUInt32LE(i) === 101010256 && i + 22 + zip.readUInt16LE(i + 20) === zip.length) {
    end = i;
    break;
  }
  if (end < 0 || zip.readUInt16LE(end + 4) || zip.readUInt16LE(end + 6)) throw new Error("WINGET_ARCHIVE_INVALID");
  let count = zip.readUInt16LE(end + 10), size = zip.readUInt32LE(end + 12), cursor = zip.readUInt32LE(end + 16), result;
  if (count === 65535 || size === 4294967295 || cursor === 4294967295) {
    if (end < 20 || zip.readUInt32LE(end - 20) !== 117853008 || zip.readUInt32LE(end - 16) !== 0 || zip.readUInt32LE(end - 4) !== 1) throw new Error("WINGET_ARCHIVE_INVALID");
    const record = Number(zip.readBigUInt64LE(end - 12));
    if (!Number.isSafeInteger(record) || record < 0 || record + 56 > end - 20 || zip.readUInt32LE(record) !== 101075792 || zip.readUInt32LE(record + 16) || zip.readUInt32LE(record + 20)) throw new Error("WINGET_ARCHIVE_INVALID");
    count = Number(zip.readBigUInt64LE(record + 32));
    size = Number(zip.readBigUInt64LE(record + 40));
    cursor = Number(zip.readBigUInt64LE(record + 48));
    if (![count, size, cursor].every(Number.isSafeInteger)) throw new Error("WINGET_ARCHIVE_INVALID");
  }
  if (count > 128 || cursor + size > end) throw new Error("WINGET_ARCHIVE_INVALID");
  for (let i = 0; i < count; i++) {
    if (cursor + 46 > end || zip.readUInt32LE(cursor) !== 33639248) throw new Error("WINGET_ARCHIVE_INVALID");
    const nameLength = zip.readUInt16LE(cursor + 28), extra = zip.readUInt16LE(cursor + 30), comment = zip.readUInt16LE(cursor + 32), next = cursor + 46 + nameLength + extra + comment;
    if (next > end) throw new Error("WINGET_ARCHIVE_INVALID");
    const name = zip.subarray(cursor + 46, cursor + 46 + nameLength).toString("utf8");
    if (name === "Public/index.db") {
      const compressed = zip.readUInt32LE(cursor + 20), expanded = zip.readUInt32LE(cursor + 24), method = zip.readUInt16LE(cursor + 10), local = zip.readUInt32LE(cursor + 42);
      if (result || zip.readUInt16LE(cursor + 8) & 1 || ![0, 8].includes(method) || expanded > 64 * 1024 ** 2 || compressed > 32 * 1024 ** 2 || local + 30 > end || zip.readUInt32LE(local) !== 67324752) throw new Error("WINGET_ARCHIVE_INVALID");
      const start = local + 30 + zip.readUInt16LE(local + 26) + zip.readUInt16LE(local + 28);
      if (start + compressed > cursor) throw new Error("WINGET_ARCHIVE_INVALID");
      const bytes = zip.subarray(start, start + compressed);
      result = method === 8 ? (0, import_node_zlib.inflateRawSync)(bytes, { maxOutputLength: 64 * 1024 ** 2 }) : Buffer.from(bytes);
      if (result.length !== expanded || (0, import_node_zlib.crc32)(result) !== zip.readUInt32LE(cursor + 16) || result.subarray(0, 16).toString() !== "SQLite format 3\0") throw new Error("WINGET_INDEX_INVALID");
    }
    cursor = next;
  }
  if (!result) throw new Error("WINGET_INDEX_MISSING");
  return result;
}
var WingetCatalog = class {
  data;
  loading;
  async index() {
    if (this.data && this.data.expires > Date.now()) return this.data;
    if (this.loading) return this.loading;
    this.loading = (async () => {
      const bytes = wingetIndex(await download("https://cdn.winget.microsoft.com/cache/source2.msix", 32 * 1024 ** 2));
      const folder = await (0, import_promises.mkdtemp)(import_node_path.default.join((0, import_node_os.tmpdir)(), "nodera-winget-")), file = import_node_path.default.join(folder, "index.db");
      let db;
      try {
        await (0, import_promises.writeFile)(file, bytes, { flag: "wx", mode: 384 });
        db = new import_node_sqlite.DatabaseSync(file, { readOnly: true, allowExtension: false });
        db.exec("PRAGMA trusted_schema=OFF; PRAGMA query_only=ON;");
        const table = db.prepare("SELECT type,sql FROM sqlite_master WHERE name='packages'").get();
        if (table?.type !== "table" || !/^CREATE TABLE /i.test(String(table.sql))) throw new Error("WINGET_INDEX_SCHEMA");
        const entries = db.prepare("SELECT id,name,latest_version FROM packages LIMIT 100001").all();
        if (!entries.length || entries.length > 1e5) throw new Error("WINGET_INDEX_SIZE");
        const rows = entries.flatMap((r) => typeof r.id === "string" && packagePattern.test(r.id) && r.id.length <= 170 && typeof r.name === "string" && r.name.length <= 240 && typeof r.latest_version === "string" && r.latest_version.length <= 120 && !/[\x00-\x1f\x7f]/.test(r.name + r.latest_version) ? [{ packageId: r.id, name: r.name, version: r.latest_version }] : []);
        this.data = { rows, updatedAt: (/* @__PURE__ */ new Date()).toISOString(), expires: Date.now() + 12 * 36e5 };
        return this.data;
      } finally {
        db?.close();
        await (0, import_promises.unlink)(file).catch(() => {
        });
        await (0, import_promises.rmdir)(folder).catch(() => {
        });
      }
    })();
    try {
      return await this.loading;
    } finally {
      this.loading = void 0;
    }
  }
  async search(q, page) {
    const data = await this.index(), query = q.toLocaleLowerCase("en-US");
    const matches = data.rows.filter((r) => (r.name + " " + r.packageId).toLocaleLowerCase("en-US").includes(query));
    const rank = (r) => r.packageId.toLowerCase() === query || r.name.toLowerCase() === query ? 0 : r.name.toLowerCase().startsWith(query) ? 1 : 2;
    matches.sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name, "en"));
    return { items: matches.slice((page - 1) * 25, page * 25), total: matches.length, catalogTotal: data.rows.length, page, pageSize: 25, updatedAt: data.updatedAt };
  }
  async inspect(id) {
    const row = (await this.index()).rows.find((r) => r.packageId.toLowerCase() === id.toLowerCase());
    if (!row) throw new HttpError(404, "Paket Microsoft WinGet dizininde bulunamad\u0131.");
    const base = `https://raw.githubusercontent.com/microsoft/winget-pkgs/master/manifests/${encodeURIComponent(Array.from(row.packageId)[0].toLowerCase())}/${row.packageId.split(".").map(encodeURIComponent).join("/")}/${encodeURIComponent(row.version)}`;
    const load = async (suffix) => {
      const bytes = await download(`${base}/${encodeURIComponent(row.packageId + suffix + ".yaml")}`, 262144, true);
      if (!bytes) return null;
      const value = (0, import_yaml2.parse)(bytes.toString("utf8"), { maxAliasCount: 0 });
      if (value?.PackageIdentifier !== row.packageId || String(value.PackageVersion) !== row.version) throw new Error("WINGET_MANIFEST_IDENTITY");
      return value;
    };
    const version = await load("");
    if (!version) throw new HttpError(409, "Katalog ile paket dosyas\u0131 hen\xFCz e\u015Fle\u015Fmiyor. Daha sonra yeniden incele.");
    const installer = version.ManifestType === "singleton" ? version : await load(".installer");
    const locale = version.ManifestType === "singleton" ? version : typeof version.DefaultLocale === "string" && /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/.test(version.DefaultLocale) ? await load(".locale." + version.DefaultLocale) : null;
    return buildWingetProfile(row, installer, locale);
  }
};
function plain(value, limit) {
  return typeof value === "string" ? value.replace(/[\x00-\x1f\x7f]/g, " ").trim().slice(0, limit) : "";
}
function buildWingetProfile(row, manifest, locale) {
  const app = { id: wingetAppId(row.packageId), packageId: row.packageId, version: row.version, source: "winget", name: plain(locale?.PackageName, 240) || row.name, vendor: plain(locale?.Publisher, 200) || row.packageId.split(".")[0], category: "Uygulama", description: plain(locale?.ShortDescription, 500) || row.name, mark: row.name.substring(0, 2).toLocaleUpperCase("tr-TR"), color: "code", license: plain(locale?.License, 120) || "\xDCreticinin kullan\u0131m ko\u015Fullar\u0131 ge\xE7erlidir.", enabled: false };
  const fail = (reason) => ({ app, supported: false, reason });
  if (!manifest || manifest.PackageIdentifier !== row.packageId || String(manifest.PackageVersion) !== row.version || !Array.isArray(manifest.Installers)) return fail("Paketin kurulum tan\u0131m\u0131 bulunamad\u0131. Kullan\u0131c\u0131 manuel kurulum iste\u011Fi g\xF6nderebilir.");
  const candidates = manifest.Installers.map((entry) => ({ ...manifest, ...entry, InstallerSwitches: { ...manifest.InstallerSwitches, ...entry.InstallerSwitches }, Dependencies: { ...manifest.Dependencies, ...entry.Dependencies } })).filter((i) => ["x64", "x86", "neutral"].includes(i.Architecture) && i.Scope === "machine");
  candidates.sort((a, b) => ["x64", "x86", "neutral"].indexOf(a.Architecture) - ["x64", "x86", "neutral"].indexOf(b.Architecture));
  const recipes = {};
  let architecture, installerType;
  for (const i of candidates) {
    const type = i.InstallerType;
    if (!["msi", "wix", "inno", "nullsoft", "exe", "burn", "installshield"].includes(type) || i.InstallModes && !Array.isArray(i.InstallModes) || Object.values(i.Dependencies ?? {}).some((v) => Array.isArray(v) && v.length > 0)) continue;
    const extension = ["msi", "wix"].includes(type) ? ".msi" : ".exe", mode = extension === ".msi" ? "msi" : type === "inno" ? "inno" : type === "nullsoft" ? "nsis" : "custom";
    const switches = i.InstallerSwitches ?? {}, silent = switches.Silent || switches.SilentWithProgress || (mode === "msi" ? "/qn /norestart REBOOT=ReallySuppress ALLUSERS=1" : mode === "inno" ? "/VERYSILENT /SUPPRESSMSGBOXES /NORESTART /SP- /ALLUSERS" : mode === "nsis" ? "/S" : "");
    const args = [silent, switches.Custom].filter(Boolean).join(" ");
    const features = Array.isArray(i.AppsAndFeaturesEntries) ? i.AppsAndFeaturesEntries : [];
    const displayNames = [...new Set([app.name, ...features.map((f) => plain(f.DisplayName, 240))].filter(Boolean))].slice(0, 12);
    const productCodes = [...new Set([plain(i.ProductCode, 240), ...features.map((f) => plain(f.ProductCode, 240))].filter(Boolean))].slice(0, 12);
    for (const execution of ["interactive", "silent"]) {
      if (recipes[execution] || i.InstallModes && !i.InstallModes.some((m) => execution === "interactive" ? m === "interactive" : ["silent", "silentWithProgress"].includes(m))) continue;
      if (execution === "silent" && (typeof silent !== "string" || !silent.trim() || switches.Custom && typeof switches.Custom !== "string")) continue;
      try {
        const recipe2 = validateRecipe({ appId: app.id, version: row.version, url: i.InstallerUrl, sha256: i.InstallerSha256, extension, mode, execution, architecture: i.Architecture, installerType: type, ...execution === "silent" ? { silentArgs: args } : {}, displayNames, productCodes });
        recipes[execution] = recipe2;
        if (!architecture || execution === "interactive") {
          architecture = i.Architecture;
          installerType = type;
        }
      } catch {
      }
    }
  }
  const executions = ["interactive", "silent"].filter((e) => recipes[e]);
  const recipe = recipes.interactive ?? recipes.silent;
  if (recipe) return { app: { ...app, execution: recipe.execution, executions }, supported: true, recipe, recipes, executions, architecture, installerType };
  return fail("Bu pakette desteklenen bilgisayar geneli EXE/MSI kurulumu yok veya ek ba\u011F\u0131ml\u0131l\u0131k gerekiyor. Kullan\u0131c\u0131 manuel kurulum iste\u011Fi g\xF6nderebilir.");
}

// apps/api/src/catalog.ts
var import_node_crypto10 = require("node:crypto");
var CatalogService = class {
  constructor(db, installations, resolver = new CatalogResolver(), winget = new WingetCatalog()) {
    this.db = db;
    this.installations = installations;
    this.resolver = resolver;
    this.winget = winget;
  }
  db;
  installations;
  resolver;
  winget;
  get requests() {
    return this.db.collection("installation_requests");
  }
  async apps() {
    const settings = await this.db.collection("application_catalog").find({}).toArray();
    return [...catalogApps.map((app) => ({ ...app, enabled: settings.find((s) => s._id === app.id)?.enabled !== false, execution: settings.find((s) => s._id === app.id)?.execution ?? "interactive", executions: ["interactive", "silent"] })), ...settings.filter((s) => s._id.startsWith("winget:") && s.app && s.recipe).map((s) => ({ ...s.app, enabled: s.enabled === true, needsReview: !s.recipes }))];
  }
  async search(query) {
    const q = (query.get("q") ?? "").trim(), page = Number(query.get("page") ?? 1);
    if (q.length < 2 || q.length > 100 || /[\x00-\x1f\x7f]/.test(q) || !Number.isSafeInteger(page) || page < 1 || page > 1e4 || [...query.keys()].some((k) => !["q", "page"].includes(k)) || query.getAll("q").length > 1 || query.getAll("page").length > 1) throw new HttpError(400, "Arama i\xE7in 2\u2013100 karakter gir.");
    let result;
    try {
      result = await this.winget.search(q, page);
    } catch {
      throw new HttpError(503, "Microsoft WinGet katalo\u011Fu \u015Fu anda al\u0131namad\u0131. Yeniden dene.");
    }
    const apps = await this.apps();
    return { ...result, items: result.items.map((item) => ({ ...item, published: apps.some((a) => a.id === wingetAppId(item.packageId) && a.enabled) })) };
  }
  async preview(value, admin) {
    const id = packageId(value);
    let profile;
    try {
      profile = await this.winget.inspect(id);
    } catch (e) {
      if (e instanceof HttpError) throw e;
      throw new HttpError(503, "Paketin Microsoft WinGet kurulum bilgileri al\u0131namad\u0131. Yeniden incele.");
    }
    if (!profile.supported || !profile.recipe) return profile;
    const previewId = (0, import_node_crypto9.randomUUID)(), expiresAt = new Date(Date.now() + 15 * 6e4);
    await this.db.collection("catalog_previews").insertOne({ _id: previewId, adminId: admin.id, ...profile, expiresAt });
    const variants = Object.fromEntries(Object.entries(profile.recipes ?? {}).map(([execution, recipe]) => [execution, { sha256: recipe.sha256, sourceHost: new URL(recipe.url).hostname, architecture: recipe.architecture, installerType: recipe.installerType }]));
    return { app: profile.app, supported: true, previewId, expiresAt: expiresAt.toISOString(), architecture: profile.architecture, installerType: profile.installerType, scope: "machine", sha256: profile.recipe.sha256, sourceHost: new URL(profile.recipe.url).hostname, executions: profile.executions, variants };
  }
  async configure(appId, admin, body) {
    const id = catalogId(appId);
    if (Object.keys(body).some((k) => !["enabled", "previewId", "execution"].includes(k)) || typeof body.enabled !== "boolean" || !id.startsWith("winget:") && body.previewId !== void 0 || body.execution !== void 0 && !["interactive", "silent"].includes(String(body.execution))) throw new HttpError(400, "Ma\u011Faza kurulum se\xE7imi ge\xE7ersiz.");
    let reviewed = {};
    if (id.startsWith("winget:")) {
      const current = await this.db.collection("application_catalog").findOne({ _id: id });
      if (body.previewId !== void 0 || body.execution !== void 0) {
        if (typeof body.previewId !== "string" || !/^[a-f0-9-]{36}$/.test(body.previewId)) throw new HttpError(400, "\u0130nceleme kimli\u011Fi ge\xE7ersiz.");
        const preview = await this.db.collection("catalog_previews").findOne({ _id: body.previewId, adminId: admin.id, "app.id": id, expiresAt: { $gt: /* @__PURE__ */ new Date() } });
        if (!preview?.supported || !preview.recipes) throw new HttpError(409, "\u0130nceleme s\xFCresi doldu veya paket e\u015Fle\u015Fmiyor. Uygulamay\u0131 yeniden incele.");
        const execution = String(body.execution ?? preview.app.execution ?? "interactive");
        if (!preview.recipes[execution]) throw new HttpError(409, "Bu paket se\xE7ilen kurulum y\xF6ntemini desteklemiyor.");
        const recipe = validateRecipe(preview.recipes[execution]), revision = (0, import_node_crypto10.createHash)("sha256").update(JSON.stringify(recipe)).digest("hex");
        reviewed = { app: { ...preview.app, execution, reviewedAt: (/* @__PURE__ */ new Date()).toISOString() }, recipes: preview.recipes, recipe, revision };
      } else if (!current?.recipe || !current.app) throw new HttpError(409, "Uygulamay\u0131 yay\u0131mlamadan \xF6nce katalogdan se\xE7ip incele.");
    }
    await this.db.collection("application_catalog").updateOne({ _id: id }, { $set: { ...reviewed, ...!id.startsWith("winget:") && body.execution !== void 0 ? { execution: body.execution } : {}, enabled: body.enabled, updatedAt: /* @__PURE__ */ new Date(), updatedBy: { id: admin.id, name: admin.name } } }, { upsert: true });
    return { apps: await this.apps() };
  }
  ready(machine) {
    return machine.installCatalogSeenAt instanceof Date && machine.installCatalogSeenAt.getTime() > Date.now() - 9e4;
  }
  async rental(user, leaseId) {
    const listing = await this.db.collection("rental_listings").findOne({ "lease.id": leaseId, "lease.guestId": user.id, "lease.phase": "active", "lease.expiresAt": { $gt: /* @__PURE__ */ new Date() }, resetRequired: false });
    if (!listing) throw new HttpError(409, "Kurulum i\xE7in sana ait aktif bir kiralama se\xE7.");
    const machine = await this.db.collection("directory_machines").findOne({ _id: listing.machineId, ownerId: listing.ownerId, generation: listing.directoryGeneration, phase: "ready" });
    if (!machine) throw new HttpError(409, "Bu bilgisayar\u0131n Windows haz\u0131rl\u0131\u011F\u0131 hen\xFCz tamamlanmad\u0131.");
    const { account } = await this.installations.lease(machine);
    return { listing, machine, account };
  }
  async snapshot(user) {
    const listings = await this.db.collection("rental_listings").find({ "lease.guestId": user.id, "lease.phase": "active", "lease.expiresAt": { $gt: /* @__PURE__ */ new Date() }, resetRequired: false }).limit(50).toArray();
    const rentals = [];
    for (const listing of listings) {
      const machine = await this.db.collection("directory_machines").findOne({ _id: listing.machineId, ownerId: listing.ownerId, generation: listing.directoryGeneration, phase: "ready" });
      if (!machine) continue;
      const records = await this.requests.find({ source: "catalog", leaseId: listing.lease.id, userId: user.id, generation: machine.generation }).sort({ createdAt: -1 }).limit(100).toArray();
      const installations = [];
      for (const r of records) installations.push(this.installations.dto(await this.installations.invalidate(r)));
      rentals.push({ leaseId: listing.lease.id, machineName: listing.name, agentReady: this.ready(machine), catalogProtocol: machine.installCatalogProtocol ?? 1, installations });
    }
    return { apps: (await this.apps()).filter((app) => app.enabled), rentals, serverNow: (/* @__PURE__ */ new Date()).toISOString() };
  }
  async enqueue(user, body) {
    if (Object.keys(body).some((k) => !["appId", "leaseId"].includes(k)) || typeof body.leaseId !== "string") throw new HttpError(400, "Ma\u011Faza kurulum bilgileri ge\xE7ersiz.");
    const appId = catalogId(body.appId), app = (await this.apps()).find((a) => a.id === appId);
    if (!app?.enabled) throw new HttpError(409, "Bu uygulama \u015Fu anda ma\u011Fazada sunulmuyor.");
    const { listing, machine, account } = await this.rental(user, body.leaseId);
    if (!this.ready(machine)) throw new HttpError(409, "VM'nin ma\u011Faza arac\u0131s\u0131na ula\u015F\u0131lam\u0131yor. Makine sahibi kurulum arac\u0131s\u0131n\u0131 g\xFCncelleyip VM'yi a\xE7\u0131k tutmal\u0131.");
    const selected = appId.startsWith("winget:") ? await this.db.collection("application_catalog").findOne({ _id: appId, enabled: true }) : null;
    const execution = app.execution ?? "interactive";
    if (selected && !selected.recipes) throw new HttpError(409, "Y\xF6netici bu uygulaman\u0131n kurulum y\xF6ntemini yeniden inceleyip yay\u0131mlamal\u0131.");
    if (appId.startsWith("winget:") && (!selected?.recipe || (machine.installCatalogProtocol ?? 1) < 2) || execution === "interactive" && (machine.installCatalogProtocol ?? 1) < 3) throw new HttpError(409, "Bu kurulum i\xE7in VM'nin kurulum arac\u0131s\u0131 g\xFCncellenmeli.");
    const identity = { source: "catalog", appId, machineId: machine.machineId, generation: machine.generation, leaseId: listing.lease.id };
    const existing = await this.requests.findOne({ ...identity, status: { $in: ["approved", "running", "succeeded"] } });
    if (existing) {
      const current = await this.installations.invalidate(existing);
      if (["approved", "running", "succeeded"].includes(current.status)) return { request: this.installations.dto(current) };
    }
    if (await this.requests.findOne({ ...identity, status: "failed", resultCode: "CATALOG_VERIFYING" })) this.resolver.invalidate(appId);
    const now = /* @__PURE__ */ new Date(), expiresAt = new Date(Math.min(Date.now() + 36e5, listing.lease.expiresAt.getTime()));
    const request = {
      _id: (0, import_node_crypto9.randomUUID)(),
      ...identity,
      ownerId: machine.ownerId,
      computerName: machine.computerName,
      machineName: listing.name,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      windowsSid: account.sid,
      windowsUsername: `${account.domain}\\${account.username}`,
      productName: app.name,
      fileName: app.name,
      status: "approved",
      stage: "queued",
      downloadedBytes: 0,
      createdAt: now,
      decidedAt: now,
      reason: "Y\xF6netici taraf\u0131ndan izin verilen haz\u0131r uygulama.",
      decidedBy: { id: "catalog", name: "Uygulama Ma\u011Fazas\u0131" },
      expiresAt,
      approvalExpiresAt: expiresAt,
      deleteAfter: new Date(Date.now() + 90 * 864e5),
      catalogExecution: execution,
      ...selected ? { catalogRevision: selected.revision, catalogRecipe: validateRecipe(selected.recipe) } : {}
    };
    try {
      await this.requests.insertOne(request);
    } catch (e) {
      if (e instanceof import_mongodb6.MongoServerError && e.code === 11e3) return this.enqueue(user, body);
      throw e;
    }
    return { request: this.installations.dto(request) };
  }
  async claim(machine, body = {}) {
    if (body.catalogProtocol !== void 0 && ![1, 2, 3].includes(body.catalogProtocol)) throw new HttpError(400, "Ma\u011Faza arac\u0131 s\xFCr\xFCm\xFC ge\xE7ersiz.");
    const protocol = body.catalogProtocol === 3 ? 3 : body.catalogProtocol === 2 ? 2 : 1;
    await this.db.collection("directory_machines").updateOne({ _id: machine.machineId, generation: machine.generation }, { $set: { installCatalogSeenAt: /* @__PURE__ */ new Date(), installCatalogProtocol: protocol } });
    const requests = await this.requests.find({ source: "catalog", machineId: machine.machineId, generation: machine.generation, status: "approved" }).sort({ createdAt: 1 }).limit(10).toArray();
    for (const queued of requests) {
      if (queued.appId.startsWith("winget:") && protocol < 2 || queued.catalogExecution === "interactive" && protocol < 3) continue;
      const r = await this.installations.invalidate(queued);
      if (r.status !== "approved") continue;
      let recipe;
      try {
        recipe = r.appId.startsWith("winget:") ? validateRecipe(r.catalogRecipe) : await this.resolver.resolve(catalogId(r.appId));
      } catch {
        await this.requests.updateOne({ _id: r._id, status: "approved" }, { $set: { status: "failed", resultCode: "CATALOG_METADATA", completedAt: /* @__PURE__ */ new Date() } });
        await recordDiagnostic(this.db, { id: r._id, userId: r.userId, machineId: r.machineId, leaseId: r.leaseId, source: "api", category: "installation", operation: "catalog-metadata", code: "ND_APP_CATALOG_METADATA", message: "Uygulaman\u0131n resm\xEE s\xFCr\xFCm bilgisi al\u0131namad\u0131. Ma\u011Fazadan yeniden deneyin." });
        continue;
      }
      recipe = validateRecipe({ ...recipe, execution: r.catalogExecution ?? recipe.execution ?? "silent" });
      try {
        await this.installations.valid(r);
      } catch {
        await this.installations.invalidate(r);
        continue;
      }
      const claim = (0, import_node_crypto9.randomBytes)(32).toString("hex");
      const saved = await this.requests.findOneAndUpdate({ _id: r._id, status: "approved", expiresAt: { $gt: /* @__PURE__ */ new Date() } }, { $set: { status: "running", stage: "downloading", version: recipe.version, sha256: recipe.sha256, mode: recipe.mode, fileName: r.appId.replace("winget:", "") + recipe.extension, claimHash: tokenHash(claim), startedAt: /* @__PURE__ */ new Date() } }, { returnDocument: "after" });
      if (saved) return { job: { request: this.installations.dto(saved), windowsSid: saved.windowsSid, claim, recipe, expiresAt: saved.expiresAt.toISOString(), serverNow: (/* @__PURE__ */ new Date()).toISOString() } };
    }
    return { job: null };
  }
  async progress(machine, id, body) {
    const r = await this.installations.running(machine, id, body.claim), phases = r.catalogExecution === "interactive" ? ["downloading", "verifying", "waiting_user", "installing"] : ["downloading", "verifying", "installing"];
    const index = phases.indexOf(String(body.stage));
    if (r.source !== "catalog" || index < 0 || index < phases.indexOf(r.stage) || index > phases.indexOf(r.stage) + 1 || !Number.isSafeInteger(body.downloadedBytes) || Number(body.downloadedBytes) < (r.downloadedBytes ?? 0) || Number(body.downloadedBytes) > 2 * 1024 ** 3 || body.totalBytes !== void 0 && (!Number.isSafeInteger(body.totalBytes) || Number(body.totalBytes) < Number(body.downloadedBytes) || Number(body.totalBytes) > 2 * 1024 ** 3)) throw new HttpError(400, "Kurulum a\u015Famas\u0131 ge\xE7ersiz.");
    await this.requests.updateOne({ _id: r._id, status: "running", claimHash: r.claimHash }, { $set: { stage: body.stage, downloadedBytes: body.downloadedBytes, ...body.totalBytes ? { totalBytes: body.totalBytes } : {}, progressAt: /* @__PURE__ */ new Date() } });
    return { expiresAt: r.expiresAt.toISOString(), serverNow: (/* @__PURE__ */ new Date()).toISOString() };
  }
};

// apps/api/src/app.ts
function createIdentityServer(store, options) {
  if (options.rateSecret.length < 32)
    throw new Error("AUTH_RATE_SECRET en az 32 karakter olmal\u0131.");
  const directory = options.directory ? new DirectoryService(store.database, options.directory) : void 0;
  const server = import_node_http.default.createServer(async (req, res) => {
    let actor;
    const pathname = new URL(req.url ?? "/", "http://identity.local").pathname;
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("X-Frame-Options", "DENY");
    const json = (status, value) => {
      res.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store"
      });
      res.end(JSON.stringify(value));
    };
    try {
      const route = `${req.method} ${new URL(req.url ?? "/", "http://identity.local").pathname}`;
      if (route === "GET /health") {
        await store.ping();
        json(200, {
          status: "ok",
          service: "nodera-identity",
          version: "0.5.0",
          capabilities: ["marketplace", "rdp-relay", "admin-monitoring-v1", "host-inventory-v1", "installation-approval-v1", "application-catalog-v1", "winget-catalog-v2", "catalog-interactive-v3", ...options.adminAd ? ["admin-ad-auth-v1"] : [], ...directory ? ["directory-v1", "directory-marketplace-v1", "windows-account-profile-v1"] : []]
        });
        return;
      }
      if (req.headers.origin)
        throw new HttpError(403, "Bu kayna\u011Fa izin verilmiyor.");
      if (route === "GET /v1/admin/auth-config") {
        json(200, options.adminAd?.config() ?? { provider: "membership" });
        return;
      }
      if (pathname.startsWith("/v1/install-agent/")) {
        const token2 = req.headers.authorization?.match(/^Bearer ([a-f0-9]{64})$/)?.[1] ?? "";
        const machine = await installations.authenticate(token2);
        await store.rateLimit("install-agent:" + machine.machineId, 3600);
        if (route === "POST /v1/install-agent/context") {
          json(200, await installations.context(machine));
          return;
        }
        if (route === "POST /v1/install-agent/catalog/claim") {
          json(200, await catalog.claim(machine, await readBody(req)));
          return;
        }
        if (route === "POST /v1/install-agent/requests") {
          json(200, await installations.submit(machine, await readBody(req)));
          return;
        }
        const request = pathname.match(/^\/v1\/install-agent\/requests\/([a-f0-9-]{36})\/(state|claim|continue|finish|cancel|progress)$/);
        if (req.method !== "POST" || !request) throw new HttpError(404, "Kurulum arac\u0131 i\u015Flemi bulunamad\u0131.");
        const [, id, action] = request, body = await readBody(req);
        if (action === "state") {
          json(200, await installations.state(machine, id));
          return;
        }
        if (action === "claim") {
          json(200, await installations.claim(machine, id));
          return;
        }
        if (action === "cancel") {
          json(200, await installations.cancel(machine, id, body.windowsSid));
          return;
        }
        if (action === "progress") {
          json(200, await catalog.progress(machine, id, body));
          return;
        }
        if (action === "continue") {
          const r = await installations.running(machine, id, body.claim);
          json(200, { ok: true, expiresAt: r.expiresAt.toISOString(), serverNow: (/* @__PURE__ */ new Date()).toISOString() });
          return;
        }
        json(200, await installations.finish(machine, id, body));
        return;
      }
      if (route.startsWith("POST /v1/ad-agent/")) {
        const token2 = req.headers.authorization?.match(/^Bearer ([a-f0-9]{64})$/)?.[1] ?? "";
        if (!directory || !directory.authenticate(token2)) throw new HttpError(403, "Arac\u0131 yetkisi do\u011Frulanamad\u0131.");
        if (route === "POST /v1/ad-agent/claim") {
          json(200, { job: await directory.claim() });
          return;
        }
        const jobId = route.match(/^POST \/v1\/ad-agent\/jobs\/([a-f0-9-]{36})$/)?.[1];
        if (!jobId) throw new HttpError(404, "Arac\u0131 i\u015Flemi bulunamad\u0131.");
        json(200, await directory.complete(jobId, await readBody(req, 262144)));
        return;
      }
      if (route === "POST /v1/auth/register" || route === "POST /v1/auth/login" || route === "POST /v1/admin/login" || route === "POST /v1/admin/ad-login") {
        let address = req.socket.remoteAddress ?? "unknown";
        if (options.trustProxy) {
          const forwarded = req.headers["x-forwarded-for"];
          const lastHop = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",").at(-1)?.trim();
          if (!lastHop || !(0, import_node_net.isIP)(lastHop))
            throw new HttpError(400, "Proxy adresi do\u011Frulanamad\u0131.");
          address = lastHop;
        }
        const key = (scope) => (0, import_node_crypto11.createHmac)("sha256", options.rateSecret).update(scope).digest("hex");
        await store.rateLimit(key(`ip:${address}`), 60);
        const body = await readBody(req);
        if (route === "POST /v1/admin/ad-login") {
          if (Object.keys(body).length !== 1 || typeof body.proof !== "string") throw new HttpError(400, "Yaln\u0131zca DC1 giri\u015F belgesi kabul edilir.");
          json(200, await admin.loginAd(body.proof));
          return;
        }
        if (body.remember !== void 0 && typeof body.remember !== "boolean")
          throw new HttpError(400, "Oturum saklama se\xE7imi ge\xE7ersiz.");
        let email, password;
        try {
          ({ email, password } = credentials(body));
        } catch (error) {
          throw new HttpError(400, error.message);
        }
        await store.rateLimit(key(`email:${email}`), 15);
        if (route === "POST /v1/admin/login") {
          json(200, await admin.login(email, password));
          return;
        }
        if (route.endsWith("register")) {
          const name = typeof body.name === "string" ? body.name.trim() : "";
          if (name.length < 2 || name.length > 60)
            throw new HttpError(400, "Ad\u0131n\u0131z 2\u201360 karakter aras\u0131nda olmal\u0131.");
          json(
            201,
            await store.register(name, email, password, body.remember === true)
          );
        } else
          json(200, await store.login(email, password, body.remember === true));
        return;
      }
      if (pathname.startsWith("/v1/admin/")) {
        const token2 = req.headers.authorization?.match(/^Bearer ([a-f0-9]{64})$/)?.[1];
        if (!token2) throw new HttpError(401, "Y\xF6netici giri\u015Fi gerekli.");
        const user = await admin.userFor(token2);
        await store.rateLimit("admin-read:" + user.id, 3e3);
        if (route === "POST /v1/admin/logout") {
          json(200, await admin.logout(token2));
          return;
        }
        if (route === "GET /v1/admin/catalog") {
          json(200, { apps: await catalog.apps() });
          return;
        }
        if (route === "GET /v1/admin/catalog/search") {
          await store.rateLimit("catalog-search:" + user.id, 300);
          json(200, await catalog.search(new URL(req.url, "http://identity.local").searchParams));
          return;
        }
        if (route === "GET /v1/admin/catalog/package") {
          await store.rateLimit("catalog-preview:" + user.id, 120);
          json(200, await catalog.preview(new URL(req.url, "http://identity.local").searchParams.get("packageId"), user));
          return;
        }
        const catalogSetting = pathname.match(/^\/v1\/admin\/catalog\/([a-z-]+|winget:[A-Za-z0-9._+-]+)$/);
        if (req.method === "POST" && catalogSetting) {
          json(200, await catalog.configure(catalogSetting[1], user, await readBody(req)));
          return;
        }
        const decision = pathname.match(/^\/v1\/admin\/installations\/([a-f0-9-]{36})\/decision$/);
        if (req.method === "POST" && decision) {
          json(200, await installations.decide(decision[1], user, await readBody(req)));
          return;
        }
        if (req.method !== "GET") throw new HttpError(405, "Bu y\xF6netim i\u015Flemi desteklenmiyor.");
        if (pathname === "/v1/admin/installations") {
          json(200, await installations.list(new URL(req.url, "http://identity.local").searchParams));
          return;
        }
        if (pathname === "/v1/admin/me") {
          json(200, { user });
          return;
        }
        if (pathname === "/v1/admin/overview") {
          json(200, await admin.overview());
          return;
        }
        json(200, await admin.list(pathname.slice("/v1/admin/".length), new URL(req.url, "http://identity.local").searchParams));
        return;
      }
      if (route === "POST /v1/host/inventory") {
        const token2 = req.headers.authorization?.match(/^Bearer ([a-f0-9]{64})$/)?.[1];
        if (!token2) throw new HttpError(401, "Giri\u015F yap\u0131n.");
        actor = await store.userFor(token2);
        await store.rateLimit("inventory:" + actor.id, 120);
        json(200, await receiveInventory(store.database, actor, await readBody(req, 524288)));
        return;
      }
      const marketplaceRoute = /^\/(?:v1\/marketplace|v1\/rentals)(?:\/|$)/.test(
        new URL(req.url ?? "/", "http://identity.local").pathname
      );
      const directoryRoute = /^\/(?:v1\/directory)(?:\/|$)/.test(new URL(req.url ?? "/", "http://identity.local").pathname);
      const catalogRoute = pathname === "/v1/catalog" || pathname === "/v1/catalog/install";
      if (route !== "GET /v1/auth/me" && route !== "POST /v1/auth/logout" && !marketplaceRoute && !directoryRoute && !catalogRoute)
        throw new HttpError(404, "\u0130\u015Flem bulunamad\u0131.");
      const match = req.headers.authorization?.match(/^Bearer ([a-f0-9]{64})$/);
      if (!match) throw new HttpError(401, "Devam etmek i\xE7in giri\u015F yap\u0131n.");
      const token = match[1];
      if (catalogRoute) {
        const user = await store.userFor(token);
        actor = user;
        await store.rateLimit("catalog:" + user.id, req.method === "GET" ? 3e3 : 120);
        if (route === "GET /v1/catalog") {
          json(200, await catalog.snapshot(user));
          return;
        }
        if (route === "POST /v1/catalog/install") {
          json(200, await catalog.enqueue(user, await readBody(req)));
          return;
        }
        throw new HttpError(405, "Ma\u011Faza i\u015Flemi desteklenmiyor.");
      }
      if (directoryRoute) {
        const user = await store.userFor(token), pathname2 = new URL(req.url ?? "/", "http://identity.local").pathname;
        actor = user;
        if (route === "GET /v1/directory/config") {
          json(200, directory ? { ...directory.config(), agentOnline: await directory.agentOnline() } : { enabled: false });
          return;
        }
        if (!directory) throw new HttpError(503, "Sunucuda otomatik AD haz\u0131rl\u0131\u011F\u0131 hen\xFCz yap\u0131land\u0131r\u0131lmad\u0131.");
        if (route === "GET /v1/directory/account") {
          json(200, { account: await directory.account(user.id) });
          return;
        }
        if (route === "POST /v1/directory/account") {
          await store.rateLimit("directory-account:" + user.id, 12);
          json(200, { account: await directory.setAccount(user, await readBody(req)) });
          return;
        }
        if (route === "POST /v1/directory/machines") {
          await store.rateLimit("directory-machine:" + user.id, 30);
          json(200, { machine: await directory.prepare(user, await readBody(req)) });
          return;
        }
        const machineRoute = pathname2.match(/^\/v1\/directory\/machines\/([a-f0-9-]{36})(?:\/(bootstrap|verify|cleanup|install-agent))?$/);
        if (!machineRoute) throw new HttpError(404, "Domain i\u015Flemi bulunamad\u0131.");
        const [, id, action] = machineRoute;
        if (req.method === "GET" && !action) {
          json(200, { machine: directory.publicMachine(await directory.owned(user.id, id)) });
          return;
        }
        if (req.method === "GET" && action === "bootstrap") {
          json(200, await directory.bootstrap(user, id));
          return;
        }
        if (req.method === "GET" && action === "install-agent") {
          json(200, await directory.installationConfig(user, id));
          return;
        }
        if (req.method === "POST" && action === "verify") {
          json(200, { machine: await directory.verify(user, id, await readBody(req)) });
          return;
        }
        if (req.method === "POST" && action === "cleanup") {
          json(200, { machine: await directory.cleanup(user.id, id) });
          return;
        }
        throw new HttpError(404, "Domain i\u015Flemi bulunamad\u0131.");
      }
      if (marketplaceRoute) {
        const user = await store.userFor(token);
        actor = user;
        json(
          200,
          await relay.handle(
            user,
            req.method ?? "GET",
            new URL(req.url ?? "/", "http://identity.local").pathname,
            req.method === "POST" ? await readBody(req) : {},
            new URL(req.url ?? "/", "http://identity.local").searchParams
          )
        );
        return;
      }
      if (route.endsWith("logout")) {
        await store.logout(token);
        json(200, { ok: true });
      } else json(200, { user: await store.userFor(token) });
    } catch (error) {
      if (actor && req.method === "POST" && !pathname.startsWith("/v1/host/") && !(error instanceof HttpError && [404, 429].includes(error.status))) {
        const category = pathname.startsWith("/v1/directory/") ? "directory" : "rental";
        void recordDiagnostic(store.database, { userId: actor.id, source: "api", category, code: error instanceof HttpError ? `HTTP_${error.status}` : "ND_API_ERROR", message: error instanceof HttpError ? error.message : "Sunucu i\u015Flemi tamamlanamad\u0131.", operation: pathname.split("/").at(-1)?.slice(0, 40) }).catch(() => {
        });
      }
      if (error instanceof HttpError) {
        if (error.status === 429) res.setHeader("Retry-After", "600");
        json(error.status, { error: error.message });
      } else {
        console.error("\xDCyelik veritaban\u0131 i\u015Flemi tamamlanamad\u0131.");
        json(503, {
          error: "\xDCyelik hizmetine \u015Fu anda ula\u015F\u0131lam\u0131yor. Biraz sonra tekrar deneyin."
        });
      }
    }
  });
  const relay = createRentalRelay(server, store, options.rateSecret, directory);
  const installations = new InstallationService(store.database);
  const catalog = new CatalogService(store.database, installations);
  const admin = new AdminService(store, options.adminEmails ?? [], relay.online, !!directory, options.adminAd);
  server.requestTimeout = 15e3;
  server.headersTimeout = 1e4;
  server.maxHeadersCount = 40;
  return Object.assign(server, { stopRentalRelay: relay.stop });
}
async function readBody(req, limit = 16384) {
  if (!req.headers["content-type"]?.startsWith("application/json"))
    throw new HttpError(415, "JSON i\xE7erik gerekli.");
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw new HttpError(413, "\u0130stek \xE7ok b\xFCy\xFCk.");
    chunks.push(chunk);
  }
  try {
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new Error();
    return body;
  } catch {
    throw new HttpError(400, "Ge\xE7ersiz JSON iste\u011Fi.");
  }
}

// apps/api/src/admin-ad.ts
var import_node_crypto12 = require("node:crypto");
var sid2 = /^S-1-5-21-\d+-\d+-\d+-\d+$/;
var guid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
function object(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("object");
  return value;
}
function decode(value, max) {
  if (!/^[A-Za-z0-9_-]+$/.test(value) || value.length > max) throw new Error("encoding");
  const data = Buffer.from(value, "base64url");
  if (data.toString("base64url") !== value) throw new Error("encoding");
  return data;
}
function text2(value, max) {
  return typeof value === "string" && value.length > 0 && value.length <= max && !/[\x00-\x1f\x7f]/.test(value);
}
var AdminAdVerifier = class {
  issuer;
  audience;
  groupSid;
  keys = /* @__PURE__ */ new Map();
  constructor(input) {
    try {
      const trust = object(input), uri = new URL(trust.issuer);
      if (uri.protocol !== "https:" || uri.username || uri.password || uri.search || uri.hash || uri.pathname !== "/nodera-auth" || uri.href !== trust.issuer || trust.audience !== "urn:nodera:admin" || !sid2.test(trust.groupSid)) throw new Error("trust");
      this.issuer = trust.issuer;
      this.audience = trust.audience;
      this.groupSid = trust.groupSid;
      const keys = object(trust.jwks).keys;
      if (!Array.isArray(keys) || !keys.length || keys.length > 8) throw new Error("keys");
      for (const inputKey of keys) {
        const key = object(inputKey);
        if (Object.keys(key).some((k) => !["kty", "use", "alg", "kid", "n", "e"].includes(k)) || key.kty !== "RSA" || key.alg !== "RS256" || key.use !== "sig" || !/^[a-f0-9]{64}$/.test(key.kid) || this.keys.has(key.kid)) throw new Error("key");
        decode(key.n, 1400);
        decode(key.e, 12);
        const publicKey = (0, import_node_crypto12.createPublicKey)({ key: { kty: "RSA", n: key.n, e: key.e }, format: "jwk" });
        const size = publicKey.asymmetricKeyDetails?.modulusLength ?? 0;
        if (publicKey.asymmetricKeyType !== "rsa" || size < 2048 || size > 8192) throw new Error("key size");
        this.keys.set(key.kid, publicKey);
      }
    } catch {
      throw new IdentityStartupError("CONFIG_ADMIN_AD");
    }
  }
  config() {
    return { provider: "ad", issuer: this.issuer, audience: this.audience, groupSid: this.groupSid, keyIds: [...this.keys.keys()], sessionMode: "application" };
  }
  accepts(kid, issuer, groupSid) {
    return issuer === this.issuer && groupSid === this.groupSid && this.keys.has(kid);
  }
  verify(proof, now = Math.floor(Date.now() / 1e3)) {
    try {
      if (typeof proof !== "string" || proof.length > 8192) throw new Error("proof");
      const parts = proof.split(".");
      if (parts.length !== 3) throw new Error("format");
      const header = object(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(decode(parts[0], 1024))));
      if (Object.keys(header).some((k) => !["alg", "typ", "kid"].includes(k)) || header.alg !== "RS256" || header.typ !== "JWT") throw new Error("algorithm");
      const key = this.keys.get(header.kid);
      if (!key || !(0, import_node_crypto12.verify)("RSA-SHA256", Buffer.from(parts[0] + "." + parts[1], "ascii"), key, decode(parts[2], 1400))) throw new Error("signature");
      const claims = object(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(decode(parts[1], 6e3))));
      if (claims.iss !== this.issuer || claims.aud !== this.audience || !sid2.test(claims.sub) || !guid.test(claims.jti) || ![claims.iat, claims.nbf, claims.exp].every(Number.isSafeInteger) || claims.iat > now + 30 || claims.nbf > now + 30 || claims.nbf !== claims.iat || claims.exp <= now || claims.exp <= claims.iat || claims.exp - claims.iat > 300 || now - claims.iat > 300 || !Array.isArray(claims.groups) || !claims.groups.includes(this.groupSid) || !Array.isArray(claims.amr) || !claims.amr.includes("pwd") || !claims.amr.includes("ad-network") || !text2(claims.username, 80) || !/^NODERA\\[A-Za-z0-9][A-Za-z0-9._-]{0,19}$/i.test(claims.username) || !text2(claims.name, 200)) throw new Error("claims");
      const user = { id: "ad:" + claims.sub, name: claims.name, email: "", username: claims.username, provider: "ad" };
      return { user, jti: claims.jti, kid: header.kid, proofExpiresAt: new Date(claims.exp * 1e3) };
    } catch {
      throw new HttpError(401, "DC1 giri\u015F belgesi do\u011Frulanamad\u0131 veya s\xFCresi doldu. Yeniden giri\u015F yap.");
    }
  }
};
function adminAdOptions(env = process.env) {
  const mode = env.NODERA_ADMIN_AUTH_MODE ?? "membership", value = env.NODERA_ADMIN_AD_TRUST?.trim();
  if (mode === "membership" && !value) return;
  if (mode !== "ad" || !value || value.length > 2e4) throw new IdentityStartupError("CONFIG_ADMIN_AD");
  try {
    return new AdminAdVerifier(JSON.parse(value));
  } catch {
    throw new IdentityStartupError("CONFIG_ADMIN_AD");
  }
}

// apps/api/src/index.ts
async function main() {
  const port = Number(process.env.PORT ?? 8080);
  if (!Number.isSafeInteger(port) || port < 1 || port > 65535)
    throw new IdentityStartupError("CONFIG_PORT");
  const rateSecret = process.env.AUTH_RATE_SECRET ?? "";
  if (rateSecret.length < 32) throw new IdentityStartupError("CONFIG_SECRET");
  const adminAd = adminAdOptions();
  const { store, client } = await connectAccounts(
    process.env.MONGODB_URI ?? "",
    process.env.MONGODB_DATABASE ?? "nodera"
  );
  const server = createIdentityServer(store, {
    rateSecret,
    trustProxy: process.env.TRUST_PROXY === "1",
    directory: directoryOptions(),
    adminEmails: adminEmails(process.env.NODERA_ADMIN_EMAILS),
    adminAd
  });
  server.listen(
    port,
    process.env.HOST ?? "0.0.0.0",
    () => console.log(`Nodera \xFCyelik API\u2019si ${port} portunda haz\u0131r.`)
  );
  server.on("error", (error) => {
    console.error(identityStartupFailure(error));
    void client.close().finally(() => process.exit(1));
  });
  function stop() {
    server.stopRentalRelay();
    server.close(() => {
      void client.close().finally(() => process.exit(0));
    });
    server.closeIdleConnections();
  }
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
}
void main().catch((error) => {
  console.error(identityStartupFailure(error));
  process.exitCode = 1;
});
