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
        },
        actions: {
            rollBoy: SimpleActorSheet.#rollBoy,
            rollCosmo: SimpleActorSheet.#rollBoy,
            rollGen: SimpleActorSheet.#rollGen
        },
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
        //const rollables = this.element.querySelectorAll(".rollable")
        // rollables.forEach((d) => d.addEventListener("click", this._onRoll.bind(this)))

    }

    /**
     * Handle toggling between Edit and Play mode.
     * @param {Event} event             The initiating click event.
     * @param {HTMLElement} target      The current target of the event listener.
     */
    static #onToggleSheet(event, target) {
        const modes = this.constructor.SHEET_MODES;
        this._sheetMode = this.isEditMode ? modes.PLAY : modes.EDIT;
        this.render();
    }

    static #rollBoy(event, target) {
        const rollType = target.dataset.rollType;
        const boy_number = this.actor.system.char_number;
        const roll = new Roll('2d6').evaluate();
        const terms = roll.terms//[0].results;
       // let dice_1 = terms[0].result;
       // let dice_2 = terms[1].result;

        console.log(terms)
        /*
        const chatData = {
            user: game.user._id,
            speaker: ChatMessage.getSpeaker(),
            content: template
           };
           let foo = ChatMessage.applyRollMode(chatData, "gmroll");
           ChatMessage.create(foo);
        */
    }

    static #rollGen(event, target) {

    }

}