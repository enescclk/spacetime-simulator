import './style.css';

import {
    SceneManager
} from './scene/SceneManager.js';

import {
    LeftPanel
} from './ui/LeftPanel.js';

import {
    BodyCreator
} from './ui/BodyCreator.js';

import {
    ObjectList
} from './ui/ObjectList.js';

import {
    SpaceSettings
} from './ui/SpaceSettings.js';

import {
    TheorySelector
} from './ui/TheorySelector.js';

import {
    LanguageSelector
} from './ui/LanguageSelector.js';

import {
    LanguageManager
} from './ui/LanguageManager.js';


// =============================================
// LANGUAGE
// =============================================

const languageManager =
    new LanguageManager();


// =============================================
// SIMULATOR
// =============================================

const simulator =
    new SceneManager();


// =============================================
// LEFT PANEL CONTAINER
// =============================================

const leftPanel =
    new LeftPanel();


const leftContainer =
    leftPanel.getElement();


// =============================================
// BODY CREATOR
// =============================================

const bodyCreator =
    new BodyCreator({

        container:
            leftContainer,

        languageManager,


        onCreateBody:
            (bodyData) => {

                simulator.addCustomBody(
                    bodyData
                );
            }

    });


// =============================================
// OBJECT LIST
// =============================================

const objectList =
    new ObjectList({

        container:
            leftContainer,

        bodies:
            simulator.bodies,

        languageManager,


        onDeleteBody:
            (body) => {

                simulator.deleteBody(
                    body
                );
            },


        onSelectBody:
            (body) => {

                simulator.selectionManager
                    .selectBody(
                        body
                    );
            }

    });


// =============================================
// SPACE SETTINGS
// =============================================

const spaceSettings =
    new SpaceSettings({

        languageManager,


        onSpaceSizeChange:
            (size) => {

                simulator.setSpaceSize(
                    size
                );
            }

    });


// =============================================
// THEORY SELECTOR
// =============================================

const theorySelector =
    new TheorySelector({

        languageManager,


        onTheoryChange:
            (theory) => {

                simulator.setCurvatureTheory(
                    theory
                );
            }

    });


// =============================================
// LANGUAGE SELECTOR
// =============================================

const languageSelector =
    new LanguageSelector({

        languageManager

    });


// =============================================
// BODY LIST CALLBACK
// =============================================

simulator.setBodiesChangedCallback(
    () => {

        objectList.refresh();

    }
);


// =============================================
// ANIMATION LOOP
// =============================================

function animate() {

    requestAnimationFrame(
        animate
    );


    simulator.update();

    simulator.render();
}


animate();