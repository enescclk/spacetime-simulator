export class LanguageManager {

    constructor() {

        this.language =
            localStorage.getItem(
                'spacetime-language'
            ) || 'en';


        if (
            this.language !== 'en' &&
            this.language !== 'tr'
        ) {

            this.language =
                'en';
        }


        this.listeners =
            [];


        this.translations = {

            // =====================================
            // ENGLISH
            // =====================================

            en: {

                language:
                    'Language',

                english:
                    'English',

                turkish:
                    'Türkçe',


                // PANEL

                simulatorTitle:
                    'Spacetime Simulator',

                spaceSettings:
                    'Space Settings',

                spaceSize:
                    'Space Size',

                units:
                    'units',

                applySpaceSize:
                    'Apply Space Size',


                // THEORY

                curvatureTheory:
                    'Curvature Theory',

                theoryA:
                    'Theory A',

                theoryADescription:
                    'Global −Y deformation',

                theoryB:
                    'Theory B',

                theoryBDescription:
                    'Surface-normal deformation',

                theoryAInfo:
                    'Theory A: global vertical direction',

                theoryBInfo:
                    'Theory B: local surface normal',


                // BODY CREATOR

                addCelestialBody:
                    'Add Celestial Body',

                preset:
                    'Preset',

                name:
                    'Name',

                mass:
                    'Mass',

                radius:
                    'Radius',

                xPosition:
                    'X Position',

                zPosition:
                    'Z Position',

                color:
                    'Color',

                addBody:
                    'Add Body',

                solarMass:
                    'M☉ = Solar Mass',

                solarRadius:
                    'R☉ = Solar Radius',


                // PRESET GROUPS

                custom:
                    'Custom',

                solarSystem:
                    'Solar System',

                stars:
                    'Stars',

                compactObjects:
                    'Compact Objects',

                blackHoles:
                    'Black Holes',


                // OBJECT LIST

                objects:
                    'Objects',

                noObjects:
                    'No objects in space',

                delete:
                    'Delete',

                massShort:
                    'Mass',


                // TOOLTIP

                collapse:
                    'Collapse',

                expand:
                    'Expand'
            },


            // =====================================
            // TÜRKÇE
            // =====================================

            tr: {

                language:
                    'Dil',

                english:
                    'English',

                turkish:
                    'Türkçe',


                // PANEL

                simulatorTitle:
                    'Uzay-Zaman Simülatörü',

                spaceSettings:
                    'Uzay Ayarları',

                spaceSize:
                    'Uzay Boyutu',

                units:
                    'birim',

                applySpaceSize:
                    'Uzay Boyutunu Uygula',


                // THEORY

                curvatureTheory:
                    'Eğrilik Teorisi',

                theoryA:
                    'Teori A',

                theoryADescription:
                    'Global −Y deformasyonu',

                theoryB:
                    'Teori B',

                theoryBDescription:
                    'Yüzey normaline göre deformasyon',

                theoryAInfo:
                    'Teori A: global dikey yön',

                theoryBInfo:
                    'Teori B: yerel yüzey normali',


                // BODY CREATOR

                addCelestialBody:
                    'Gök Cismi Ekle',

                preset:
                    'Hazır Cisim',

                name:
                    'İsim',

                mass:
                    'Kütle',

                radius:
                    'Yarıçap',

                xPosition:
                    'X Konumu',

                zPosition:
                    'Z Konumu',

                color:
                    'Renk',

                addBody:
                    'Cisim Ekle',

                solarMass:
                    'M☉ = Güneş Kütlesi',

                solarRadius:
                    'R☉ = Güneş Yarıçapı',


                // PRESET GROUPS

                custom:
                    'Özel',

                solarSystem:
                    'Güneş Sistemi',

                stars:
                    'Yıldızlar',

                compactObjects:
                    'Kompakt Cisimler',

                blackHoles:
                    'Kara Delikler',


                // OBJECT LIST

                objects:
                    'Uzaydaki Cisimler',

                noObjects:
                    'Uzayda cisim yok',

                delete:
                    'Sil',

                massShort:
                    'Kütle',


                // TOOLTIP

                collapse:
                    'Daralt',

                expand:
                    'Genişlet'
            }
        };
    }


    // =============================================
    // TRANSLATE
    // =============================================

    t(key) {

        const languageData =
            this.translations[
                this.language
            ];


        if (
            languageData &&
            languageData[key]
        ) {

            return languageData[key];
        }


        return key;
    }


    // =============================================
    // LANGUAGE
    // =============================================

    getLanguage() {

        return this.language;
    }


    setLanguage(language) {

        if (
            language !== 'en' &&
            language !== 'tr'
        ) {

            return;
        }


        if (
            this.language === language
        ) {

            return;
        }


        this.language =
            language;


        localStorage.setItem(
            'spacetime-language',
            language
        );


        for (
            const listener of this.listeners
        ) {

            listener(
                language
            );
        }
    }


    // =============================================
    // SUBSCRIBE
    // =============================================

    subscribe(listener) {

        if (
            typeof listener !== 'function'
        ) {

            return;
        }


        this.listeners.push(
            listener
        );
    }
}