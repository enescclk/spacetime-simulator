export class SpaceSettings {

    constructor({
        languageManager,
        onSpaceSizeChange
    }) {

        this.languageManager =
            languageManager;

        this.onSpaceSizeChange =
            onSpaceSizeChange;

        this.spaceSize =
            100;


        this.createUI();


        this.languageManager.subscribe(
            () => this.render()
        );
    }


    createUI() {

        this.panel =
            document.createElement('div');


        this.panel.className =
            'space-settings';


        document.body.appendChild(
            this.panel
        );


        this.render();
    }


    render() {

        const oldInput =
            document.getElementById(
                'space-size'
            );


        if (oldInput) {

            const value =
                Number(oldInput.value);


            if (Number.isFinite(value)) {

                this.spaceSize =
                    value;
            }
        }


        const t =
            (key) =>
                this.languageManager.t(key);


        this.panel.innerHTML = `

            <div class="compact-title">
                ${t('spaceSize')}
            </div>


            <div class="space-size-row">

                <input
                    id="space-size"
                    type="number"
                    value="${this.spaceSize}"
                    min="20"
                    max="1000"
                    step="10"
                >

                <button id="apply-space-size">
                    ${t('applySpaceSize')}
                </button>

            </div>

        `;


        document
            .getElementById('apply-space-size')
            .addEventListener(
                'click',
                () => this.apply()
            );


        document
            .getElementById('space-size')
            .addEventListener(
                'keydown',
                (event) => {

                    if (
                        event.key === 'Enter'
                    ) {

                        this.apply();
                    }
                }
            );
    }


    apply() {

        const input =
            document.getElementById(
                'space-size'
            );


        const size =
            Number(input.value);


        if (
            !Number.isFinite(size) ||
            size < 20
        ) {
            return;
        }


        this.spaceSize =
            size;


        if (
            this.onSpaceSizeChange
        ) {

            this.onSpaceSizeChange(
                size
            );
        }
    }
}