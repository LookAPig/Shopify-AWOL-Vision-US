/** @returns {void} */
function noop() {}

const identity = (x) => x;

/**
 * @template T
 * @template S
 * @param {T} tar
 * @param {S} src
 * @returns {T & S}
 */
function assign(tar, src) {
	// @ts-ignore
	for (const k in src) tar[k] = src[k];
	return /** @type {T & S} */ (tar);
}

function run(fn) {
	return fn();
}

function blank_object() {
	return Object.create(null);
}

/**
 * @param {Function[]} fns
 * @returns {void}
 */
function run_all(fns) {
	fns.forEach(run);
}

/**
 * @param {any} thing
 * @returns {thing is Function}
 */
function is_function(thing) {
	return typeof thing === 'function';
}

/** @returns {boolean} */
function safe_not_equal(a, b) {
	return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}

let src_url_equal_anchor;

/**
 * @param {string} element_src
 * @param {string} url
 * @returns {boolean}
 */
function src_url_equal(element_src, url) {
	if (element_src === url) return true;
	if (!src_url_equal_anchor) {
		src_url_equal_anchor = document.createElement('a');
	}
	// This is actually faster than doing URL(..).href
	src_url_equal_anchor.href = url;
	return element_src === src_url_equal_anchor.href;
}

/** @param {string} srcset */
function split_srcset(srcset) {
	return srcset.split(',').map((src) => src.trim().split(' ').filter(Boolean));
}

/**
 * @param {HTMLSourceElement | HTMLImageElement} element_srcset
 * @param {string | undefined | null} srcset
 * @returns {boolean}
 */
function srcset_url_equal(element_srcset, srcset) {
	const element_urls = split_srcset(element_srcset.srcset);
	const urls = split_srcset(srcset || '');

	return (
		urls.length === element_urls.length &&
		urls.every(
			([url, width], i) =>
				width === element_urls[i][1] &&
				// We need to test both ways because Vite will create an a full URL with
				// `new URL(asset, import.meta.url).href` for the client when `base: './'`, and the
				// relative URLs inside srcset are not automatically resolved to absolute URLs by
				// browsers (in contrast to img.src). This means both SSR and DOM code could
				// contain relative or absolute URLs.
				(src_url_equal(element_urls[i][0], url) || src_url_equal(url, element_urls[i][0]))
		)
	);
}

/** @returns {boolean} */
function is_empty(obj) {
	return Object.keys(obj).length === 0;
}

function subscribe(store, ...callbacks) {
	if (store == null) {
		for (const callback of callbacks) {
			callback(undefined);
		}
		return noop;
	}
	const unsub = store.subscribe(...callbacks);
	return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}

/**
 * Get the current value from a store by subscribing and immediately unsubscribing.
 *
 * https://svelte.dev/docs/svelte-store#get
 * @template T
 * @param {import('../store/public.js').Readable<T>} store
 * @returns {T}
 */
function get_store_value(store) {
	let value;
	subscribe(store, (_) => (value = _))();
	return value;
}

/** @returns {void} */
function component_subscribe(component, store, callback) {
	component.$$.on_destroy.push(subscribe(store, callback));
}

function create_slot(definition, ctx, $$scope, fn) {
	if (definition) {
		const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
		return definition[0](slot_ctx);
	}
}

function get_slot_context(definition, ctx, $$scope, fn) {
	return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
}

function get_slot_changes(definition, $$scope, dirty, fn) {
	if (definition[2] && fn) {
		const lets = definition[2](fn(dirty));
		if ($$scope.dirty === undefined) {
			return lets;
		}
		if (typeof lets === 'object') {
			const merged = [];
			const len = Math.max($$scope.dirty.length, lets.length);
			for (let i = 0; i < len; i += 1) {
				merged[i] = $$scope.dirty[i] | lets[i];
			}
			return merged;
		}
		return $$scope.dirty | lets;
	}
	return $$scope.dirty;
}

/** @returns {void} */
function update_slot_base(
	slot,
	slot_definition,
	ctx,
	$$scope,
	slot_changes,
	get_slot_context_fn
) {
	if (slot_changes) {
		const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
		slot.p(slot_context, slot_changes);
	}
}

/** @returns {any[] | -1} */
function get_all_dirty_from_scope($$scope) {
	if ($$scope.ctx.length > 32) {
		const dirty = [];
		const length = $$scope.ctx.length / 32;
		for (let i = 0; i < length; i++) {
			dirty[i] = -1;
		}
		return dirty;
	}
	return -1;
}

/** @returns {{}} */
function exclude_internal_props(props) {
	const result = {};
	for (const k in props) if (k[0] !== '$') result[k] = props[k];
	return result;
}

function null_to_empty(value) {
	return value == null ? '' : value;
}

function action_destroyer(action_result) {
	return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}

/** @param {number | string} value
 * @returns {[number, string]}
 */
function split_css_unit(value) {
	const split = typeof value === 'string' && value.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
	return split ? [parseFloat(split[1]), split[2] || 'px'] : [/** @type {number} */ (value), 'px'];
}

const is_client = typeof window !== 'undefined';

/** @type {() => number} */
let now = is_client ? () => window.performance.now() : () => Date.now();

let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;

const tasks = new Set();

/**
 * @param {number} now
 * @returns {void}
 */
function run_tasks(now) {
	tasks.forEach((task) => {
		if (!task.c(now)) {
			tasks.delete(task);
			task.f();
		}
	});
	if (tasks.size !== 0) raf(run_tasks);
}

/**
 * Creates a new task that runs on each raf frame
 * until it returns a falsy value or is aborted
 * @param {import('./private.js').TaskCallback} callback
 * @returns {import('./private.js').Task}
 */
function loop(callback) {
	/** @type {import('./private.js').TaskEntry} */
	let task;
	if (tasks.size === 0) raf(run_tasks);
	return {
		promise: new Promise((fulfill) => {
			tasks.add((task = { c: callback, f: fulfill }));
		}),
		abort() {
			tasks.delete(task);
		}
	};
}

// Track which nodes are claimed during hydration. Unclaimed nodes can then be removed from the DOM
// at the end of hydration without touching the remaining nodes.
let is_hydrating = false;

/**
 * @returns {void}
 */
function start_hydrating() {
	is_hydrating = true;
}

/**
 * @returns {void}
 */
function end_hydrating() {
	is_hydrating = false;
}

/**
 * @param {number} low
 * @param {number} high
 * @param {(index: number) => number} key
 * @param {number} value
 * @returns {number}
 */
function upper_bound(low, high, key, value) {
	// Return first index of value larger than input value in the range [low, high)
	while (low < high) {
		const mid = low + ((high - low) >> 1);
		if (key(mid) <= value) {
			low = mid + 1;
		} else {
			high = mid;
		}
	}
	return low;
}

/**
 * @param {NodeEx} target
 * @returns {void}
 */
function init_hydrate(target) {
	if (target.hydrate_init) return;
	target.hydrate_init = true;
	// We know that all children have claim_order values since the unclaimed have been detached if target is not <head>

	let children = /** @type {ArrayLike<NodeEx2>} */ (target.childNodes);
	// If target is <head>, there may be children without claim_order
	if (target.nodeName === 'HEAD') {
		const my_children = [];
		for (let i = 0; i < children.length; i++) {
			const node = children[i];
			if (node.claim_order !== undefined) {
				my_children.push(node);
			}
		}
		children = my_children;
	}
	/*
	 * Reorder claimed children optimally.
	 * We can reorder claimed children optimally by finding the longest subsequence of
	 * nodes that are already claimed in order and only moving the rest. The longest
	 * subsequence of nodes that are claimed in order can be found by
	 * computing the longest increasing subsequence of .claim_order values.
	 *
	 * This algorithm is optimal in generating the least amount of reorder operations
	 * possible.
	 *
	 * Proof:
	 * We know that, given a set of reordering operations, the nodes that do not move
	 * always form an increasing subsequence, since they do not move among each other
	 * meaning that they must be already ordered among each other. Thus, the maximal
	 * set of nodes that do not move form a longest increasing subsequence.
	 */
	// Compute longest increasing subsequence
	// m: subsequence length j => index k of smallest value that ends an increasing subsequence of length j
	const m = new Int32Array(children.length + 1);
	// Predecessor indices + 1
	const p = new Int32Array(children.length);
	m[0] = -1;
	let longest = 0;
	for (let i = 0; i < children.length; i++) {
		const current = children[i].claim_order;
		// Find the largest subsequence length such that it ends in a value less than our current value
		// upper_bound returns first greater value, so we subtract one
		// with fast path for when we are on the current longest subsequence
		const seq_len =
			(longest > 0 && children[m[longest]].claim_order <= current
				? longest + 1
				: upper_bound(1, longest, (idx) => children[m[idx]].claim_order, current)) - 1;
		p[i] = m[seq_len] + 1;
		const new_len = seq_len + 1;
		// We can guarantee that current is the smallest value. Otherwise, we would have generated a longer sequence.
		m[new_len] = i;
		longest = Math.max(new_len, longest);
	}
	// The longest increasing subsequence of nodes (initially reversed)

	/**
	 * @type {NodeEx2[]}
	 */
	const lis = [];
	// The rest of the nodes, nodes that will be moved

	/**
	 * @type {NodeEx2[]}
	 */
	const to_move = [];
	let last = children.length - 1;
	for (let cur = m[longest] + 1; cur != 0; cur = p[cur - 1]) {
		lis.push(children[cur - 1]);
		for (; last >= cur; last--) {
			to_move.push(children[last]);
		}
		last--;
	}
	for (; last >= 0; last--) {
		to_move.push(children[last]);
	}
	lis.reverse();
	// We sort the nodes being moved to guarantee that their insertion order matches the claim order
	to_move.sort((a, b) => a.claim_order - b.claim_order);
	// Finally, we move the nodes
	for (let i = 0, j = 0; i < to_move.length; i++) {
		while (j < lis.length && to_move[i].claim_order >= lis[j].claim_order) {
			j++;
		}
		const anchor = j < lis.length ? lis[j] : null;
		target.insertBefore(to_move[i], anchor);
	}
}

/**
 * @param {Node} target
 * @param {Node} node
 * @returns {void}
 */
function append(target, node) {
	target.appendChild(node);
}

/**
 * @param {Node} target
 * @param {string} style_sheet_id
 * @param {string} styles
 * @returns {void}
 */
function append_styles(target, style_sheet_id, styles) {
	const append_styles_to = get_root_for_style(target);
	if (!append_styles_to.getElementById(style_sheet_id)) {
		const style = element('style');
		style.id = style_sheet_id;
		style.textContent = styles;
		append_stylesheet(append_styles_to, style);
	}
}

/**
 * @param {Node} node
 * @returns {ShadowRoot | Document}
 */
function get_root_for_style(node) {
	if (!node) return document;
	const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
	if (root && /** @type {ShadowRoot} */ (root).host) {
		return /** @type {ShadowRoot} */ (root);
	}
	return node.ownerDocument;
}

/**
 * @param {Node} node
 * @returns {CSSStyleSheet}
 */
function append_empty_stylesheet(node) {
	const style_element = element('style');
	// For transitions to work without 'style-src: unsafe-inline' Content Security Policy,
	// these empty tags need to be allowed with a hash as a workaround until we move to the Web Animations API.
	// Using the hash for the empty string (for an empty tag) works in all browsers except Safari.
	// So as a workaround for the workaround, when we append empty style tags we set their content to /* empty */.
	// The hash 'sha256-9OlNO0DNEeaVzHL4RZwCLsBHA8WBQ8toBp/4F5XV2nc=' will then work even in Safari.
	style_element.textContent = '/* empty */';
	append_stylesheet(get_root_for_style(node), style_element);
	return style_element.sheet;
}

/**
 * @param {ShadowRoot | Document} node
 * @param {HTMLStyleElement} style
 * @returns {CSSStyleSheet}
 */
function append_stylesheet(node, style) {
	append(/** @type {Document} */ (node).head || node, style);
	return style.sheet;
}

/**
 * @param {NodeEx} target
 * @param {NodeEx} node
 * @returns {void}
 */
function append_hydration(target, node) {
	if (is_hydrating) {
		init_hydrate(target);
		if (
			target.actual_end_child === undefined ||
			(target.actual_end_child !== null && target.actual_end_child.parentNode !== target)
		) {
			target.actual_end_child = target.firstChild;
		}
		// Skip nodes of undefined ordering
		while (target.actual_end_child !== null && target.actual_end_child.claim_order === undefined) {
			target.actual_end_child = target.actual_end_child.nextSibling;
		}
		if (node !== target.actual_end_child) {
			// We only insert if the ordering of this node should be modified or the parent node is not target
			if (node.claim_order !== undefined || node.parentNode !== target) {
				target.insertBefore(node, target.actual_end_child);
			}
		} else {
			target.actual_end_child = node.nextSibling;
		}
	} else if (node.parentNode !== target || node.nextSibling !== null) {
		target.appendChild(node);
	}
}

/**
 * @param {Node} target
 * @param {Node} node
 * @param {Node} [anchor]
 * @returns {void}
 */
function insert(target, node, anchor) {
	target.insertBefore(node, anchor || null);
}

/**
 * @param {NodeEx} target
 * @param {NodeEx} node
 * @param {NodeEx} [anchor]
 * @returns {void}
 */
function insert_hydration(target, node, anchor) {
	if (is_hydrating && !anchor) {
		append_hydration(target, node);
	} else if (node.parentNode !== target || node.nextSibling != anchor) {
		target.insertBefore(node, anchor || null);
	}
}

/**
 * @param {Node} node
 * @returns {void}
 */
function detach(node) {
	if (node.parentNode) {
		node.parentNode.removeChild(node);
	}
}

/**
 * @returns {void} */
function destroy_each(iterations, detaching) {
	for (let i = 0; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].d(detaching);
	}
}

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} name
 * @returns {HTMLElementTagNameMap[K]}
 */
function element(name) {
	return document.createElement(name);
}

/**
 * @template {keyof SVGElementTagNameMap} K
 * @param {K} name
 * @returns {SVGElement}
 */
function svg_element(name) {
	return document.createElementNS('http://www.w3.org/2000/svg', name);
}

/**
 * @param {string} data
 * @returns {Text}
 */
function text(data) {
	return document.createTextNode(data);
}

/**
 * @returns {Text} */
function space() {
	return text(' ');
}

/**
 * @returns {Text} */
function empty() {
	return text('');
}

/**
 * @param {EventTarget} node
 * @param {string} event
 * @param {EventListenerOrEventListenerObject} handler
 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
 * @returns {() => void}
 */
function listen(node, event, handler, options) {
	node.addEventListener(event, handler, options);
	return () => node.removeEventListener(event, handler, options);
}

/**
 * @param {Element} node
 * @param {string} attribute
 * @param {string} [value]
 * @returns {void}
 */
function attr(node, attribute, value) {
	if (value == null) node.removeAttribute(attribute);
	else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
}

/**
 * @param {HTMLElement} node
 * @returns {string}
 */
function get_svelte_dataset(node) {
	return node.dataset.svelteH;
}

/**
 * @param {Element} element
 * @returns {ChildNode[]}
 */
function children(element) {
	return Array.from(element.childNodes);
}

/**
 * @param {ChildNodeArray} nodes
 * @returns {void}
 */
function init_claim_info(nodes) {
	if (nodes.claim_info === undefined) {
		nodes.claim_info = { last_index: 0, total_claimed: 0 };
	}
}

/**
 * @template {ChildNodeEx} R
 * @param {ChildNodeArray} nodes
 * @param {(node: ChildNodeEx) => node is R} predicate
 * @param {(node: ChildNodeEx) => ChildNodeEx | undefined} process_node
 * @param {() => R} create_node
 * @param {boolean} dont_update_last_index
 * @returns {R}
 */
function claim_node(nodes, predicate, process_node, create_node, dont_update_last_index = false) {
	// Try to find nodes in an order such that we lengthen the longest increasing subsequence
	init_claim_info(nodes);
	const result_node = (() => {
		// We first try to find an element after the previous one
		for (let i = nodes.claim_info.last_index; i < nodes.length; i++) {
			const node = nodes[i];
			if (predicate(node)) {
				const replacement = process_node(node);
				if (replacement === undefined) {
					nodes.splice(i, 1);
				} else {
					nodes[i] = replacement;
				}
				if (!dont_update_last_index) {
					nodes.claim_info.last_index = i;
				}
				return node;
			}
		}
		// Otherwise, we try to find one before
		// We iterate in reverse so that we don't go too far back
		for (let i = nodes.claim_info.last_index - 1; i >= 0; i--) {
			const node = nodes[i];
			if (predicate(node)) {
				const replacement = process_node(node);
				if (replacement === undefined) {
					nodes.splice(i, 1);
				} else {
					nodes[i] = replacement;
				}
				if (!dont_update_last_index) {
					nodes.claim_info.last_index = i;
				} else if (replacement === undefined) {
					// Since we spliced before the last_index, we decrease it
					nodes.claim_info.last_index--;
				}
				return node;
			}
		}
		// If we can't find any matching node, we create a new one
		return create_node();
	})();
	result_node.claim_order = nodes.claim_info.total_claimed;
	nodes.claim_info.total_claimed += 1;
	return result_node;
}

/**
 * @param {ChildNodeArray} nodes
 * @param {string} name
 * @param {{ [key: string]: boolean }} attributes
 * @param {(name: string) => Element | SVGElement} create_element
 * @returns {Element | SVGElement}
 */
function claim_element_base(nodes, name, attributes, create_element) {
	return claim_node(
		nodes,
		/** @returns {node is Element | SVGElement} */
		(node) => node.nodeName === name,
		/** @param {Element} node */
		(node) => {
			const remove = [];
			for (let j = 0; j < node.attributes.length; j++) {
				const attribute = node.attributes[j];
				if (!attributes[attribute.name]) {
					remove.push(attribute.name);
				}
			}
			remove.forEach((v) => node.removeAttribute(v));
			return undefined;
		},
		() => create_element(name)
	);
}

/**
 * @param {ChildNodeArray} nodes
 * @param {string} name
 * @param {{ [key: string]: boolean }} attributes
 * @returns {Element | SVGElement}
 */
function claim_element(nodes, name, attributes) {
	return claim_element_base(nodes, name, attributes, element);
}

/**
 * @param {ChildNodeArray} nodes
 * @returns {Text}
 */
function claim_text(nodes, data) {
	return claim_node(
		nodes,
		/** @returns {node is Text} */
		(node) => node.nodeType === 3,
		/** @param {Text} node */
		(node) => {
			const data_str = '' + data;
			if (node.data.startsWith(data_str)) {
				if (node.data.length !== data_str.length) {
					return node.splitText(data_str.length);
				}
			} else {
				node.data = data_str;
			}
		},
		() => text(data),
		true // Text nodes should not update last index since it is likely not worth it to eliminate an increasing subsequence of actual elements
	);
}

/**
 * @returns {Text} */
function claim_space(nodes) {
	return claim_text(nodes, ' ');
}

function get_comment_idx(nodes, text, start) {
	for (let i = start; i < nodes.length; i += 1) {
		const node = nodes[i];
		if (node.nodeType === 8 /* comment node */ && node.textContent.trim() === text) {
			return i;
		}
	}
	return -1;
}

/**
 * @param {boolean} is_svg
 * @returns {HtmlTagHydration}
 */
function claim_html_tag(nodes, is_svg) {
	// find html opening tag
	const start_index = get_comment_idx(nodes, 'HTML_TAG_START', 0);
	const end_index = get_comment_idx(nodes, 'HTML_TAG_END', start_index + 1);
	if (start_index === -1 || end_index === -1) {
		return new HtmlTagHydration(is_svg);
	}

	init_claim_info(nodes);
	const html_tag_nodes = nodes.splice(start_index, end_index - start_index + 1);
	detach(html_tag_nodes[0]);
	detach(html_tag_nodes[html_tag_nodes.length - 1]);
	const claimed_nodes = html_tag_nodes.slice(1, html_tag_nodes.length - 1);
	if (claimed_nodes.length === 0) {
		return new HtmlTagHydration(is_svg);
	}
	for (const n of claimed_nodes) {
		n.claim_order = nodes.claim_info.total_claimed;
		nodes.claim_info.total_claimed += 1;
	}
	return new HtmlTagHydration(is_svg, claimed_nodes);
}

/**
 * @param {Text} text
 * @param {unknown} data
 * @returns {void}
 */
function set_data(text, data) {
	data = '' + data;
	if (text.data === data) return;
	text.data = /** @type {string} */ (data);
}

/**
 * @returns {void} */
function set_style(node, key, value, important) {
	if (value == null) {
		node.style.removeProperty(key);
	} else {
		node.style.setProperty(key, value, important ? 'important' : '');
	}
}

/**
 * @returns {void} */
function toggle_class(element, name, toggle) {
	// The `!!` is required because an `undefined` flag means flipping the current state.
	element.classList.toggle(name, !!toggle);
}

/**
 * @template T
 * @param {string} type
 * @param {T} [detail]
 * @param {{ bubbles?: boolean, cancelable?: boolean }} [options]
 * @returns {CustomEvent<T>}
 */
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
	return new CustomEvent(type, { detail, bubbles, cancelable });
}
/** */
class HtmlTag {
	/**
	 * @private
	 * @default false
	 */
	is_svg = false;
	/** parent for creating node */
	e = undefined;
	/** html tag nodes */
	n = undefined;
	/** target */
	t = undefined;
	/** anchor */
	a = undefined;
	constructor(is_svg = false) {
		this.is_svg = is_svg;
		this.e = this.n = null;
	}

	/**
	 * @param {string} html
	 * @returns {void}
	 */
	c(html) {
		this.h(html);
	}

	/**
	 * @param {string} html
	 * @param {HTMLElement | SVGElement} target
	 * @param {HTMLElement | SVGElement} anchor
	 * @returns {void}
	 */
	m(html, target, anchor = null) {
		if (!this.e) {
			if (this.is_svg)
				this.e = svg_element(/** @type {keyof SVGElementTagNameMap} */ (target.nodeName));
			/** #7364  target for <template> may be provided as #document-fragment(11) */ else
				this.e = element(
					/** @type {keyof HTMLElementTagNameMap} */ (
						target.nodeType === 11 ? 'TEMPLATE' : target.nodeName
					)
				);
			this.t =
				target.tagName !== 'TEMPLATE'
					? target
					: /** @type {HTMLTemplateElement} */ (target).content;
			this.c(html);
		}
		this.i(anchor);
	}

	/**
	 * @param {string} html
	 * @returns {void}
	 */
	h(html) {
		this.e.innerHTML = html;
		this.n = Array.from(
			this.e.nodeName === 'TEMPLATE' ? this.e.content.childNodes : this.e.childNodes
		);
	}

	/**
	 * @returns {void} */
	i(anchor) {
		for (let i = 0; i < this.n.length; i += 1) {
			insert(this.t, this.n[i], anchor);
		}
	}

	/**
	 * @param {string} html
	 * @returns {void}
	 */
	p(html) {
		this.d();
		this.h(html);
		this.i(this.a);
	}

	/**
	 * @returns {void} */
	d() {
		this.n.forEach(detach);
	}
}

class HtmlTagHydration extends HtmlTag {
	/** @type {Element[]} hydration claimed nodes */
	l = undefined;

	constructor(is_svg = false, claimed_nodes) {
		super(is_svg);
		this.e = this.n = null;
		this.l = claimed_nodes;
	}

	/**
	 * @param {string} html
	 * @returns {void}
	 */
	c(html) {
		if (this.l) {
			this.n = this.l;
		} else {
			super.c(html);
		}
	}

	/**
	 * @returns {void} */
	i(anchor) {
		for (let i = 0; i < this.n.length; i += 1) {
			insert_hydration(this.t, this.n[i], anchor);
		}
	}
}

/**
 * @param {HTMLElement} element
 * @returns {{}}
 */
function get_custom_elements_slots(element) {
	const result = {};
	element.childNodes.forEach(
		/** @param {Element} node */ (node) => {
			result[node.slot || 'default'] = true;
		}
	);
	return result;
}

/**
 * @typedef {Node & {
 * 	claim_order?: number;
 * 	hydrate_init?: true;
 * 	actual_end_child?: NodeEx;
 * 	childNodes: NodeListOf<NodeEx>;
 * }} NodeEx
 */

/** @typedef {ChildNode & NodeEx} ChildNodeEx */

/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

/**
 * @typedef {ChildNodeEx[] & {
 * 	claim_info?: {
 * 		last_index: number;
 * 		total_claimed: number;
 * 	};
 * }} ChildNodeArray
 */

// we need to store the information for multiple documents because a Svelte application could also contain iframes
// https://github.com/sveltejs/svelte/issues/3624
/** @type {Map<Document | ShadowRoot, import('./private.d.ts').StyleInformation>} */
const managed_styles = new Map();

let active = 0;

// https://github.com/darkskyapp/string-hash/blob/master/index.js
/**
 * @param {string} str
 * @returns {number}
 */
function hash(str) {
	let hash = 5381;
	let i = str.length;
	while (i--) hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
	return hash >>> 0;
}

/**
 * @param {Document | ShadowRoot} doc
 * @param {Element & ElementCSSInlineStyle} node
 * @returns {{ stylesheet: any; rules: {}; }}
 */
function create_style_information(doc, node) {
	const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
	managed_styles.set(doc, info);
	return info;
}

/**
 * @param {Element & ElementCSSInlineStyle} node
 * @param {number} a
 * @param {number} b
 * @param {number} duration
 * @param {number} delay
 * @param {(t: number) => number} ease
 * @param {(t: number, u: number) => string} fn
 * @param {number} uid
 * @returns {string}
 */
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
	const step = 16.666 / duration;
	let keyframes = '{\n';
	for (let p = 0; p <= 1; p += step) {
		const t = a + (b - a) * ease(p);
		keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
	}
	const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
	const name = `__svelte_${hash(rule)}_${uid}`;
	const doc = get_root_for_style(node);
	const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
	if (!rules[name]) {
		rules[name] = true;
		stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
	}
	const animation = node.style.animation || '';
	node.style.animation = `${
		animation ? `${animation}, ` : ''
	}${name} ${duration}ms linear ${delay}ms 1 both`;
	active += 1;
	return name;
}

/**
 * @param {Element & ElementCSSInlineStyle} node
 * @param {string} [name]
 * @returns {void}
 */
function delete_rule(node, name) {
	const previous = (node.style.animation || '').split(', ');
	const next = previous.filter(
		name
			? (anim) => anim.indexOf(name) < 0 // remove specific animation
			: (anim) => anim.indexOf('__svelte') === -1 // remove all Svelte animations
	);
	const deleted = previous.length - next.length;
	if (deleted) {
		node.style.animation = next.join(', ');
		active -= deleted;
		if (!active) clear_rules();
	}
}

/** @returns {void} */
function clear_rules() {
	raf(() => {
		if (active) return;
		managed_styles.forEach((info) => {
			const { ownerNode } = info.stylesheet;
			// there is no ownerNode if it runs on jsdom.
			if (ownerNode) detach(ownerNode);
		});
		managed_styles.clear();
	});
}

let current_component;

/** @returns {void} */
function set_current_component(component) {
	current_component = component;
}

function get_current_component() {
	if (!current_component) throw new Error('Function called outside component initialization');
	return current_component;
}

/**
 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
 * it can be called from an external module).
 *
 * If a function is returned _synchronously_ from `onMount`, it will be called when the component is unmounted.
 *
 * `onMount` does not run inside a [server-side component](https://svelte.dev/docs#run-time-server-side-component-api).
 *
 * https://svelte.dev/docs/svelte#onmount
 * @template T
 * @param {() => import('./private.js').NotFunction<T> | Promise<import('./private.js').NotFunction<T>> | (() => any)} fn
 * @returns {void}
 */
function onMount(fn) {
	get_current_component().$$.on_mount.push(fn);
}

const dirty_components = [];
const binding_callbacks = [];

let render_callbacks = [];

const flush_callbacks = [];

const resolved_promise = /* @__PURE__ */ Promise.resolve();

let update_scheduled = false;

/** @returns {void} */
function schedule_update() {
	if (!update_scheduled) {
		update_scheduled = true;
		resolved_promise.then(flush);
	}
}

/** @returns {void} */
function add_render_callback(fn) {
	render_callbacks.push(fn);
}

// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();

let flushidx = 0; // Do *not* move this inside the flush() function

/** @returns {void} */
function flush() {
	// Do not reenter flush while dirty components are updated, as this can
	// result in an infinite loop. Instead, let the inner flush handle it.
	// Reentrancy is ok afterwards for bindings etc.
	if (flushidx !== 0) {
		return;
	}
	const saved_component = current_component;
	do {
		// first, call beforeUpdate functions
		// and update components
		try {
			while (flushidx < dirty_components.length) {
				const component = dirty_components[flushidx];
				flushidx++;
				set_current_component(component);
				update(component.$$);
			}
		} catch (e) {
			// reset dirty state to not end up in a deadlocked state and then rethrow
			dirty_components.length = 0;
			flushidx = 0;
			throw e;
		}
		set_current_component(null);
		dirty_components.length = 0;
		flushidx = 0;
		while (binding_callbacks.length) binding_callbacks.pop()();
		// then, once components are updated, call
		// afterUpdate functions. This may cause
		// subsequent updates...
		for (let i = 0; i < render_callbacks.length; i += 1) {
			const callback = render_callbacks[i];
			if (!seen_callbacks.has(callback)) {
				// ...so guard against infinite loops
				seen_callbacks.add(callback);
				callback();
			}
		}
		render_callbacks.length = 0;
	} while (dirty_components.length);
	while (flush_callbacks.length) {
		flush_callbacks.pop()();
	}
	update_scheduled = false;
	seen_callbacks.clear();
	set_current_component(saved_component);
}

/** @returns {void} */
function update($$) {
	if ($$.fragment !== null) {
		$$.update();
		run_all($$.before_update);
		const dirty = $$.dirty;
		$$.dirty = [-1];
		$$.fragment && $$.fragment.p($$.ctx, dirty);
		$$.after_update.forEach(add_render_callback);
	}
}

/**
 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
 * @param {Function[]} fns
 * @returns {void}
 */
function flush_render_callbacks(fns) {
	const filtered = [];
	const targets = [];
	render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
	targets.forEach((c) => c());
	render_callbacks = filtered;
}

/**
 * @type {Promise<void> | null}
 */
let promise;

/**
 * @returns {Promise<void>}
 */
function wait() {
	if (!promise) {
		promise = Promise.resolve();
		promise.then(() => {
			promise = null;
		});
	}
	return promise;
}

/**
 * @param {Element} node
 * @param {INTRO | OUTRO | boolean} direction
 * @param {'start' | 'end'} kind
 * @returns {void}
 */
function dispatch(node, direction, kind) {
	node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
}

const outroing = new Set();

/**
 * @type {Outro}
 */
let outros;

/**
 * @returns {void} */
function group_outros() {
	outros = {
		r: 0,
		c: [],
		p: outros // parent group
	};
}

/**
 * @returns {void} */
function check_outros() {
	if (!outros.r) {
		run_all(outros.c);
	}
	outros = outros.p;
}

/**
 * @param {import('./private.js').Fragment} block
 * @param {0 | 1} [local]
 * @returns {void}
 */
function transition_in(block, local) {
	if (block && block.i) {
		outroing.delete(block);
		block.i(local);
	}
}

/**
 * @param {import('./private.js').Fragment} block
 * @param {0 | 1} local
 * @param {0 | 1} [detach]
 * @param {() => void} [callback]
 * @returns {void}
 */
function transition_out(block, local, detach, callback) {
	if (block && block.o) {
		if (outroing.has(block)) return;
		outroing.add(block);
		outros.c.push(() => {
			outroing.delete(block);
			if (callback) {
				if (detach) block.d(1);
				callback();
			}
		});
		block.o(local);
	} else if (callback) {
		callback();
	}
}

/**
 * @type {import('../transition/public.js').TransitionConfig}
 */
const null_transition = { duration: 0 };

/**
 * @param {Element & ElementCSSInlineStyle} node
 * @param {TransitionFn} fn
 * @param {any} params
 * @returns {{ start(): void; invalidate(): void; end(): void; }}
 */
function create_in_transition(node, fn, params) {
	/**
	 * @type {TransitionOptions} */
	const options = { direction: 'in' };
	let config = fn(node, params, options);
	let running = false;
	let animation_name;
	let task;
	let uid = 0;

	/**
	 * @returns {void} */
	function cleanup() {
		if (animation_name) delete_rule(node, animation_name);
	}

	/**
	 * @returns {void} */
	function go() {
		const {
			delay = 0,
			duration = 300,
			easing = identity,
			tick = noop,
			css
		} = config || null_transition;
		if (css) animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
		tick(0, 1);
		const start_time = now() + delay;
		const end_time = start_time + duration;
		if (task) task.abort();
		running = true;
		add_render_callback(() => dispatch(node, true, 'start'));
		task = loop((now) => {
			if (running) {
				if (now >= end_time) {
					tick(1, 0);
					dispatch(node, true, 'end');
					cleanup();
					return (running = false);
				}
				if (now >= start_time) {
					const t = easing((now - start_time) / duration);
					tick(t, 1 - t);
				}
			}
			return running;
		});
	}
	let started = false;
	return {
		start() {
			if (started) return;
			started = true;
			delete_rule(node);
			if (is_function(config)) {
				config = config(options);
				wait().then(go);
			} else {
				go();
			}
		},
		invalidate() {
			started = false;
		},
		end() {
			if (running) {
				cleanup();
				running = false;
			}
		}
	};
}

/**
 * @param {Element & ElementCSSInlineStyle} node
 * @param {TransitionFn} fn
 * @param {any} params
 * @returns {{ end(reset: any): void; }}
 */
function create_out_transition(node, fn, params) {
	/** @type {TransitionOptions} */
	const options = { direction: 'out' };
	let config = fn(node, params, options);
	let running = true;
	let animation_name;
	const group = outros;
	group.r += 1;
	/** @type {boolean} */
	let original_inert_value;

	/**
	 * @returns {void} */
	function go() {
		const {
			delay = 0,
			duration = 300,
			easing = identity,
			tick = noop,
			css
		} = config || null_transition;

		if (css) animation_name = create_rule(node, 1, 0, duration, delay, easing, css);

		const start_time = now() + delay;
		const end_time = start_time + duration;
		add_render_callback(() => dispatch(node, false, 'start'));

		if ('inert' in node) {
			original_inert_value = /** @type {HTMLElement} */ (node).inert;
			node.inert = true;
		}

		loop((now) => {
			if (running) {
				if (now >= end_time) {
					tick(0, 1);
					dispatch(node, false, 'end');
					if (!--group.r) {
						// this will result in `end()` being called,
						// so we don't need to clean up here
						run_all(group.c);
					}
					return false;
				}
				if (now >= start_time) {
					const t = easing((now - start_time) / duration);
					tick(1 - t, t);
				}
			}
			return running;
		});
	}

	if (is_function(config)) {
		wait().then(() => {
			// @ts-ignore
			config = config(options);
			go();
		});
	} else {
		go();
	}

	return {
		end(reset) {
			if (reset && 'inert' in node) {
				node.inert = original_inert_value;
			}
			if (reset && config.tick) {
				config.tick(1, 0);
			}
			if (running) {
				if (animation_name) delete_rule(node, animation_name);
				running = false;
			}
		}
	};
}

/**
 * @param {Element & ElementCSSInlineStyle} node
 * @param {TransitionFn} fn
 * @param {any} params
 * @param {boolean} intro
 * @returns {{ run(b: 0 | 1): void; end(): void; }}
 */
function create_bidirectional_transition(node, fn, params, intro) {
	/**
	 * @type {TransitionOptions} */
	const options = { direction: 'both' };
	let config = fn(node, params, options);
	let t = intro ? 0 : 1;

	/**
	 * @type {Program | null} */
	let running_program = null;

	/**
	 * @type {PendingProgram | null} */
	let pending_program = null;
	let animation_name = null;

	/** @type {boolean} */
	let original_inert_value;

	/**
	 * @returns {void} */
	function clear_animation() {
		if (animation_name) delete_rule(node, animation_name);
	}

	/**
	 * @param {PendingProgram} program
	 * @param {number} duration
	 * @returns {Program}
	 */
	function init(program, duration) {
		const d = /** @type {Program['d']} */ (program.b - t);
		duration *= Math.abs(d);
		return {
			a: t,
			b: program.b,
			d,
			duration,
			start: program.start,
			end: program.start + duration,
			group: program.group
		};
	}

	/**
	 * @param {INTRO | OUTRO} b
	 * @returns {void}
	 */
	function go(b) {
		const {
			delay = 0,
			duration = 300,
			easing = identity,
			tick = noop,
			css
		} = config || null_transition;

		/**
		 * @type {PendingProgram} */
		const program = {
			start: now() + delay,
			b
		};

		if (!b) {
			// @ts-ignore todo: improve typings
			program.group = outros;
			outros.r += 1;
		}

		if ('inert' in node) {
			if (b) {
				if (original_inert_value !== undefined) {
					// aborted/reversed outro — restore previous inert value
					node.inert = original_inert_value;
				}
			} else {
				original_inert_value = /** @type {HTMLElement} */ (node).inert;
				node.inert = true;
			}
		}

		if (running_program || pending_program) {
			pending_program = program;
		} else {
			// if this is an intro, and there's a delay, we need to do
			// an initial tick and/or apply CSS animation immediately
			if (css) {
				clear_animation();
				animation_name = create_rule(node, t, b, duration, delay, easing, css);
			}
			if (b) tick(0, 1);
			running_program = init(program, duration);
			add_render_callback(() => dispatch(node, b, 'start'));
			loop((now) => {
				if (pending_program && now > pending_program.start) {
					running_program = init(pending_program, duration);
					pending_program = null;
					dispatch(node, running_program.b, 'start');
					if (css) {
						clear_animation();
						animation_name = create_rule(
							node,
							t,
							running_program.b,
							running_program.duration,
							0,
							easing,
							config.css
						);
					}
				}
				if (running_program) {
					if (now >= running_program.end) {
						tick((t = running_program.b), 1 - t);
						dispatch(node, running_program.b, 'end');
						if (!pending_program) {
							// we're done
							if (running_program.b) {
								// intro — we can tidy up immediately
								clear_animation();
							} else {
								// outro — needs to be coordinated
								if (!--running_program.group.r) run_all(running_program.group.c);
							}
						}
						running_program = null;
					} else if (now >= running_program.start) {
						const p = now - running_program.start;
						t = running_program.a + running_program.d * easing(p / running_program.duration);
						tick(t, 1 - t);
					}
				}
				return !!(running_program || pending_program);
			});
		}
	}
	return {
		run(b) {
			if (is_function(config)) {
				wait().then(() => {
					const opts = { direction: b ? 'in' : 'out' };
					// @ts-ignore
					config = config(opts);
					go(b);
				});
			} else {
				go(b);
			}
		},
		end() {
			clear_animation();
			running_program = pending_program = null;
		}
	};
}

/** @typedef {1} INTRO */
/** @typedef {0} OUTRO */
/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

/**
 * @typedef {Object} Outro
 * @property {number} r
 * @property {Function[]} c
 * @property {Object} p
 */

/**
 * @typedef {Object} PendingProgram
 * @property {number} start
 * @property {INTRO|OUTRO} b
 * @property {Outro} [group]
 */

/**
 * @typedef {Object} Program
 * @property {number} a
 * @property {INTRO|OUTRO} b
 * @property {1|-1} d
 * @property {number} duration
 * @property {number} start
 * @property {number} end
 * @property {Outro} [group]
 */

// general each functions:

function ensure_array_like(array_like_or_iterator) {
	return array_like_or_iterator?.length !== undefined
		? array_like_or_iterator
		: Array.from(array_like_or_iterator);
}

// keyed each functions:

/** @returns {void} */
function destroy_block(block, lookup) {
	block.d(1);
	lookup.delete(block.key);
}

/** @returns {void} */
function outro_and_destroy_block(block, lookup) {
	transition_out(block, 1, 1, () => {
		lookup.delete(block.key);
	});
}

/** @returns {any[]} */
function update_keyed_each(
	old_blocks,
	dirty,
	get_key,
	dynamic,
	ctx,
	list,
	lookup,
	node,
	destroy,
	create_each_block,
	next,
	get_context
) {
	let o = old_blocks.length;
	let n = list.length;
	let i = o;
	const old_indexes = {};
	while (i--) old_indexes[old_blocks[i].key] = i;
	const new_blocks = [];
	const new_lookup = new Map();
	const deltas = new Map();
	const updates = [];
	i = n;
	while (i--) {
		const child_ctx = get_context(ctx, list, i);
		const key = get_key(child_ctx);
		let block = lookup.get(key);
		if (!block) {
			block = create_each_block(key, child_ctx);
			block.c();
		} else if (dynamic) {
			// defer updates until all the DOM shuffling is done
			updates.push(() => block.p(child_ctx, dirty));
		}
		new_lookup.set(key, (new_blocks[i] = block));
		if (key in old_indexes) deltas.set(key, Math.abs(i - old_indexes[key]));
	}
	const will_move = new Set();
	const did_move = new Set();
	/** @returns {void} */
	function insert(block) {
		transition_in(block, 1);
		block.m(node, next);
		lookup.set(block.key, block);
		next = block.first;
		n--;
	}
	while (o && n) {
		const new_block = new_blocks[n - 1];
		const old_block = old_blocks[o - 1];
		const new_key = new_block.key;
		const old_key = old_block.key;
		if (new_block === old_block) {
			// do nothing
			next = new_block.first;
			o--;
			n--;
		} else if (!new_lookup.has(old_key)) {
			// remove old block
			destroy(old_block, lookup);
			o--;
		} else if (!lookup.has(new_key) || will_move.has(new_key)) {
			insert(new_block);
		} else if (did_move.has(old_key)) {
			o--;
		} else if (deltas.get(new_key) > deltas.get(old_key)) {
			did_move.add(new_key);
			insert(new_block);
		} else {
			will_move.add(old_key);
			o--;
		}
	}
	while (o--) {
		const old_block = old_blocks[o];
		if (!new_lookup.has(old_block.key)) destroy(old_block, lookup);
	}
	while (n) insert(new_blocks[n - 1]);
	run_all(updates);
	return new_blocks;
}

/** @returns {void} */
function create_component(block) {
	block && block.c();
}

/** @returns {void} */
function claim_component(block, parent_nodes) {
	block && block.l(parent_nodes);
}

/** @returns {void} */
function mount_component(component, target, anchor) {
	const { fragment, after_update } = component.$$;
	fragment && fragment.m(target, anchor);
	// onMount happens before the initial afterUpdate
	add_render_callback(() => {
		const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
		// if the component was destroyed immediately
		// it will update the `$$.on_destroy` reference to `null`.
		// the destructured on_destroy may still reference to the old array
		if (component.$$.on_destroy) {
			component.$$.on_destroy.push(...new_on_destroy);
		} else {
			// Edge case - component was destroyed immediately,
			// most likely as a result of a binding initialising
			run_all(new_on_destroy);
		}
		component.$$.on_mount = [];
	});
	after_update.forEach(add_render_callback);
}

/** @returns {void} */
function destroy_component(component, detaching) {
	const $$ = component.$$;
	if ($$.fragment !== null) {
		flush_render_callbacks($$.after_update);
		run_all($$.on_destroy);
		$$.fragment && $$.fragment.d(detaching);
		// TODO null out other refs, including component.$$ (but need to
		// preserve final state?)
		$$.on_destroy = $$.fragment = null;
		$$.ctx = [];
	}
}

/** @returns {void} */
function make_dirty(component, i) {
	if (component.$$.dirty[0] === -1) {
		dirty_components.push(component);
		schedule_update();
		component.$$.dirty.fill(0);
	}
	component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
}

// TODO: Document the other params
/**
 * @param {SvelteComponent} component
 * @param {import('./public.js').ComponentConstructorOptions} options
 *
 * @param {import('./utils.js')['not_equal']} not_equal Used to compare props and state values.
 * @param {(target: Element | ShadowRoot) => void} [append_styles] Function that appends styles to the DOM when the component is first initialised.
 * This will be the `add_css` function from the compiled component.
 *
 * @returns {void}
 */
function init$1(
	component,
	options,
	instance,
	create_fragment,
	not_equal,
	props,
	append_styles = null,
	dirty = [-1]
) {
	const parent_component = current_component;
	set_current_component(component);
	/** @type {import('./private.js').T$$} */
	const $$ = (component.$$ = {
		fragment: null,
		ctx: [],
		// state
		props,
		update: noop,
		not_equal,
		bound: blank_object(),
		// lifecycle
		on_mount: [],
		on_destroy: [],
		on_disconnect: [],
		before_update: [],
		after_update: [],
		context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
		// everything else
		callbacks: blank_object(),
		dirty,
		skip_bound: false,
		root: options.target || parent_component.$$.root
	});
	append_styles && append_styles($$.root);
	let ready = false;
	$$.ctx = instance
		? instance(component, options.props || {}, (i, ret, ...rest) => {
				const value = rest.length ? rest[0] : ret;
				if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
					if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
					if (ready) make_dirty(component, i);
				}
				return ret;
		  })
		: [];
	$$.update();
	ready = true;
	run_all($$.before_update);
	// `false` as a special case of no DOM component
	$$.fragment = create_fragment ? create_fragment($$.ctx) : false;
	if (options.target) {
		if (options.hydrate) {
			start_hydrating();
			// TODO: what is the correct type here?
			// @ts-expect-error
			const nodes = children(options.target);
			$$.fragment && $$.fragment.l(nodes);
			nodes.forEach(detach);
		} else {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			$$.fragment && $$.fragment.c();
		}
		if (options.intro) transition_in(component.$$.fragment);
		mount_component(component, options.target, options.anchor);
		end_hydrating();
		flush();
	}
	set_current_component(parent_component);
}

let SvelteElement;

if (typeof HTMLElement === 'function') {
	SvelteElement = class extends HTMLElement {
		/** The Svelte component constructor */
		$$ctor;
		/** Slots */
		$$s;
		/** The Svelte component instance */
		$$c;
		/** Whether or not the custom element is connected */
		$$cn = false;
		/** Component props data */
		$$d = {};
		/** `true` if currently in the process of reflecting component props back to attributes */
		$$r = false;
		/** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
		$$p_d = {};
		/** @type {Record<string, Function[]>} Event listeners */
		$$l = {};
		/** @type {Map<Function, Function>} Event listener unsubscribe functions */
		$$l_u = new Map();

		constructor($$componentCtor, $$slots, use_shadow_dom) {
			super();
			this.$$ctor = $$componentCtor;
			this.$$s = $$slots;
			if (use_shadow_dom) {
				this.attachShadow({ mode: 'open' });
			}
		}

		addEventListener(type, listener, options) {
			// We can't determine upfront if the event is a custom event or not, so we have to
			// listen to both. If someone uses a custom event with the same name as a regular
			// browser event, this fires twice - we can't avoid that.
			this.$$l[type] = this.$$l[type] || [];
			this.$$l[type].push(listener);
			if (this.$$c) {
				const unsub = this.$$c.$on(type, listener);
				this.$$l_u.set(listener, unsub);
			}
			super.addEventListener(type, listener, options);
		}

		removeEventListener(type, listener, options) {
			super.removeEventListener(type, listener, options);
			if (this.$$c) {
				const unsub = this.$$l_u.get(listener);
				if (unsub) {
					unsub();
					this.$$l_u.delete(listener);
				}
			}
		}

		async connectedCallback() {
			this.$$cn = true;
			if (!this.$$c) {
				// We wait one tick to let possible child slot elements be created/mounted
				await Promise.resolve();
				if (!this.$$cn || this.$$c) {
					return;
				}
				function create_slot(name) {
					return () => {
						let node;
						const obj = {
							c: function create() {
								node = element('slot');
								if (name !== 'default') {
									attr(node, 'name', name);
								}
							},
							/**
							 * @param {HTMLElement} target
							 * @param {HTMLElement} [anchor]
							 */
							m: function mount(target, anchor) {
								insert(target, node, anchor);
							},
							d: function destroy(detaching) {
								if (detaching) {
									detach(node);
								}
							}
						};
						return obj;
					};
				}
				const $$slots = {};
				const existing_slots = get_custom_elements_slots(this);
				for (const name of this.$$s) {
					if (name in existing_slots) {
						$$slots[name] = [create_slot(name)];
					}
				}
				for (const attribute of this.attributes) {
					// this.$$data takes precedence over this.attributes
					const name = this.$$g_p(attribute.name);
					if (!(name in this.$$d)) {
						this.$$d[name] = get_custom_element_value(name, attribute.value, this.$$p_d, 'toProp');
					}
				}
				// Port over props that were set programmatically before ce was initialized
				for (const key in this.$$p_d) {
					if (!(key in this.$$d) && this[key] !== undefined) {
						this.$$d[key] = this[key]; // don't transform, these were set through JavaScript
						delete this[key]; // remove the property that shadows the getter/setter
					}
				}
				this.$$c = new this.$$ctor({
					target: this.shadowRoot || this,
					props: {
						...this.$$d,
						$$slots,
						$$scope: {
							ctx: []
						}
					}
				});

				// Reflect component props as attributes
				const reflect_attributes = () => {
					this.$$r = true;
					for (const key in this.$$p_d) {
						this.$$d[key] = this.$$c.$$.ctx[this.$$c.$$.props[key]];
						if (this.$$p_d[key].reflect) {
							const attribute_value = get_custom_element_value(
								key,
								this.$$d[key],
								this.$$p_d,
								'toAttribute'
							);
							if (attribute_value == null) {
								this.removeAttribute(this.$$p_d[key].attribute || key);
							} else {
								this.setAttribute(this.$$p_d[key].attribute || key, attribute_value);
							}
						}
					}
					this.$$r = false;
				};
				this.$$c.$$.after_update.push(reflect_attributes);
				reflect_attributes(); // once initially because after_update is added too late for first render

				for (const type in this.$$l) {
					for (const listener of this.$$l[type]) {
						const unsub = this.$$c.$on(type, listener);
						this.$$l_u.set(listener, unsub);
					}
				}
				this.$$l = {};
			}
		}

		// We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
		// and setting attributes through setAttribute etc, this is helpful
		attributeChangedCallback(attr, _oldValue, newValue) {
			if (this.$$r) return;
			attr = this.$$g_p(attr);
			this.$$d[attr] = get_custom_element_value(attr, newValue, this.$$p_d, 'toProp');
			this.$$c?.$set({ [attr]: this.$$d[attr] });
		}

		disconnectedCallback() {
			this.$$cn = false;
			// In a microtask, because this could be a move within the DOM
			Promise.resolve().then(() => {
				if (!this.$$cn) {
					this.$$c.$destroy();
					this.$$c = undefined;
				}
			});
		}

		$$g_p(attribute_name) {
			return (
				Object.keys(this.$$p_d).find(
					(key) =>
						this.$$p_d[key].attribute === attribute_name ||
						(!this.$$p_d[key].attribute && key.toLowerCase() === attribute_name)
				) || attribute_name
			);
		}
	};
}

/**
 * @param {string} prop
 * @param {any} value
 * @param {Record<string, CustomElementPropDefinition>} props_definition
 * @param {'toAttribute' | 'toProp'} [transform]
 */
function get_custom_element_value(prop, value, props_definition, transform) {
	const type = props_definition[prop]?.type;
	value = type === 'Boolean' && typeof value !== 'boolean' ? value != null : value;
	if (!transform || !props_definition[prop]) {
		return value;
	} else if (transform === 'toAttribute') {
		switch (type) {
			case 'Object':
			case 'Array':
				return value == null ? null : JSON.stringify(value);
			case 'Boolean':
				return value ? '' : null;
			case 'Number':
				return value == null ? null : value;
			default:
				return value;
		}
	} else {
		switch (type) {
			case 'Object':
			case 'Array':
				return value && JSON.parse(value);
			case 'Boolean':
				return value; // conversion already handled above
			case 'Number':
				return value != null ? +value : value;
			default:
				return value;
		}
	}
}

/**
 * @internal
 *
 * Turn a Svelte component into a custom element.
 * @param {import('./public.js').ComponentType} Component  A Svelte component constructor
 * @param {Record<string, CustomElementPropDefinition>} props_definition  The props to observe
 * @param {string[]} slots  The slots to create
 * @param {string[]} accessors  Other accessors besides the ones for props the component has
 * @param {boolean} use_shadow_dom  Whether to use shadow DOM
 * @param {(ce: new () => HTMLElement) => new () => HTMLElement} [extend]
 */
function create_custom_element(
	Component,
	props_definition,
	slots,
	accessors,
	use_shadow_dom,
	extend
) {
	let Class = class extends SvelteElement {
		constructor() {
			super(Component, slots, use_shadow_dom);
			this.$$p_d = props_definition;
		}
		static get observedAttributes() {
			return Object.keys(props_definition).map((key) =>
				(props_definition[key].attribute || key).toLowerCase()
			);
		}
	};
	Object.keys(props_definition).forEach((prop) => {
		Object.defineProperty(Class.prototype, prop, {
			get() {
				return this.$$c && prop in this.$$c ? this.$$c[prop] : this.$$d[prop];
			},
			set(value) {
				value = get_custom_element_value(prop, value, props_definition);
				this.$$d[prop] = value;
				this.$$c?.$set({ [prop]: value });
			}
		});
	});
	accessors.forEach((accessor) => {
		Object.defineProperty(Class.prototype, accessor, {
			get() {
				return this.$$c?.[accessor];
			}
		});
	});
	if (extend) {
		// @ts-expect-error - assigning here is fine
		Class = extend(Class);
	}
	Component.element = /** @type {any} */ (Class);
	return Class;
}

/**
 * Base class for Svelte components. Used when dev=false.
 *
 * @template {Record<string, any>} [Props=any]
 * @template {Record<string, any>} [Events=any]
 */
class SvelteComponent {
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$ = undefined;
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$set = undefined;

	/** @returns {void} */
	$destroy() {
		destroy_component(this, 1);
		this.$destroy = noop;
	}

	/**
	 * @template {Extract<keyof Events, string>} K
	 * @param {K} type
	 * @param {((e: Events[K]) => void) | null | undefined} callback
	 * @returns {() => void}
	 */
	$on(type, callback) {
		if (!is_function(callback)) {
			return noop;
		}
		const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
		callbacks.push(callback);
		return () => {
			const index = callbacks.indexOf(callback);
			if (index !== -1) callbacks.splice(index, 1);
		};
	}

	/**
	 * @param {Partial<Props>} props
	 * @returns {void}
	 */
	$set(props) {
		if (this.$$set && !is_empty(props)) {
			this.$$.skip_bound = true;
			this.$$set(props);
			this.$$.skip_bound = false;
		}
	}
}

/**
 * @typedef {Object} CustomElementPropDefinition
 * @property {string} [attribute]
 * @property {boolean} [reflect]
 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
 */

// generated during release, do not modify

const PUBLIC_VERSION = '4';

if (typeof window !== 'undefined')
	// @ts-ignore
	(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

const subscriber_queue = [];

/**
 * Creates a `Readable` store that allows reading by subscription.
 *
 * https://svelte.dev/docs/svelte-store#readable
 * @template T
 * @param {T} [value] initial value
 * @param {import('./public.js').StartStopNotifier<T>} [start]
 * @returns {import('./public.js').Readable<T>}
 */
function readable(value, start) {
	return {
		subscribe: writable(value, start).subscribe
	};
}

/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 *
 * https://svelte.dev/docs/svelte-store#writable
 * @template T
 * @param {T} [value] initial value
 * @param {import('./public.js').StartStopNotifier<T>} [start]
 * @returns {import('./public.js').Writable<T>}
 */
function writable(value, start = noop) {
	/** @type {import('./public.js').Unsubscriber} */
	let stop;
	/** @type {Set<import('./private.js').SubscribeInvalidateTuple<T>>} */
	const subscribers = new Set();
	/** @param {T} new_value
	 * @returns {void}
	 */
	function set(new_value) {
		if (safe_not_equal(value, new_value)) {
			value = new_value;
			if (stop) {
				// store is ready
				const run_queue = !subscriber_queue.length;
				for (const subscriber of subscribers) {
					subscriber[1]();
					subscriber_queue.push(subscriber, value);
				}
				if (run_queue) {
					for (let i = 0; i < subscriber_queue.length; i += 2) {
						subscriber_queue[i][0](subscriber_queue[i + 1]);
					}
					subscriber_queue.length = 0;
				}
			}
		}
	}

	/**
	 * @param {import('./public.js').Updater<T>} fn
	 * @returns {void}
	 */
	function update(fn) {
		set(fn(value));
	}

	/**
	 * @param {import('./public.js').Subscriber<T>} run
	 * @param {import('./private.js').Invalidator<T>} [invalidate]
	 * @returns {import('./public.js').Unsubscriber}
	 */
	function subscribe(run, invalidate = noop) {
		/** @type {import('./private.js').SubscribeInvalidateTuple<T>} */
		const subscriber = [run, invalidate];
		subscribers.add(subscriber);
		if (subscribers.size === 1) {
			stop = start(set, update) || noop;
		}
		run(value);
		return () => {
			subscribers.delete(subscriber);
			if (subscribers.size === 0 && stop) {
				stop();
				stop = null;
			}
		};
	}
	return { set, update, subscribe };
}

/**
 * Derived value store by synchronizing one or more readable stores and
 * applying an aggregation function over its input values.
 *
 * https://svelte.dev/docs/svelte-store#derived
 * @template {import('./private.js').Stores} S
 * @template T
 * @overload
 * @param {S} stores - input stores
 * @param {(values: import('./private.js').StoresValues<S>, set: (value: T) => void, update: (fn: import('./public.js').Updater<T>) => void) => import('./public.js').Unsubscriber | void} fn - function callback that aggregates the values
 * @param {T} [initial_value] - initial value
 * @returns {import('./public.js').Readable<T>}
 */

/**
 * Derived value store by synchronizing one or more readable stores and
 * applying an aggregation function over its input values.
 *
 * https://svelte.dev/docs/svelte-store#derived
 * @template {import('./private.js').Stores} S
 * @template T
 * @overload
 * @param {S} stores - input stores
 * @param {(values: import('./private.js').StoresValues<S>) => T} fn - function callback that aggregates the values
 * @param {T} [initial_value] - initial value
 * @returns {import('./public.js').Readable<T>}
 */

/**
 * @template {import('./private.js').Stores} S
 * @template T
 * @param {S} stores
 * @param {Function} fn
 * @param {T} [initial_value]
 * @returns {import('./public.js').Readable<T>}
 */
function derived(stores, fn, initial_value) {
	const single = !Array.isArray(stores);
	/** @type {Array<import('./public.js').Readable<any>>} */
	const stores_array = single ? [stores] : stores;
	if (!stores_array.every(Boolean)) {
		throw new Error('derived() expects stores as input, got a falsy value');
	}
	const auto = fn.length < 2;
	return readable(initial_value, (set, update) => {
		let started = false;
		const values = [];
		let pending = 0;
		let cleanup = noop;
		const sync = () => {
			if (pending) {
				return;
			}
			cleanup();
			const result = fn(single ? values[0] : values, set, update);
			if (auto) {
				set(result);
			} else {
				cleanup = is_function(result) ? result : noop;
			}
		};
		const unsubscribers = stores_array.map((store, i) =>
			subscribe(
				store,
				(value) => {
					values[i] = value;
					pending &= ~(1 << i);
					if (started) {
						sync();
					}
				},
				() => {
					pending |= 1 << i;
				}
			)
		);
		started = true;
		sync();
		return function stop() {
			run_all(unsubscribers);
			cleanup();
			// We need to set this to false because callbacks can still happen despite having unsubscribed:
			// Callbacks might already be placed in the queue which doesn't know it should no longer
			// invoke this derived store.
			started = false;
		};
	});
}

/*
Adapted from https://github.com/mattdesl
Distributed under MIT License https://github.com/mattdesl/eases/blob/master/LICENSE.md
*/

/**
 * https://svelte.dev/docs/svelte-easing
 * @param {number} t
 * @returns {number}
 */
function cubicOut(t) {
	const f = t - 1.0;
	return f * f * f + 1.0;
}

/**
 * Animates the opacity of an element from 0 to the current opacity for `in` transitions and from the current opacity to 0 for `out` transitions.
 *
 * https://svelte.dev/docs/svelte-transition#fade
 * @param {Element} node
 * @param {import('./public').FadeParams} [params]
 * @returns {import('./public').TransitionConfig}
 */
function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
	const o = +getComputedStyle(node).opacity;
	return {
		delay,
		duration,
		easing,
		css: (t) => `opacity: ${t * o}`
	};
}

/**
 * Animates the x and y positions and the opacity of an element. `in` transitions animate from the provided values, passed as parameters to the element's default values. `out` transitions animate from the element's default values to the provided values.
 *
 * https://svelte.dev/docs/svelte-transition#fly
 * @param {Element} node
 * @param {import('./public').FlyParams} [params]
 * @returns {import('./public').TransitionConfig}
 */
function fly(
	node,
	{ delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}
) {
	const style = getComputedStyle(node);
	const target_opacity = +style.opacity;
	const transform = style.transform === 'none' ? '' : style.transform;
	const od = target_opacity * (1 - opacity);
	const [xValue, xUnit] = split_css_unit(x);
	const [yValue, yUnit] = split_css_unit(y);
	return {
		delay,
		duration,
		easing,
		css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * xValue}${xUnit}, ${(1 - t) * yValue}${yUnit});
			opacity: ${target_opacity - od * u}`
	};
}

/**
 * Slides an element in and out.
 *
 * https://svelte.dev/docs/svelte-transition#slide
 * @param {Element} node
 * @param {import('./public').SlideParams} [params]
 * @returns {import('./public').TransitionConfig}
 */
function slide(node, { delay = 0, duration = 400, easing = cubicOut, axis = 'y' } = {}) {
	const style = getComputedStyle(node);
	const opacity = +style.opacity;
	const primary_property = axis === 'y' ? 'height' : 'width';
	const primary_property_value = parseFloat(style[primary_property]);
	const secondary_properties = axis === 'y' ? ['top', 'bottom'] : ['left', 'right'];
	const capitalized_secondary_properties = secondary_properties.map(
		(e) => `${e[0].toUpperCase()}${e.slice(1)}`
	);
	const padding_start_value = parseFloat(style[`padding${capitalized_secondary_properties[0]}`]);
	const padding_end_value = parseFloat(style[`padding${capitalized_secondary_properties[1]}`]);
	const margin_start_value = parseFloat(style[`margin${capitalized_secondary_properties[0]}`]);
	const margin_end_value = parseFloat(style[`margin${capitalized_secondary_properties[1]}`]);
	const border_width_start_value = parseFloat(
		style[`border${capitalized_secondary_properties[0]}Width`]
	);
	const border_width_end_value = parseFloat(
		style[`border${capitalized_secondary_properties[1]}Width`]
	);
	return {
		delay,
		duration,
		easing,
		css: (t) =>
			'overflow: hidden;' +
			`opacity: ${Math.min(t * 20, 1) * opacity};` +
			`${primary_property}: ${t * primary_property_value}px;` +
			`padding-${secondary_properties[0]}: ${t * padding_start_value}px;` +
			`padding-${secondary_properties[1]}: ${t * padding_end_value}px;` +
			`margin-${secondary_properties[0]}: ${t * margin_start_value}px;` +
			`margin-${secondary_properties[1]}: ${t * margin_end_value}px;` +
			`border-${secondary_properties[0]}-width: ${t * border_width_start_value}px;` +
			`border-${secondary_properties[1]}-width: ${t * border_width_end_value}px;`
	};
}

const store = writable();
const currentSegment = derived(store, ($s) => $s === null || $s === void 0 ? void 0 : $s.segment);
function init(state) {
    store.set(state);
}

/* node_modules/.pnpm/svelte-confetti@1.4.0_svelte@4.2.15/node_modules/svelte-confetti/dist/Confetti.svelte generated by Svelte v4.2.15 */

function add_css$7(target) {
	append_styles(target, "svelte-15ksp55", ".confetti-holder.svelte-15ksp55.svelte-15ksp55{position:relative}@keyframes svelte-15ksp55-rotate{0%{transform:skew(var(--skew)) rotate3d(var(--full-rotation))}100%{transform:skew(var(--skew)) rotate3d(var(--rotation-xyz), calc(var(--rotation-deg) + 360deg))}}@keyframes svelte-15ksp55-translate{0%{opacity:1}8%{transform:translateY(calc(var(--translate-y) * 0.95)) translateX(calc(var(--translate-x) * (var(--x-spread) * 0.9)));opacity:1}12%{transform:translateY(var(--translate-y)) translateX(calc(var(--translate-x) * (var(--x-spread) * 0.95)));opacity:1}16%{transform:translateY(var(--translate-y)) translateX(calc(var(--translate-x) * var(--x-spread)));opacity:1}100%{transform:translateY(calc(var(--translate-y) + var(--fall-distance))) translateX(var(--translate-x));opacity:0}}@keyframes svelte-15ksp55-no-gravity-translate{0%{opacity:1}100%{transform:translateY(var(--translate-y)) translateX(var(--translate-x));opacity:0}}.confetti.svelte-15ksp55.svelte-15ksp55{--translate-y:calc(-200px * var(--translate-y-multiplier));--translate-x:calc(200px * var(--translate-x-multiplier));position:absolute;height:calc(var(--size) * var(--scale));width:calc(var(--size) * var(--scale));animation:svelte-15ksp55-translate var(--transition-duration) var(--transition-delay) var(--transition-iteration-count) linear;opacity:0;pointer-events:none}.confetti.svelte-15ksp55.svelte-15ksp55::before{--full-rotation:var(--rotation-xyz), var(--rotation-deg);content:'';display:block;width:100%;height:100%;background:var(--color);background-size:contain;transform:skew(var(--skew)) rotate3d(var(--full-rotation));animation:svelte-15ksp55-rotate var(--transition-duration) var(--transition-delay) var(--transition-iteration-count) linear}.rounded.svelte-15ksp55 .confetti.svelte-15ksp55::before{border-radius:50%}.cone.svelte-15ksp55 .confetti.svelte-15ksp55{--translate-x:calc(200px * var(--translate-y-multiplier) * var(--translate-x-multiplier))}.no-gravity.svelte-15ksp55 .confetti.svelte-15ksp55{animation-name:svelte-15ksp55-no-gravity-translate;animation-timing-function:ease-out}@media(prefers-reduced-motion){.reduced-motion.svelte-15ksp55 .confetti.svelte-15ksp55,.reduced-motion.svelte-15ksp55 .confetti.svelte-15ksp55::before{animation:none}}");
}

function get_each_context$4(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[19] = list[i];
	return child_ctx;
}

// (40:0) {#if !complete}
function create_if_block$7(ctx) {
	let div;
	let each_value = ensure_array_like({ length: /*amount*/ ctx[6] });
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
	}

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			this.h();
		},
		l(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(div_nodes);
			}

			div_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(div, "class", "confetti-holder svelte-15ksp55");
			toggle_class(div, "rounded", /*rounded*/ ctx[9]);
			toggle_class(div, "cone", /*cone*/ ctx[10]);
			toggle_class(div, "no-gravity", /*noGravity*/ ctx[11]);
			toggle_class(div, "reduced-motion", /*disableForReducedMotion*/ ctx[13]);
		},
		m(target, anchor) {
			insert_hydration(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div, null);
				}
			}
		},
		p(ctx, dirty) {
			if (dirty & /*fallDistance, size, getColor, randomBetween, y, x, infinite, duration, delay, iterationCount, xSpread, amount*/ 37375) {
				each_value = ensure_array_like({ length: /*amount*/ ctx[6] });
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$4(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$4(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*rounded*/ 512) {
				toggle_class(div, "rounded", /*rounded*/ ctx[9]);
			}

			if (dirty & /*cone*/ 1024) {
				toggle_class(div, "cone", /*cone*/ ctx[10]);
			}

			if (dirty & /*noGravity*/ 2048) {
				toggle_class(div, "no-gravity", /*noGravity*/ ctx[11]);
			}

			if (dirty & /*disableForReducedMotion*/ 8192) {
				toggle_class(div, "reduced-motion", /*disableForReducedMotion*/ ctx[13]);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

// (42:4) {#each { length: amount } as _}
function create_each_block$4(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			this.h();
		},
		l(nodes) {
			div = claim_element(nodes, "DIV", { class: true, style: true });
			children(div).forEach(detach);
			this.h();
		},
		h() {
			attr(div, "class", "confetti svelte-15ksp55");
			set_style(div, "--fall-distance", /*fallDistance*/ ctx[8]);
			set_style(div, "--size", /*size*/ ctx[0] + "px");
			set_style(div, "--color", /*getColor*/ ctx[15]());
			set_style(div, "--skew", randomBetween(-45, 45) + "deg," + randomBetween(-45, 45) + "deg");
			set_style(div, "--rotation-xyz", randomBetween(-10, 10) + ", " + randomBetween(-10, 10) + ", " + randomBetween(-10, 10));
			set_style(div, "--rotation-deg", randomBetween(0, 360) + "deg");
			set_style(div, "--translate-y-multiplier", randomBetween(/*y*/ ctx[2][0], /*y*/ ctx[2][1]));
			set_style(div, "--translate-x-multiplier", randomBetween(/*x*/ ctx[1][0], /*x*/ ctx[1][1]));
			set_style(div, "--scale", 0.1 * randomBetween(2, 10));

			set_style(div, "--transition-duration", /*infinite*/ ctx[4]
			? `calc(${/*duration*/ ctx[3]}ms * var(--scale))`
			: `${/*duration*/ ctx[3]}ms`);

			set_style(div, "--transition-delay", randomBetween(/*delay*/ ctx[5][0], /*delay*/ ctx[5][1]) + "ms");

			set_style(div, "--transition-iteration-count", /*infinite*/ ctx[4]
			? 'infinite'
			: /*iterationCount*/ ctx[7]);

			set_style(div, "--x-spread", 1 - /*xSpread*/ ctx[12]);
		},
		m(target, anchor) {
			insert_hydration(target, div, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*fallDistance*/ 256) {
				set_style(div, "--fall-distance", /*fallDistance*/ ctx[8]);
			}

			if (dirty & /*size*/ 1) {
				set_style(div, "--size", /*size*/ ctx[0] + "px");
			}

			if (dirty & /*y*/ 4) {
				set_style(div, "--translate-y-multiplier", randomBetween(/*y*/ ctx[2][0], /*y*/ ctx[2][1]));
			}

			if (dirty & /*x*/ 2) {
				set_style(div, "--translate-x-multiplier", randomBetween(/*x*/ ctx[1][0], /*x*/ ctx[1][1]));
			}

			if (dirty & /*infinite, duration*/ 24) {
				set_style(div, "--transition-duration", /*infinite*/ ctx[4]
				? `calc(${/*duration*/ ctx[3]}ms * var(--scale))`
				: `${/*duration*/ ctx[3]}ms`);
			}

			if (dirty & /*delay*/ 32) {
				set_style(div, "--transition-delay", randomBetween(/*delay*/ ctx[5][0], /*delay*/ ctx[5][1]) + "ms");
			}

			if (dirty & /*infinite, iterationCount*/ 144) {
				set_style(div, "--transition-iteration-count", /*infinite*/ ctx[4]
				? 'infinite'
				: /*iterationCount*/ ctx[7]);
			}

			if (dirty & /*xSpread*/ 4096) {
				set_style(div, "--x-spread", 1 - /*xSpread*/ ctx[12]);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

function create_fragment$b(ctx) {
	let if_block_anchor;
	let if_block = !/*complete*/ ctx[14] && create_if_block$7(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l(nodes) {
			if (if_block) if_block.l(nodes);
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_hydration(target, if_block_anchor, anchor);
		},
		p(ctx, [dirty]) {
			if (!/*complete*/ ctx[14]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$7(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(if_block_anchor);
			}

			if (if_block) if_block.d(detaching);
		}
	};
}

function randomBetween(min, max) {
	return Math.random() * (max - min) + min;
}

function instance$b($$self, $$props, $$invalidate) {
	let { size = 10 } = $$props;
	let { x = [-0.5, 0.5] } = $$props;
	let { y = [0.25, 1] } = $$props;
	let { duration = 2000 } = $$props;
	let { infinite = false } = $$props;
	let { delay = [0, 50] } = $$props;
	let { colorRange = [0, 360] } = $$props;
	let { colorArray = [] } = $$props;
	let { amount = 50 } = $$props;
	let { iterationCount = 1 } = $$props;
	let { fallDistance = "100px" } = $$props;
	let { rounded = false } = $$props;
	let { cone = false } = $$props;
	let { noGravity = false } = $$props;
	let { xSpread = 0.15 } = $$props;
	let { destroyOnComplete = true } = $$props;
	let { disableForReducedMotion = false } = $$props;
	let complete = false;

	onMount(() => {
		if (!destroyOnComplete || infinite || iterationCount == "infinite") return;
		setTimeout(() => $$invalidate(14, complete = true), (duration + delay[1]) * iterationCount);
	});

	function getColor() {
		if (colorArray.length) return colorArray[Math.round(Math.random() * (colorArray.length - 1))]; else return `hsl(${Math.round(randomBetween(colorRange[0], colorRange[1]))}, 75%, 50%)`;
	}

	$$self.$$set = $$props => {
		if ('size' in $$props) $$invalidate(0, size = $$props.size);
		if ('x' in $$props) $$invalidate(1, x = $$props.x);
		if ('y' in $$props) $$invalidate(2, y = $$props.y);
		if ('duration' in $$props) $$invalidate(3, duration = $$props.duration);
		if ('infinite' in $$props) $$invalidate(4, infinite = $$props.infinite);
		if ('delay' in $$props) $$invalidate(5, delay = $$props.delay);
		if ('colorRange' in $$props) $$invalidate(16, colorRange = $$props.colorRange);
		if ('colorArray' in $$props) $$invalidate(17, colorArray = $$props.colorArray);
		if ('amount' in $$props) $$invalidate(6, amount = $$props.amount);
		if ('iterationCount' in $$props) $$invalidate(7, iterationCount = $$props.iterationCount);
		if ('fallDistance' in $$props) $$invalidate(8, fallDistance = $$props.fallDistance);
		if ('rounded' in $$props) $$invalidate(9, rounded = $$props.rounded);
		if ('cone' in $$props) $$invalidate(10, cone = $$props.cone);
		if ('noGravity' in $$props) $$invalidate(11, noGravity = $$props.noGravity);
		if ('xSpread' in $$props) $$invalidate(12, xSpread = $$props.xSpread);
		if ('destroyOnComplete' in $$props) $$invalidate(18, destroyOnComplete = $$props.destroyOnComplete);
		if ('disableForReducedMotion' in $$props) $$invalidate(13, disableForReducedMotion = $$props.disableForReducedMotion);
	};

	return [
		size,
		x,
		y,
		duration,
		infinite,
		delay,
		amount,
		iterationCount,
		fallDistance,
		rounded,
		cone,
		noGravity,
		xSpread,
		disableForReducedMotion,
		complete,
		getColor,
		colorRange,
		colorArray,
		destroyOnComplete
	];
}

class Confetti extends SvelteComponent {
	constructor(options) {
		super();

		init$1(
			this,
			options,
			instance$b,
			create_fragment$b,
			safe_not_equal,
			{
				size: 0,
				x: 1,
				y: 2,
				duration: 3,
				infinite: 4,
				delay: 5,
				colorRange: 16,
				colorArray: 17,
				amount: 6,
				iterationCount: 7,
				fallDistance: 8,
				rounded: 9,
				cone: 10,
				noGravity: 11,
				xSpread: 12,
				destroyOnComplete: 18,
				disableForReducedMotion: 13
			},
			add_css$7
		);
	}

	get size() {
		return this.$$.ctx[0];
	}

	set size(size) {
		this.$$set({ size });
		flush();
	}

	get x() {
		return this.$$.ctx[1];
	}

	set x(x) {
		this.$$set({ x });
		flush();
	}

	get y() {
		return this.$$.ctx[2];
	}

	set y(y) {
		this.$$set({ y });
		flush();
	}

	get duration() {
		return this.$$.ctx[3];
	}

	set duration(duration) {
		this.$$set({ duration });
		flush();
	}

	get infinite() {
		return this.$$.ctx[4];
	}

	set infinite(infinite) {
		this.$$set({ infinite });
		flush();
	}

	get delay() {
		return this.$$.ctx[5];
	}

	set delay(delay) {
		this.$$set({ delay });
		flush();
	}

	get colorRange() {
		return this.$$.ctx[16];
	}

	set colorRange(colorRange) {
		this.$$set({ colorRange });
		flush();
	}

	get colorArray() {
		return this.$$.ctx[17];
	}

	set colorArray(colorArray) {
		this.$$set({ colorArray });
		flush();
	}

	get amount() {
		return this.$$.ctx[6];
	}

	set amount(amount) {
		this.$$set({ amount });
		flush();
	}

	get iterationCount() {
		return this.$$.ctx[7];
	}

	set iterationCount(iterationCount) {
		this.$$set({ iterationCount });
		flush();
	}

	get fallDistance() {
		return this.$$.ctx[8];
	}

	set fallDistance(fallDistance) {
		this.$$set({ fallDistance });
		flush();
	}

	get rounded() {
		return this.$$.ctx[9];
	}

	set rounded(rounded) {
		this.$$set({ rounded });
		flush();
	}

	get cone() {
		return this.$$.ctx[10];
	}

	set cone(cone) {
		this.$$set({ cone });
		flush();
	}

	get noGravity() {
		return this.$$.ctx[11];
	}

	set noGravity(noGravity) {
		this.$$set({ noGravity });
		flush();
	}

	get xSpread() {
		return this.$$.ctx[12];
	}

	set xSpread(xSpread) {
		this.$$set({ xSpread });
		flush();
	}

	get destroyOnComplete() {
		return this.$$.ctx[18];
	}

	set destroyOnComplete(destroyOnComplete) {
		this.$$set({ destroyOnComplete });
		flush();
	}

	get disableForReducedMotion() {
		return this.$$.ctx[13];
	}

	set disableForReducedMotion(disableForReducedMotion) {
		this.$$set({ disableForReducedMotion });
		flush();
	}
}

create_custom_element(Confetti, {"size":{},"x":{},"y":{},"duration":{},"infinite":{"type":"Boolean"},"delay":{},"colorRange":{},"colorArray":{},"amount":{},"iterationCount":{},"fallDistance":{},"rounded":{"type":"Boolean"},"cone":{"type":"Boolean"},"noGravity":{"type":"Boolean"},"xSpread":{},"destroyOnComplete":{"type":"Boolean"},"disableForReducedMotion":{"type":"Boolean"}}, [], [], true);

/* src/ProgressBullets.svelte generated by Svelte v4.2.15 */

function add_css$6(target) {
	append_styles(target, "svelte-14lzci1", ".connection-line-container.svelte-14lzci1{background-color:rgb(var(--primary-color-rgb) / 0.2)}.bullet-border-upcoming.svelte-14lzci1{padding:4px;border-color:var(--primary-color);filter:grayscale(100%) opacity(20%)}.bullet-border-current.svelte-14lzci1{padding:4px;border-color:var(--accent-color)}.bullet-border-complete.svelte-14lzci1{padding:0px;border-width:0}.bullet-upcoming.svelte-14lzci1{width:8px;height:8px;background-color:transpaernt}.bullet-current.svelte-14lzci1{width:8px;height:8px;background-color:var(--primary-color)}.bullet-complete.svelte-14lzci1{width:16px;height:16px;background-color:var(--primary-color)}");
}

function get_each_context$3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[13] = list[i];
	child_ctx[15] = i;
	return child_ctx;
}

// (62:8) {#if i > 0}
function create_if_block_3$3(ctx) {
	let div1;
	let div0;
	let mounted;
	let dispose;

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			this.h();
		},
		l(nodes) {
			div1 = claim_element(nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			div0 = claim_element(div1_nodes, "DIV", { class: true });
			children(div0).forEach(detach);
			div1_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(div0, "class", "h-px w-0 bg-[var(--primary-color)] transition-all");
			attr(div1, "class", "connection-line-container flex h-full flex-1 flex-col justify-center svelte-14lzci1");
		},
		m(target, anchor) {
			insert_hydration(target, div1, anchor);
			append_hydration(div1, div0);

			if (!mounted) {
				dispose = [
					action_destroyer(/*setupConnectionLinesRefs*/ ctx[5].call(null, div0)),
					listen(div0, "transitionend", /*handleConnectionLineTransitionEnd*/ ctx[6])
				];

				mounted = true;
			}
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(div1);
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

// (73:8) {#if i < stepsCount - 1}
function create_if_block_2$3(ctx) {
	let div1;
	let div0;
	let div0_class_value;
	let div1_class_value;
	let mounted;
	let dispose;

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			this.h();
		},
		l(nodes) {
			div1 = claim_element(nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			div0 = claim_element(div1_nodes, "DIV", { class: true });
			children(div0).forEach(detach);
			div1_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(div0, "class", div0_class_value = "" + (null_to_empty(`${/*i*/ ctx[15] === 0
			? "bullet-current"
			: "bullet-upcoming"} rounded-full transition-all`) + " svelte-14lzci1"));

			attr(div1, "class", div1_class_value = "" + (null_to_empty(`${/*i*/ ctx[15] === 0
			? "bullet-border-current"
			: "bullet-border-upcoming"} rounded-full border-2 transition-all`) + " svelte-14lzci1"));
		},
		m(target, anchor) {
			insert_hydration(target, div1, anchor);
			append_hydration(div1, div0);

			if (!mounted) {
				dispose = action_destroyer(/*setupBulletsRefs*/ ctx[4].call(null, div1));
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*stepsCount*/ 1 && div0_class_value !== (div0_class_value = "" + (null_to_empty(`${/*i*/ ctx[15] === 0
			? "bullet-current"
			: "bullet-upcoming"} rounded-full transition-all`) + " svelte-14lzci1"))) {
				attr(div0, "class", div0_class_value);
			}

			if (dirty & /*stepsCount*/ 1 && div1_class_value !== (div1_class_value = "" + (null_to_empty(`${/*i*/ ctx[15] === 0
			? "bullet-border-current"
			: "bullet-border-upcoming"} rounded-full border-2 transition-all`) + " svelte-14lzci1"))) {
				attr(div1, "class", div1_class_value);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div1);
			}

			mounted = false;
			dispose();
		}
	};
}

// (83:8) {#if i >= stepsCount - 1}
function create_if_block$6(ctx) {
	let div;
	let span;
	let t0;
	let t1;
	let t2;
	let current;
	let if_block = /*completed*/ ctx[1] && create_if_block_1$4();

	return {
		c() {
			div = element("div");
			span = element("span");
			t0 = text(/*prizeText*/ ctx[3]);
			t1 = space();
			if (if_block) if_block.c();
			t2 = space();
			this.h();
		},
		l(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			span = claim_element(div_nodes, "SPAN", {});
			var span_nodes = children(span);
			t0 = claim_text(span_nodes, /*prizeText*/ ctx[3]);
			span_nodes.forEach(detach);
			t1 = claim_space(div_nodes);
			if (if_block) if_block.l(div_nodes);
			t2 = claim_space(div_nodes);
			div_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(div, "class", "rounded-lg border-2 border-[var(--accent-color)] p-2 pl-2 text-sm font-semibold transition-all");
			toggle_class(div, "border-0", /*completed*/ ctx[1]);
			toggle_class(div, "bg-[var(--primary-color)]", /*completed*/ ctx[1]);
			toggle_class(div, "text-[var(--secondary-color)]", !/*completed*/ ctx[1]);
			toggle_class(div, "text-[var(--text-on-primary-color)]", /*completed*/ ctx[1]);
		},
		m(target, anchor) {
			insert_hydration(target, div, anchor);
			append_hydration(div, span);
			append_hydration(span, t0);
			/*span_binding*/ ctx[9](span);
			append_hydration(div, t1);
			if (if_block) if_block.m(div, null);
			append_hydration(div, t2);
			current = true;
		},
		p(ctx, dirty) {
			if (!current || dirty & /*prizeText*/ 8) set_data(t0, /*prizeText*/ ctx[3]);

			if (/*completed*/ ctx[1]) {
				if (if_block) {
					if (dirty & /*completed*/ 2) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block_1$4();
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div, t2);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}

			if (!current || dirty & /*completed*/ 2) {
				toggle_class(div, "border-0", /*completed*/ ctx[1]);
			}

			if (!current || dirty & /*completed*/ 2) {
				toggle_class(div, "bg-[var(--primary-color)]", /*completed*/ ctx[1]);
			}

			if (!current || dirty & /*completed*/ 2) {
				toggle_class(div, "text-[var(--secondary-color)]", !/*completed*/ ctx[1]);
			}

			if (!current || dirty & /*completed*/ 2) {
				toggle_class(div, "text-[var(--text-on-primary-color)]", /*completed*/ ctx[1]);
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			/*span_binding*/ ctx[9](null);
			if (if_block) if_block.d();
		}
	};
}

// (94:16) {#if completed}
function create_if_block_1$4(ctx) {
	let div;
	let confetti;
	let current;
	confetti = new Confetti({ props: { cone: true, delay: [0, 250] } });

	return {
		c() {
			div = element("div");
			create_component(confetti.$$.fragment);
			this.h();
		},
		l(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			claim_component(confetti.$$.fragment, div_nodes);
			div_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(div, "class", "flex w-full justify-center");
		},
		m(target, anchor) {
			insert_hydration(target, div, anchor);
			mount_component(confetti, div, null);
			current = true;
		},
		i(local) {
			if (current) return;
			transition_in(confetti.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(confetti.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			destroy_component(confetti);
		}
	};
}

// (61:4) {#each Array(stepsCount) as _, i (i)}
function create_each_block$3(key_1, ctx) {
	let first;
	let t0;
	let t1;
	let if_block2_anchor;
	let current;
	let if_block0 = /*i*/ ctx[15] > 0 && create_if_block_3$3(ctx);
	let if_block1 = /*i*/ ctx[15] < /*stepsCount*/ ctx[0] - 1 && create_if_block_2$3(ctx);
	let if_block2 = /*i*/ ctx[15] >= /*stepsCount*/ ctx[0] - 1 && create_if_block$6(ctx);

	return {
		key: key_1,
		first: null,
		c() {
			first = empty();
			if (if_block0) if_block0.c();
			t0 = space();
			if (if_block1) if_block1.c();
			t1 = space();
			if (if_block2) if_block2.c();
			if_block2_anchor = empty();
			this.h();
		},
		l(nodes) {
			first = empty();
			if (if_block0) if_block0.l(nodes);
			t0 = claim_space(nodes);
			if (if_block1) if_block1.l(nodes);
			t1 = claim_space(nodes);
			if (if_block2) if_block2.l(nodes);
			if_block2_anchor = empty();
			this.h();
		},
		h() {
			this.first = first;
		},
		m(target, anchor) {
			insert_hydration(target, first, anchor);
			if (if_block0) if_block0.m(target, anchor);
			insert_hydration(target, t0, anchor);
			if (if_block1) if_block1.m(target, anchor);
			insert_hydration(target, t1, anchor);
			if (if_block2) if_block2.m(target, anchor);
			insert_hydration(target, if_block2_anchor, anchor);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (/*i*/ ctx[15] > 0) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_3$3(ctx);
					if_block0.c();
					if_block0.m(t0.parentNode, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*i*/ ctx[15] < /*stepsCount*/ ctx[0] - 1) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_2$3(ctx);
					if_block1.c();
					if_block1.m(t1.parentNode, t1);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (/*i*/ ctx[15] >= /*stepsCount*/ ctx[0] - 1) {
				if (if_block2) {
					if_block2.p(ctx, dirty);

					if (dirty & /*stepsCount*/ 1) {
						transition_in(if_block2, 1);
					}
				} else {
					if_block2 = create_if_block$6(ctx);
					if_block2.c();
					transition_in(if_block2, 1);
					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
				}
			} else if (if_block2) {
				group_outros();

				transition_out(if_block2, 1, 1, () => {
					if_block2 = null;
				});

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block2);
			current = true;
		},
		o(local) {
			transition_out(if_block2);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(first);
				detach(t0);
				detach(t1);
				detach(if_block2_anchor);
			}

			if (if_block0) if_block0.d(detaching);
			if (if_block1) if_block1.d(detaching);
			if (if_block2) if_block2.d(detaching);
		}
	};
}

function create_fragment$a(ctx) {
	let div;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let current;
	let each_value = ensure_array_like(Array(/*stepsCount*/ ctx[0]));
	const get_key = ctx => /*i*/ ctx[15];

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context$3(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
	}

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			this.h();
		},
		l(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(div_nodes);
			}

			div_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(div, "class", "flex w-full items-center justify-between");
		},
		m(target, anchor) {
			insert_hydration(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div, null);
				}
			}

			current = true;
		},
		p(ctx, [dirty]) {
			if (dirty & /*completed, prizeTextEl, prizeText, Array, stepsCount, handleConnectionLineTransitionEnd*/ 79) {
				each_value = ensure_array_like(Array(/*stepsCount*/ ctx[0]));
				group_outros();
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block$3, null, get_each_context$3);
				check_outros();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}
		}
	};
}

function instance$a($$self, $$props, $$invalidate) {
	let { stepsCount } = $$props;
	let { currentStep } = $$props;
	let { prize } = $$props;
	const bullets = [];
	const connectionLines = [];
	let completed = false;
	let prizeTextEl;
	let prizeText;

	switch (prize.discountType) {
		case "percentage":
			prizeText = `${prize.discountValue}% off`;
			break;
		case "fixed":
			prizeText = `$${prize.discountValue.toFixed(2)} off`;
			break;
		default:
			throw new Error("Invalid discount type");
	}

	function setupBulletsRefs(element) {
		bullets.push(element);
	}

	function setupConnectionLinesRefs(element) {
		connectionLines.push(element);
	}

	function handleChangeCurrentStep(currentStep) {
		if (connectionLines.length === 0) {
			return;
		}

		const connectionLine = connectionLines[currentStep - 1];

		connectionLine.ontransitionend = () => {
			var _a;

			(_a = connectionLine.parentElement) === null || _a === void 0
			? void 0
			: _a.classList.add("items-center");
		};

		connectionLine.classList.replace("w-0", "w-full");
	}

	async function handleConnectionLineTransitionEnd() {
		const bulletBorder = bullets[currentStep];

		const bullet = bulletBorder === null || bulletBorder === void 0
		? void 0
		: bulletBorder.firstElementChild;

		if (bulletBorder != null) {
			bulletBorder.classList.replace("bullet-border-upcoming", "bullet-border-current");

			bullet === null || bullet === void 0
			? void 0
			: bullet.classList.replace("bullet-upcoming", "bullet-current");
		}

		const previousBulletBorder = bullets[currentStep - 1];

		if (previousBulletBorder != null) {
			const previousBullet = previousBulletBorder.firstElementChild;
			previousBulletBorder.classList.replace("bullet-border-current", "bullet-border-complete");

			previousBullet === null || previousBullet === void 0
			? void 0
			: previousBullet.classList.replace("bullet-current", "bullet-complete");
		}

		// Handle last step
		if (currentStep < stepsCount - 1) {
			return;
		}

		$$invalidate(1, completed = true);
		$$invalidate(2, prizeTextEl.innerHTML = `You've earned ${prizeText}!`, prizeTextEl);
	}

	function span_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			prizeTextEl = $$value;
			$$invalidate(2, prizeTextEl);
		});
	}

	$$self.$$set = $$props => {
		if ('stepsCount' in $$props) $$invalidate(0, stepsCount = $$props.stepsCount);
		if ('currentStep' in $$props) $$invalidate(7, currentStep = $$props.currentStep);
		if ('prize' in $$props) $$invalidate(8, prize = $$props.prize);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*currentStep*/ 128) {
			handleChangeCurrentStep(currentStep);
		}
	};

	return [
		stepsCount,
		completed,
		prizeTextEl,
		prizeText,
		setupBulletsRefs,
		setupConnectionLinesRefs,
		handleConnectionLineTransitionEnd,
		currentStep,
		prize,
		span_binding
	];
}

class ProgressBullets extends SvelteComponent {
	constructor(options) {
		super();
		init$1(this, options, instance$a, create_fragment$a, safe_not_equal, { stepsCount: 0, currentStep: 7, prize: 8 }, add_css$6);
	}

	get stepsCount() {
		return this.$$.ctx[0];
	}

	set stepsCount(stepsCount) {
		this.$$set({ stepsCount });
		flush();
	}

	get currentStep() {
		return this.$$.ctx[7];
	}

	set currentStep(currentStep) {
		this.$$set({ currentStep });
		flush();
	}

	get prize() {
		return this.$$.ctx[8];
	}

	set prize(prize) {
		this.$$set({ prize });
		flush();
	}
}

create_custom_element(ProgressBullets, {"stepsCount":{},"currentStep":{},"prize":{}}, [], [], true);

/* src/ResponsiveImage.svelte generated by Svelte v4.2.15 */

function create_fragment$9(ctx) {
	let img;
	let img_loading_value;
	let img_width_value;
	let img_height_value;
	let img_src_value;
	let img_srcset_value;
	let img_alt_value;

	return {
		c() {
			img = element("img");
			this.h();
		},
		l(nodes) {
			img = claim_element(nodes, "IMG", {
				loading: true,
				width: true,
				height: true,
				src: true,
				srcset: true,
				sizes: true,
				alt: true,
				class: true
			});

			this.h();
		},
		h() {
			attr(img, "loading", img_loading_value = /*loading*/ ctx[1] === "eager" ? "eager" : "lazy");
			attr(img, "width", img_width_value = /*image*/ ctx[0].width);
			attr(img, "height", img_height_value = /*image*/ ctx[0].height);
			if (!src_url_equal(img.src, img_src_value = /*imageUrl*/ ctx[3](/*image*/ ctx[0].width))) attr(img, "src", img_src_value);
			if (!srcset_url_equal(img, img_srcset_value = /*srcset*/ ctx[4])) attr(img, "srcset", img_srcset_value);
			attr(img, "sizes", /*sizes*/ ctx[5]);
			attr(img, "alt", img_alt_value = /*image*/ ctx[0].alt);
			attr(img, "class", /*className*/ ctx[2]);
		},
		m(target, anchor) {
			insert_hydration(target, img, anchor);
		},
		p(ctx, [dirty]) {
			if (dirty & /*loading*/ 2 && img_loading_value !== (img_loading_value = /*loading*/ ctx[1] === "eager" ? "eager" : "lazy")) {
				attr(img, "loading", img_loading_value);
			}

			if (dirty & /*image*/ 1 && img_width_value !== (img_width_value = /*image*/ ctx[0].width)) {
				attr(img, "width", img_width_value);
			}

			if (dirty & /*image*/ 1 && img_height_value !== (img_height_value = /*image*/ ctx[0].height)) {
				attr(img, "height", img_height_value);
			}

			if (dirty & /*image*/ 1 && !src_url_equal(img.src, img_src_value = /*imageUrl*/ ctx[3](/*image*/ ctx[0].width))) {
				attr(img, "src", img_src_value);
			}

			if (dirty & /*image*/ 1 && img_alt_value !== (img_alt_value = /*image*/ ctx[0].alt)) {
				attr(img, "alt", img_alt_value);
			}

			if (dirty & /*className*/ 4) {
				attr(img, "class", /*className*/ ctx[2]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(img);
			}
		}
	};
}

function instance$9($$self, $$props, $$invalidate) {
	let { image } = $$props;
	let { loading = undefined } = $$props;
	let { className = "" } = $$props;

	function imageUrl(width) {
		let completeUrl = image.src.startsWith("http")
		? image.src
		: `https:${image.src}`;

		const url = new URL(completeUrl);
		url.searchParams.set("width", width.toString());
		return url.toString();
	}

	const widths = [300, 600, 800, 1000, 1200, 1600, 2000];
	const srcset = widths.map(w => `${imageUrl(w)} ${w}w`).join(", ");

	const sizes = `
    (max-width: 300px) 280px,
    (max-width: 600px) 560px,
    (max-width: 800px) 800px,
    (max-width: 1000px) 1000px,
    (max-width: 1200px) 1200px,
    (max-width: 1600px) 1600px,
    (max-width: 2000px) 2000px
  `;

	$$self.$$set = $$props => {
		if ('image' in $$props) $$invalidate(0, image = $$props.image);
		if ('loading' in $$props) $$invalidate(1, loading = $$props.loading);
		if ('className' in $$props) $$invalidate(2, className = $$props.className);
	};

	return [image, loading, className, imageUrl, srcset, sizes];
}

class ResponsiveImage extends SvelteComponent {
	constructor(options) {
		super();
		init$1(this, options, instance$9, create_fragment$9, safe_not_equal, { image: 0, loading: 1, className: 2 });
	}

	get image() {
		return this.$$.ctx[0];
	}

	set image(image) {
		this.$$set({ image });
		flush();
	}

	get loading() {
		return this.$$.ctx[1];
	}

	set loading(loading) {
		this.$$set({ loading });
		flush();
	}

	get className() {
		return this.$$.ctx[2];
	}

	set className(className) {
		this.$$set({ className });
		flush();
	}
}

create_custom_element(ResponsiveImage, {"image":{},"loading":{},"className":{}}, [], [], true);

var _a;
const GTAG_ID = "G-430EPZZG3B";
const DATA_LAYER = "shplnDataLayer";
const SHOP_HANDLE = window.Shopify.shop.replace(/.myshopify.com/, "");
const eventLogger = {
    logEvent: (action, data = {}) => {
        if (!isGtagEnabled) {
            return;
        }
        console.log(`[shpln-quiz][event] ${action}`, data, SHOP_HANDLE);
        data.timestamp = Date.now();
        data.shop = SHOP_HANDLE;
        window.shplnGtag("event", action, data);
    },
};
const isGtagEnabled = GTAG_ID.length;
if (isGtagEnabled) {
    const scriptTag = document.createElement("script");
    scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}&l=${DATA_LAYER}`;
    scriptTag.setAttribute("id", "shpln-gtag");
    (_a = document.querySelector("head")) === null || _a === void 0 ? void 0 : _a.prepend(scriptTag);
    window[DATA_LAYER] = window[DATA_LAYER] || [];
    window.shplnGtag = function () {
        window[DATA_LAYER].push(arguments);
    };
    window.shplnGtag("js", new Date());
    window.shplnGtag("config", GTAG_ID);
}
else {
    console.error("[shpln-quiz] gtagId is empty. Tracking will be disabled. To enable it, provide the gtag id in section settings.");
}

/* src/quiz-controller.svelte generated by Svelte v4.2.15 */
let prevSegmentId;

const sequenceState = derived(store, $ => {
	if ($ == null) {
		return;
	}

	return { segment: $.segment, step: $.step };
});

currentSegment.subscribe($ => {
	if ($ == null) {
		return;
	}

	if (prevSegmentId === $.value.id) {
		return;
	}

	eventLogger.logEvent("level_start", {
		level_number: $.idx + 1,
		level_id: $.value.id
	});

	prevSegmentId = $.value.id;
});

sequenceState.subscribe($ => {
	if ($ == null) {
		return;
	}

	const { segment, step } = $;

	if (step.next == null) {
		eventLogger.logEvent("level_end", {
			level_number: segment.idx + 1,
			level_id: segment.value.id
		});
	}

	if (step.next == null && segment.next == null) {
		eventLogger.logEvent("game_end");
	}
});

function handleSelectOption(option) {
	const answerId = option.answerId;

	if (option.answerId != null) {
		store.update(s => {
			if (s.score[answerId] == null) {
				s.score[answerId] = 0;
			}

			++s.score[answerId];
			return s;
		});
	}

	goToNextStep();
}

function goToNextStep() {
	const state = get_store_value(store);
	eventLogger.logEvent("step_forward", { step_number: state.globalStepIdx + 1 });

	store.update(store => {
		++store.globalStepIdx;
		let nextStep = store.step.next;

		if (nextStep == null) {
			const nextSegment = store.segment.next;
			store.segment = nextSegment;
			nextStep = nextSegment.value.steps.head;
		}

		store.step = nextStep;
		return store;
	});
}

function calculateResult(segmentId) {
	const state = get_store_value(store);
	console.log(`--- finalScore:`, state.score);
	let winningAnswerIds = [];
	let high = 0;

	for (const [answerId, count] of Object.entries(state.score)) {
		switch (true) {
			case count === high:
				winningAnswerIds.push(answerId);
			case count > high:
				winningAnswerIds = [answerId];
				high = count;
		}
	}

	const winningAnswerId = winningAnswerIds[0];
	const segmentConfig = state.config.segments[segmentId];
	const winner = segmentConfig.results[winningAnswerId];
	const discountUrl = `/discount/${winner.discount_code}?redirect=${winner.redirect_url}`;

	eventLogger.logEvent("result", {
		answer_id: winningAnswerId,
		discount_code: winner.discount_code,
		redirect_url: discountUrl
	});

	return { discountUrl };
}

class Quiz_controller extends SvelteComponent {
	constructor(options) {
		super();
		init$1(this, options, null, null, safe_not_equal, {});
	}
}

create_custom_element(Quiz_controller, {}, [], [], true);

/* src/MultipleChoiceStep.svelte generated by Svelte v4.2.15 */

function add_css$5(target) {
	append_styles(target, "svelte-daejqo", ".option.svelte-daejqo{background-color:var(--primary-color);color:var(--text-on-primary-color)}@keyframes svelte-daejqo-flash{0%,50%{filter:brightness(1.75)}100%{filter:brightness(1)}}.flash-animation.svelte-daejqo{animation:svelte-daejqo-flash 0.175s 1}");
}

function get_each_context$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[12] = list[i];
	return child_ctx;
}

// (82:12) {#if option.iconSrc}
function create_if_block$5(ctx) {
	let div;
	let img;
	let img_src_value;
	let img_alt_value;

	return {
		c() {
			div = element("div");
			img = element("img");
			this.h();
		},
		l(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);

			img = claim_element(div_nodes, "IMG", {
				class: true,
				src: true,
				alt: true,
				loading: true
			});

			div_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(img, "class", "h-full w-full object-contain");
			if (!src_url_equal(img.src, img_src_value = `${/*option*/ ctx[12].iconSrc}&width=${ICON_WIDTH}`)) attr(img, "src", img_src_value);
			attr(img, "alt", img_alt_value = `${/*option*/ ctx[12].title} icon`);
			attr(img, "loading", "eager");
			attr(div, "class", "flex aspect-square max-h-[33%] flex-col items-center justify-center");
		},
		m(target, anchor) {
			insert_hydration(target, div, anchor);
			append_hydration(div, img);
		},
		p(ctx, dirty) {
			if (dirty & /*options*/ 4 && !src_url_equal(img.src, img_src_value = `${/*option*/ ctx[12].iconSrc}&width=${ICON_WIDTH}`)) {
				attr(img, "src", img_src_value);
			}

			if (dirty & /*options*/ 4 && img_alt_value !== (img_alt_value = `${/*option*/ ctx[12].title} icon`)) {
				attr(img, "alt", img_alt_value);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (69:4) {#each options as option (option.title)}
function create_each_block$2(key_1, ctx) {
	let button;
	let t0;
	let span;
	let t1_value = /*option*/ ctx[12].title + "";
	let t1;
	let t2;
	let button_class_value;
	let mounted;
	let dispose;
	let if_block = /*option*/ ctx[12].iconSrc && create_if_block$5(ctx);

	function click_handler(...args) {
		return /*click_handler*/ ctx[9](/*option*/ ctx[12], ...args);
	}

	return {
		key: key_1,
		first: null,
		c() {
			button = element("button");
			if (if_block) if_block.c();
			t0 = space();
			span = element("span");
			t1 = text(t1_value);
			t2 = space();
			this.h();
		},
		l(nodes) {
			button = claim_element(nodes, "BUTTON", { class: true });
			var button_nodes = children(button);
			if (if_block) if_block.l(button_nodes);
			t0 = claim_space(button_nodes);
			span = claim_element(button_nodes, "SPAN", { class: true });
			var span_nodes = children(span);
			t1 = claim_text(span_nodes, t1_value);
			span_nodes.forEach(detach);
			t2 = claim_space(button_nodes);
			button_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(span, "class", "text-sm sm:text-base");

			attr(button, "class", button_class_value = "" + (null_to_empty(`
            option
            flex
            translate-y-12 flex-col items-center justify-center
            gap-2 p-2
            font-medium opacity-0 transition-all duration-200 sm:text-lg
            ${/*style*/ ctx[1] === "grid"
			? "aspect-square w-full"
			: "w-full rounded-lg"}
            ${/*OPTION_HOVER_CLASSES*/ ctx[5].join(" ")}
            `) + " svelte-daejqo"));

			this.first = button;
		},
		m(target, anchor) {
			insert_hydration(target, button, anchor);
			if (if_block) if_block.m(button, null);
			append_hydration(button, t0);
			append_hydration(button, span);
			append_hydration(span, t1);
			append_hydration(button, t2);

			if (!mounted) {
				dispose = listen(button, "click", click_handler);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (/*option*/ ctx[12].iconSrc) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$5(ctx);
					if_block.c();
					if_block.m(button, t0);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*options*/ 4 && t1_value !== (t1_value = /*option*/ ctx[12].title + "")) set_data(t1, t1_value);

			if (dirty & /*style*/ 2 && button_class_value !== (button_class_value = "" + (null_to_empty(`
            option
            flex
            translate-y-12 flex-col items-center justify-center
            gap-2 p-2
            font-medium opacity-0 transition-all duration-200 sm:text-lg
            ${/*style*/ ctx[1] === "grid"
			? "aspect-square w-full"
			: "w-full rounded-lg"}
            ${/*OPTION_HOVER_CLASSES*/ ctx[5].join(" ")}
            `) + " svelte-daejqo"))) {
				attr(button, "class", button_class_value);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(button);
			}

			if (if_block) if_block.d();
			mounted = false;
			dispose();
		}
	};
}

function create_fragment$8(ctx) {
	let div;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let div_class_value;
	let each_value = ensure_array_like(/*options*/ ctx[2]);
	const get_key = ctx => /*option*/ ctx[12].title;

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context$2(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
	}

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			this.h();
		},
		l(nodes) {
			div = claim_element(nodes, "DIV", { class: true, "data-step": true });
			var div_nodes = children(div);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(div_nodes);
			}

			div_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(div, "class", div_class_value = /*style*/ ctx[1] === "grid"
			? "grid aspect-square max-w-md grid-cols-2 gap-3 sm:h-full"
			: "flex w-full max-w-md flex-col items-center gap-3");

			attr(div, "data-step", /*stepIdx*/ ctx[0]);
			toggle_class(div, "pointer-events-none", !/*interactionEnabled*/ ctx[4]);
		},
		m(target, anchor) {
			insert_hydration(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div, null);
				}
			}

			/*div_binding*/ ctx[10](div);
		},
		p(ctx, [dirty]) {
			if (dirty & /*style, OPTION_HOVER_CLASSES, onClickOption, options, ICON_WIDTH*/ 102) {
				each_value = ensure_array_like(/*options*/ ctx[2]);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, destroy_block, create_each_block$2, null, get_each_context$2);
			}

			if (dirty & /*style*/ 2 && div_class_value !== (div_class_value = /*style*/ ctx[1] === "grid"
			? "grid aspect-square max-w-md grid-cols-2 gap-3 sm:h-full"
			: "flex w-full max-w-md flex-col items-center gap-3")) {
				attr(div, "class", div_class_value);
			}

			if (dirty & /*stepIdx*/ 1) {
				attr(div, "data-step", /*stepIdx*/ ctx[0]);
			}

			if (dirty & /*style, interactionEnabled*/ 18) {
				toggle_class(div, "pointer-events-none", !/*interactionEnabled*/ ctx[4]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			/*div_binding*/ ctx[10](null);
		}
	};
}

const ICON_WIDTH = 56;
const OPTION_REVEAL_DELAY = 400;

function instance$8($$self, $$props, $$invalidate) {
	let { stepIdx } = $$props;
	let { style } = $$props;
	let { options } = $$props;
	let { onSelect } = $$props;
	let { isShowing } = $$props;
	const ROUNDED_CLASS_OPTION_MAP = ["rounded-tl-lg", "rounded-tr-lg", "rounded-bl-lg", "rounded-br-lg"];

	const OPTION_HOVER_CLASSES = [
		"hover:scale-105",
		"hover:rounded-lg",
		"hover:font-semibold",
		"hover:shadow-xl"
	];

	let interactionEnabled = false;
	let container;

	function onClickOption(option, event) {
		onSelect(option);
		const optionElem = event.currentTarget;
		optionElem.classList.add("flash-animation", "pointer-events-none", ...OPTION_HOVER_CLASSES);

		optionElem.addEventListener("animationend", () => {
			optionElem.classList.remove("flash-animation");
			optionElem.classList.add("brightness-[1.75]");

			setTimeout(
				() => {
					handleSelectOption(option);
				},
				350
			);
		});
	}

	const click_handler = (option, e) => onClickOption(option, e);

	function div_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			container = $$value;
			$$invalidate(3, container);
		});
	}

	$$self.$$set = $$props => {
		if ('stepIdx' in $$props) $$invalidate(0, stepIdx = $$props.stepIdx);
		if ('style' in $$props) $$invalidate(1, style = $$props.style);
		if ('options' in $$props) $$invalidate(2, options = $$props.options);
		if ('onSelect' in $$props) $$invalidate(7, onSelect = $$props.onSelect);
		if ('isShowing' in $$props) $$invalidate(8, isShowing = $$props.isShowing);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*isShowing, container, style, options*/ 270) {
			(async function reveal() {
				if (!isShowing) {
					return;
				}

				await new Promise(resolve => {
						setTimeout(resolve, 350);
					});

				const optionsElems = container.querySelectorAll("button");

				optionsElems.forEach((elem, idx) => {
					setTimeout(
						() => {
							window.requestAnimationFrame(() => {
								elem.classList.remove("opacity-0");
								elem.classList.remove("translate-y-12");

								if (style === "grid") {
									elem.classList.add(ROUNDED_CLASS_OPTION_MAP[idx]);
								}
							});
						},
						idx * OPTION_REVEAL_DELAY
					);
				});

				setTimeout(
					() => {
						$$invalidate(4, interactionEnabled = true);
					},
					options.length * OPTION_REVEAL_DELAY
				);
			})();
		}
	};

	return [
		stepIdx,
		style,
		options,
		container,
		interactionEnabled,
		OPTION_HOVER_CLASSES,
		onClickOption,
		onSelect,
		isShowing,
		click_handler,
		div_binding
	];
}

class MultipleChoiceStep extends SvelteComponent {
	constructor(options) {
		super();

		init$1(
			this,
			options,
			instance$8,
			create_fragment$8,
			safe_not_equal,
			{
				stepIdx: 0,
				style: 1,
				options: 2,
				onSelect: 7,
				isShowing: 8
			},
			add_css$5
		);
	}

	get stepIdx() {
		return this.$$.ctx[0];
	}

	set stepIdx(stepIdx) {
		this.$$set({ stepIdx });
		flush();
	}

	get style() {
		return this.$$.ctx[1];
	}

	set style(style) {
		this.$$set({ style });
		flush();
	}

	get options() {
		return this.$$.ctx[2];
	}

	set options(options) {
		this.$$set({ options });
		flush();
	}

	get onSelect() {
		return this.$$.ctx[7];
	}

	set onSelect(onSelect) {
		this.$$set({ onSelect });
		flush();
	}

	get isShowing() {
		return this.$$.ctx[8];
	}

	set isShowing(isShowing) {
		this.$$set({ isShowing });
		flush();
	}
}

create_custom_element(MultipleChoiceStep, {"stepIdx":{},"style":{},"options":{},"onSelect":{},"isShowing":{}}, [], [], true);

/* src/EducationalStep.svelte generated by Svelte v4.2.15 */

function add_css$4(target) {
	append_styles(target, "svelte-1d1bfyu", "button.svelte-1d1bfyu{background-color:var(--primary-color);color:var(--text-on-primary-color)}.next-button-overlay.svelte-1d1bfyu{transition-duration:var(--wait-duration)}");
}

// (20:0) {#if $store.globalStepIdx >= stepIdx}
function create_if_block$4(ctx) {
	let div2;
	let div0;
	let html_tag;
	let t0;
	let button;
	let t1;
	let div1;
	let button_disabled_value;
	let div2_transition;
	let current;
	let mounted;
	let dispose;

	return {
		c() {
			div2 = element("div");
			div0 = element("div");
			html_tag = new HtmlTagHydration(false);
			t0 = space();
			button = element("button");
			t1 = text("Next\n            ");
			div1 = element("div");
			this.h();
		},
		l(nodes) {
			div2 = claim_element(nodes, "DIV", { class: true });
			var div2_nodes = children(div2);
			div0 = claim_element(div2_nodes, "DIV", { class: true });
			var div0_nodes = children(div0);
			html_tag = claim_html_tag(div0_nodes, false);
			div0_nodes.forEach(detach);
			t0 = claim_space(div2_nodes);
			button = claim_element(div2_nodes, "BUTTON", { class: true });
			var button_nodes = children(button);
			t1 = claim_text(button_nodes, "Next\n            ");
			div1 = claim_element(button_nodes, "DIV", { class: true, style: true });
			children(div1).forEach(detach);
			button_nodes.forEach(detach);
			div2_nodes.forEach(detach);
			this.h();
		},
		h() {
			html_tag.a = null;
			attr(div0, "class", "w-full flex-1 overflow-scroll text-center text-lg");
			attr(div1, "class", "next-button-overlay absolute inset-0 ml-0 bg-white opacity-65 transition-[margin-left,shadow] ease-linear  svelte-1d1bfyu");
			set_style(div1, "--wait-duration", /*waitUntilCanProceed*/ ctx[2] + "s");
			button.disabled = button_disabled_value = !/*canProceed*/ ctx[4];
			attr(button, "class", "relative overflow-hidden rounded px-4 py-2 text-xl font-medium transition-all duration-200  svelte-1d1bfyu");
			toggle_class(button, "hover:scale-105", /*canProceed*/ ctx[4]);
			toggle_class(button, "hover:shadow-xl", /*canProceed*/ ctx[4]);
			attr(div2, "class", "flex size-full flex-1 flex-col items-center justify-around gap-4 py-6");
		},
		m(target, anchor) {
			insert_hydration(target, div2, anchor);
			append_hydration(div2, div0);
			html_tag.m(/*body*/ ctx[1], div0);
			append_hydration(div2, t0);
			append_hydration(div2, button);
			append_hydration(button, t1);
			append_hydration(button, div1);
			/*div1_binding*/ ctx[8](div1);
			/*div2_binding*/ ctx[10](div2);
			current = true;

			if (!mounted) {
				dispose = [
					listen(div1, "transitionend", /*transitionend_handler*/ ctx[9]),
					listen(button, "click", goToNextStep),
					listen(div2, "introend", /*startNextButtonTransition*/ ctx[7])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (!current || dirty & /*body*/ 2) html_tag.p(/*body*/ ctx[1]);

			if (!current || dirty & /*waitUntilCanProceed*/ 4) {
				set_style(div1, "--wait-duration", /*waitUntilCanProceed*/ ctx[2] + "s");
			}

			if (!current || dirty & /*canProceed*/ 16 && button_disabled_value !== (button_disabled_value = !/*canProceed*/ ctx[4])) {
				button.disabled = button_disabled_value;
			}

			if (!current || dirty & /*canProceed*/ 16) {
				toggle_class(button, "hover:scale-105", /*canProceed*/ ctx[4]);
			}

			if (!current || dirty & /*canProceed*/ 16) {
				toggle_class(button, "hover:shadow-xl", /*canProceed*/ ctx[4]);
			}
		},
		i(local) {
			if (current) return;

			if (local) {
				add_render_callback(() => {
					if (!current) return;
					if (!div2_transition) div2_transition = create_bidirectional_transition(div2, fly, { y: 48, delay: 350 }, true);
					div2_transition.run(1);
				});
			}

			current = true;
		},
		o(local) {
			if (local) {
				if (!div2_transition) div2_transition = create_bidirectional_transition(div2, fly, { y: 48, delay: 350 }, false);
				div2_transition.run(0);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(div2);
			}

			/*div1_binding*/ ctx[8](null);
			/*div2_binding*/ ctx[10](null);
			if (detaching && div2_transition) div2_transition.end();
			mounted = false;
			run_all(dispose);
		}
	};
}

function create_fragment$7(ctx) {
	let if_block_anchor;
	let if_block = /*$store*/ ctx[6].globalStepIdx >= /*stepIdx*/ ctx[0] && create_if_block$4(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l(nodes) {
			if (if_block) if_block.l(nodes);
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_hydration(target, if_block_anchor, anchor);
		},
		p(ctx, [dirty]) {
			if (/*$store*/ ctx[6].globalStepIdx >= /*stepIdx*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*$store, stepIdx*/ 65) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$4(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i(local) {
			transition_in(if_block);
		},
		o(local) {
			transition_out(if_block);
		},
		d(detaching) {
			if (detaching) {
				detach(if_block_anchor);
			}

			if (if_block) if_block.d(detaching);
		}
	};
}

function instance$7($$self, $$props, $$invalidate) {
	let $store;
	component_subscribe($$self, store, $$value => $$invalidate(6, $store = $$value));
	let { stepIdx } = $$props;
	let { body } = $$props;
	let { waitUntilCanProceed } = $$props;
	let container;
	let canProceed = false;
	let nextButtonOverlayContainer;

	function startNextButtonTransition() {
		$$invalidate(5, nextButtonOverlayContainer.style.marginLeft = "100%", nextButtonOverlayContainer);
		nextButtonOverlayContainer.classList.add("shadow-xl");
	}

	function div1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			nextButtonOverlayContainer = $$value;
			$$invalidate(5, nextButtonOverlayContainer);
		});
	}

	const transitionend_handler = () => {
		$$invalidate(4, canProceed = true);
	};

	function div2_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			container = $$value;
			$$invalidate(3, container);
		});
	}

	$$self.$$set = $$props => {
		if ('stepIdx' in $$props) $$invalidate(0, stepIdx = $$props.stepIdx);
		if ('body' in $$props) $$invalidate(1, body = $$props.body);
		if ('waitUntilCanProceed' in $$props) $$invalidate(2, waitUntilCanProceed = $$props.waitUntilCanProceed);
	};

	return [
		stepIdx,
		body,
		waitUntilCanProceed,
		container,
		canProceed,
		nextButtonOverlayContainer,
		$store,
		startNextButtonTransition,
		div1_binding,
		transitionend_handler,
		div2_binding
	];
}

class EducationalStep extends SvelteComponent {
	constructor(options) {
		super();

		init$1(
			this,
			options,
			instance$7,
			create_fragment$7,
			safe_not_equal,
			{
				stepIdx: 0,
				body: 1,
				waitUntilCanProceed: 2
			},
			add_css$4
		);
	}

	get stepIdx() {
		return this.$$.ctx[0];
	}

	set stepIdx(stepIdx) {
		this.$$set({ stepIdx });
		flush();
	}

	get body() {
		return this.$$.ctx[1];
	}

	set body(body) {
		this.$$set({ body });
		flush();
	}

	get waitUntilCanProceed() {
		return this.$$.ctx[2];
	}

	set waitUntilCanProceed(waitUntilCanProceed) {
		this.$$set({ waitUntilCanProceed });
		flush();
	}
}

create_custom_element(EducationalStep, {"stepIdx":{},"body":{},"waitUntilCanProceed":{}}, [], [], true);

/* src/SegmentResultStep.svelte generated by Svelte v4.2.15 */

function add_css$3(target) {
	append_styles(target, "svelte-19day7h", "button.claim.svelte-19day7h.svelte-19day7h{color:var(--primary-color);border-style:solid;border-width:2px;border-color:var(--primary-color);background-color:whitesmoke}button.continue.svelte-19day7h.svelte-19day7h{color:var(--text-on-primary-color);background-color:var(--primary-color)}form.svelte-19day7h input[name=\"email\"].svelte-19day7h{border-style:solid;border-width:2px;border-color:var(--primary-color);background-color:whitesmoke}.dot-typing.svelte-19day7h.svelte-19day7h{position:relative;left:-9999px;width:10px;height:10px;border-radius:5px;background-color:var(--dots-color);color:var(--dots-color);box-shadow:9984px 0 0 0 var(--dots-color),\n            9999px 0 0 0 var(--dots-color),\n            10014px 0 0 0 var(--dots-color);animation:svelte-19day7h-dot-typing 1.5s infinite linear}@keyframes svelte-19day7h-dot-typing{0%{box-shadow:9984px 0 0 0 var(--dots-color),\n                9999px 0 0 0 var(--dots-color),\n                10014px 0 0 0 var(--dots-color)}16.667%{box-shadow:9984px -10px 0 0 var(--dots-color),\n                9999px 0 0 0 var(--dots-color),\n                10014px 0 0 0 var(--dots-color)}33.333%{box-shadow:9984px 0 0 0 var(--dots-color),\n                9999px 0 0 0 var(--dots-color),\n                10014px 0 0 0 var(--dots-color)}50%{box-shadow:9984px 0 0 0 var(--dots-color),\n                9999px -10px 0 0 var(--dots-color),\n                10014px 0 0 0 var(--dots-color)}66.667%{box-shadow:9984px 0 0 0 var(--dots-color),\n                9999px 0 0 0 var(--dots-color),\n                10014px 0 0 0 var(--dots-color)}83.333%{box-shadow:9984px 0 0 0 var(--dots-color),\n                9999px 0 0 0 var(--dots-color),\n                10014px -10px 0 0 var(--dots-color)}100%{box-shadow:9984px 0 0 0 var(--dots-color),\n                9999px 0 0 0 var(--dots-color),\n                10014px 0 0 0 var(--dots-color)}}");
}

// (73:8) {#if nextConfig != null}
function create_if_block_3$2(ctx) {
	let button;
	let textContent = "Play again for more savings";
	let mounted;
	let dispose;

	return {
		c() {
			button = element("button");
			button.textContent = textContent;
			this.h();
		},
		l(nodes) {
			button = claim_element(nodes, "BUTTON", { class: true, ["data-svelte-h"]: true });
			if (get_svelte_dataset(button) !== "svelte-18ljt9h") button.textContent = textContent;
			this.h();
		},
		h() {
			attr(button, "class", "continue h-14 w-full rounded-lg px-3 uppercase transition-transform hover:scale-105 svelte-19day7h");
		},
		m(target, anchor) {
			insert_hydration(target, button, anchor);

			if (!mounted) {
				dispose = listen(button, "click", /*handleContinue*/ ctx[6]);
				mounted = true;
			}
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(button);
			}

			mounted = false;
			dispose();
		}
	};
}

// (137:8) {:else}
function create_else_block$1(ctx) {
	let button;
	let t0;
	let t1;
	let mounted;
	let dispose;

	return {
		c() {
			button = element("button");
			t0 = text("Take the ");
			t1 = text(/*prizeText*/ ctx[3]);
			this.h();
		},
		l(nodes) {
			button = claim_element(nodes, "BUTTON", { class: true });
			var button_nodes = children(button);
			t0 = claim_text(button_nodes, "Take the ");
			t1 = claim_text(button_nodes, /*prizeText*/ ctx[3]);
			button_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(button, "class", "claim h-14 w-full rounded-lg px-3 uppercase svelte-19day7h");
		},
		m(target, anchor) {
			insert_hydration(target, button, anchor);
			append_hydration(button, t0);
			append_hydration(button, t1);

			if (!mounted) {
				dispose = listen(button, "click", /*handleClaimPrize*/ ctx[7]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*prizeText*/ 8) set_data(t1, /*prizeText*/ ctx[3]);
		},
		d(detaching) {
			if (detaching) {
				detach(button);
			}

			mounted = false;
			dispose();
		}
	};
}

// (81:8) {#if isShowingForm}
function create_if_block$3(ctx) {
	let form;
	let input0;
	let t0;
	let input1;
	let t1;
	let button;
	let t2;
	let button_disabled_value;
	let mounted;
	let dispose;
	let if_block0 = /*networkStatus*/ ctx[1] === "idle" && create_if_block_2$2();
	let if_block1 = /*networkStatus*/ ctx[1] === "loading" && create_if_block_1$3();

	return {
		c() {
			form = element("form");
			input0 = element("input");
			t0 = space();
			input1 = element("input");
			t1 = space();
			button = element("button");
			if (if_block0) if_block0.c();
			t2 = space();
			if (if_block1) if_block1.c();
			this.h();
		},
		l(nodes) {
			form = claim_element(nodes, "FORM", { class: true });
			var form_nodes = children(form);

			input0 = claim_element(form_nodes, "INPUT", {
				class: true,
				name: true,
				type: true,
				placeholder: true
			});

			t0 = claim_space(form_nodes);
			input1 = claim_element(form_nodes, "INPUT", { name: true, type: true });
			t1 = claim_space(form_nodes);
			button = claim_element(form_nodes, "BUTTON", { type: true, class: true });
			var button_nodes = children(button);
			if (if_block0) if_block0.l(button_nodes);
			t2 = claim_space(button_nodes);
			if (if_block1) if_block1.l(button_nodes);
			button_nodes.forEach(detach);
			form_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(input0, "class", "h-14 flex-1 rounded px-3 svelte-19day7h");
			attr(input0, "name", "email");
			attr(input0, "type", "email");
			attr(input0, "placeholder", "Email");
			input0.required = true;
			attr(input1, "name", "store");
			attr(input1, "type", "hidden");
			input1.value = /*STORE_HANDLE*/ ctx[4];
			attr(button, "type", "submit");
			attr(button, "class", "flex size-14 flex-col items-center justify-center rounded p-2");
			button.disabled = button_disabled_value = /*networkStatus*/ ctx[1] === "loading";
			toggle_class(button, "bg-none", /*networkStatus*/ ctx[1] === "loading");
			toggle_class(button, "bg-[var(--primary-color)]", /*networkStatus*/ ctx[1] === "idle");
			attr(form, "class", "flex h-14 w-full items-center gap-2 svelte-19day7h");
		},
		m(target, anchor) {
			insert_hydration(target, form, anchor);
			append_hydration(form, input0);
			append_hydration(form, t0);
			append_hydration(form, input1);
			append_hydration(form, t1);
			append_hydration(form, button);
			if (if_block0) if_block0.m(button, null);
			append_hydration(button, t2);
			if (if_block1) if_block1.m(button, null);

			if (!mounted) {
				dispose = listen(form, "submit", /*handleSubmitForm*/ ctx[8]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (/*networkStatus*/ ctx[1] === "idle") {
				if (if_block0) {
					if (dirty & /*networkStatus*/ 2) {
						transition_in(if_block0, 1);
					}
				} else {
					if_block0 = create_if_block_2$2();
					if_block0.c();
					transition_in(if_block0, 1);
					if_block0.m(button, t2);
				}
			} else if (if_block0) {
				group_outros();

				transition_out(if_block0, 1, 1, () => {
					if_block0 = null;
				});

				check_outros();
			}

			if (/*networkStatus*/ ctx[1] === "loading") {
				if (if_block1) {
					if (dirty & /*networkStatus*/ 2) {
						transition_in(if_block1, 1);
					}
				} else {
					if_block1 = create_if_block_1$3();
					if_block1.c();
					transition_in(if_block1, 1);
					if_block1.m(button, null);
				}
			} else if (if_block1) {
				group_outros();

				transition_out(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				check_outros();
			}

			if (dirty & /*networkStatus*/ 2 && button_disabled_value !== (button_disabled_value = /*networkStatus*/ ctx[1] === "loading")) {
				button.disabled = button_disabled_value;
			}

			if (dirty & /*networkStatus*/ 2) {
				toggle_class(button, "bg-none", /*networkStatus*/ ctx[1] === "loading");
			}

			if (dirty & /*networkStatus*/ 2) {
				toggle_class(button, "bg-[var(--primary-color)]", /*networkStatus*/ ctx[1] === "idle");
			}
		},
		d(detaching) {
			if (detaching) {
				detach(form);
			}

			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			mounted = false;
			dispose();
		}
	};
}

// (102:20) {#if networkStatus === "idle"}
function create_if_block_2$2(ctx) {
	let div;
	let textContent = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.698 4.034L21 12L4.698 19.966a.5.5 0 0 1-.546-.124a.56.56 0 0 1-.12-.568L6.5 12L4.032 4.726a.56.56 0 0 1 .12-.568a.5.5 0 0 1 .546-.124M6.5 12H21"></path></svg>`;
	let div_transition;
	let current;

	return {
		c() {
			div = element("div");
			div.innerHTML = textContent;
			this.h();
		},
		l(nodes) {
			div = claim_element(nodes, "DIV", { class: true, ["data-svelte-h"]: true });
			if (get_svelte_dataset(div) !== "svelte-1liv9t0") div.innerHTML = textContent;
			this.h();
		},
		h() {
			attr(div, "class", "size1/2 text-[var(--text-on-primary-color)]");
		},
		m(target, anchor) {
			insert_hydration(target, div, anchor);
			current = true;
		},
		i(local) {
			if (current) return;

			if (local) {
				add_render_callback(() => {
					if (!current) return;
					if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { y: 24 }, true);
					div_transition.run(1);
				});
			}

			current = true;
		},
		o(local) {
			if (local) {
				if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { y: 24 }, false);
				div_transition.run(0);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			if (detaching && div_transition) div_transition.end();
		}
	};
}

// (122:20) {#if networkStatus === "loading"}
function create_if_block_1$3(ctx) {
	let div2;
	let textContent = `<div class="p-4"><div class="dot-typing svelte-19day7h" style="--dots-color:var(--secondary-color);"></div></div>`;
	let div2_transition;
	let current;

	return {
		c() {
			div2 = element("div");
			div2.innerHTML = textContent;
			this.h();
		},
		l(nodes) {
			div2 = claim_element(nodes, "DIV", { class: true, ["data-svelte-h"]: true });
			if (get_svelte_dataset(div2) !== "svelte-cpksjy") div2.innerHTML = textContent;
			this.h();
		},
		h() {
			attr(div2, "class", "flex flex-col items-center justify-center gap-4");
		},
		m(target, anchor) {
			insert_hydration(target, div2, anchor);
			current = true;
		},
		i(local) {
			if (current) return;

			if (local) {
				add_render_callback(() => {
					if (!current) return;
					if (!div2_transition) div2_transition = create_bidirectional_transition(div2, fly, { y: 24 }, true);
					div2_transition.run(1);
				});
			}

			current = true;
		},
		o(local) {
			if (local) {
				if (!div2_transition) div2_transition = create_bidirectional_transition(div2, fly, { y: 24 }, false);
				div2_transition.run(0);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(div2);
			}

			if (detaching && div2_transition) div2_transition.end();
		}
	};
}

function create_fragment$6(ctx) {
	let div2;
	let div0;
	let h1;
	let t0_value = /*step*/ ctx[0].title + "";
	let t0;
	let t1;
	let div1;
	let t2;
	let if_block0 = /*nextConfig*/ ctx[5] != null && create_if_block_3$2(ctx);

	function select_block_type(ctx, dirty) {
		if (/*isShowingForm*/ ctx[2]) return create_if_block$3;
		return create_else_block$1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block1 = current_block_type(ctx);

	return {
		c() {
			div2 = element("div");
			div0 = element("div");
			h1 = element("h1");
			t0 = text(t0_value);
			t1 = space();
			div1 = element("div");
			if (if_block0) if_block0.c();
			t2 = space();
			if_block1.c();
			this.h();
		},
		l(nodes) {
			div2 = claim_element(nodes, "DIV", { class: true });
			var div2_nodes = children(div2);
			div0 = claim_element(div2_nodes, "DIV", { class: true });
			var div0_nodes = children(div0);
			h1 = claim_element(div0_nodes, "H1", { class: true });
			var h1_nodes = children(h1);
			t0 = claim_text(h1_nodes, t0_value);
			h1_nodes.forEach(detach);
			div0_nodes.forEach(detach);
			t1 = claim_space(div2_nodes);
			div1 = claim_element(div2_nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			if (if_block0) if_block0.l(div1_nodes);
			t2 = claim_space(div1_nodes);
			if_block1.l(div1_nodes);
			div1_nodes.forEach(detach);
			div2_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(h1, "class", "text-center text-3xl font-bold");
			attr(div0, "class", "max-w-sm");
			attr(div1, "class", "flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2");
			attr(div2, "class", "flex w-full max-w-md flex-col items-center gap-8");
			toggle_class(div2, "pointer-events-none", /*networkStatus*/ ctx[1] === "loading");
		},
		m(target, anchor) {
			insert_hydration(target, div2, anchor);
			append_hydration(div2, div0);
			append_hydration(div0, h1);
			append_hydration(h1, t0);
			append_hydration(div2, t1);
			append_hydration(div2, div1);
			if (if_block0) if_block0.m(div1, null);
			append_hydration(div1, t2);
			if_block1.m(div1, null);
		},
		p(ctx, [dirty]) {
			if (dirty & /*step*/ 1 && t0_value !== (t0_value = /*step*/ ctx[0].title + "")) set_data(t0, t0_value);
			if (/*nextConfig*/ ctx[5] != null) if_block0.p(ctx, dirty);

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
				if_block1.p(ctx, dirty);
			} else {
				if_block1.d(1);
				if_block1 = current_block_type(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(div1, null);
				}
			}

			if (dirty & /*networkStatus*/ 2) {
				toggle_class(div2, "pointer-events-none", /*networkStatus*/ ctx[1] === "loading");
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(div2);
			}

			if (if_block0) if_block0.d();
			if_block1.d();
		}
	};
}

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzv_XTTbTeL0FSd4l8hGlEJTqBspUmDOeKeBqf5qmoTzunIq7hTieSTq24po1O01OiO/exec";

function instance$6($$self, $$props, $$invalidate) {
	let $store;
	component_subscribe($$self, store, $$value => $$invalidate(10, $store = $$value));
	let { node } = $$props;
	let { step } = $$props;
	const segment = node.value;
	const STORE_HANDLE = window.Shopify.shop;
	const config = $store.config.segments[segment.id];

	const nextConfig = node.next != null
	? $store.config.segments[node.next.value.id]
	: null;

	const prize = config.prize;
	let networkStatus = "idle";
	let isShowingForm = false;
	let prizeText;

	switch (prize.discount_type) {
		case "percentage":
			prizeText = `${prize.discount_value}% off`;
			break;
		case "fixed":
			prizeText = `$${prize.discount_value.toFixed(2)} off`;
			break;
		default:
			throw new Error("Invalid discount type");
	}

	function handleContinue() {
		var _a;

		eventLogger.logEvent("continue_playing", {
			level_id: segment.id,
			next_level_id: (_a = node.next) === null || _a === void 0
			? void 0
			: _a.value.id
		});

		goToNextStep();
	}

	function handleClaimPrize() {
		$$invalidate(2, isShowingForm = true);
	}

	function handleSubmitForm(e) {
		e.preventDefault();
		$$invalidate(1, networkStatus = "loading");

		// We don't care about the response. If it fails before the redirect,
		// at least we can log it.
		fetch(GOOGLE_SCRIPT_URL, {
			method: "POST",
			body: new FormData(e.target)
		}).catch(error => {
			console.error("[shpln-quiz] Unable to save email", error);
		});

		if (node.next != null) {
			eventLogger.logEvent("abandon_game", { level_id: segment.id });
		}

		eventLogger.logEvent("claim_prize", {
			level_id: segment.id,
			prize_discount_value: prize.discount_value,
			prize_discount_type: prize.discount_type
		});

		const result = calculateResult(segment.id);
		window.location.href = result.discountUrl;
	}

	$$self.$$set = $$props => {
		if ('node' in $$props) $$invalidate(9, node = $$props.node);
		if ('step' in $$props) $$invalidate(0, step = $$props.step);
	};

	return [
		step,
		networkStatus,
		isShowingForm,
		prizeText,
		STORE_HANDLE,
		nextConfig,
		handleContinue,
		handleClaimPrize,
		handleSubmitForm,
		node
	];
}

class SegmentResultStep extends SvelteComponent {
	constructor(options) {
		super();
		init$1(this, options, instance$6, create_fragment$6, safe_not_equal, { node: 9, step: 0 }, add_css$3);
	}

	get node() {
		return this.$$.ctx[9];
	}

	set node(node) {
		this.$$set({ node });
		flush();
	}

	get step() {
		return this.$$.ctx[0];
	}

	set step(step) {
		this.$$set({ step });
		flush();
	}
}

create_custom_element(SegmentResultStep, {"node":{},"step":{}}, [], [], true);

/* src/Step.svelte generated by Svelte v4.2.15 */

function create_fragment$5(ctx) {
	let div;
	let current;
	const default_slot_template = /*#slots*/ ctx[1].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

	return {
		c() {
			div = element("div");
			if (default_slot) default_slot.c();
			this.h();
		},
		l(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			if (default_slot) default_slot.l(div_nodes);
			div_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(div, "class", "flex w-full flex-shrink-0 flex-col items-center justify-center");
		},
		m(target, anchor) {
			insert_hydration(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;
		},
		p(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[0],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
						null
					);
				}
			}
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			if (default_slot) default_slot.d(detaching);
		}
	};
}

function instance$5($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;

	$$self.$$set = $$props => {
		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
	};

	return [$$scope, slots];
}

class Step extends SvelteComponent {
	constructor(options) {
		super();
		init$1(this, options, instance$5, create_fragment$5, safe_not_equal, {});
	}
}

create_custom_element(Step, {}, ["default"], [], true);

/* src/IntroStep.svelte generated by Svelte v4.2.15 */

function add_css$2(target) {
	append_styles(target, "svelte-xb38xr", ".subtitle.svelte-xb38xr{font-size:calc(10px + 0.3em)}.cta-button.svelte-xb38xr{background-color:var(--primary-color);color:var(--text-on-primary-color)}.cta-text.svelte-xb38xr{color:black}");
}

function create_fragment$4(ctx) {
	let div2;
	let div0;
	let t0;
	let section;
	let span2;
	let span0;
	let t1;
	let t2;
	let span1;
	let html_tag;
	let t3;
	let button_1;
	let t4_value = /*ctaButton*/ ctx[5].text + "";
	let t4;
	let t5;
	let div1;
	let html_tag_1;
	let mounted;
	let dispose;

	return {
		c() {
			div2 = element("div");
			div0 = element("div");
			t0 = space();
			section = element("section");
			span2 = element("span");
			span0 = element("span");
			t1 = text(/*title*/ ctx[2]);
			t2 = space();
			span1 = element("span");
			html_tag = new HtmlTagHydration(false);
			t3 = space();
			button_1 = element("button");
			t4 = text(t4_value);
			t5 = space();
			div1 = element("div");
			html_tag_1 = new HtmlTagHydration(false);
			this.h();
		},
		l(nodes) {
			div2 = claim_element(nodes, "DIV", { class: true });
			var div2_nodes = children(div2);
			div0 = claim_element(div2_nodes, "DIV", {});
			children(div0).forEach(detach);
			t0 = claim_space(div2_nodes);
			section = claim_element(div2_nodes, "SECTION", { class: true });
			var section_nodes = children(section);
			span2 = claim_element(section_nodes, "SPAN", { class: true });
			var span2_nodes = children(span2);
			span0 = claim_element(span2_nodes, "SPAN", { class: true });
			var span0_nodes = children(span0);
			t1 = claim_text(span0_nodes, /*title*/ ctx[2]);
			span0_nodes.forEach(detach);
			t2 = claim_space(span2_nodes);
			span1 = claim_element(span2_nodes, "SPAN", { class: true });
			var span1_nodes = children(span1);
			html_tag = claim_html_tag(span1_nodes, false);
			span1_nodes.forEach(detach);
			span2_nodes.forEach(detach);
			t3 = claim_space(section_nodes);
			button_1 = claim_element(section_nodes, "BUTTON", { class: true });
			var button_1_nodes = children(button_1);
			t4 = claim_text(button_1_nodes, t4_value);
			button_1_nodes.forEach(detach);
			section_nodes.forEach(detach);
			t5 = claim_space(div2_nodes);
			div1 = claim_element(div2_nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			html_tag_1 = claim_html_tag(div1_nodes, false);
			div1_nodes.forEach(detach);
			div2_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(span0, "class", "block font-bold");
			html_tag.a = null;
			attr(span1, "class", "subtitle svelte-xb38xr");
			attr(span2, "class", "cta-text text-center text-2xl sm:text-3xl svelte-xb38xr");
			attr(button_1, "class", "cta-button rounded-lg px-5 py-3 text-xl transition-[font-weight,transform]  svelte-xb38xr");
			toggle_class(button_1, "hover:scale-105", !/*hasTouch*/ ctx[6]);
			toggle_class(button_1, "hover:font-light", !/*hasTouch*/ ctx[6]);
			toggle_class(button_1, "scale-105", /*isTouching*/ ctx[1]);
			toggle_class(button_1, "font-light", /*isTouching*/ ctx[1]);
			attr(section, "class", "flex flex-col items-center gap-5");
			html_tag_1.a = null;
			attr(div1, "class", "text-center text-xs text-[var(--secondary-color)]");
			attr(div2, "class", "flex max-w-md flex-1 flex-col items-center justify-between gap-y-2");
		},
		m(target, anchor) {
			insert_hydration(target, div2, anchor);
			append_hydration(div2, div0);
			append_hydration(div2, t0);
			append_hydration(div2, section);
			append_hydration(section, span2);
			append_hydration(span2, span0);
			append_hydration(span0, t1);
			append_hydration(span2, t2);
			append_hydration(span2, span1);
			html_tag.m(/*subtitle*/ ctx[3], span1);
			append_hydration(section, t3);
			append_hydration(section, button_1);
			append_hydration(button_1, t4);
			/*button_1_binding*/ ctx[9](button_1);
			append_hydration(div2, t5);
			append_hydration(div2, div1);
			html_tag_1.m(/*footer*/ ctx[4], div1);

			if (!mounted) {
				dispose = listen(button_1, "click", /*handleClickCtaButton*/ ctx[7]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*isTouching*/ 2) {
				toggle_class(button_1, "scale-105", /*isTouching*/ ctx[1]);
			}

			if (dirty & /*isTouching*/ 2) {
				toggle_class(button_1, "font-light", /*isTouching*/ ctx[1]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(div2);
			}

			/*button_1_binding*/ ctx[9](null);
			mounted = false;
			dispose();
		}
	};
}

function instance$4($$self, $$props, $$invalidate) {
	let $store;
	component_subscribe($$self, store, $$value => $$invalidate(10, $store = $$value));
	let { step } = $$props;
	const { title, subtitle, footer, ctaButton } = step;
	let button;
	let isTouching = false;
	let hasTouch = "ontouchstart" in window;

	function handleClickCtaButton() {
		eventLogger.logEvent("game_start", { total_steps: $store.totalSteps });
		goToNextStep();
	}

	onMount(() => {
		if (!hasTouch) {
			return;
		}

		button.addEventListener("touchstart", () => {
			$$invalidate(1, isTouching = true);
		});

		button.addEventListener("touchend", () => {
			$$invalidate(1, isTouching = false);
		});
	});

	function button_1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			button = $$value;
			$$invalidate(0, button);
		});
	}

	$$self.$$set = $$props => {
		if ('step' in $$props) $$invalidate(8, step = $$props.step);
	};

	return [
		button,
		isTouching,
		title,
		subtitle,
		footer,
		ctaButton,
		hasTouch,
		handleClickCtaButton,
		step,
		button_1_binding
	];
}

class IntroStep extends SvelteComponent {
	constructor(options) {
		super();
		init$1(this, options, instance$4, create_fragment$4, safe_not_equal, { step: 8 }, add_css$2);
	}

	get step() {
		return this.$$.ctx[8];
	}

	set step(step) {
		this.$$set({ step });
		flush();
	}
}

create_custom_element(IntroStep, {"step":{}}, [], [], true);

/* src/SegmentsOverviewStep.svelte generated by Svelte v4.2.15 */

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[4] = list[i];
	return child_ctx;
}

// (21:4) {#each segmentsConfig as config}
function create_each_block$1(ctx) {
	let div0;
	let t0;
	let t1_value = /*config*/ ctx[4].title + "";
	let t1;
	let t2;
	let div1;
	let t3;
	let t4_value = /*config*/ ctx[4].prize.discount_value + "";
	let t4;
	let t5;

	return {
		c() {
			div0 = element("div");
			t0 = text("Title: ");
			t1 = text(t1_value);
			t2 = space();
			div1 = element("div");
			t3 = text("Prize: ");
			t4 = text(t4_value);
			t5 = text("%");
		},
		l(nodes) {
			div0 = claim_element(nodes, "DIV", {});
			var div0_nodes = children(div0);
			t0 = claim_text(div0_nodes, "Title: ");
			t1 = claim_text(div0_nodes, t1_value);
			div0_nodes.forEach(detach);
			t2 = claim_space(nodes);
			div1 = claim_element(nodes, "DIV", {});
			var div1_nodes = children(div1);
			t3 = claim_text(div1_nodes, "Prize: ");
			t4 = claim_text(div1_nodes, t4_value);
			t5 = claim_text(div1_nodes, "%");
			div1_nodes.forEach(detach);
		},
		m(target, anchor) {
			insert_hydration(target, div0, anchor);
			append_hydration(div0, t0);
			append_hydration(div0, t1);
			insert_hydration(target, t2, anchor);
			insert_hydration(target, div1, anchor);
			append_hydration(div1, t3);
			append_hydration(div1, t4);
			append_hydration(div1, t5);
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t2);
				detach(div1);
			}
		}
	};
}

function create_fragment$3(ctx) {
	let div0;
	let textContent = "Segments Overview";
	let t1;
	let div1;
	let t2;
	let button;
	let textContent_1 = "Start";
	let mounted;
	let dispose;
	let each_value = ensure_array_like(/*segmentsConfig*/ ctx[0]);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	return {
		c() {
			div0 = element("div");
			div0.textContent = textContent;
			t1 = space();
			div1 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t2 = space();
			button = element("button");
			button.textContent = textContent_1;
		},
		l(nodes) {
			div0 = claim_element(nodes, "DIV", { ["data-svelte-h"]: true });
			if (get_svelte_dataset(div0) !== "svelte-109exkv") div0.textContent = textContent;
			t1 = claim_space(nodes);
			div1 = claim_element(nodes, "DIV", {});
			var div1_nodes = children(div1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(div1_nodes);
			}

			div1_nodes.forEach(detach);
			t2 = claim_space(nodes);
			button = claim_element(nodes, "BUTTON", { ["data-svelte-h"]: true });
			if (get_svelte_dataset(button) !== "svelte-hey3d2") button.textContent = textContent_1;
		},
		m(target, anchor) {
			insert_hydration(target, div0, anchor);
			insert_hydration(target, t1, anchor);
			insert_hydration(target, div1, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div1, null);
				}
			}

			insert_hydration(target, t2, anchor);
			insert_hydration(target, button, anchor);

			if (!mounted) {
				dispose = listen(button, "click", /*handleClickStart*/ ctx[1]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*segmentsConfig*/ 1) {
				each_value = ensure_array_like(/*segmentsConfig*/ ctx[0]);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div1, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t1);
				detach(div1);
				detach(t2);
				detach(button);
			}

			destroy_each(each_blocks, detaching);
			mounted = false;
			dispose();
		}
	};
}

function instance$3($$self, $$props, $$invalidate) {
	let $store;
	component_subscribe($$self, store, $$value => $$invalidate(3, $store = $$value));
	let { segments } = $$props;
	let segmentsConfig = [];

	for (const node of segments.iterate()) {
		const segment = node.value;
		const config = $store.config.segments[segment.id];

		if (config == null) {
			continue;
		}

		segmentsConfig.push(config);
	}

	function handleClickStart() {
		goToNextStep();
	}

	$$self.$$set = $$props => {
		if ('segments' in $$props) $$invalidate(2, segments = $$props.segments);
	};

	return [segmentsConfig, handleClickStart, segments];
}

class SegmentsOverviewStep extends SvelteComponent {
	constructor(options) {
		super();
		init$1(this, options, instance$3, create_fragment$3, safe_not_equal, { segments: 2 });
	}

	get segments() {
		return this.$$.ctx[2];
	}

	set segments(segments) {
		this.$$set({ segments });
		flush();
	}
}

create_custom_element(SegmentsOverviewStep, {"segments":{}}, [], [], true);

function getRelativeStepIdx(segments, globalStepIdx) {
    let idx = 0;
    let globalIdx = 0;
    for (const seg of segments.iterate()) {
        for (const _ of seg.value.steps.iterate()) {
            if (globalIdx === globalStepIdx) {
                return idx;
            }
            ++idx;
            ++globalIdx;
        }
        idx = 0;
    }
    throw new Error("[sphln-quiz]: Unable to get relative step index from global index");
}

/* src/Segments.svelte generated by Svelte v4.2.15 */

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[4] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[7] = list[i];
	child_ctx[9] = i;
	return child_ctx;
}

// (49:59) 
function create_if_block_4$1(ctx) {
	let segmentresultstep;
	let current;

	segmentresultstep = new SegmentResultStep({
			props: {
				node: /*segment*/ ctx[4],
				step: /*node*/ ctx[7].value
			}
		});

	return {
		c() {
			create_component(segmentresultstep.$$.fragment);
		},
		l(nodes) {
			claim_component(segmentresultstep.$$.fragment, nodes);
		},
		m(target, anchor) {
			mount_component(segmentresultstep, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const segmentresultstep_changes = {};
			if (dirty & /*segments*/ 1) segmentresultstep_changes.node = /*segment*/ ctx[4];
			if (dirty & /*segments*/ 1) segmentresultstep_changes.step = /*node*/ ctx[7].value;
			segmentresultstep.$set(segmentresultstep_changes);
		},
		i(local) {
			if (current) return;
			transition_in(segmentresultstep.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(segmentresultstep.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(segmentresultstep, detaching);
		}
	};
}

// (43:56) 
function create_if_block_3$1(ctx) {
	let educationalstep;
	let current;

	educationalstep = new EducationalStep({
			props: {
				body: /*node*/ ctx[7].value.body,
				stepIdx: /*idx*/ ctx[9],
				waitUntilCanProceed: /*node*/ ctx[7].value.waitUntilCanProceed
			}
		});

	return {
		c() {
			create_component(educationalstep.$$.fragment);
		},
		l(nodes) {
			claim_component(educationalstep.$$.fragment, nodes);
		},
		m(target, anchor) {
			mount_component(educationalstep, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const educationalstep_changes = {};
			if (dirty & /*segments*/ 1) educationalstep_changes.body = /*node*/ ctx[7].value.body;
			if (dirty & /*segments*/ 1) educationalstep_changes.waitUntilCanProceed = /*node*/ ctx[7].value.waitUntilCanProceed;
			educationalstep.$set(educationalstep_changes);
		},
		i(local) {
			if (current) return;
			transition_in(educationalstep.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(educationalstep.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(educationalstep, detaching);
		}
	};
}

// (26:60) 
function create_if_block_2$1(ctx) {
	let multiplechoicestep;
	let current;

	function func(...args) {
		return /*func*/ ctx[3](/*node*/ ctx[7], ...args);
	}

	multiplechoicestep = new MultipleChoiceStep({
			props: {
				stepIdx: /*idx*/ ctx[9],
				isShowing: /*isMultipleChoiceStepShowing*/ ctx[2](/*segment*/ ctx[4].value, /*$store*/ ctx[1].globalStepIdx, /*idx*/ ctx[9]),
				style: /*node*/ ctx[7].value.style,
				options: /*node*/ ctx[7].value.options,
				onSelect: func
			}
		});

	return {
		c() {
			create_component(multiplechoicestep.$$.fragment);
		},
		l(nodes) {
			claim_component(multiplechoicestep.$$.fragment, nodes);
		},
		m(target, anchor) {
			mount_component(multiplechoicestep, target, anchor);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			const multiplechoicestep_changes = {};
			if (dirty & /*segments, $store*/ 3) multiplechoicestep_changes.isShowing = /*isMultipleChoiceStepShowing*/ ctx[2](/*segment*/ ctx[4].value, /*$store*/ ctx[1].globalStepIdx, /*idx*/ ctx[9]);
			if (dirty & /*segments*/ 1) multiplechoicestep_changes.style = /*node*/ ctx[7].value.style;
			if (dirty & /*segments*/ 1) multiplechoicestep_changes.options = /*node*/ ctx[7].value.options;
			if (dirty & /*segments*/ 1) multiplechoicestep_changes.onSelect = func;
			multiplechoicestep.$set(multiplechoicestep_changes);
		},
		i(local) {
			if (current) return;
			transition_in(multiplechoicestep.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(multiplechoicestep.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(multiplechoicestep, detaching);
		}
	};
}

// (24:62) 
function create_if_block_1$2(ctx) {
	let segmentsoverviewstep;
	let current;
	segmentsoverviewstep = new SegmentsOverviewStep({ props: { segments: /*segments*/ ctx[0] } });

	return {
		c() {
			create_component(segmentsoverviewstep.$$.fragment);
		},
		l(nodes) {
			claim_component(segmentsoverviewstep.$$.fragment, nodes);
		},
		m(target, anchor) {
			mount_component(segmentsoverviewstep, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const segmentsoverviewstep_changes = {};
			if (dirty & /*segments*/ 1) segmentsoverviewstep_changes.segments = /*segments*/ ctx[0];
			segmentsoverviewstep.$set(segmentsoverviewstep_changes);
		},
		i(local) {
			if (current) return;
			transition_in(segmentsoverviewstep.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(segmentsoverviewstep.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(segmentsoverviewstep, detaching);
		}
	};
}

// (22:12) {#if node.value.type === "intro"}
function create_if_block$2(ctx) {
	let introstep;
	let current;
	introstep = new IntroStep({ props: { step: /*node*/ ctx[7].value } });

	return {
		c() {
			create_component(introstep.$$.fragment);
		},
		l(nodes) {
			claim_component(introstep.$$.fragment, nodes);
		},
		m(target, anchor) {
			mount_component(introstep, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const introstep_changes = {};
			if (dirty & /*segments*/ 1) introstep_changes.step = /*node*/ ctx[7].value;
			introstep.$set(introstep_changes);
		},
		i(local) {
			if (current) return;
			transition_in(introstep.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(introstep.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(introstep, detaching);
		}
	};
}

// (21:8) <Step>
function create_default_slot(ctx) {
	let current_block_type_index;
	let if_block;
	let t;
	let current;

	const if_block_creators = [
		create_if_block$2,
		create_if_block_1$2,
		create_if_block_2$1,
		create_if_block_3$1,
		create_if_block_4$1
	];

	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*node*/ ctx[7].value.type === "intro") return 0;
		if (/*node*/ ctx[7].value.type === "segments_overview") return 1;
		if (/*node*/ ctx[7].value.type === "multiple_choice") return 2;
		if (/*node*/ ctx[7].value.type === "educational") return 3;
		if (/*node*/ ctx[7].value.type === "segment_result") return 4;
		return -1;
	}

	if (~(current_block_type_index = select_block_type(ctx))) {
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	}

	return {
		c() {
			if (if_block) if_block.c();
			t = space();
		},
		l(nodes) {
			if (if_block) if_block.l(nodes);
			t = claim_space(nodes);
		},
		m(target, anchor) {
			if (~current_block_type_index) {
				if_blocks[current_block_type_index].m(target, anchor);
			}

			insert_hydration(target, t, anchor);
			current = true;
		},
		p(ctx, dirty) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if (~current_block_type_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				}
			} else {
				if (if_block) {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
				}

				if (~current_block_type_index) {
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(t.parentNode, t);
				} else {
					if_block = null;
				}
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}

			if (~current_block_type_index) {
				if_blocks[current_block_type_index].d(detaching);
			}
		}
	};
}

// (20:4) {#each segment.value.steps.iterate() as node, idx}
function create_each_block_1(ctx) {
	let step;
	let current;

	step = new Step({
			props: {
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			}
		});

	return {
		c() {
			create_component(step.$$.fragment);
		},
		l(nodes) {
			claim_component(step.$$.fragment, nodes);
		},
		m(target, anchor) {
			mount_component(step, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const step_changes = {};

			if (dirty & /*$$scope, segments, $store*/ 1027) {
				step_changes.$$scope = { dirty, ctx };
			}

			step.$set(step_changes);
		},
		i(local) {
			if (current) return;
			transition_in(step.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(step.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(step, detaching);
		}
	};
}

// (19:0) {#each segments.iterate() as segment}
function create_each_block(ctx) {
	let each_1_anchor;
	let current;
	let each_value_1 = ensure_array_like(/*segment*/ ctx[4].value.steps.iterate());
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		l(nodes) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(nodes);
			}

			each_1_anchor = empty();
		},
		m(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(target, anchor);
				}
			}

			insert_hydration(target, each_1_anchor, anchor);
			current = true;
		},
		p(ctx, dirty) {
			if (dirty & /*segments, isMultipleChoiceStepShowing, $store*/ 7) {
				each_value_1 = ensure_array_like(/*segment*/ ctx[4].value.steps.iterate());
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				group_outros();

				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value_1.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(each_1_anchor);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

function create_fragment$2(ctx) {
	let div;
	let t;
	let each_1_anchor;
	let current;
	let each_value = ensure_array_like(/*segments*/ ctx[0].iterate());
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			div = element("div");
			t = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		l(nodes) {
			div = claim_element(nodes, "DIV", {});
			children(div).forEach(detach);
			t = claim_space(nodes);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(nodes);
			}

			each_1_anchor = empty();
		},
		m(target, anchor) {
			insert_hydration(target, div, anchor);
			insert_hydration(target, t, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(target, anchor);
				}
			}

			insert_hydration(target, each_1_anchor, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			if (dirty & /*segments, isMultipleChoiceStepShowing, $store*/ 7) {
				each_value = ensure_array_like(/*segments*/ ctx[0].iterate());
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(div);
				detach(t);
				detach(each_1_anchor);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

function instance$2($$self, $$props, $$invalidate) {
	let $store;
	component_subscribe($$self, store, $$value => $$invalidate(1, $store = $$value));
	let { segments } = $$props;

	function isMultipleChoiceStepShowing(segment, globalStepIdx, stepIdx) {
		const relativeStepIdx = getRelativeStepIdx(segments, globalStepIdx);
		return segment.id === $store.segment.value.id && relativeStepIdx >= stepIdx;
	}

	const func = (node, option) => {
		eventLogger.logEvent("option_selected", {
			question: node.value.title,
			answer: option.title
		});
	};

	$$self.$$set = $$props => {
		if ('segments' in $$props) $$invalidate(0, segments = $$props.segments);
	};

	return [segments, $store, isMultipleChoiceStepShowing, func];
}

class Segments extends SvelteComponent {
	constructor(options) {
		super();
		init$1(this, options, instance$2, create_fragment$2, safe_not_equal, { segments: 0 });
	}

	get segments() {
		return this.$$.ctx[0];
	}

	set segments(segments) {
		this.$$set({ segments });
		flush();
	}
}

create_custom_element(Segments, {"segments":{}}, [], [], true);

class Sequence {
    constructor(items) {
        this.length = 0;
        if (items.length === 0) {
            throw new Error("[shpln-quiz] Cannot initialize a Sequence with an empty list");
        }
        let prevNode;
        for (let idx = items.length - 1; idx >= 0; --idx) {
            const value = items[idx];
            const node = {
                idx,
                value,
                next: prevNode,
            };
            this.head = node;
            ++this.length;
            prevNode = node;
        }
    }
    *iterate() {
        let curr = this.head;
        while (curr != null) {
            yield curr;
            curr = curr.next;
        }
    }
    forEach(cb) {
        for (const node of this.iterate()) {
            cb(node.value);
        }
    }
    reduce(cb, initialValue) {
        let res = initialValue;
        this.forEach((value) => {
            res = cb(res, value);
        });
        return res;
    }
    toArray() {
        const values = [];
        for (const node of this.iterate()) {
            values.push(node.value);
        }
        return values;
    }
    toMap(getKeyFn) {
        const map = new Map();
        for (const node of this.iterate()) {
            const key = getKeyFn(node.value);
            map.set(key, node.value);
        }
        return map;
    }
}

/* src/ProgressPercentage.svelte generated by Svelte v4.2.15 */

function add_css$1(target) {
	append_styles(target, "svelte-1e2szn", ".background.svelte-1e2szn{background-color:var(--secondary-color)}.foreground.svelte-1e2szn{background-color:var(--accent-color);color:var(--secondary-color)}.progress-width.svelte-1e2szn{width:var(--progress-width)}");
}

// (33:8) {#if percent >= 100}
function create_if_block_1$1(ctx) {
	let div1;
	let span;
	let t0;
	let t1;
	let t2;
	let t3;
	let div0;
	let confetti;
	let current;
	confetti = new Confetti({ props: { cone: true, delay: [0, 250] } });

	return {
		c() {
			div1 = element("div");
			span = element("span");
			t0 = text("🎉 You've earned ");
			t1 = text(/*prizeText*/ ctx[3]);
			t2 = text("! 🎉");
			t3 = space();
			div0 = element("div");
			create_component(confetti.$$.fragment);
			this.h();
		},
		l(nodes) {
			div1 = claim_element(nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			span = claim_element(div1_nodes, "SPAN", {});
			var span_nodes = children(span);
			t0 = claim_text(span_nodes, "🎉 You've earned ");
			t1 = claim_text(span_nodes, /*prizeText*/ ctx[3]);
			t2 = claim_text(span_nodes, "! 🎉");
			span_nodes.forEach(detach);
			t3 = claim_space(div1_nodes);
			div0 = claim_element(div1_nodes, "DIV", { class: true });
			var div0_nodes = children(div0);
			claim_component(confetti.$$.fragment, div0_nodes);
			div0_nodes.forEach(detach);
			div1_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(div0, "class", "absolute inset-0 flex w-full justify-center");
			attr(div1, "class", "relative text-sm font-semibold sm:text-base");
		},
		m(target, anchor) {
			insert_hydration(target, div1, anchor);
			append_hydration(div1, span);
			append_hydration(span, t0);
			append_hydration(span, t1);
			append_hydration(span, t2);
			append_hydration(div1, t3);
			append_hydration(div1, div0);
			mount_component(confetti, div0, null);
			current = true;
		},
		p(ctx, dirty) {
			if (!current || dirty & /*prizeText*/ 8) set_data(t1, /*prizeText*/ ctx[3]);
		},
		i(local) {
			if (current) return;
			transition_in(confetti.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(confetti.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(div1);
			}

			destroy_component(confetti);
		}
	};
}

// (46:4) {#if currentStep + 1 < stepsCount}
function create_if_block$1(ctx) {
	let t0_value = /*currentStep*/ ctx[1] + 1 + "";
	let t0;
	let t1;
	let t2;
	let t3;
	let t4;

	return {
		c() {
			t0 = text(t0_value);
			t1 = text("/");
			t2 = text(/*stepsCount*/ ctx[0]);
			t3 = text(" steps away from ");
			t4 = text(/*prizeText*/ ctx[3]);
		},
		l(nodes) {
			t0 = claim_text(nodes, t0_value);
			t1 = claim_text(nodes, "/");
			t2 = claim_text(nodes, /*stepsCount*/ ctx[0]);
			t3 = claim_text(nodes, " steps away from ");
			t4 = claim_text(nodes, /*prizeText*/ ctx[3]);
		},
		m(target, anchor) {
			insert_hydration(target, t0, anchor);
			insert_hydration(target, t1, anchor);
			insert_hydration(target, t2, anchor);
			insert_hydration(target, t3, anchor);
			insert_hydration(target, t4, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*currentStep*/ 2 && t0_value !== (t0_value = /*currentStep*/ ctx[1] + 1 + "")) set_data(t0, t0_value);
			if (dirty & /*stepsCount*/ 1) set_data(t2, /*stepsCount*/ ctx[0]);
			if (dirty & /*prizeText*/ 8) set_data(t4, /*prizeText*/ ctx[3]);
		},
		d(detaching) {
			if (detaching) {
				detach(t0);
				detach(t1);
				detach(t2);
				detach(t3);
				detach(t4);
			}
		}
	};
}

function create_fragment$1(ctx) {
	let div1;
	let div0;
	let t;
	let div2;
	let current;
	let if_block0 = /*percent*/ ctx[2] >= 100 && create_if_block_1$1(ctx);
	let if_block1 = /*currentStep*/ ctx[1] + 1 < /*stepsCount*/ ctx[0] && create_if_block$1(ctx);

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			if (if_block0) if_block0.c();
			t = space();
			div2 = element("div");
			if (if_block1) if_block1.c();
			this.h();
		},
		l(nodes) {
			div1 = claim_element(nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			div0 = claim_element(div1_nodes, "DIV", { class: true, style: true });
			var div0_nodes = children(div0);
			if (if_block0) if_block0.l(div0_nodes);
			div0_nodes.forEach(detach);
			div1_nodes.forEach(detach);
			t = claim_space(nodes);
			div2 = claim_element(nodes, "DIV", { class: true });
			var div2_nodes = children(div2);
			if (if_block1) if_block1.l(div2_nodes);
			div2_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(div0, "class", "foreground progress-width flex justify-center rounded-full px-3 py-1.5 transition-[width]  svelte-1e2szn");
			set_style(div0, "--progress-width", /*barWidth*/ ctx[4]);
			toggle_class(div0, "font-semibold", /*percent*/ ctx[2] >= 100);
			attr(div1, "class", "background w-full rounded-full svelte-1e2szn");
			attr(div2, "class", "mt-2 flex justify-center");
		},
		m(target, anchor) {
			insert_hydration(target, div1, anchor);
			append_hydration(div1, div0);
			if (if_block0) if_block0.m(div0, null);
			insert_hydration(target, t, anchor);
			insert_hydration(target, div2, anchor);
			if (if_block1) if_block1.m(div2, null);
			current = true;
		},
		p(ctx, [dirty]) {
			if (/*percent*/ ctx[2] >= 100) {
				if (if_block0) {
					if_block0.p(ctx, dirty);

					if (dirty & /*percent*/ 4) {
						transition_in(if_block0, 1);
					}
				} else {
					if_block0 = create_if_block_1$1(ctx);
					if_block0.c();
					transition_in(if_block0, 1);
					if_block0.m(div0, null);
				}
			} else if (if_block0) {
				group_outros();

				transition_out(if_block0, 1, 1, () => {
					if_block0 = null;
				});

				check_outros();
			}

			if (!current || dirty & /*barWidth*/ 16) {
				set_style(div0, "--progress-width", /*barWidth*/ ctx[4]);
			}

			if (!current || dirty & /*percent*/ 4) {
				toggle_class(div0, "font-semibold", /*percent*/ ctx[2] >= 100);
			}

			if (/*currentStep*/ ctx[1] + 1 < /*stepsCount*/ ctx[0]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block$1(ctx);
					if_block1.c();
					if_block1.m(div2, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block0);
			current = true;
		},
		o(local) {
			transition_out(if_block0);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(div1);
				detach(t);
				detach(div2);
			}

			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let percent;
	let barWidth;
	let { prize } = $$props;
	let { stepsCount } = $$props;
	let { currentStep } = $$props;
	let prizeText;

	switch (prize.discountType) {
		case "percentage":
			prizeText = `${prize.discountValue}% off`;
			break;
		case "fixed":
			prizeText = `$${prize.discountValue.toFixed(2)} off`;
			break;
		default:
			throw new Error("Invalid discount type");
	}

	$$self.$$set = $$props => {
		if ('prize' in $$props) $$invalidate(5, prize = $$props.prize);
		if ('stepsCount' in $$props) $$invalidate(0, stepsCount = $$props.stepsCount);
		if ('currentStep' in $$props) $$invalidate(1, currentStep = $$props.currentStep);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*currentStep, stepsCount*/ 3) {
			$$invalidate(2, percent = (currentStep + 1) / stepsCount * 100);
		}

		if ($$self.$$.dirty & /*percent*/ 4) {
			$$invalidate(4, barWidth = `${percent}%`);
		}
	};

	return [stepsCount, currentStep, percent, prizeText, barWidth, prize];
}

class ProgressPercentage extends SvelteComponent {
	constructor(options) {
		super();
		init$1(this, options, instance$1, create_fragment$1, safe_not_equal, { prize: 5, stepsCount: 0, currentStep: 1 }, add_css$1);
	}

	get prize() {
		return this.$$.ctx[5];
	}

	set prize(prize) {
		this.$$set({ prize });
		flush();
	}

	get stepsCount() {
		return this.$$.ctx[0];
	}

	set stepsCount(stepsCount) {
		this.$$set({ stepsCount });
		flush();
	}

	get currentStep() {
		return this.$$.ctx[1];
	}

	set currentStep(currentStep) {
		this.$$set({ currentStep });
		flush();
	}
}

create_custom_element(ProgressPercentage, {"prize":{},"stepsCount":{},"currentStep":{}}, [], [], true);

/* src/Quiz.svelte generated by Svelte v4.2.15 */

function add_css(target) {
	append_styles(target, "svelte-c4w2yu", ".shoplanding.svelte-c4w2yu{width:100%;height:100%}.logo.wide.svelte-c4w2yu{width:100%;max-width:var(--max-logo-size)}.logo.high.svelte-c4w2yu{height:100%;max-height:var(--max-logo-size)}");
}

// (67:8) {#if backgroundImage != null}
function create_if_block_5(ctx) {
	let div;
	let responsiveimage;
	let current;

	responsiveimage = new ResponsiveImage({
			props: {
				image: /*backgroundImage*/ ctx[2],
				className: "size-full object-cover"
			}
		});

	return {
		c() {
			div = element("div");
			create_component(responsiveimage.$$.fragment);
			this.h();
		},
		l(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			claim_component(responsiveimage.$$.fragment, div_nodes);
			div_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(div, "class", "absolute inset-0");
		},
		m(target, anchor) {
			insert_hydration(target, div, anchor);
			mount_component(responsiveimage, div, null);
			current = true;
		},
		p(ctx, dirty) {
			const responsiveimage_changes = {};
			if (dirty & /*backgroundImage*/ 4) responsiveimage_changes.image = /*backgroundImage*/ ctx[2];
			responsiveimage.$set(responsiveimage_changes);
		},
		i(local) {
			if (current) return;
			transition_in(responsiveimage.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(responsiveimage.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			destroy_component(responsiveimage);
		}
	};
}

// (90:24) {#if logo != null}
function create_if_block_4(ctx) {
	let div;
	let img;
	let img_src_value;
	let img_width_value;
	let img_height_value;
	let img_alt_value;

	return {
		c() {
			div = element("div");
			img = element("img");
			this.h();
		},
		l(nodes) {
			div = claim_element(nodes, "DIV", { class: true, style: true });
			var div_nodes = children(div);

			img = claim_element(div_nodes, "IMG", {
				src: true,
				width: true,
				height: true,
				alt: true
			});

			div_nodes.forEach(detach);
			this.h();
		},
		h() {
			if (!src_url_equal(img.src, img_src_value = /*logo*/ ctx[0].src)) attr(img, "src", img_src_value);
			attr(img, "width", img_width_value = /*logo*/ ctx[0].width);
			attr(img, "height", img_height_value = /*logo*/ ctx[0].height);
			attr(img, "alt", img_alt_value = /*logo*/ ctx[0].alt);
			attr(div, "class", "logo svelte-c4w2yu");
			set_style(div, "--max-logo-size", /*logo*/ ctx[0].maxSize + "px");
			toggle_class(div, "wide", /*logo*/ ctx[0].width >= /*logo*/ ctx[0].height);
			toggle_class(div, "high", /*logo*/ ctx[0].height > /*logo*/ ctx[0].width);
		},
		m(target, anchor) {
			insert_hydration(target, div, anchor);
			append_hydration(div, img);
		},
		p(ctx, dirty) {
			if (dirty & /*logo*/ 1 && !src_url_equal(img.src, img_src_value = /*logo*/ ctx[0].src)) {
				attr(img, "src", img_src_value);
			}

			if (dirty & /*logo*/ 1 && img_width_value !== (img_width_value = /*logo*/ ctx[0].width)) {
				attr(img, "width", img_width_value);
			}

			if (dirty & /*logo*/ 1 && img_height_value !== (img_height_value = /*logo*/ ctx[0].height)) {
				attr(img, "height", img_height_value);
			}

			if (dirty & /*logo*/ 1 && img_alt_value !== (img_alt_value = /*logo*/ ctx[0].alt)) {
				attr(img, "alt", img_alt_value);
			}

			if (dirty & /*logo*/ 1) {
				set_style(div, "--max-logo-size", /*logo*/ ctx[0].maxSize + "px");
			}

			if (dirty & /*logo*/ 1) {
				toggle_class(div, "wide", /*logo*/ ctx[0].width >= /*logo*/ ctx[0].height);
			}

			if (dirty & /*logo*/ 1) {
				toggle_class(div, "high", /*logo*/ ctx[0].height > /*logo*/ ctx[0].width);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (111:32) {#if isTitleVisible}
function create_if_block_3(ctx) {
	let t_value = /*$step*/ ctx[3].title + "";
	let t;

	return {
		c() {
			t = text(t_value);
		},
		l(nodes) {
			t = claim_text(nodes, t_value);
		},
		m(target, anchor) {
			insert_hydration(target, t, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*$step*/ 8 && t_value !== (t_value = /*$step*/ ctx[3].title + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) {
				detach(t);
			}
		}
	};
}

// (106:24) {#key $store.globalStepIdx}
function create_key_block_1(ctx) {
	let h1;
	let h1_transition;
	let current;
	let if_block = /*isTitleVisible*/ ctx[6] && create_if_block_3(ctx);

	return {
		c() {
			h1 = element("h1");
			if (if_block) if_block.c();
			this.h();
		},
		l(nodes) {
			h1 = claim_element(nodes, "H1", { class: true });
			var h1_nodes = children(h1);
			if (if_block) if_block.l(h1_nodes);
			h1_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(h1, "class", "text-center text-xl font-bold sm:text-2xl");
		},
		m(target, anchor) {
			insert_hydration(target, h1, anchor);
			if (if_block) if_block.m(h1, null);
			current = true;
		},
		p(ctx, dirty) {
			if (/*isTitleVisible*/ ctx[6]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_3(ctx);
					if_block.c();
					if_block.m(h1, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i(local) {
			if (current) return;

			if (local) {
				add_render_callback(() => {
					if (!current) return;
					if (!h1_transition) h1_transition = create_bidirectional_transition(h1, slide, { delay: 250 }, true);
					h1_transition.run(1);
				});
			}

			current = true;
		},
		o(local) {
			if (local) {
				if (!h1_transition) h1_transition = create_bidirectional_transition(h1, slide, { delay: 250 }, false);
				h1_transition.run(0);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(h1);
			}

			if (if_block) if_block.d();
			if (detaching && h1_transition) h1_transition.end();
		}
	};
}

// (129:24) {#if $isProgressVisible}
function create_if_block_1(ctx) {
	let div;
	let current_block_type_index;
	let if_block;
	let div_intro;
	let div_outro;
	let current;
	const if_block_creators = [create_if_block_2, create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*$segment*/ ctx[4].steps.length <= 6 || /*innerWidth*/ ctx[5] >= 640) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		c() {
			div = element("div");
			if_block.c();
			this.h();
		},
		l(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			if_block.l(div_nodes);
			div_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(div, "class", "w-full");
		},
		m(target, anchor) {
			insert_hydration(target, div, anchor);
			if_blocks[current_block_type_index].m(div, null);
			current = true;
		},
		p(ctx, dirty) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(div, null);
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);

			if (local) {
				add_render_callback(() => {
					if (!current) return;
					if (div_outro) div_outro.end(1);
					div_intro = create_in_transition(div, fade, {});
					div_intro.start();
				});
			}

			current = true;
		},
		o(local) {
			transition_out(if_block);
			if (div_intro) div_intro.invalidate();

			if (local) {
				div_outro = create_out_transition(div, fade, { delay: 1000 });
			}

			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			if_blocks[current_block_type_index].d();
			if (detaching && div_outro) div_outro.end();
		}
	};
}

// (148:32) {:else}
function create_else_block(ctx) {
	let progresspercentage;
	let current;

	progresspercentage = new ProgressPercentage({
			props: {
				prize: {
					discountType: /*$segmentConfig*/ ctx[11].prize.discount_type,
					discountValue: /*$segmentConfig*/ ctx[11].prize.discount_value
				},
				stepsCount: /*$segment*/ ctx[4].steps.length,
				currentStep: /*$stepIdx*/ ctx[12]
			}
		});

	return {
		c() {
			create_component(progresspercentage.$$.fragment);
		},
		l(nodes) {
			claim_component(progresspercentage.$$.fragment, nodes);
		},
		m(target, anchor) {
			mount_component(progresspercentage, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const progresspercentage_changes = {};

			if (dirty & /*$segmentConfig*/ 2048) progresspercentage_changes.prize = {
				discountType: /*$segmentConfig*/ ctx[11].prize.discount_type,
				discountValue: /*$segmentConfig*/ ctx[11].prize.discount_value
			};

			if (dirty & /*$segment*/ 16) progresspercentage_changes.stepsCount = /*$segment*/ ctx[4].steps.length;
			if (dirty & /*$stepIdx*/ 4096) progresspercentage_changes.currentStep = /*$stepIdx*/ ctx[12];
			progresspercentage.$set(progresspercentage_changes);
		},
		i(local) {
			if (current) return;
			transition_in(progresspercentage.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(progresspercentage.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(progresspercentage, detaching);
		}
	};
}

// (135:32) {#if $segment.steps.length <= 6 || innerWidth >= 640}
function create_if_block_2(ctx) {
	let progressbullets;
	let current;

	progressbullets = new ProgressBullets({
			props: {
				prize: {
					discountType: /*$segmentConfig*/ ctx[11].prize.discount_type,
					discountValue: /*$segmentConfig*/ ctx[11].prize.discount_value
				},
				stepsCount: /*$segment*/ ctx[4].steps.length,
				currentStep: /*$stepIdx*/ ctx[12]
			}
		});

	return {
		c() {
			create_component(progressbullets.$$.fragment);
		},
		l(nodes) {
			claim_component(progressbullets.$$.fragment, nodes);
		},
		m(target, anchor) {
			mount_component(progressbullets, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const progressbullets_changes = {};

			if (dirty & /*$segmentConfig*/ 2048) progressbullets_changes.prize = {
				discountType: /*$segmentConfig*/ ctx[11].prize.discount_type,
				discountValue: /*$segmentConfig*/ ctx[11].prize.discount_value
			};

			if (dirty & /*$segment*/ 16) progressbullets_changes.stepsCount = /*$segment*/ ctx[4].steps.length;
			if (dirty & /*$stepIdx*/ 4096) progressbullets_changes.currentStep = /*$stepIdx*/ ctx[12];
			progressbullets.$set(progressbullets_changes);
		},
		i(local) {
			if (current) return;
			transition_in(progressbullets.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(progressbullets.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(progressbullets, detaching);
		}
	};
}

// (128:20) {#key $segment.id}
function create_key_block(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*$isProgressVisible*/ ctx[10] && create_if_block_1(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l(nodes) {
			if (if_block) if_block.l(nodes);
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_hydration(target, if_block_anchor, anchor);
			current = true;
		},
		p(ctx, dirty) {
			if (/*$isProgressVisible*/ ctx[10]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*$isProgressVisible*/ 1024) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block_1(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(if_block_anchor);
			}

			if (if_block) if_block.d(detaching);
		}
	};
}

// (168:12) {#if $isCoverImageVisible}
function create_if_block(ctx) {
	let div;
	let img;
	let img_src_value;
	let img_alt_value;
	let img_width_value;
	let img_height_value;
	let div_class_value;
	let div_outro;
	let current;

	return {
		c() {
			div = element("div");
			img = element("img");
			this.h();
		},
		l(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);

			img = claim_element(div_nodes, "IMG", {
				class: true,
				src: true,
				alt: true,
				width: true,
				height: true,
				loading: true
			});

			div_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(img, "class", "relative size-full object-cover");
			if (!src_url_equal(img.src, img_src_value = /*coverImage*/ ctx[1].src)) attr(img, "src", img_src_value);
			attr(img, "alt", img_alt_value = /*coverImage*/ ctx[1].alt);
			attr(img, "width", img_width_value = /*coverImage*/ ctx[1].width);
			attr(img, "height", img_height_value = /*coverImage*/ ctx[1].height);
			attr(img, "loading", "lazy");

			attr(div, "class", div_class_value = "" + (null_to_empty(`
                    relative hidden flex-1
                    ${/*coverImage*/ ctx[1] != null ? "sm:block" : ""}
                    `) + " svelte-c4w2yu"));
		},
		m(target, anchor) {
			insert_hydration(target, div, anchor);
			append_hydration(div, img);
			current = true;
		},
		p(ctx, dirty) {
			if (!current || dirty & /*coverImage*/ 2 && !src_url_equal(img.src, img_src_value = /*coverImage*/ ctx[1].src)) {
				attr(img, "src", img_src_value);
			}

			if (!current || dirty & /*coverImage*/ 2 && img_alt_value !== (img_alt_value = /*coverImage*/ ctx[1].alt)) {
				attr(img, "alt", img_alt_value);
			}

			if (!current || dirty & /*coverImage*/ 2 && img_width_value !== (img_width_value = /*coverImage*/ ctx[1].width)) {
				attr(img, "width", img_width_value);
			}

			if (!current || dirty & /*coverImage*/ 2 && img_height_value !== (img_height_value = /*coverImage*/ ctx[1].height)) {
				attr(img, "height", img_height_value);
			}

			if (!current || dirty & /*coverImage*/ 2 && div_class_value !== (div_class_value = "" + (null_to_empty(`
                    relative hidden flex-1
                    ${/*coverImage*/ ctx[1] != null ? "sm:block" : ""}
                    `) + " svelte-c4w2yu"))) {
				attr(div, "class", div_class_value);
			}
		},
		i(local) {
			if (current) return;
			if (div_outro) div_outro.end(1);
			current = true;
		},
		o(local) {
			if (local) {
				div_outro = create_out_transition(div, fade, {});
			}

			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			if (detaching && div_outro) div_outro.end();
		}
	};
}

function create_fragment(ctx) {
	let div5;
	let div4;
	let t0;
	let div3;
	let section;
	let div2;
	let header;
	let t1;
	let previous_key = /*$store*/ ctx[8].globalStepIdx;
	let t2;
	let div1;
	let div0;
	let div0_style_value;
	let t3;
	let segments_1;
	let t4;
	let previous_key_1 = /*$segment*/ ctx[4].id;
	let t5;
	let current;
	let mounted;
	let dispose;
	add_render_callback(/*onwindowresize*/ ctx[21]);
	let if_block0 = /*backgroundImage*/ ctx[2] != null && create_if_block_5(ctx);
	let if_block1 = /*logo*/ ctx[0] != null && create_if_block_4(ctx);
	let key_block0 = create_key_block_1(ctx);

	segments_1 = new Segments({
			props: { segments: /*segments*/ ctx[13] }
		});

	let key_block1 = create_key_block(ctx);
	let if_block2 = /*$isCoverImageVisible*/ ctx[7] && create_if_block(ctx);

	return {
		c() {
			div5 = element("div");
			div4 = element("div");
			if (if_block0) if_block0.c();
			t0 = space();
			div3 = element("div");
			section = element("section");
			div2 = element("div");
			header = element("header");
			if (if_block1) if_block1.c();
			t1 = space();
			key_block0.c();
			t2 = space();
			div1 = element("div");
			div0 = element("div");
			t3 = space();
			create_component(segments_1.$$.fragment);
			t4 = space();
			key_block1.c();
			t5 = space();
			if (if_block2) if_block2.c();
			this.h();
		},
		l(nodes) {
			div5 = claim_element(nodes, "DIV", { class: true });
			var div5_nodes = children(div5);
			div4 = claim_element(div5_nodes, "DIV", { class: true });
			var div4_nodes = children(div4);
			if (if_block0) if_block0.l(div4_nodes);
			t0 = claim_space(div4_nodes);
			div3 = claim_element(div4_nodes, "DIV", { class: true });
			var div3_nodes = children(div3);
			section = claim_element(div3_nodes, "SECTION", { class: true });
			var section_nodes = children(section);
			div2 = claim_element(section_nodes, "DIV", { class: true });
			var div2_nodes = children(div2);
			header = claim_element(div2_nodes, "HEADER", { class: true });
			var header_nodes = children(header);
			if (if_block1) if_block1.l(header_nodes);
			t1 = claim_space(header_nodes);
			key_block0.l(header_nodes);
			header_nodes.forEach(detach);
			t2 = claim_space(div2_nodes);
			div1 = claim_element(div2_nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			div0 = claim_element(div1_nodes, "DIV", { class: true, style: true });
			children(div0).forEach(detach);
			t3 = claim_space(div1_nodes);
			claim_component(segments_1.$$.fragment, div1_nodes);
			div1_nodes.forEach(detach);
			t4 = claim_space(div2_nodes);
			key_block1.l(div2_nodes);
			div2_nodes.forEach(detach);
			section_nodes.forEach(detach);
			t5 = claim_space(div3_nodes);
			if (if_block2) if_block2.l(div3_nodes);
			div3_nodes.forEach(detach);
			div4_nodes.forEach(detach);
			div5_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(header, "class", "flex max-w-[60%] flex-col items-center space-y-4");
			attr(div0, "class", "w-0 transition-[margin-left] duration-300 ease-in-out");
			attr(div0, "style", div0_style_value = `margin-left:-${/*$marginLeftOffset*/ ctx[9]}%;`);
			attr(div1, "class", "flex w-full flex-1 items-stretch overflow-hidden py-4");
			attr(div2, "class", "flex h-full max-h-full flex-1 flex-col items-center justify-between");
			attr(section, "class", "flex size-full flex-col p-6 transition-[width]");
			toggle_class(section, "sm:w-[52.5%]", /*$isCoverImageVisible*/ ctx[7]);
			toggle_class(section, "sm:w-full", !/*$isCoverImageVisible*/ ctx[7]);
			attr(div3, "class", "relative flex size-full max-w-screen-md items-stretch overflow-hidden bg-white sm:rounded-3xl sm:shadow-xl");
			attr(div4, "class", "relative flex size-full justify-center p-0 sm:p-12");
			attr(div5, "class", "shoplanding svelte-c4w2yu");
		},
		m(target, anchor) {
			insert_hydration(target, div5, anchor);
			append_hydration(div5, div4);
			if (if_block0) if_block0.m(div4, null);
			append_hydration(div4, t0);
			append_hydration(div4, div3);
			append_hydration(div3, section);
			append_hydration(section, div2);
			append_hydration(div2, header);
			if (if_block1) if_block1.m(header, null);
			append_hydration(header, t1);
			key_block0.m(header, null);
			append_hydration(div2, t2);
			append_hydration(div2, div1);
			append_hydration(div1, div0);
			append_hydration(div1, t3);
			mount_component(segments_1, div1, null);
			append_hydration(div2, t4);
			key_block1.m(div2, null);
			append_hydration(div3, t5);
			if (if_block2) if_block2.m(div3, null);
			current = true;

			if (!mounted) {
				dispose = listen(window, "resize", /*onwindowresize*/ ctx[21]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (/*backgroundImage*/ ctx[2] != null) {
				if (if_block0) {
					if_block0.p(ctx, dirty);

					if (dirty & /*backgroundImage*/ 4) {
						transition_in(if_block0, 1);
					}
				} else {
					if_block0 = create_if_block_5(ctx);
					if_block0.c();
					transition_in(if_block0, 1);
					if_block0.m(div4, t0);
				}
			} else if (if_block0) {
				group_outros();

				transition_out(if_block0, 1, 1, () => {
					if_block0 = null;
				});

				check_outros();
			}

			if (/*logo*/ ctx[0] != null) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_4(ctx);
					if_block1.c();
					if_block1.m(header, t1);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (dirty & /*$store*/ 256 && safe_not_equal(previous_key, previous_key = /*$store*/ ctx[8].globalStepIdx)) {
				group_outros();
				transition_out(key_block0, 1, 1, noop);
				check_outros();
				key_block0 = create_key_block_1(ctx);
				key_block0.c();
				transition_in(key_block0, 1);
				key_block0.m(header, null);
			} else {
				key_block0.p(ctx, dirty);
			}

			if (!current || dirty & /*$marginLeftOffset*/ 512 && div0_style_value !== (div0_style_value = `margin-left:-${/*$marginLeftOffset*/ ctx[9]}%;`)) {
				attr(div0, "style", div0_style_value);
			}

			if (dirty & /*$segment*/ 16 && safe_not_equal(previous_key_1, previous_key_1 = /*$segment*/ ctx[4].id)) {
				group_outros();
				transition_out(key_block1, 1, 1, noop);
				check_outros();
				key_block1 = create_key_block(ctx);
				key_block1.c();
				transition_in(key_block1, 1);
				key_block1.m(div2, null);
			} else {
				key_block1.p(ctx, dirty);
			}

			if (!current || dirty & /*$isCoverImageVisible*/ 128) {
				toggle_class(section, "sm:w-[52.5%]", /*$isCoverImageVisible*/ ctx[7]);
			}

			if (!current || dirty & /*$isCoverImageVisible*/ 128) {
				toggle_class(section, "sm:w-full", !/*$isCoverImageVisible*/ ctx[7]);
			}

			if (/*$isCoverImageVisible*/ ctx[7]) {
				if (if_block2) {
					if_block2.p(ctx, dirty);

					if (dirty & /*$isCoverImageVisible*/ 128) {
						transition_in(if_block2, 1);
					}
				} else {
					if_block2 = create_if_block(ctx);
					if_block2.c();
					transition_in(if_block2, 1);
					if_block2.m(div3, null);
				}
			} else if (if_block2) {
				group_outros();

				transition_out(if_block2, 1, 1, () => {
					if_block2 = null;
				});

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block0);
			transition_in(key_block0);
			transition_in(segments_1.$$.fragment, local);
			transition_in(key_block1);
			transition_in(if_block2);
			current = true;
		},
		o(local) {
			transition_out(if_block0);
			transition_out(key_block0);
			transition_out(segments_1.$$.fragment, local);
			transition_out(key_block1);
			transition_out(if_block2);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(div5);
			}

			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			key_block0.d(detaching);
			destroy_component(segments_1);
			key_block1.d(detaching);
			if (if_block2) if_block2.d();
			mounted = false;
			dispose();
		}
	};
}

function shouldShowProgress(segment, segmentConfig, step) {
	let should = true;
	should = should && segment.id !== "fixed";
	should = should && segmentConfig != null;
	should = should && step.type !== "segment_result";
	return should;
}

function instance($$self, $$props, $$invalidate) {
	let $step;
	let $segment;
	let $isCoverImageVisible;
	let $store;
	let $marginLeftOffset;
	let $isProgressVisible;
	let $segmentConfig;
	let $stepIdx;
	component_subscribe($$self, store, $$value => $$invalidate(8, $store = $$value));
	let { logo } = $$props;
	let { coverImage } = $$props;
	let { backgroundImage } = $$props;
	const segments = new Sequence($$props.segments);
	const hasCoverImage = coverImage != null;

	const totalSteps = segments.reduce(
		(acc, segment) => {
			return acc + segment.steps.length;
		},
		0
	);

	let innerWidth;

	init({
		config: $$props.config,
		segment: segments.head,
		step: segments.head.value.steps.head,
		globalStepIdx: 0,
		score: {},
		totalSteps
	});

	const segment = derived(store, $s => $s.segment.value);
	component_subscribe($$self, segment, value => $$invalidate(4, $segment = value));
	const step = derived(store, $s => $s.step.value);
	component_subscribe($$self, step, value => $$invalidate(3, $step = value));
	const stepIdx = derived(store, $s => getRelativeStepIdx(segments, $s.globalStepIdx));
	component_subscribe($$self, stepIdx, value => $$invalidate(12, $stepIdx = value));
	const segmentConfig = derived([store, segment], ([$s, $segment]) => $s.config.segments[$segment.id]);
	component_subscribe($$self, segmentConfig, value => $$invalidate(11, $segmentConfig = value));
	const isCoverImageVisible = derived(step, $step => hasCoverImage && $step.type === "intro");
	component_subscribe($$self, isCoverImageVisible, value => $$invalidate(7, $isCoverImageVisible = value));

	const isProgressVisible = derived([segment, segmentConfig, step], ([$segment, $segmentConfig, $step], set) => {
		const visible = shouldShowProgress($segment, $segmentConfig, $step);
		let timeoutId;

		if (!visible) {
			timeoutId = setTimeout(
				() => {
					set(visible);
				},
				750
			);
		} else {
			set(visible);
		}

		return () => {
			clearTimeout(timeoutId);
		};
	});

	component_subscribe($$self, isProgressVisible, value => $$invalidate(10, $isProgressVisible = value));
	const marginLeftOffset = derived(store, $s => $s.globalStepIdx * 100);
	component_subscribe($$self, marginLeftOffset, value => $$invalidate(9, $marginLeftOffset = value));
	let isTitleVisible = false;

	function onwindowresize() {
		$$invalidate(5, innerWidth = window.innerWidth);
	}

	$$self.$$set = $$new_props => {
		$$invalidate(24, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ('logo' in $$new_props) $$invalidate(0, logo = $$new_props.logo);
		if ('coverImage' in $$new_props) $$invalidate(1, coverImage = $$new_props.coverImage);
		if ('backgroundImage' in $$new_props) $$invalidate(2, backgroundImage = $$new_props.backgroundImage);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$segment, $step*/ 24) {
			$$invalidate(6, isTitleVisible = $segment.id !== "fixed" && $step.type !== "segment_result" && !!$step.title);
		}
	};

	$$props = exclude_internal_props($$props);

	return [
		logo,
		coverImage,
		backgroundImage,
		$step,
		$segment,
		innerWidth,
		isTitleVisible,
		$isCoverImageVisible,
		$store,
		$marginLeftOffset,
		$isProgressVisible,
		$segmentConfig,
		$stepIdx,
		segments,
		segment,
		step,
		stepIdx,
		segmentConfig,
		isCoverImageVisible,
		isProgressVisible,
		marginLeftOffset,
		onwindowresize
	];
}

class Quiz extends SvelteComponent {
	constructor(options) {
		super();

		init$1(
			this,
			options,
			instance,
			create_fragment,
			safe_not_equal,
			{
				logo: 0,
				coverImage: 1,
				backgroundImage: 2
			},
			add_css
		);
	}

	get logo() {
		return this.$$.ctx[0];
	}

	set logo(logo) {
		this.$$set({ logo });
		flush();
	}

	get coverImage() {
		return this.$$.ctx[1];
	}

	set coverImage(coverImage) {
		this.$$set({ coverImage });
		flush();
	}

	get backgroundImage() {
		return this.$$.ctx[2];
	}

	set backgroundImage(backgroundImage) {
		this.$$set({ backgroundImage });
		flush();
	}
}

create_custom_element(Quiz, {"logo":{},"coverImage":{},"backgroundImage":{}}, [], [], true);

function hexToRgb(hex) {
    hex = hex.replace(/^#/, "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
}
function camelCaseToCssVariable(camelCaseString) {
    return ("--" +
        camelCaseString.replace(/([A-Z])/g, (match) => "-" + match.toLowerCase()));
}
function createSegmentResultStep(block) {
    return {
        type: block.type,
        title: block.settings.title,
        segmentId: block.settings.segment_id,
    };
}
function createResultStep(block) {
    return {
        type: block.type,
        title: block.settings.title,
        buyButton: {
            text: block.settings.buy_button_text,
        },
    };
}
function createLoadingStep(block) {
    return {
        type: block.type,
        message: block.settings.message,
        durationInSeconds: block.settings.duration,
    };
}
function createIntroStep(block) {
    return {
        type: block.type,
        title: block.settings.title,
        subtitle: block.settings.subtitle,
        footer: block.settings.footer,
        ctaButton: {
            text: block.settings.cta_button_text,
            backgroundColor: block.settings.cta_button_bg_color,
            textColor: block.settings.cta_button_text_color,
        },
    };
}
function createEducationalStep(block) {
    return {
        type: block.type,
        title: block.settings.title,
        body: block.settings.body,
        waitUntilCanProceed: block.settings.wait_until_can_proceed,
    };
}
function createMultipleChoiceStep(block) {
    const options = [];
    for (let i = 1; i <= 4; i++) {
        const titleKey = `option_${i}_title`;
        const iconSrcKey = `option_${i}_icon`;
        const answerIdKey = `option_${i}_answer_id`;
        const title = block.settings[titleKey];
        if (!(title === null || title === void 0 ? void 0 : title.length)) {
            continue;
        }
        let answerId = block.settings[answerIdKey];
        if ((answerId === null || answerId === void 0 ? void 0 : answerId.length) === 0) {
            // if answerId is not provided, we don't include it in the props
            answerId = undefined;
        }
        const iconSrc = block.settings[iconSrcKey];
        options.push({
            title,
            iconSrc,
            answerId,
        });
    }
    return {
        type: block.type,
        title: block.settings.title,
        addsDiscountCodeSuffix: block.settings.adds_discount_code_suffix,
        style: block.settings.style,
        options,
    };
}
function createSteps(blocks) {
    const fixedSteps = [];
    const steps = [];
    for (const block of blocks) {
        let step;
        let fixedStep;
        switch (block.type) {
            case "intro":
                fixedStep = createIntroStep(block);
                break;
            case "multiple_choice":
                step = createMultipleChoiceStep(block);
                break;
            case "educational":
                step = createEducationalStep(block);
                break;
            case "loading":
                step = createLoadingStep(block);
                break;
            case "result":
                step = createResultStep(block);
                break;
            case "segment_result":
                step = createSegmentResultStep(block);
                break;
            default:
                continue;
        }
        switch (true) {
            case fixedStep != null:
                fixedSteps.push(fixedStep);
                break;
            case step != null:
                steps.push(step);
                break;
            default:
                continue;
        }
    }
    return { fixedSteps, steps };
}
function createSegments(steps, fixedSteps) {
    var _a;
    const segments = [];
    let currSteps = [];
    for (const step of fixedSteps) {
        currSteps.push(step);
    }
    segments.push({
        id: "fixed",
        steps: new Sequence(currSteps),
    });
    currSteps = [];
    for (const step of steps) {
        if (step.segmentId == null || step.segmentId) ;
        if (step.type === "intro") {
            continue;
        }
        currSteps.push(step);
        if (step.type === "segment_result") {
            if (!((_a = step.segmentId) === null || _a === void 0 ? void 0 : _a.length)) {
                throw new Error("[shpln-quiz] segmentId missing for segment_result step");
            }
            segments.push({
                id: step.segmentId,
                steps: new Sequence(currSteps),
            });
            currSteps = [];
        }
    }
    return segments;
}
function validateProps(props) {
    switch (true) {
        case props.config == null || Object.keys(props.config).length === 0:
            console.error("[shpln-quiz] Config is missing or incomplete: ", props.config);
    }
}
class QuizElement extends HTMLElement {
    constructor() {
        super();
        let shadow = this.shadowRoot;
        if (!shadow) {
            shadow = this.attachShadow({
                mode: "open",
            });
        }
        const propsJson = this.dataset.props;
        let props;
        try {
            props = JSON.parse(propsJson);
        }
        catch (err) {
            console.error("[shpln-quiz] Unable to parse props.", err);
        }
        validateProps(props);
        this.props = props;
        this.setupCSS(props);
        this.setupTheme(props.theme);
    }
    connectedCallback() {
        this.init();
    }
    setupCSS(props) {
        var _a, _b;
        const sectionContainer = document.querySelector(`#${props.shopifySectionId}`);
        const sectionCustomStyle = sectionContainer === null || sectionContainer === void 0 ? void 0 : sectionContainer.querySelector("style:last-of-type");
        if (sectionCustomStyle != null) {
            const sectionCustomCss = sectionCustomStyle.innerHTML;
            const shadowCustomStyle = document.createElement("style");
            const shadowCustomCss = sectionCustomCss.replace(`#${props.shopifySectionId}`, "");
            shadowCustomStyle.innerHTML = shadowCustomCss;
            (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.prepend(shadowCustomStyle);
        }
        try {
            const cssSourcesJson = this.dataset.cssSources;
            const cssSources = JSON.parse(cssSourcesJson !== null && cssSourcesJson !== void 0 ? cssSourcesJson : "[]");
            // Loop backwards because we are prepending each item. This way we can
            // preserve the order of CSS imports.
            for (let i = cssSources.length - 1; i >= 0; i--) {
                const source = cssSources[i];
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = source;
                (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.prepend(link);
            }
        }
        catch (_c) {
            console.error("[sphpln-quiz] css-sources data attribute is missing");
        }
    }
    setupTheme(theme) {
        var _a;
        const values = [];
        for (const [key, value] of Object.entries(theme)) {
            const varName = camelCaseToCssVariable(key);
            switch (true) {
                case value.startsWith("#"):
                    const { r, g, b } = hexToRgb(value);
                    values.push(`${varName}-rgb: ${r} ${g} ${b};`);
                default:
                    values.push(`${varName}: ${value};`);
            }
        }
        const style = document.createElement("style");
        style.textContent = `:host{${values.join(" ")}}`;
        (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.prepend(style);
    }
    init() {
        if (this.shadowRoot == null) {
            console.error("[shpln-quiz] Cannot initialize quiz because shadow root was not found");
            return;
        }
        if (this.props == null) {
            console.error("[shpln-quiz] Cannot initialize quiz because props were not found");
            return;
        }
        const introBlock = this.props.blocks.find((b) => b.type === "intro");
        if (introBlock == null) {
            throw new Error("[shpln-quiz]: Intro block was not found");
        }
        const { fixedSteps, steps } = createSteps(this.props.blocks);
        const segments = createSegments(steps, fixedSteps);
        new Quiz({
            target: this.shadowRoot,
            props: {
                backgroundImage: this.props.backgroundImage,
                config: this.props.config,
                coverImage: this.props.coverImage,
                logo: this.props.logo,
                prize: this.props.prize,
                segments,
                timerDurationInSeconds: this.props.timerDurationInSeconds,
            },
        });
    }
}
customElements.define("shpln-quiz", QuizElement);
//# sourceMappingURL=shpln-quiz.js.map
