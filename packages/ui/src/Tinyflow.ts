import { type useSvelteFlow } from '@xyflow/svelte';
import { componentName } from './consts';
import type { TinyflowData, TinyflowOptions } from './types';

type FlowInstance = ReturnType<typeof useSvelteFlow>;

export class Tinyflow {
    private options!: TinyflowOptions;
    private rootEl!: Element;
    private svelteFlowInstance!: FlowInstance;

    constructor(options: TinyflowOptions) {
        if (typeof options.element !== 'string' && !(options.element instanceof Element)) {
            throw new Error('element must be a string or Element');
        }
        this._setOptions(options);
        this._init();
    }

    private _init() {
        if (typeof this.options.element === 'string') {
            this.rootEl = document.querySelector(this.options.element)!;
            if (!this.rootEl) {
                throw new Error(
                    `element not found by document.querySelector('${this.options.element}')`
                );
            }
        } else if (this.options.element instanceof Element) {
            this.rootEl = this.options.element;
        } else {
            throw new Error('element must be a string or Element');
        }

        const tinyflowEl = document.createElement(componentName) as HTMLElement & {
            options: TinyflowOptions;
            onInit: (svelteFlowInstance: FlowInstance) => void;
        };
        tinyflowEl.style.display = 'block';
        tinyflowEl.style.width = '100%';
        tinyflowEl.style.height = '100%';
        tinyflowEl.classList.add('tf-theme-light');

        tinyflowEl.options = this.options;
        tinyflowEl.onInit = (svelteFlowInstance: FlowInstance) => {
            this.svelteFlowInstance = svelteFlowInstance;
        };

        this.rootEl.appendChild(tinyflowEl);
    }

    private _setOptions(options: TinyflowOptions) {
        this.options = {
            ...options
        };
    }

    getOptions() {
        return this.options;
    }

    getData() {
        return this.svelteFlowInstance.toObject();
    }

    setData(data: TinyflowData) {
        this.options.data = data;

        const tinyflowEl = document.createElement(componentName) as HTMLElement & {
            options: TinyflowOptions;
            onInit: (svelteFlowInstance: FlowInstance) => void;
        };
        tinyflowEl.style.display = 'block';
        tinyflowEl.style.width = '100%';
        tinyflowEl.style.height = '100%';
        tinyflowEl.classList.add('tf-theme-light');

        tinyflowEl.options = this.options;
        tinyflowEl.onInit = (svelteFlowInstance: FlowInstance) => {
            this.svelteFlowInstance = svelteFlowInstance;
        };

        this.destroy();
        this.rootEl.appendChild(tinyflowEl);
    }

    destroy() {
        while (this.rootEl.firstChild) {
            this.rootEl.removeChild(this.rootEl.firstChild);
        }
    }
}
