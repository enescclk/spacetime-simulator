export class TheorySelector {

    constructor({
        languageManager,
        onTheoryChange
    }) {

        this.languageManager =
            languageManager;

        this.onTheoryChange =
            onTheoryChange;

        this.theory =
            'theoryA';


        this.createUI();


        this.languageManager.subscribe(
            () => this.render()
        );
    }


    createUI() {

        this.panel =
            document.createElement('div');


        this.panel.className =
            'theory-selector';


        document.body.appendChild(
            this.panel
        );


        this.render();
    }


    render() {

        const t =
            (key) =>
                this.languageManager.t(key);


        this.panel.innerHTML = `

            <div class="compact-title">
                ${t('curvatureTheory')}
            </div>


            <div class="theory-buttons">

                <button
                    class="theory-button
                    ${
                        this.theory === 'theoryA'
                            ? 'active'
                            : ''
                    }"
                    data-theory="theoryA"
                >
                    <span class="theory-name">
                        ${t('theoryA')}
                    </span>

                    <span class="theory-description">
                        ${t('theoryADescription')}
                    </span>
                </button>


                <button
                    class="theory-button
                    ${
                        this.theory === 'theoryB'
                            ? 'active'
                            : ''
                    }"
                    data-theory="theoryB"
                >
                    <span class="theory-name">
                        ${t('theoryB')}
                    </span>

                    <span class="theory-description">
                        ${t('theoryBDescription')}
                    </span>
                </button>

            </div>

        `;


        this.panel
            .querySelectorAll(
                '[data-theory]'
            )
            .forEach(
                (button) => {

                    button.addEventListener(
                        'click',
                        () => {

                            this.selectTheory(
                                button.dataset.theory
                            );
                        }
                    );

                }
            );
    }


    selectTheory(theory) {

        if (
            theory !== 'theoryA' &&
            theory !== 'theoryB'
        ) {
            return;
        }


        this.theory =
            theory;


        this.render();


        if (
            this.onTheoryChange
        ) {

            this.onTheoryChange(
                theory
            );
        }
    }
}