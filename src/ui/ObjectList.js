export class ObjectList {

    constructor({
        container,
        bodies,
        languageManager,
        onDeleteBody,
        onSelectBody
    }) {

        this.container =
            container;

        this.bodies =
            bodies;

        this.languageManager =
            languageManager;

        this.onDeleteBody =
            onDeleteBody;

        this.onSelectBody =
            onSelectBody;

        this.collapsed =
            false;


        this.createUI();


        this.languageManager.subscribe(
            () => this.refresh()
        );
    }


    // =============================================
    // CREATE
    // =============================================

    createUI() {

        this.panel =
            document.createElement('div');


        this.panel.className =
            'object-list';


        this.container.appendChild(
            this.panel
        );


        this.refresh();
    }


    // =============================================
    // REFRESH
    // =============================================

    refresh() {

        const t =
            (key) =>
                this.languageManager.t(key);


        this.panel.innerHTML = `

            <div class="panel-header">

                <div class="panel-title">
                    ${t('objects')}
                </div>

                <button
                    id="toggle-object-list"
                    class="panel-toggle"
                    title="${
                        this.collapsed
                            ? t('expand')
                            : t('collapse')
                    }"
                >
                    ${this.collapsed ? '+' : '−'}
                </button>

            </div>


            <div
                class="object-list-content"
                style="${
                    this.collapsed
                        ? 'display:none'
                        : ''
                }"
            >

                <div class="object-items">

                    ${this.createItems()}

                </div>

            </div>
        `;


        this.bindEvents();
    }


    // =============================================
    // ITEMS
    // =============================================

    createItems() {

        if (
            this.bodies.length === 0
        ) {

            return `

                <div class="empty-list">

                    ${
                        this.languageManager.t(
                            'noObjects'
                        )
                    }

                </div>
            `;
        }


        return this.bodies

            .map(
                (body, index) => {

                    const name =
                        this.escapeHTML(
                            body.name ||
                            `Body ${index + 1}`
                        );


                    const mass =
                        Number(
                            body.getMass()
                        );


                    return `

                        <div
                            class="object-item"
                            data-body-index="${index}"
                        >

                            <div
                                class="object-info"
                                data-select-index="${index}"
                            >

                                <div class="object-name">
                                    ${name}
                                </div>

                                <div class="object-mass">

                                    ${
                                        this.languageManager.t(
                                            'massShort'
                                        )
                                    }:

                                    ${this.formatNumber(mass)}
                                    M☉

                                </div>

                            </div>


                            <button
                                class="delete-object"
                                data-delete-index="${index}"
                                title="${
                                    this.languageManager.t(
                                        'delete'
                                    )
                                }"
                            >
                                ×
                            </button>

                        </div>
                    `;
                }
            )

            .join('');
    }


    // =============================================
    // EVENTS
    // =============================================

    bindEvents() {

        const toggle =
            this.panel.querySelector(
                '#toggle-object-list'
            );


        if (toggle) {

            toggle.addEventListener(
                'click',
                () => {

                    this.collapsed =
                        !this.collapsed;

                    this.refresh();
                }
            );
        }


        const selectableItems =
            this.panel.querySelectorAll(
                '[data-select-index]'
            );


        selectableItems.forEach(
            (element) => {

                element.addEventListener(
                    'click',
                    () => {

                        const index =
                            Number(
                                element.dataset
                                    .selectIndex
                            );


                        const body =
                            this.bodies[index];


                        if (
                            body &&
                            this.onSelectBody
                        ) {

                            this.onSelectBody(
                                body
                            );
                        }
                    }
                );
            }
        );


        const deleteButtons =
            this.panel.querySelectorAll(
                '[data-delete-index]'
            );


        deleteButtons.forEach(
            (button) => {

                button.addEventListener(
                    'click',
                    (event) => {

                        event.stopPropagation();


                        const index =
                            Number(
                                button.dataset
                                    .deleteIndex
                            );


                        const body =
                            this.bodies[index];


                        if (
                            body &&
                            this.onDeleteBody
                        ) {

                            this.onDeleteBody(
                                body
                            );
                        }
                    }
                );
            }
        );
    }


    // =============================================
    // NUMBER FORMAT
    // =============================================

    formatNumber(value) {

        if (
            !Number.isFinite(value)
        ) {

            return '0';
        }


        if (
            value !== 0 &&
            Math.abs(value) < 0.0001
        ) {

            return value.toExponential(3);
        }


        if (
            Math.abs(value) >= 1000000
        ) {

            return value.toExponential(3);
        }


        return value.toLocaleString(

            this.languageManager
                .getLanguage() === 'tr'
                ? 'tr-TR'
                : 'en-US',

            {
                maximumFractionDigits: 6
            }
        );
    }


    // =============================================
    // ESCAPE
    // =============================================

    escapeHTML(value) {

        return String(value)

            .replaceAll('&', '&amp;')
            .replaceAll('"', '&quot;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;');
    }
}