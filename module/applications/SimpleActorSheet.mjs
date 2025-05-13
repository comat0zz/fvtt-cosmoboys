/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {SimpleActorSheet}
 */

import { SYSTEM } from "../configs/system.mjs";

const { api, sheets } = foundry.applications;


export default class SimpleActorSheet extends api.HandlebarsApplicationMixin(sheets.ActorSheetV2) {
    /**
     * Different sheet modes.r
     * @enum {number}
     */
    static SHEET_MODES = { 
        EDIT: 0, 
        PLAY: 1 
    }
    
    constructor(options = {}) {
        super(options)
    }

    /** @override */
    static DEFAULT_OPTIONS = {
        tag: "form",
        position: {
            width: 580,
            height: "auto",
        },
        classes: [ SYSTEM.id, "sheet", "actor" ],
        form: {
            submitOnChange: true,
            closeOnSubmit: false
        },
        window: {
          resizable: true,
        }
    }

    /**
     * The current sheet mode.
     * @type {number}
     */
    _sheetMode = this.constructor.SHEET_MODES.PLAY
    
    /**
     * Is the sheet currently in 'Play' mode?
     * @type {boolean}
     */
    get isPlayMode() {
        return this._sheetMode === this.constructor.SHEET_MODES.PLAY
    }

    /**
     * Is the sheet currently in 'Edit' mode?
     * @type {boolean}
     */
    get isEditMode() {
        return this._sheetMode === this.constructor.SHEET_MODES.EDIT
    }

    /** @override */
    static PARTS = {
        tabs: {
            template: "templates/generic/tab-navigation.hbs",
        },
        hero: {
            template: `${SYSTEM.template_path}/sheets/actors/hero-sheet.hbs`
        },
        info: {
            template: `${SYSTEM.template_path}/sheets/actors/info-tab-sheet.hbs`
        },
    }

    
    /* -------------------------------------------- */

    /** @override */
    async _prepareContext() {
        var context = {}

        
        // Default tab for first time it's rendered this session
        if (!this.tabGroups.primary){
            this.tabGroups.primary = 'hero';
        }
        context.tabs = {
            hero: {
                cssClass: this.tabGroups.primary === 'hero' ? 'active' : '',
                group: 'primary',
                id: 'hero',
                icon: '',
                label: 'CBOYS.Tabs.main',
              },
            info: {
              cssClass: this.tabGroups.primary === 'info' ? 'active' : '',
              group: 'primary',
              id: 'info',
              icon: '',
              label: 'CBOYS.Tabs.info',
            },            
        }
        
        context.fields = this.document.schema.fields
        context.systemFields = this.document.system.schema.fields
        context.actor = this.document
        context.system = this.document.system
        context.source = this.document.toObject()
        context.enrichedDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.document.system.description, { async: true })
        context.enrichedArchetype = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.document.system.archetype.desc, { async: true })
        context.enrichedFlash = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.document.system.flash.desc, { async: true })
        context.isEditMode = this.isEditMode
        context.isPlayMode = this.isPlayMode
        context.isEditable = this.isEditable

        context.arrayNumbers = [3,4,5,6,7,8,9,10,11]
        context.actor_char_number = context.system.char_number.value

        game.logger.log(context)
        return context
    }

    /** @override */
  async _preparePartContext(partId, context) {
    switch (partId) {
        case 'hero':
        case 'info':
          context.tab = context.tabs[partId];
          break;
        default:
      }
      return context;
  }

    /** @override */
    _onRender(context, options) {
        super._onRender((context, options))
        const rollables = this.element.querySelectorAll(".cosmoboys-rollable")
        rollables.forEach((d) => d.addEventListener("click", this._onRoll.bind(this)))
        
        const putNumberChar = this.element.querySelectorAll(".cosmoboys-numbers-list li")
        putNumberChar.forEach((d) => d.addEventListener("click", this._onSetCharNumber.bind(this)))

        const changeWound = this.element.querySelectorAll(".cosmoboys-wounds-line")
        changeWound.forEach((d) => d.addEventListener("click", this._onSetWoundMinus.bind(this)))

        const changeWound2 = this.element.querySelectorAll(".cosmoboys-wounds-line")
        changeWound2.forEach((d) => d.addEventListener("contextmenu", this._onSetWoundPlus.bind(this)))
    }

    async _onSetWoundMinus(event, target) {
        const wound = parseInt(this.actor.system.wound.value);
        if(wound > 0) {
            this.actor.update({ ['system.wound.value']: wound - 1 });
        }
    }

    async _onSetWoundPlus(event, target) {
        const wound = parseInt(this.actor.system.wound.value);
        if(wound < 5) {
            this.actor.update({ ['system.wound.value']: wound + 1 });
        }
    }

    async _onSetCharNumber(event, target) {
        const putNumberChar = $(event.currentTarget).data("num");
        this.actor.update({ ['system.char_number.value']: putNumberChar });
    }

    async _onRoll(event, target) {
        const rollType = $(event.currentTarget).data("roll-type");
        const boy_number = this.actor.system.char_number.value;
        const isHelp = $(event.currentTarget).parent('.cosmoboys-rolls').find('.roll-help-check').is(':checked')
        let succes = false;
        let flash = false;
        let trump = false;
        let flash_trump = false;
        let formula = '2d6';
        let dice_3 = "";
        let trump_text = "";

        if(isHelp) {formula = '3d6'};

        const roll = await new Roll(formula).evaluate();
        const terms = roll.terms[0].results;
        const total = roll.total;
        let dice_1 = terms[0].result;
        let dice_2 = terms[1].result;

        if(isHelp) {
            dice_3 = terms[2].result;
            let arrValues = [dice_1, dice_2, dice_3];
            let mm_num;
            if(rollType == 'boy') {
                mm_num = Math.max.apply(null, arrValues);
            }else if(rollType == 'cosmo') {
                // Нужно откинуть наименьший куб
                // чтобы в первых двух получить максимум 
                mm_num = Math.min.apply(null, arrValues);
            }
            let filteredNumbers = arrValues.filter((number) => number !== mm_num);
            // может быть ситуация, когда выпало три одинаковых или два, 
            // в итоге выше уберет больше одного, 
            // а раз кубы убрало, значит надо дополнить, мы знаем какие - mm_num
            while(filteredNumbers.length < 2) {
                filteredNumbers.push(mm_num)
            }

            dice_1 = filteredNumbers[0];
            dice_2 = filteredNumbers[1];
            dice_3 = mm_num;

            if(dice_1 === dice_2) {
                flash = true;
            }

            // попробуем проверить на козыря
            if( (dice_1 + dice_2) == boy_number) {
                trump = true;
                trump_text = `${dice_1} + ${dice_2}`;
            }else if((dice_1 + dice_3) == boy_number) {
                trump = true;
                trump_text = `${dice_1} + ${dice_3}`;
            }else if((dice_2 + dice_3) == boy_number) {
                trump = true;
                trump_text = `${dice_2} + ${dice_3}`;
            }

        }

        if(flash && trump && !isHelp) {
            flash_trump = true;
        }
        if(dice_1 === dice_2 && !isHelp) {
            flash = true;
        }
        if(total == boy_number && !isHelp) {
            trump = true;
        }
        if(rollType == 'boy' && total <= boy_number && !isHelp) {
            succes = true;
        }else if(rollType == 'cosmo' && total >= boy_number && !isHelp) {
            succes = true;
        }

        const template = await foundry.applications.handlebars.renderTemplate(`${SYSTEM.template_path}/chats/dices-roll.hbs`, {
            succes: succes,
            total: total,
            flash: flash,
            trump: trump,
            trump_text: trump_text,
            flash_trump: flash_trump,
            dice_1: dice_1,
            dice_2: dice_2,
            dice_3: dice_3,
            isHelp: isHelp,
            boy_number: boy_number,
            rollType: rollType,
            title_name: this.actor.name, //game.user.name;
            title_desc: game.i18n.localize(`CBOYS.Rolls.roll_${rollType}`)
        });

        ChatMessage.create({
            user: game.user._id,
            speaker: ChatMessage.getSpeaker(),
            content: template
        });
    }

    static #rollGen(event, target) {

    }

}