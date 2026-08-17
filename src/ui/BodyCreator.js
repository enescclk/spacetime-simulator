import {
    BODY_PRESETS,
    getBodyPreset
} from '../bodies/BodyPresets.js';


export class BodyCreator {

    constructor({
        container,
        languageManager,
        onCreateBody
    }) {

        this.container =
            container;

        this.languageManager =
            languageManager;

        this.onCreateBody =
            onCreateBody;

        this.collapsed =
            false;


        this.createUI();


        this.languageManager.subscribe(
            () => this.render()
        );
    }


    // =============================================
    // CREATE UI
    // =============================================

    createUI() {

        this.panel =
            document.createElement('div');

        this.panel.className =
            'body-creator';


        this.container.appendChild(
            this.panel
        );


        this.render();
    }


    // =============================================
    // RENDER
    // =============================================

    render() {

        const previous =
            this.readCurrentValues();


        const t =
            (key) =>
                this.languageManager.t(key);


        this.panel.innerHTML = `

            <div class="panel-header">

                <div class="panel-title">
                    ${t('addCelestialBody')}
                </div>

                <button
                    class="panel-toggle"
                    id="toggle-body-panel"
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
                class="body-panel-content"
                style="${
                    this.collapsed
                        ? 'display:none'
                        : ''
                }"
            >

                <label>

                    ${t('preset')}

                    <select id="body-preset">

                        ${this.createPresetOptions(
                            previous.preset
                        )}

                    </select>

                </label>


                <label>

                    ${t('name')}

                    <input
                        id="body-name"
                        type="text"
                        value="${this.escapeHTML(
                            previous.name
                        )}"
                    >

                </label>


                <label>

                    ${t('mass')}

                    <div class="input-unit-row">

                        <input
                            id="body-mass"
                            type="number"
                            value="${previous.mass}"
                            min="0.000000001"
                            step="any"
                        >

                        <span class="unit">
                            M☉
                        </span>

                    </div>

                </label>


                <label>

                    ${t('radius')}

                    <div class="input-unit-row">

                        <input
                            id="body-radius"
                            type="number"
                            value="${previous.radius}"
                            min="0.000000001"
                            step="any"
                        >

                        <span class="unit">
                            R☉
                        </span>

                    </div>

                </label>


                <div class="unit-info">

                    <div>
                        ${t('solarMass')}
                    </div>

                    <div>
                        ${t('solarRadius')}
                    </div>

                </div>


                <div class="position-row">

                    <label>

                        ${t('xPosition')}

                        <input
                            id="body-x"
                            type="number"
                            value="${previous.x}"
                            step="0.5"
                        >

                    </label>


                    <label>

                        ${t('zPosition')}

                        <input
                            id="body-z"
                            type="number"
                            value="${previous.z}"
                            step="0.5"
                        >

                    </label>

                </div>


                <label>

                    ${t('color')}

                    <input
                        id="body-color"
                        type="color"
                        value="${previous.color}"
                    >

                </label>


                <button
                    id="add-body-button"
                    class="primary-button"
                >
                    ${t('addBody')}
                </button>

            </div>
        `;


        this.bindEvents();
    }


    // =============================================
    // PRESETS
    // =============================================

    createPresetOptions(selected) {

        const t =
            (key) =>
                this.languageManager.t(key);


        const option =
            (key, label) => `

                <option
                    value="${key}"
                    ${
                        selected === key
                            ? 'selected'
                            : ''
                    }
                >
                    ${label}
                </option>
            `;


        return `

            ${option(
                'custom',
                t('custom')
            )}


            <optgroup label="${t('solarSystem')}">

                ${option(
                    'mercury',
                    BODY_PRESETS.mercury.name
                )}

                ${option(
                    'venus',
                    BODY_PRESETS.venus.name
                )}

                ${option(
                    'earth',
                    BODY_PRESETS.earth.name
                )}

                ${option(
                    'moon',
                    BODY_PRESETS.moon.name
                )}

                ${option(
                    'mars',
                    BODY_PRESETS.mars.name
                )}

                ${option(
                    'jupiter',
                    BODY_PRESETS.jupiter.name
                )}

                ${option(
                    'saturn',
                    BODY_PRESETS.saturn.name
                )}

                ${option(
                    'uranus',
                    BODY_PRESETS.uranus.name
                )}

                ${option(
                    'neptune',
                    BODY_PRESETS.neptune.name
                )}

            </optgroup>


            <optgroup label="${t('stars')}">

                ${option(
                    'sun',
                    BODY_PRESETS.sun.name
                )}

                ${option(
                    'proximaCentauri',
                    BODY_PRESETS.proximaCentauri.name
                )}

                ${option(
                    'siriusA',
                    BODY_PRESETS.siriusA.name
                )}

                ${option(
                    'polaris',
                    BODY_PRESETS.polaris.name
                )}

                ${option(
                    'betelgeuse',
                    BODY_PRESETS.betelgeuse.name
                )}

            </optgroup>


            <optgroup label="${t('compactObjects')}">

                ${option(
                    'whiteDwarf',
                    BODY_PRESETS.whiteDwarf.name
                )}

                ${option(
                    'neutronStar',
                    BODY_PRESETS.neutronStar.name
                )}

                ${option(
                    'heavyNeutronStar',
                    BODY_PRESETS.heavyNeutronStar.name
                )}

            </optgroup>


            <optgroup label="${t('blackHoles')}">

                ${option(
                    'stellarBlackHole',
                    BODY_PRESETS.stellarBlackHole.name
                )}

                ${option(
                    'intermediateBlackHole',
                    BODY_PRESETS.intermediateBlackHole.name
                )}

                ${option(
                    'sagittariusA',
                    BODY_PRESETS.sagittariusA.name
                )}

                ${option(
                    'supermassiveBlackHole',
                    BODY_PRESETS.supermassiveBlackHole.name
                )}

            </optgroup>
        `;
    }


    // =============================================
    // EVENTS
    // =============================================

    bindEvents() {

        const toggle =
            this.panel.querySelector(
                '#toggle-body-panel'
            );


        toggle.addEventListener(
            'click',
            () => {

                this.collapsed =
                    !this.collapsed;

                this.render();
            }
        );


        const preset =
            this.panel.querySelector(
                '#body-preset'
            );


        if (preset) {

            preset.addEventListener(
                'change',
                () => this.applyPreset()
            );
        }


        const addButton =
            this.panel.querySelector(
                '#add-body-button'
            );


        if (addButton) {

            addButton.addEventListener(
                'click',
                () => this.createBody()
            );
        }
    }


    // =============================================
    // VALUES
    // =============================================

    readCurrentValues() {

        const get =
            (id) =>
                this.panel?.querySelector(
                    `#${id}`
                );


        return {

            preset:
                get('body-preset')?.value ??
                'custom',

            name:
                get('body-name')?.value ??
                'Custom Body',

            mass:
                get('body-mass')?.value ??
                1,

            radius:
                get('body-radius')?.value ??
                0.5,

            x:
                get('body-x')?.value ??
                5,

            z:
                get('body-z')?.value ??
                0,

            color:
                get('body-color')?.value ??
                '#44aaff'
        };
    }


    // =============================================
    // APPLY PRESET
    // =============================================

    applyPreset() {

        const key =
            this.panel
                .querySelector('#body-preset')
                .value;


        if (key === 'custom') {

            return;
        }


        const preset =
            getBodyPreset(key);


        this.panel.querySelector(
            '#body-name'
        ).value =
            preset.name;


        this.panel.querySelector(
            '#body-mass'
        ).value =
            preset.mass;


        this.panel.querySelector(
            '#body-radius'
        ).value =
            preset.radius;


        this.panel.querySelector(
            '#body-color'
        ).value =
            preset.color;
    }


    // =============================================
    // CREATE BODY
    // =============================================

    createBody() {

        const data = {

            type:
                this.panel
                    .querySelector('#body-preset')
                    .value,

            name:
                this.panel
                    .querySelector('#body-name')
                    .value
                    .trim(),

            mass:
                Number(
                    this.panel
                        .querySelector('#body-mass')
                        .value
                ),

            radius:
                Number(
                    this.panel
                        .querySelector('#body-radius')
                        .value
                ),

            x:
                Number(
                    this.panel
                        .querySelector('#body-x')
                        .value
                ),

            z:
                Number(
                    this.panel
                        .querySelector('#body-z')
                        .value
                ),

            color:
                this.panel
                    .querySelector('#body-color')
                    .value
        };


        if (
            !data.name ||
            !Number.isFinite(data.mass) ||
            data.mass <= 0 ||
            !Number.isFinite(data.radius) ||
            data.radius <= 0 ||
            !Number.isFinite(data.x) ||
            !Number.isFinite(data.z)
        ) {

            return;
        }


        if (this.onCreateBody) {

            this.onCreateBody(
                data
            );
        }
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